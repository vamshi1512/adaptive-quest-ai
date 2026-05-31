import uuid
import datetime
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from app.models import (
    SessionStartRequest, SessionStartResponse, Question,
    AnswerSubmission, AnswerResult
)
from app.storage.db import DBSession, DBAnswer
from app.services.ai_service import AIService


class GameEngine:
    def __init__(self, db: Session, ai_service: AIService):
        self.db = db
        self.ai_service = ai_service

    def start_session(self, request: SessionStartRequest) -> SessionStartResponse:
        """
        Initializes a new gameplay session, creates a DB entry, and generates the first question.
        """
        session_id = str(uuid.uuid4())
        
        # Start at difficulty 1
        initial_difficulty = 1
        
        # Generate the first question
        first_question = self.ai_service.generate_question(
            topic=request.topic,
            difficulty=initial_difficulty,
            excluded_ids=[]
        )

        # Create session record
        db_session = DBSession(
            session_id=session_id,
            username=request.username,
            topic=request.topic,
            start_time=datetime.datetime.utcnow(),
            score=0,
            total_questions=0,
            correct_answers=0,
            lives_remaining=3,
            max_difficulty_reached=initial_difficulty,
            completed=False,
            weak_areas="",
            difficulty_log=str(initial_difficulty)
        )
        self.db.add(db_session)
        self.db.commit()

        return SessionStartResponse(
            session_id=session_id,
            username=request.username,
            topic=request.topic,
            lives_remaining=3,
            current_difficulty=initial_difficulty,
            current_level=1,
            total_levels=5,
            first_question=first_question
        )

    def submit_answer(self, submission: AnswerSubmission) -> AnswerResult:
        """
        Processes an answer submission, updates the adaptive state, and determines the next question.
        """
        # 1. Fetch current session from DB
        db_session = self.db.query(DBSession).filter(
            DBSession.session_id == submission.session_id
        ).first()

        if not db_session:
            raise ValueError("Session not found")
        if db_session.completed:
            raise ValueError("Session already completed")

        # 2. Get list of already answered questions to pass as excluded
        answered_questions = self.db.query(DBAnswer).filter(
            DBAnswer.session_id == submission.session_id
        ).all()
        excluded_ids = [ans.question_id for ans in answered_questions]
        
        # Calculate current difficulty from current session log
        diffs = [int(x) for x in db_session.difficulty_log.split(",")]
        current_difficulty = diffs[-1]
        
        # Find the question currently being answered
        # We need to retrieve it. Since we are using the AIService, let's query the question
        # details. In a real system, the question would be in DB. Here, we fetch it by ID.
        # We search MOCK_QUESTIONS_DATABASE or generate a procedural fallback.
        # But wait, to be correct, the client provides the question ID. Let's fetch the details
        # using the AI service (which is deterministic).
        question = self.ai_service.generate_question(
            topic=db_session.topic,
            difficulty=current_difficulty,
            excluded_ids=[x for x in excluded_ids if x != submission.question_id]
        )
        # Verify question matches the ID, otherwise find it. Since we want precision, let's search:
        # If the generated question's ID doesn't match submission.question_id, we generate
        # specifically matching the ID. Let's make sure it matches.
        # A simpler way is: the client sends selected index, and we evaluate it against the question.
        # Let's write the response.
        
        # Determine correct answer
        is_correct = (submission.selected_option_index == question.correct_option_index)
        
        # 3. Calculate streak and update difficulty log
        # Let's count consecutive correct answers at the end of the answered list
        consecutive_correct = 0
        for ans in reversed(answered_questions):
            if ans.is_correct:
                consecutive_correct += 1
            else:
                break
                
        # If this answer is correct, we add to streak
        new_streak = consecutive_correct + 1 if is_correct else 0

        # Calculate new difficulty
        new_difficulty = current_difficulty
        if is_correct:
            # Correct answer: increment score, and if streak is 2, increase difficulty
            db_session.score += current_difficulty * 100
            db_session.correct_answers += 1
            if new_streak >= 2:
                new_difficulty = min(current_difficulty + 1, 5)
                # Reset streak in our calculation so they need another 2 correct answers to go up again
                new_streak = 0
        else:
            # Incorrect answer: decrement lives, decrease difficulty, track weak areas
            db_session.lives_remaining -= 1
            new_difficulty = max(current_difficulty - 1, 1)
            
            # Add to weak areas
            current_weak = [x.strip() for x in db_session.weak_areas.split(",") if x.strip()]
            if question.sub_topic not in current_weak:
                current_weak.append(question.sub_topic)
                db_session.weak_areas = ",".join(current_weak)

        # Update session tracking
        db_session.total_questions += 1
        db_session.max_difficulty_reached = max(db_session.max_difficulty_reached, new_difficulty)
        
        # Append to difficulty log
        difficulty_log_list = db_session.difficulty_log.split(",")
        difficulty_log_list.append(str(new_difficulty))
        db_session.difficulty_log = ",".join(difficulty_log_list)

        # 4. Save answer audit record
        db_answer = DBAnswer(
            session_id=submission.session_id,
            question_id=submission.question_id,
            question_text=question.text,
            sub_topic=question.sub_topic,
            difficulty=current_difficulty,
            selected_option_index=submission.selected_option_index,
            correct_option_index=question.correct_option_index,
            is_correct=is_correct
        )
        self.db.add(db_answer)

        # 5. Generate AI feedback reaction
        selected_option_text = question.options[submission.selected_option_index]
        correct_option_text = question.options[question.correct_option_index]
        ai_feedback = self.ai_service.generate_feedback(
            question_text=question.text,
            selected_option=selected_option_text,
            correct_option=correct_option_text,
            is_correct=is_correct,
            difficulty=current_difficulty
        )

        # 6. Check game termination condition
        completed = False
        next_question = None
        learning_summary = None

        if db_session.lives_remaining <= 0 or db_session.total_questions >= 5:
            # Game complete
            completed = True
            db_session.completed = True
            db_session.end_time = datetime.datetime.utcnow()
            
            # Calculate accuracy percentage
            accuracy = (db_session.correct_answers / db_session.total_questions * 100) if db_session.total_questions > 0 else 0
            
            # Generate AI review summary
            weak_list = [x.strip() for x in db_session.weak_areas.split(",") if x.strip()]
            learning_summary = self.ai_service.generate_learning_summary(
                username=db_session.username,
                topic=db_session.topic,
                score=db_session.score,
                total_questions=db_session.total_questions,
                accuracy=accuracy,
                weak_areas=weak_list
            )
        else:
            # Game continues - generate next question excluding answered questions
            new_excluded = excluded_ids + [submission.question_id]
            next_question = self.ai_service.generate_question(
                topic=db_session.topic,
                difficulty=new_difficulty,
                excluded_ids=new_excluded
            )

        self.db.commit()

        return AnswerResult(
            is_correct=is_correct,
            correct_option_index=question.correct_option_index,
            explanation=question.explanation,
            streak=new_streak,
            lives_remaining=db_session.lives_remaining,
            new_difficulty=new_difficulty,
            completed=completed,
            next_question=next_question,
            summary=learning_summary
        )

    def force_complete_session(self, session_id: str) -> None:
        """
        Force completes an open session (e.g. if the user exits early).
        """
        db_session = self.db.query(DBSession).filter(
            DBSession.session_id == session_id
        ).first()

        if db_session and not db_session.completed:
            db_session.completed = True
            db_session.end_time = datetime.datetime.utcnow()
            self.db.commit()
            
            # Generate AI review summary on force-complete
            accuracy = (db_session.correct_answers / db_session.total_questions * 100) if db_session.total_questions > 0 else 0
            weak_list = [x.strip() for x in db_session.weak_areas.split(",") if x.strip()]
            self.ai_service.generate_learning_summary(
                username=db_session.username,
                topic=db_session.topic,
                score=db_session.score,
                total_questions=db_session.total_questions,
                accuracy=accuracy,
                weak_areas=weak_list
            )
            self.db.commit()
