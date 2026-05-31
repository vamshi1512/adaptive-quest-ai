import React from 'react';
import { BookOpen, Activity, Cpu, BarChart2 } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-violet-950/40 border border-violet-800/40 rounded-full text-violet-400 font-semibold text-xs uppercase tracking-wider mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Scientific Foundation</span>
        </span>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight uppercase">
          Learning Methodology & Architecture
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Discover the educational theory, mathematical design, and AI orchestration structures underpinning Adaptive Quest AI.
        </p>
      </div>

      <div className="space-y-10">
        {/* Section 1: Game-Based Learning */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/20 mb-4">
              <BookOpen className="w-6 h-6 animate-float" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Game-Based Learning</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Educational Psychology</p>
          </div>
          
          <div className="md:col-span-2 space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              Traditional compliance training uses flat, linear slides and multiple-choice tests that cause high dropoff and poor recall. <strong>Game-Based Learning (GBL)</strong> wraps educational questions inside structured narrative quests, motivating the learner through intrinsic storytelling mechanics.
            </p>
            <p>
              By aligning levels to narrative states (e.g. <em>Detecting the breach</em>, <em>Deploying countermeasures</em>), learners apply abstract concepts to high-stakes simulated scenarios. This cognitive context improves long-term recall and retention by mimicking actual operational challenges.
            </p>
          </div>
        </div>

        {/* Section 2: Adaptive Difficulty scaling */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/20 mb-4">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Adaptive Scaling (Flow Theory)</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Zone of Proximal Development</p>
          </div>
          
          <div className="md:col-span-2 space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              Our adaptive engine is modeled on Csikszentmihalyi's <strong>Flow Theory</strong>. If a training quiz is too easy, the user experiences boredom; if it is too hard, they experience frustration and quit. 
            </p>
            <p>
              To keep the learner in the "Flow Channel", the engine scales difficulty (Levels 1 to 5) based on real-time feedback:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
              <li><strong>Success Rules:</strong> Answering 2 consecutive questions correctly increases difficulty level by 1 (max 5), reset streak.</li>
              <li><strong>Failure Rules:</strong> Answering incorrectly immediately drops difficulty by 1 (min 1) and resets streak.</li>
              <li><strong>Stasis limits:</strong> The player begins with 3 Lives. Losing all lives ends the quest, suggesting immediate review.</li>
            </ul>
          </div>
        </div>

        {/* Section 3: AI Abstraction */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/20 mb-4">
              <Cpu className="w-6 h-6 animate-float" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">AI-Native Content Pipeline</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">LLM Provider Abstraction</p>
          </div>
          
          <div className="md:col-span-2 space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              Adaptive Quest AI is built with an <strong>AI-native provider design</strong>. In this prototype, we use a deterministic mock provider loaded with high-quality default content, and procedural fallbacks for custom topics.
            </p>
            <p>
              To transition to production, the `ai_service.py` can be easily configured to hit LLMs (GPT-4o or Gemini 1.5 Pro) with structured JSON schemas. This allows corporations to feed in custom knowledge documents and instantly generate infinite, tailored quest levels, dynamic feedback, and coaching coach-summaries.
            </p>
          </div>
        </div>

        {/* Section 4: KPI framework */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20 mb-4">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">KPI Telemetry Framework</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Business Impact Analytics</p>
          </div>
          
          <div className="md:col-span-2 space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              Why track telemetry? In corporate learning, design metrics determine training ROI. This project tracks five behavioral KPI vectors:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-2">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="font-bold text-violet-400 block mb-1">Completion Rate</span>
                Measures engagement quality. High completion indicates high narrative and challenge alignment.
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="font-bold text-cyan-400 block mb-1">Replay Count</span>
                Measures long-term recall interest. Demonstrates game replayability and voluntary reinforcement.
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">Accuracy / Weak Areas</span>
                Flags conceptual gaps (e.g. failing phishing attempts) to direct offline manager coaching.
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">Difficulty logs</span>
                Visualizes difficulty progression to confirm the adaptive scaling works as designed.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
