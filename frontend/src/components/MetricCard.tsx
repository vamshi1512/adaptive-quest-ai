import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon,
  trend
}) => {
  return (
    <div className="glass-panel glass-panel-hover p-6 rounded-2xl transition-all-custom flex flex-col justify-between h-36">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            {value}
          </h3>
        </div>
        <div className="p-3 bg-slate-800/60 rounded-xl text-violet-400 border border-slate-700/50">
          {icon}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2">
        {subtext && (
          <span className="text-xs text-slate-500 font-medium">
            {subtext}
          </span>
        )}
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              trend.isPositive
                ? 'text-emerald-400 bg-emerald-950/30 border-emerald-500/20'
                : 'text-rose-400 bg-rose-950/30 border-rose-500/20'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
