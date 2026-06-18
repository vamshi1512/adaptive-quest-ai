import type {
  SessionStartRequest,
  SessionStartResponse,
  AnswerSubmission,
  AnswerResult,
  FeedbackSubmit,
  KPISummary,
  Question
} from '../types';

// The Vite dev server will proxy requests starting with /api to http://127.0.0.1:8000
const API_BASE = '/api';
const IS_STATIC_DEMO = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');

const demoQuestions: Question[] = [
  {
    id: 'demo-q1',
    text: 'A teammate receives an urgent email asking them to reset their password through an unknown link. What is the safest first action?',
    options: [
      'Click the link quickly because the request is urgent',
      'Forward the email to everyone as a warning',
      'Verify the sender and report the email through the approved phishing channel',
      'Reply to the sender and ask if the message is real'
    ],
    correct_option_index: 2,
    difficulty: 1,
    sub_topic: 'Phishing response',
    explanation: 'Suspicious credential-reset emails should be verified through trusted channels and reported through the organization process.'
  },
  {
    id: 'demo-q2',
    text: 'Which control most directly reduces risk when an employee password is reused across services?',
    options: [
      'Multi-factor authentication',
      'More frequent team meetings',
      'Larger email attachments',
      'A public project dashboard'
    ],
    correct_option_index: 0,
    difficulty: 2,
    sub_topic: 'Account protection',
    explanation: 'MFA adds a second verification layer, reducing the impact of leaked or reused passwords.'
  },
  {
    id: 'demo-q3',
    text: 'A model-generated answer sounds confident but cites evidence that does not exist. What risk does this describe?',
    options: [
      'Load balancing',
      'Hallucination',
      'Containerization',
      'Database indexing'
    ],
    correct_option_index: 1,
    difficulty: 3,
    sub_topic: 'AI reliability',
    explanation: 'Hallucination occurs when an AI system produces unsupported or fabricated information.'
  },
  {
    id: 'demo-q4',
    text: 'For privacy-aware analytics, which practice is usually best?',
    options: [
      'Collect every possible user field for future use',
      'Store raw personal data forever',
      'Minimize collected data and aggregate where possible',
      'Disable all audit logging'
    ],
    correct_option_index: 2,
    difficulty: 4,
    sub_topic: 'Data minimization',
    explanation: 'Data minimization and aggregation reduce privacy risk while preserving useful analytics.'
  },
  {
    id: 'demo-q5',
    text: 'In threat modeling, why is it useful to compare LLM-generated findings against a structured method such as STRIDE?',
    options: [
      'It removes the need for human review',
      'It helps evaluate coverage, consistency, and missed threat categories',
      'It guarantees every issue is exploitable',
      'It replaces all security testing'
    ],
    correct_option_index: 1,
    difficulty: 5,
    sub_topic: 'Threat modeling',
    explanation: 'A structured baseline helps evaluate whether AI-assisted analysis covers relevant threat categories consistently.'
  }
];

const demoState = new Map<string, { username: string; topic: string; level: number; lives: number; streak: number }>();

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const demoApi = {
  async startSession(request: SessionStartRequest): Promise<SessionStartResponse> {
    await wait();
    const sessionId = `demo-${Date.now()}`;
    demoState.set(sessionId, {
      username: request.username,
      topic: request.topic,
      level: 1,
      lives: 3,
      streak: 0
    });

    return {
      session_id: sessionId,
      username: request.username,
      topic: request.topic,
      lives_remaining: 3,
      current_difficulty: 1,
      current_level: 1,
      total_levels: demoQuestions.length,
      first_question: demoQuestions[0]
    };
  },

  async submitAnswer(submission: AnswerSubmission): Promise<AnswerResult> {
    await wait();
    const state = demoState.get(submission.session_id);
    const questionIndex = Math.max(0, demoQuestions.findIndex((q) => q.id === submission.question_id));
    const question = demoQuestions[questionIndex];
    const isCorrect = submission.selected_option_index === question.correct_option_index;
    const lives = isCorrect ? state?.lives ?? 3 : Math.max((state?.lives ?? 3) - 1, 0);
    const streak = isCorrect ? (state?.streak ?? 0) + 1 : 0;
    const nextQuestion = demoQuestions[questionIndex + 1] ?? null;
    const completed = lives === 0 || nextQuestion === null;

    if (state) {
      demoState.set(submission.session_id, {
        ...state,
        level: questionIndex + 2,
        lives,
        streak
      });
    }

    return {
      is_correct: isCorrect,
      correct_option_index: question.correct_option_index,
      explanation: question.explanation,
      streak,
      lives_remaining: lives,
      new_difficulty: Math.min(question.difficulty + (isCorrect ? 1 : 0), 5),
      completed,
      next_question: completed ? null : nextQuestion,
      summary: completed
        ? 'Demo quest complete. The session shows adaptive difficulty, answer feedback, and KPI-ready result tracking without a hosted backend.'
        : null
    };
  },

  async completeSession(): Promise<void> {
    await wait(100);
  },

  async submitFeedback(): Promise<void> {
    await wait();
  },

  async getAnalyticsSummary(): Promise<KPISummary> {
    await wait();
    return {
      total_sessions: 42,
      completion_rate: 81,
      average_accuracy: 76,
      average_score: 1380,
      replay_count: 17,
      average_session_length_seconds: 214,
      difficulty_progression: [
        { level: 'L1', difficulty: 1.2 },
        { level: 'L2', difficulty: 2.1 },
        { level: 'L3', difficulty: 3.0 },
        { level: 'L4', difficulty: 3.6 },
        { level: 'L5', difficulty: 4.2 }
      ],
      topic_distribution: [
        { topic: 'Cybersecurity basics', count: 14 },
        { topic: 'AI ethics', count: 10 },
        { topic: 'Data privacy', count: 8 },
        { topic: 'Communication', count: 6 },
        { topic: 'Collaboration', count: 4 }
      ],
      feedback_ratings: { fun: 4.6, useful: 4.4 },
      weak_areas_summary: [
        { sub_topic: 'AI reliability', count_failed: 6 },
        { sub_topic: 'Threat modeling', count_failed: 4 },
        { sub_topic: 'Data minimization', count_failed: 3 }
      ],
      session_history: [
        { session_id: 'demo-001', username: 'Recruiter demo', topic: 'Cybersecurity basics', score: '1500', accuracy: '80%', status: 'Completed', date: 'Demo data' },
        { session_id: 'demo-002', username: 'Playtester A', topic: 'AI ethics', score: '1200', accuracy: '70%', status: 'Completed', date: 'Demo data' },
        { session_id: 'demo-003', username: 'Playtester B', topic: 'Data privacy', score: '1650', accuracy: '90%', status: 'Completed', date: 'Demo data' }
      ]
    };
  },

  async checkHealth(): Promise<{ status: string; service: string }> {
    return { status: 'ok', service: 'static-demo' };
  }
};

export const api = {
  /**
   * Starts a new learning session.
   */
  async startSession(request: SessionStartRequest): Promise<SessionStartResponse> {
    if (IS_STATIC_DEMO) return demoApi.startSession(request);

    const response = await fetch(`${API_BASE}/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`Failed to start session: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Submits an answer to the current question and receives the adaptive result.
   */
  async submitAnswer(submission: AnswerSubmission): Promise<AnswerResult> {
    if (IS_STATIC_DEMO) return demoApi.submitAnswer(submission);

    const response = await fetch(`${API_BASE}/answer/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });
    if (!response.ok) {
      throw new Error(`Failed to submit answer: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Force completes a session (e.g., if user exits early).
   */
  async completeSession(sessionId: string): Promise<void> {
    if (IS_STATIC_DEMO) return demoApi.completeSession();

    const response = await fetch(`${API_BASE}/session/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });
    if (!response.ok) {
      throw new Error(`Failed to complete session: ${response.statusText}`);
    }
  },

  /**
   * Submits playtest feedback survey response.
   */
  async submitFeedback(feedback: FeedbackSubmit): Promise<void> {
    if (IS_STATIC_DEMO) return demoApi.submitFeedback();

    const response = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
    if (!response.ok) {
      throw new Error(`Failed to submit feedback: ${response.statusText}`);
    }
  },

  /**
   * Fetches the analytics summary for the KPI dashboard.
   */
  async getAnalyticsSummary(): Promise<KPISummary> {
    if (IS_STATIC_DEMO) return demoApi.getAnalyticsSummary();

    const response = await fetch(`${API_BASE}/analytics/summary`);
    if (!response.ok) {
      throw new Error(`Failed to fetch analytics summary: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Performs basic health check of the backend.
   */
  async checkHealth(): Promise<{ status: string; service: string }> {
    if (IS_STATIC_DEMO) return demoApi.checkHealth();

    const response = await fetch('/health');
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
  }
};
