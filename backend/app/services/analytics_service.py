from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import KPISummary
from app.storage.db import DBSession, DBAnswer, DBFeedback
from typing import List, Dict, Any
import json

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_kpi_summary(self) -> KPISummary:
        """
        Calculates and returns aggregated metrics for the KPI dashboard.
        """
        # Fetch all sessions, answers, and feedback
        sessions = self.db.query(DBSession).all()
        answers = self.db.query(DBAnswer).all()
        feedback = self.db.query(DBFeedback).all()

        total_sessions = len(sessions)
        if total_sessions == 0:
            # Fallback empty metrics structure
            return KPISummary(
                total_sessions=0,
                completion_rate=0.0,
                average_accuracy=0.0,
                average_score=0.0,
                replay_count=0,
                average_session_length_seconds=0.0,
                difficulty_progression=[],
                topic_distribution=[],
                feedback_ratings={"fun": 0.0, "useful": 0.0},
                weak_areas_summary=[],
                session_history=[]
            )

        # 1. Completion Rate
        completed_sessions = [s for s in sessions if s.completed]
        completion_rate = (len(completed_sessions) / total_sessions) * 100

        # 2. Accuracy
        total_q = sum(s.total_questions for s in sessions)
        total_correct = sum(s.correct_answers for s in sessions)
        average_accuracy = (total_correct / total_q * 100) if total_q > 0 else 0.0

        # 3. Average Score
        average_score = sum(s.score for s in sessions) / total_sessions

        # 4. Replay Count
        # We define a replay as any session where a username has already played that topic before.
        user_topic_pairs = set()
        replay_count = 0
        # Sort sessions by start_time so we evaluate chronologically
        sorted_sessions = sorted(sessions, key=lambda x: x.start_time)
        for s in sorted_sessions:
            pair = (s.username, s.topic)
            if pair in user_topic_pairs:
                replay_count += 1
            else:
                user_topic_pairs.add(pair)

        # 5. Average Session Length
        session_lengths = []
        for s in completed_sessions:
            if s.end_time and s.start_time:
                duration = (s.end_time - s.start_time).total_seconds()
                session_lengths.append(duration)
        avg_session_length = sum(session_lengths) / len(session_lengths) if session_lengths else 0.0

        # 6. Difficulty Progression
        # Aggregate difficulty logs per question number (e.g. index 0, 1, 2, 3, 4)
        difficulty_sums_per_step: Dict[int, List[int]] = {}
        for s in sessions:
            log_steps = [int(x) for x in s.difficulty_log.split(",") if x.strip()]
            for step_idx, diff in enumerate(log_steps):
                if step_idx not in difficulty_sums_per_step:
                    difficulty_sums_per_step[step_idx] = []
                difficulty_sums_per_step[step_idx].append(diff)
        
        difficulty_progression = []
        # Sort by step number
        for step in sorted(difficulty_sums_per_step.keys()):
            diff_list = difficulty_sums_per_step[step]
            avg_diff = sum(diff_list) / len(diff_list) if diff_list else 0.0
            difficulty_progression.append({
                "level": f"Q{step + 1}",
                "difficulty": round(avg_diff, 2)
            })

        # 7. Topic Distribution
        topic_counts: Dict[str, int] = {}
        for s in sessions:
            topic_counts[s.topic] = topic_counts.get(s.topic, 0) + 1
        topic_distribution = [
            {"topic": k, "count": v} for k, v in topic_counts.items()
        ]

        # 8. Feedback Ratings
        fun_sum = sum(f.was_fun for f in feedback)
        useful_sum = sum(f.was_useful for f in feedback)
        feedback_count = len(feedback)
        feedback_ratings = {
            "fun": round(fun_sum / feedback_count, 1) if feedback_count > 0 else 0.0,
            "useful": round(useful_sum / feedback_count, 1) if feedback_count > 0 else 0.0
        }

        # 9. Weak Areas Summary
        # Count failures per sub_topic
        weak_counts: Dict[str, int] = {}
        incorrect_answers = [a for a in answers if not a.is_correct]
        for a in incorrect_answers:
            if a.sub_topic:
                weak_counts[a.sub_topic] = weak_counts.get(a.sub_topic, 0) + 1
        
        weak_areas_summary = [
            {"sub_topic": k, "count_failed": v}
            for k, v in sorted(weak_counts.items(), key=lambda item: item[1], reverse=True)
        ]

        # 10. Session History Log
        session_history = []
        for s in sorted(sessions, key=lambda x: x.start_time, reverse=True)[:10]:
            session_history.append({
                "session_id": s.session_id,
                "username": s.username,
                "topic": s.topic,
                "score": str(s.score),
                "accuracy": f"{(s.correct_answers / s.total_questions * 100):.0f}%" if s.total_questions > 0 else "0%",
                "status": "Completed" if s.completed else "In Progress",
                "date": s.start_time.strftime("%Y-%m-%d %H:%M")
            })

        return KPISummary(
            total_sessions=total_sessions,
            completion_rate=round(completion_rate, 1),
            average_accuracy=round(average_accuracy, 1),
            average_score=round(average_score, 1),
            replay_count=replay_count,
            average_session_length_seconds=round(avg_session_length, 1),
            difficulty_progression=difficulty_progression,
            topic_distribution=topic_distribution,
            feedback_ratings=feedback_ratings,
            weak_areas_summary=weak_areas_summary,
            session_history=session_history
        )

    def submit_feedback(self, feedback_data: DBFeedback) -> None:
        """
        Persists a playtester feedback record.
        """
        self.db.add(feedback_data)
        self.db.commit()
