import React from 'react';

interface ProgressBarProps {
  currentLevel: number;
  totalLevels: number;
  difficulty: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentLevel,
  totalLevels,
  difficulty
}) => {
  return (
    <div className="w-full">
      {/* Label section */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Quest Level: <span className="text-slate-100 font-bold">{currentLevel} / {totalLevels}</span>
        </span>
        <span className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-xs font-medium text-cyan-300">
            Difficulty: {difficulty}/5 ({['Beginner', 'Easy', 'Medium', 'Advanced', 'Expert'][difficulty - 1]})
          </span>
        </span>
      </div>

      {/* Progress steps bar */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalLevels }).map((_, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentLevel;
          const isCurrent = stepNum === currentLevel;

          return (
            <div key={idx} className="relative">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-500 shadow-md'
                    : isCurrent
                    ? 'bg-cyan-400 glow-secondary animate-pulse'
                    : 'bg-slate-800'
                }`}
              />
              {isCurrent && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-[9px] bg-cyan-900 text-cyan-300 px-1 py-0.2 rounded border border-cyan-700 font-bold uppercase tracking-wide">
                  Active
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
