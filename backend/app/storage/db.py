import datetime
import random
from sqlalchemy import create_engine, Column, String, Integer, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = "sqlite:///./adaptive_quest.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DBSession(Base):
    __tablename__ = "sessions"

    session_id = Column(String, primary_key=True, index=True)
    username = Column(String, index=True)
    topic = Column(String)
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    score = Column(Integer, default=0)
    total_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    lives_remaining = Column(Integer, default=3)
    max_difficulty_reached = Column(Integer, default=1)
    completed = Column(Boolean, default=False)
    weak_areas = Column(String, default="")  # Comma-separated list of subtopics
    difficulty_log = Column(String, default="1")  # Comma-separated like "1,2,3,2,1"

    answers = relationship("DBAnswer", back_populates="session")

class DBAnswer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String, ForeignKey("sessions.session_id"))
    question_id = Column(String)
    question_text = Column(String)
    sub_topic = Column(String)
    difficulty = Column(Integer)
    selected_option_index = Column(Integer)
    correct_option_index = Column(Integer)
    is_correct = Column(Boolean)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("DBSession", back_populates="answers")

class DBFeedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String, nullable=True)
    username = Column(String)
    topic = Column(String)
    was_fun = Column(Integer)  # 1-5
    was_useful = Column(Integer)  # 1-5
    difficulty_fit = Column(String)  # Too Easy, Perfect, Too Hard
    would_replay = Column(Boolean)
    comments = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database_if_empty(db)
    finally:
        db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def seed_database_if_empty(db):
    """
    Seeds the SQLite database with 15 completed sessions and feedback records
    so the dashboard shows rich, production-like charts from start.
    """
    if db.query(DBSession).count() > 0:
        return  # Already seeded

    print("Seeding database with sample playtest records...")

    sample_users = [
        ("sarah_pm", "Cybersecurity basics"),
        ("dev_john", "AI ethics"),
        ("alex_ux", "Workplace communication"),
        ("mary_legal", "Data privacy"),
        ("tom_lead", "Team collaboration"),
        ("clara_sec", "Cybersecurity basics"),
        ("sam_ethics", "AI ethics"),
        ("anna_hr", "Workplace communication"),
        ("steve_ops", "Data privacy"),
        ("lucy_agile", "Team collaboration"),
        ("kurt_eng", "Cybersecurity basics"),
        ("emma_ai", "AI ethics"),
        ("dan_comms", "Workplace communication"),
        ("grace_data", "Data privacy"),
        ("ben_prod", "Team collaboration")
    ]

    base_time = datetime.datetime.utcnow() - datetime.timedelta(days=3)

    for idx, (username, topic) in enumerate(sample_users):
        session_id = f"seed_session_{idx + 1}"
        start_time = base_time + datetime.timedelta(hours=idx * 4, minutes=random.randint(0, 45))
        
        # Determine randomized outcome
        completed = random.choice([True, True, True, False])  # 75% completion rate
        total_q = 5 if completed else random.randint(2, 4)
        correct_q = random.randint(int(total_q * 0.5), total_q)
        lives_left = 3 - (total_q - correct_q)
        
        # Ensure consistency
        if lives_left <= 0:
            lives_left = 0
            completed = True  # Ended due to out of lives
            
        score = 0
        diff_log = []
        curr_diff = 1
        streak = 0
        
        # Simulate answers and difficulty progression
        for q_idx in range(total_q):
            is_ans_correct = (q_idx < correct_q)  # Simple simulation
            diff_log.append(str(curr_diff))
            
            # Record answer
            db_ans = DBAnswer(
                session_id=session_id,
                question_id=f"seed_q_{topic[:3].lower()}_{curr_diff}_{q_idx}",
                question_text=f"Sample question text regarding {topic} at level {curr_diff}",
                sub_topic=f"Topic Element {q_idx + 1}",
                difficulty=curr_diff,
                selected_option_index=0 if is_ans_correct else 1,
                correct_option_index=0,
                is_correct=is_ans_correct,
                timestamp=start_time + datetime.timedelta(minutes=q_idx * 2)
            )
            db.add(db_ans)

            # Update stats
            if is_ans_correct:
                score += curr_diff * 100
                streak += 1
                if streak >= 2:
                    curr_diff = min(curr_diff + 1, 5)
                    streak = 0
            else:
                streak = 0
                curr_diff = max(curr_diff - 1, 1)
        
        end_time = start_time + datetime.timedelta(minutes=total_q * 2) if completed else None
        
        # Deduce weak areas
        weaks = []
        if correct_q < total_q:
            weaks = [f"Topic Element {x + 1}" for x in range(correct_q, total_q)]
            
        db_sess = DBSession(
            session_id=session_id,
            username=username,
            topic=topic,
            start_time=start_time,
            end_time=end_time,
            score=score,
            total_questions=total_q,
            correct_answers=correct_q,
            lives_remaining=lives_left,
            max_difficulty_reached=max([int(x) for x in diff_log]) if diff_log else 1,
            completed=completed,
            weak_areas=",".join(weaks),
            difficulty_log=",".join(diff_log)
        )
        db.add(db_sess)

        # Seed Feedback for completed sessions (about 60% submit feedback)
        if completed and random.random() > 0.4:
            fun = random.choice([4, 5, 5, 3])
            useful = random.choice([5, 5, 4, 4])
            diff_fit = random.choice(["Perfect", "Perfect", "Perfect", "Too Easy", "Too Hard"])
            would_rep = random.choice([True, True, False])
            
            feedbacks = [
                "Loved the adaptive mechanic, kept me engaged!",
                "Great interface and relevant questions. Highly recommended.",
                "Feedback on incorrect answers was very actionable.",
                "Questions are clear, difficulty progression is smooth.",
                "Corporate learning should always be this fun. Highly replayable.",
                "A bit difficult, but I learned a lot from the detailed feedback!"
            ]
            comment = feedbacks[random.randint(0, len(feedbacks) - 1)] if random.random() > 0.3 else None

            db_feed = DBFeedback(
                session_id=session_id,
                username=username,
                topic=topic,
                was_fun=fun,
                was_useful=useful,
                difficulty_fit=diff_fit,
                would_replay=would_rep,
                comments=comment,
                timestamp=end_time + datetime.timedelta(minutes=1)
            )
            db.add(db_feed)

    db.commit()
    print("Database seeding completed successfully.")
