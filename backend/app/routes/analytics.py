from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import KPISummary, FeedbackSubmit
from app.storage.db import get_db, DBFeedback
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api")

@router.get("/analytics/summary", response_model=KPISummary)
def get_analytics_summary(db: Session = Depends(get_db)):
    try:
        service = AnalyticsService(db)
        return service.get_kpi_summary()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch analytics: {str(e)}"
        )

@router.post("/feedback")
def submit_feedback(feedback: FeedbackSubmit, db: Session = Depends(get_db)):
    try:
        service = AnalyticsService(db)
        
        db_feedback = DBFeedback(
            session_id=feedback.session_id,
            username=feedback.username,
            topic=feedback.topic,
            was_fun=feedback.was_fun,
            was_useful=feedback.was_useful,
            difficulty_fit=feedback.difficulty_fit,
            would_replay=feedback.would_replay,
            comments=feedback.comments
        )
        
        service.submit_feedback(db_feedback)
        return {"status": "success", "message": "Feedback submitted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit feedback: {str(e)}"
        )
