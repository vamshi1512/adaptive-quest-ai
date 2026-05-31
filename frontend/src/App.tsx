import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { TopicSelectionPage } from './pages/TopicSelectionPage';
import { GamePlayPage } from './pages/GamePlayPage';
import { ResultsPage } from './pages/ResultsPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlaytestFeedbackPage } from './pages/PlaytestFeedbackPage';
import { MethodologyPage } from './pages/MethodologyPage';
import type { SessionStartResponse } from './types';
import { AlertCircle } from 'lucide-react';

function App() {
  const [currentView, setView] = useState<string>('landing');
  const [activeSession, setActiveSession] = useState<SessionStartResponse | null>(null);
  
  const [gameResult, setGameResult] = useState<{
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    maxDifficulty: number;
    livesLeft: number;
    difficultyLog: number[];
    weakAreas: string[];
    summary: string;
    topic: string;
    sessionId: string;
    username: string;
  } | null>(null);

  const [error, setError] = useState<string>('');

  const handleSessionStart = (session: SessionStartResponse) => {
    setActiveSession(session);
    setGameResult(null);
    setView('game-play');
  };

  const handleGameComplete = (result: any) => {
    setGameResult(result);
    setActiveSession(null);
  };

  const handleReplay = () => {
    if (gameResult) {
      handleSessionStart({
        session_id: '', // Starts new session id on startSession
        username: gameResult.username,
        topic: gameResult.topic,
        lives_remaining: 3,
        current_difficulty: 1,
        current_level: 1,
        total_levels: 5,
        first_question: {} as any // Will be fetched
      });
      // We can re-trigger start via TopicSelection, but to make replay instant:
      // We trigger start session API with same username & topic
      const triggerSession = async () => {
        setError('');
        try {
          const resp = await fetch('/api/session/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: gameResult.username, topic: gameResult.topic })
          });
          if (!resp.ok) throw new Error('Replay failed');
          const data = await resp.json();
          handleSessionStart(data);
        } catch (err: any) {
          setError('Failed to restart session. Redirecting to selection.');
          setView('topic-selection');
        }
      };
      triggerSession();
    }
  };

  const resetGame = () => {
    setActiveSession(null);
    setGameResult(null);
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar currentView={currentView} setView={setView} resetGame={resetGame} />

        {/* Global Error Banner */}
        {error && (
          <div className="max-w-4xl mx-auto mt-4 mx-4 sm:mx-auto">
            <div className="flex items-center space-x-2 bg-rose-950/30 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Main Routed View */}
        <main className="pb-16">
          {currentView === 'landing' && <LandingPage setView={setView} />}
          
          {currentView === 'topic-selection' && (
            <TopicSelectionPage onSessionStart={handleSessionStart} setError={setError} />
          )}
          
          {currentView === 'game-play' && activeSession && (
            <GamePlayPage
              session={activeSession}
              onGameComplete={handleGameComplete}
              setView={setView}
              setError={setError}
            />
          )}
          
          {currentView === 'results' && (
            <ResultsPage gameData={gameResult} onReplay={handleReplay} setView={setView} />
          )}
          
          {currentView === 'dashboard' && <DashboardPage setError={setError} />}
          
          {currentView === 'playtest-feedback' && (
            <PlaytestFeedbackPage
              latestSession={gameResult ? { sessionId: gameResult.sessionId, topic: gameResult.topic } : null}
              setView={setView}
              setError={setError}
            />
          )}
          
          {currentView === 'methodology' && <MethodologyPage />}
        </main>
      </div>

      {/* Persistent global footer */}
      <footer className="py-6 border-t border-slate-900 bg-slate-950/20 text-center text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
        © 2026 Adaptive Quest AI. Portfolio Project for AI Games Internship.
      </footer>
    </div>
  );
}

export default App;
