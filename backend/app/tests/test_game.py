import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.storage.db import Base, DBSession
from app.services.game_engine import GameEngine
from app.services.ai_service import AIService
from app.models import SessionStartRequest, AnswerSubmission

# Use in-memory SQLite database for testing
TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(name="db_session")
def fixture_db_session():
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(name="ai_service")
def fixture_ai_service():
    return AIService()

def test_start_session(db_session, ai_service):
    engine = GameEngine(db_session, ai_service)
    request = SessionStartRequest(username="test_player", topic="Cybersecurity basics")
    
    response = engine.start_session(request)
    
    assert response.session_id is not None
    assert response.username == "test_player"
    assert response.topic == "Cybersecurity basics"
    assert response.lives_remaining == 3
    assert response.current_difficulty == 1
    assert response.first_question is not None
    assert len(response.first_question.options) == 4

def test_submit_correct_answers_increases_difficulty(db_session, ai_service):
    engine = GameEngine(db_session, ai_service)
    request = SessionStartRequest(username="test_player", topic="Cybersecurity basics")
    start_resp = engine.start_session(request)
    
    # Force mock question details to ensure we know the correct answer
    question = start_resp.first_question
    correct_idx = question.correct_option_index
    
    # Submit first correct answer
    sub1 = AnswerSubmission(
        session_id=start_resp.session_id,
        question_id=question.id,
        selected_option_index=correct_idx
    )
    res1 = engine.submit_answer(sub1)
    
    assert res1.is_correct is True
    assert res1.lives_remaining == 3
    # Streak is 1. Difficulty remains 1 because streak must be >= 2 to increase.
    assert res1.new_difficulty == 1
    assert res1.streak == 1
    
    # Submit second correct answer
    next_question = res1.next_question
    assert next_question is not None
    sub2 = AnswerSubmission(
        session_id=start_resp.session_id,
        question_id=next_question.id,
        selected_option_index=next_question.correct_option_index
    )
    res2 = engine.submit_answer(sub2)
    
    assert res2.is_correct is True
    assert res2.lives_remaining == 3
    # Streak was 1, now becomes 2, which triggers difficulty increase to 2, and resets streak in return.
    assert res2.new_difficulty == 2
    assert res2.streak == 0

def test_submit_incorrect_answer_decreases_lives_and_difficulty(db_session, ai_service):
    engine = GameEngine(db_session, ai_service)
    request = SessionStartRequest(username="test_player", topic="Cybersecurity basics")
    start_resp = engine.start_session(request)
    
    # Set session to difficulty 3 manually for test purposes
    db_sess = db_session.query(DBSession).filter(DBSession.session_id == start_resp.session_id).first()
    db_sess.difficulty_log = "1,3"  # Pretend we are at difficulty 3
    db_session.commit()
    
    # Fetch question at difficulty 3
    question = ai_service.generate_question("Cybersecurity basics", 3, [])
    
    # Submit incorrect answer (any index other than the correct one)
    incorrect_idx = (question.correct_option_index + 1) % 4
    sub = AnswerSubmission(
        session_id=start_resp.session_id,
        question_id=question.id,
        selected_option_index=incorrect_idx
    )
    res = engine.submit_answer(sub)
    
    assert res.is_correct is False
    assert res.lives_remaining == 2
    # Difficulty should decrease from 3 to 2
    assert res.new_difficulty == 2
    assert res.streak == 0
    
    # Verify that the sub_topic is registered as a weak area
    db_sess_updated = db_session.query(DBSession).filter(DBSession.session_id == start_resp.session_id).first()
    assert question.sub_topic in db_sess_updated.weak_areas

def test_game_over_conditions_out_of_lives(db_session, ai_service):
    engine = GameEngine(db_session, ai_service)
    request = SessionStartRequest(username="test_player", topic="Cybersecurity basics")
    start_resp = engine.start_session(request)
    
    session_id = start_resp.session_id
    question = start_resp.first_question
    
    # Submit 3 incorrect answers consecutively to run out of lives
    for i in range(3):
        incorrect_idx = (question.correct_option_index + 1) % 4
        sub = AnswerSubmission(
            session_id=session_id,
            question_id=question.id,
            selected_option_index=incorrect_idx
        )
        res = engine.submit_answer(sub)
        
        if i < 2:
            assert res.completed is False
            assert res.lives_remaining == 2 - i
            question = res.next_question
        else:
            assert res.completed is True
            assert res.lives_remaining == 0
            assert res.summary is not None
            assert "Summary" in res.summary
