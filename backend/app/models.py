from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

# --- Game Schema Models ---

class Question(BaseModel):
    id: str = Field(..., description="Unique question identifier")
    text: str = Field(..., description="The question text")
    options: List[str] = Field(..., description="List of multiple choice options (exactly 4 options)")
    correct_option_index: int = Field(..., description="Index of the correct option (0-3)")
    difficulty: int = Field(..., description="Difficulty level from 1 (easy) to 5 (hard)")
    sub_topic: str = Field(..., description="The sub-topic this question covers")
    explanation: str = Field(..., description="Explanation of why the option is correct")

class SessionStartRequest(BaseModel):
    username: str = Field(..., description="Username or anonymous identifier")
    topic: str = Field(..., description="The learning topic chosen (e.g. 'Cybersecurity basics')")

class SessionStartResponse(BaseModel):
    session_id: str
    username: str
    topic: str
    lives_remaining: int
    current_difficulty: int
    current_level: int
    total_levels: int = 5
    first_question: Question

class AnswerSubmission(BaseModel):
    session_id: str
    question_id: str
    selected_option_index: int

class AnswerResult(BaseModel):
    is_correct: bool
    correct_option_index: int
    explanation: str
    streak: int
    lives_remaining: int
    new_difficulty: int
    completed: bool
    next_question: Optional[Question] = None
    summary: Optional[str] = None # Filled on final question or when out of lives

class SessionCompleteRequest(BaseModel):
    session_id: str

# --- Playtest Feedback Models ---

class FeedbackSubmit(BaseModel):
    session_id: Optional[str] = None
    username: str
    topic: str
    was_fun: int = Field(..., description="Fun rating (1-5)")
    was_useful: int = Field(..., description="Usefulness rating (1-5)")
    difficulty_fit: str = Field(..., description="Too Easy, Perfect, Too Hard")
    would_replay: bool = Field(..., description="True if they would replay")
    comments: Optional[str] = None

# --- KPI Dashboard Models ---

class DifficultyProgressionPoint(BaseModel):
    level: str
    difficulty: float

class TopicDistributionPoint(BaseModel):
    topic: str
    count: int

class WeakAreaPoint(BaseModel):
    sub_topic: str
    count_failed: int

class KPISummary(BaseModel):
    total_sessions: int
    completion_rate: float # Percentage
    average_accuracy: float # Percentage
    average_score: float
    replay_count: int
    average_session_length_seconds: float
    difficulty_progression: List[DifficultyProgressionPoint]
    topic_distribution: List[TopicDistributionPoint]
    feedback_ratings: Dict[str, float] # {fun: 4.2, useful: 4.5}
    weak_areas_summary: List[WeakAreaPoint]
    session_history: List[Dict[str, str]] # Detailed grid log of recent plays

