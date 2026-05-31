import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { RefreshCw, BarChart2, ShieldAlert, Award, FileText, ChevronRight } from 'lucide-react';

interface ResultsPageProps {
  gameData: {
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
  } | null;
  onReplay: () => void;
  setView: (view: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  gameData,
  onReplay,
  setView
}) => {
  if (!gameData) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 text-center">
        <p className="text-slate-400">No session results available.</p>
        <button onClick={() => setView('topic-selection')} className="btn-primary mt-4">
          Choose a Topic
        </button>
      </div>
    );
  }

  const accuracy = (gameData.correctAnswers / gameData.totalQuestions) * 100;
  const isWinner = gameData.livesLeft > 0;

  // Format difficulty progression for Recharts
  const chartData = gameData.difficultyLog.map((diff, index) => ({
    questionNum: `Q${index + 1}`,
    Difficulty: diff
  }));

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      {/* Top Banner Status */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-violet-950/40 border border-violet-800/40 rounded-full text-violet-400 font-semibold text-xs uppercase tracking-wider mb-4 animate-float">
          <Award className="w-3.5 h-3.5" />
          <span>Quest Audited</span>
        </span>
        
        <h2 className="text-4xl font-extrabold text-slate-100 tracking-tight uppercase">
          {isWinner ? 'Quest Accomplished!' : 'Deployment Interrupted'}
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          {isWinner 
            ? 'You successfully bypassed all security vectors and completed the quest outline.'
            : 'Operational integrity dropped below limits. Re-run systems to complete the quest.'}
        </p>
      </div>

      {/* Grid of Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Core Stats Card */}
        <div className="glass-panel p-6 rounded-2xl md:col-span-1 border border-slate-800 flex flex-col justify-between">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4">Performance Log</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-xs text-slate-400">Total Score</span>
              <span className="text-lg font-black text-amber-400">{gameData.score} pts</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-xs text-slate-400">Total Questions</span>
              <span className="text-sm font-bold text-slate-200">{gameData.totalQuestions}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-xs text-slate-400">Accuracy Rate</span>
              <span className={`text-sm font-extrabold ${accuracy >= 80 ? 'text-emerald-400' : accuracy >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                {accuracy.toFixed(0)}%
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-xs text-slate-400">Max Difficulty reached</span>
              <span className="text-sm font-bold text-cyan-300">Level {gameData.maxDifficulty} / 5</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-slate-400">Lives remaining</span>
              <span className="text-sm font-bold text-rose-400">{gameData.livesLeft} / 3</span>
            </div>
          </div>

          <button
            onClick={() => setView('playtest-feedback')}
            className="w-full text-center py-3 bg-violet-600 hover:bg-violet-500 hover:glow-primary text-slate-100 font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-300 mt-6 cursor-pointer"
          >
            Submit Feedback Survey
          </button>
        </div>

        {/* AI summary feedback & Weak areas */}
        <div className="glass-panel p-6 rounded-2xl md:col-span-2 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
              <FileText className="w-4 h-4 text-violet-400 mr-2" />
              <span>AI Learning Audit & Coaching Report</span>
            </h3>

            {/* AI Coaching comment box */}
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 mb-6">
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                {gameData.summary}
              </p>
            </div>

            {/* Weak topics registry */}
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Weakness Vectors Identified</h4>
            {gameData.weakAreas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {gameData.weakAreas.map((area, i) => (
                  <span
                    key={i}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-300 text-xs font-semibold"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{area}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-400 font-semibold bg-emerald-950/20 border border-emerald-500/20 px-3 py-2 rounded-xl inline-block">
                No major weak areas flagged! Excellent system compliance.
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={onReplay}
              className="flex-1 flex items-center justify-center space-x-2 py-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold rounded-xl text-xs uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replay Quest</span>
            </button>
            <button
              onClick={() => setView('topic-selection')}
              className="flex-1 flex items-center justify-center space-x-2 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span>Choose Another Topic</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Local Difficulty Progression Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
          <BarChart2 className="w-4 h-4 text-cyan-400 mr-2" />
          <span>Real-time Difficulty Progression Curve</span>
        </h3>
        
        <div className="w-full h-64 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1b2640" />
              <XAxis dataKey="questionNum" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                domain={[1, 5]}
                tickCount={5}
                fontSize={11}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#131c2e',
                  border: '1px solid #2b395c',
                  borderRadius: '12px',
                  color: '#f1f5f9',
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="Difficulty"
                stroke="#8b5cf6"
                strokeWidth={3}
                activeDot={{ r: 8 }}
                dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4, fill: '#131c2e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-slate-500 text-center mt-3">
          This curve illustrates how the game adjusted the question challenge based on your response history.
        </p>
      </div>
    </div>
  );
};
