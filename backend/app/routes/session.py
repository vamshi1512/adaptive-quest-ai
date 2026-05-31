from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import (
    SessionStartRequest, SessionStartResponse, Question,
    AnswerSubmission, AnswerResult, SessionCompleteRequest
)
from app.storage.db import get_db, DBSession, DBAnswer
from app.services.game_engine import GameEngine
from app.services.ai_service import AIService
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/api")

# Instantiate Services
ai_service = AIService()

class QuestionGenerateRequest(BaseModel):
    session_id: Optional[str] = None
    topic: Optional[str] = None
    difficulty: Optional[int] = None

@router.post("/session/start", response_model=SessionStartResponse)
def start_session(request: SessionStartRequest, db: Session = Depends(get_db)):
    try:
        engine = GameEngine(db, ai_service)
        return engine.start_session(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start session: {str(e)}"
        )

@router.post("/question/generate", response_model=Question)
def generate_question(request: QuestionGenerateRequest, db: Session = Depends(get_db)):
    """
    Endpoint to retrieve/generate a question. If session_id is provided,
    it respects the current session difficulty and excluded questions list.
    """
    try:
        if request.session_id:
            # Retrieve session
            session_rec = db.query(DBSession).filter(
                DBSession.session_id == request.session_id
            ).first()
            if not session_rec:
                raise HTTPException(status_code=404, detail="Session not found")
            
            # Fetch answered question IDs
            answered = db.query(DBAnswer).filter(
                DBAnswer.session_id == request.session_id
            ).all()
            excluded = [ans.question_id for ans in answered]
            
            # Get current difficulty from log
            diffs = [int(x) for x in session_rec.difficulty_log.split(",")]
            current_diff = diffs[-1]
            
            return ai_service.generate_question(
                topic=session_rec.topic,
                difficulty=current_diff,
                excluded_ids=excluded
            )
        elif request.topic and request.difficulty:
            return ai_service.generate_question(
                topic=request.topic,
                difficulty=request.difficulty,
                excluded_ids=[]
            )
        else:
            raise HTTPException(
                status_code=400,
                detail="Must provide either session_id or both topic and difficulty."
            )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate question: {str(e)}"
        )

@router.post("/answer/submit", response_model=AnswerResult)
def submit_answer(submission: AnswerSubmission, db: Session = Depends(get_db)):
    try:
        engine = GameEngine(db, ai_service)
        return engine.submit_answer(submission)
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit answer: {str(e)}"
        )

@router.post("/session/complete")
def complete_session(request: SessionCompleteRequest, db: Session = Depends(get_db)):
    try:
        engine = GameEngine(db, ai_service)
        engine.force_complete_session(request.session_id)
        return {"status": "success", "message": "Session completed successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to complete session: {str(e)}"
        )
