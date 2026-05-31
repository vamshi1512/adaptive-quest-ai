from fastapi.testclient import TestClient
from app.main import app
from app.storage.db import Base, engine
import pytest

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    # Make sure tables exist
    Base.metadata.create_all(bind=engine)
    yield
    # We keep the physical test db clean if needed, or SQLite file remains.

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "healthy"
    assert "service" in json_data

def test_start_session_api():
    payload = {
        "username": "test_user_api",
        "topic": "Cybersecurity basics"
    }
    response = client.post("/api/session/start", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert data["username"] == "test_user_api"
    assert data["lives_remaining"] == 3
    assert "first_question" in data

def test_analytics_summary_api():
    response = client.get("/api/analytics/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_sessions" in data
    assert "completion_rate" in data
    assert "average_accuracy" in data
    assert "difficulty_progression" in data
    assert "session_history" in data

def test_feedback_submit_api():
    payload = {
        "session_id": "seed_session_1",
        "username": "test_user_api",
        "topic": "Cybersecurity basics",
        "was_fun": 5,
        "was_useful": 4,
        "difficulty_fit": "Perfect",
        "would_replay": True,
        "comments": "Tasting API feedback"
    }
    response = client.post("/api/feedback", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
