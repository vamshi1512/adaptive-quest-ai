import React from 'react';
import { Play, BarChart2, Shield, BrainCircuit, Activity, Award } from 'lucide-react';

interface LandingPageProps {
  setView: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setView }) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mt-8">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-violet-950/40 border border-violet-800/40 rounded-full text-violet-400 font-semibold text-xs uppercase tracking-wider mb-6">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Interactive Game-Based Learning Engine</span>
        </span>
        
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none text-slate-100 mb-6 uppercase">
          Empower Learning Through{' '}
          <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Adaptive Play
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          Adaptive Quest AI combines storytelling, game mechanics, and dynamic difficulty scaling to create highly engaging, personalized corporate training experiences.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => setView('topic-selection')}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-slate-100 rounded-2xl font-bold hover:glow-primary hover:-translate-y-0.5 transition-all-custom shadow-lg cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-100" />
            <span>Launch Game Prototype</span>
          </button>
          
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-2xl font-bold hover:-translate-y-0.5 transition-all-custom cursor-pointer"
          >
            <BarChart2 className="w-5 h-5" />
            <span>View KPI Dashboard</span>
          </button>
        </div>
      </div>

      {/* Feature Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 relative z-10 w-full">
        {/* Feature 1 */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/20 mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-100 mb-2">Adaptive Difficulty Scaling</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            The game monitors performance in real time. Answering correctly increases the challenge, while making mistakes simplifies subsequent questions to keep learners in the flow state.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/20 mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-100 mb-2">Story-Driven Corporate Topics</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            Play through realistic narratives covering Cybersecurity, AI Ethics, Data Privacy, and Communication rather than boring, generic quiz templates.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/20 mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-100 mb-2">Detailed KPI Analytics</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            Measure training efficacy instantly with charts showing completion rate, average accuracy, difficulty logs, session length, and playtest satisfaction.
          </p>
        </div>
      </div>

      {/* Footer / Portfolio Note */}
      <div className="text-center mt-12 border-t border-slate-800/80 pt-6">
        <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
          Prepared for AI Games Internship Portfolio Selection
        </p>
      </div>
    </div>
  );
};
