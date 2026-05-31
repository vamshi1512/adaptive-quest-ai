import type {
  SessionStartRequest,
  SessionStartResponse,
  AnswerSubmission,
  AnswerResult,
  FeedbackSubmit,
  KPISummary
} from '../types';

// The Vite dev server will proxy requests starting with /api to http://127.0.0.1:8000
const API_BASE = '/api';

export const api = {
  /**
   * Starts a new learning session.
   */
  async startSession(request: SessionStartRequest): Promise<SessionStartResponse> {
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
    const response = await fetch('/health');
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
  }
};
