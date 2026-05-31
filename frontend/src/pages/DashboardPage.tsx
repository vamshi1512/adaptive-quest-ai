import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { KPISummary } from '../types';
import { MetricCard } from '../components/MetricCard';
import { formatDuration } from '../utils/formatters';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { BarChart2, CheckCircle2, Clock, RotateCcw, Target, Sparkles, AlertOctagon, RefreshCw } from 'lucide-react';

interface DashboardPageProps {
  setError: (err: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setError }) => {
  const [data, setData] = useState<KPISummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const summary = await api.getAnalyticsSummary();
      setData(summary);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch dashboard data. Ensure backend API is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 font-semibold text-sm">Compiling and auditing system KPIs...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center">
        <p className="text-slate-400">Failed to render KPI analytics.</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-slate-100 font-bold rounded-xl text-xs uppercase"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Color constants for charts
  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#a78bfa'];


  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight uppercase">
            KPI Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry measuring playtest completion, session lengths, replayability, accuracy, and difficulty curves.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 mb-8">
        <MetricCard
          title="Total Sessions"
          value={data.total_sessions}
          subtext="Starts tracked"
          icon={<BarChart2 className="w-5 h-5" />}
        />
        <MetricCard
          title="Completion Rate"
          value={`${data.completion_rate}%`}
          subtext="Sessions finished"
          icon={<CheckCircle2 className="w-5 h-5" />}
          trend={{ value: 'Target: 70%+', isPositive: data.completion_rate >= 70 }}
        />
        <MetricCard
          title="Avg Accuracy"
          value={`${data.average_accuracy}%`}
          subtext="Correct responses"
          icon={<Target className="w-5 h-5" />}
        />
        <MetricCard
          title="Replay Count"
          value={data.replay_count}
          subtext="Repeat plays"
          icon={<RotateCcw className="w-5 h-5" />}
        />
        <MetricCard
          title="Avg Session length"
          value={formatDuration(data.average_session_length_seconds)}
          subtext="Active play"
          icon={<Clock className="w-5 h-5" />}
        />
        <MetricCard
          title="CSAT (Fun / Use)"
          value={`${data.feedback_ratings.fun} / ${data.feedback_ratings.useful}`}
          subtext="Rating (out of 5)"
          icon={<Sparkles className="w-5 h-5" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Difficulty Progression Curve */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4">
            Aggregated Difficulty progression (Telemetry Curve)
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.difficulty_progression} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b2640" />
                <XAxis dataKey="level" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" domain={[1, 5]} tickCount={5} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131c2e',
                    border: '1px solid #2b395c',
                    borderRadius: '12px',
                    color: '#f1f5f9'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="difficulty"
                  name="Avg Difficulty"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Distribution Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4">
            Quest Enrolments by Topic
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topic_distribution} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b2640" />
                <XAxis dataKey="topic" stroke="#94a3b8" fontSize={10} interval={0} tickFormatter={(t) => t.split(' ')[0]} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131c2e',
                    border: '1px solid #2b395c',
                    borderRadius: '12px',
                    color: '#f1f5f9'
                  }}
                />
                <Bar dataKey="count" name="Sessions Started" fill="#06b6d4" radius={[4, 4, 0, 0]}>
                  {data.topic_distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weak Areas and History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weak Area breakdown table */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
              <AlertOctagon className="w-4 h-4 text-rose-500 mr-2" />
              <span>Failed Sub-Topic Vectors</span>
            </h3>
            
            {data.weak_areas_summary.length > 0 ? (
              <div className="space-y-3">
                {data.weak_areas_summary.slice(0, 5).map((w, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                    <span className="text-xs font-semibold text-slate-300">{w.sub_topic}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-950/20 border border-rose-500/20 text-rose-400">
                      {w.count_failed} Errors
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center italic">
                No recorded errors yet. Systems operating at 100% compliance.
              </p>
            )}
          </div>
          
          <div className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-800/70 pt-4 mt-6">
            Tracks specific question details which playtesters failed. High counts indicate conceptual deficits needing curricular updates.
          </div>
        </div>

        {/* Recent Session log table */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-2 overflow-x-auto">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4">
            Audited Session History logs
          </h3>
          
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-bold">
                <th className="py-3 px-2">Playtester</th>
                <th className="py-3 px-2">Topic Chosen</th>
                <th className="py-3 px-2 text-center">Score</th>
                <th className="py-3 px-2 text-center">Accuracy</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-2 text-right">Start Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {data.session_history.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-2 font-semibold text-slate-200">{s.username}</td>
                  <td className="py-2.5 px-2">{s.topic}</td>
                  <td className="py-2.5 px-2 text-center font-bold text-amber-400">{s.score}</td>
                  <td className="py-2.5 px-2 text-center">{s.accuracy}</td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                      s.status === 'Completed'
                        ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-500/10'
                        : 'text-violet-400 bg-violet-950/20 border border-violet-500/10'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-500">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
