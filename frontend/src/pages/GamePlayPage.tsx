import React, { useState } from 'react';
import { api } from '../services/api';
import type { SessionStartResponse, AnswerResult, Question } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { Heart, Trophy, Zap, ArrowRight, BookOpen, ShieldAlert } from 'lucide-react';

interface GamePlayPageProps {
  session: SessionStartResponse;
  onGameComplete: (result: {
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
  }) => void;
  setView: (view: string) => void;
  setError: (err: string) => void;
}

export const GamePlayPage: React.FC<GamePlayPageProps> = ({
  session,
  onGameComplete,
  setView,
  setError
}) => {
  const [currentLevel, setCurrentLevel] = useState(session.current_level);
  const [currentDifficulty, setCurrentDifficulty] = useState(session.current_difficulty);
  const [livesRemaining, setLivesRemaining] = useState(session.lives_remaining);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(session.first_question);
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answering, setAnswering] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [difficultyLog, setDifficultyLog] = useState<number[]>([session.current_difficulty]);
  const [correctCount, setCorrectCount] = useState(0);

  // Level Names & Story Narratives to make it look like a quest
  const levelNarratives = [
    {
      title: 'Incident Detection',
      narrative: 'You detect anomalous behaviors in the infrastructure. Answer correctly to diagnose the core vector of the anomaly.'
    },
    {
      title: 'Perimeter Defense',
      narrative: 'The anomaly attempts to spread across local boundaries. Build the secure shield to isolate the operational hazard.'
    },
    {
      title: 'Root-Cause Analysis',
      narrative: 'Incident responders isolate the anomalies but encounter a configuration lock. Resolve the operational conflict.'
    },
    {
      title: 'Countermeasure Deployment',
      narrative: 'Deploy the recovery blueprint to secure corporate compliance and mitigate future vulnerabilities.'
    },
    {
      title: 'System Optimization & Audit',
      narrative: 'Finalize safety configurations, compile training logs, and present the final compliance audit report to leadership.'
    }
  ];

  const currentNarrative = levelNarratives[Math.min(currentLevel - 1, 4)];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || answering) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || answering) return;
    setAnswering(true);
    setError('');

    try {
      const result = await api.submitAnswer({
        session_id: session.session_id,
        question_id: currentQuestion.id,
        selected_option_index: selectedOption
      });

      setAnswerResult(result);
      
      // Update local states
      setLivesRemaining(result.lives_remaining);
      setStreak(result.streak);
      setCurrentDifficulty(result.new_difficulty);
      setDifficultyLog((prev) => [...prev, result.new_difficulty]);

      if (result.is_correct) {
        setScore((prev) => prev + currentDifficulty * 100);
        setCorrectCount((prev) => prev + 1);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to submit answer. Check backend connections.');
    } finally {
      setAnswering(false);
    }
  };

  const handleNextStep = () => {
    if (!answerResult) return;

    if (answerResult.completed) {
      // Assemble final data structure and trigger final callback
      onGameComplete({
        score: score + (answerResult.is_correct ? currentDifficulty * 100 : 0),
        totalQuestions: currentLevel,
        correctAnswers: correctCount + (answerResult.is_correct ? 1 : 0),
        maxDifficulty: Math.max(...difficultyLog),
        livesLeft: answerResult.lives_remaining,
        difficultyLog: difficultyLog,
        // Compute weak areas from answered questions or pull from backend
        // We will fetch analytics which gets it from SQLite, but let's pass initial mock weak list:
        weakAreas: answerResult.is_correct ? [] : [currentQuestion.sub_topic],
        summary: answerResult.summary || 'Quest complete.',
        topic: session.topic,
        sessionId: session.session_id,
        username: session.username
      });
      setView('results');
    } else {
      // Continue to next question
      if (answerResult.next_question) {
        setCurrentQuestion(answerResult.next_question);
        setCurrentLevel((prev) => prev + 1);
        setSelectedOption(null);
        setAnswerResult(null);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Top HUD: Score, Streak, Lives */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
        {/* Score & Streak */}
        <div className="flex space-x-6">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Score</p>
              <p className="text-sm font-black text-slate-100">{score}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-violet-400 animate-float" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Streak</p>
              <p className="text-sm font-black text-slate-100">{streak}x</p>
            </div>
          </div>
        </div>

        {/* Lives Rendering */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 mr-1.5">Lives:</span>
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              className={`w-5 h-5 ${
                i < livesRemaining
                  ? 'text-rose-500 fill-rose-500 animate-float'
                  : 'text-slate-800 fill-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar Component */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 mb-6">
        <ProgressBar
          currentLevel={currentLevel}
          totalLevels={session.total_levels}
          difficulty={currentDifficulty}
        />
      </div>

      {/* Main Quest Content Area */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        {/* Decorative corner tag */}
        <div className="absolute top-0 right-0 bg-violet-600/10 border-l border-b border-slate-800 text-violet-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-bl-xl">
          Subtopic: {currentQuestion.sub_topic}
        </div>

        {/* Quest Story Narrative */}
        <div className="mb-6 pb-6 border-b border-slate-800/70">
          <span className="text-[10px] font-extrabold tracking-widest text-violet-400 uppercase">
            Stage {currentLevel}: {currentNarrative.title}
          </span>
          <p className="text-sm text-slate-400 italic mt-1 leading-relaxed">
            "{currentNarrative.narrative}"
          </p>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug mb-8">
          {currentQuestion.text}
        </h3>

        {/* Options Selection Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const wasSubmitted = answerResult !== null;
            const isCorrectAnswer = idx === currentQuestion.correct_option_index;
            
            let btnStyle = 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 text-slate-300 hover:text-slate-200';
            
            if (isSelected && !wasSubmitted) {
              btnStyle = 'bg-violet-600/10 border-violet-500 text-violet-300 glow-primary';
            } else if (wasSubmitted) {
              if (isCorrectAnswer) {
                // Correct answer is colored green
                btnStyle = 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300 glow-success';
              } else if (isSelected && !isCorrectAnswer) {
                // Wrong answer selected is colored red
                btnStyle = 'bg-rose-950/30 border-rose-500/50 text-rose-300';
              } else {
                btnStyle = 'bg-slate-900/20 border-slate-900 text-slate-600 cursor-not-allowed';
              }
            }

            return (
              <button
                key={idx}
                disabled={wasSubmitted || answering}
                onClick={() => handleSelectOption(idx)}
                className={`flex items-start text-left w-full p-4 rounded-xl border font-medium text-sm transition-all duration-200 cursor-pointer ${btnStyle}`}
              >
                <span className="font-extrabold text-violet-400 uppercase mr-3 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-xs select-none">
                  {['A', 'B', 'C', 'D'][idx]}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Actions Form / Feedback display */}
        <div className="flex flex-col items-center">
          {/* Submit Action */}
          {selectedOption !== null && answerResult === null && (
            <button
              onClick={handleSubmitAnswer}
              disabled={answering}
              className="flex items-center justify-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:glow-primary text-slate-100 font-bold rounded-xl text-sm uppercase tracking-wider transition-all-custom cursor-pointer w-full sm:w-auto"
            >
              <span>Submit Answer</span>
            </button>
          )}

          {/* Answer Feedback Alert Panel */}
          {answerResult !== null && (
            <div className={`w-full border p-6 rounded-2xl flex flex-col sm:flex-row gap-4 items-start ${
              answerResult.is_correct
                ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-200'
                : 'bg-rose-950/20 border-rose-500/20 text-slate-200'
            }`}>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                {answerResult.is_correct ? (
                  <BookOpen className="w-6 h-6 text-emerald-400 animate-float" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-rose-500 animate-float" />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className={`text-base font-extrabold mb-1 flex items-center ${
                  answerResult.is_correct ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {answerResult.is_correct ? 'System Stabilized!' : 'Incident Alert – Security Compromise!'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {answerResult.is_correct 
                    ? `Correct. You successfully completed the level requirement.`
                    : `Incorrect. The anomaly bypassed systems. Stasis integrity dropped.`}
                </p>
                <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-900/80 mb-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">AI Explanation & Analysis</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{answerResult.explanation}</p>
                </div>
                
                <button
                  onClick={handleNextStep}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold rounded-xl text-xs uppercase tracking-wider hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>{answerResult.completed ? 'Audit Summary' : 'Proceed Level'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
