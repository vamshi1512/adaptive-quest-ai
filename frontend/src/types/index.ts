export interface Question {
  id: string;
  text: string;
  options: string[];
  correct_option_index: number;
  difficulty: number;
  sub_topic: string;
  explanation: string;
}

export interface SessionStartRequest {
  username: string;
  topic: string;
}

export interface SessionStartResponse {
  session_id: string;
  username: string;
  topic: string;
  lives_remaining: number;
  current_difficulty: number;
  current_level: number;
  total_levels: number;
  first_question: Question;
}

export interface AnswerSubmission {
  session_id: string;
  question_id: string;
  selected_option_index: number;
}

export interface AnswerResult {
  is_correct: boolean;
  correct_option_index: number;
  explanation: string;
  streak: number;
  lives_remaining: number;
  new_difficulty: number;
  completed: boolean;
  next_question: Question | null;
  summary: string | null;
}

export interface FeedbackSubmit {
  session_id?: string;
  username: string;
  topic: string;
  was_fun: number; // 1-5
  was_useful: number; // 1-5
  difficulty_fit: string; // "Too Easy" | "Perfect" | "Too Hard"
  would_replay: boolean;
  comments?: string;
}

export interface KPISummary {
  total_sessions: number;
  completion_rate: number;
  average_accuracy: number;
  average_score: number;
  replay_count: number;
  average_session_length_seconds: number;
  difficulty_progression: { level: string; difficulty: number }[];
  topic_distribution: { topic: string; count: number }[];
  feedback_ratings: { fun: number; useful: number };
  weak_areas_summary: { sub_topic: string; count_failed: number }[];
  session_history: {
    session_id: string;
    username: string;
    topic: string;
    score: string;
    accuracy: string;
    status: string;
    date: string;
  }[];
}
