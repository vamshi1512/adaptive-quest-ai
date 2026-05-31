import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { api } from '../services/api';
import type { SessionStartResponse } from '../types';
import { Shield, MessageSquare, Lock, Users, Sparkles, Send } from 'lucide-react';

interface TopicSelectionPageProps {
  onSessionStart: (session: SessionStartResponse) => void;
  setError: (err: string) => void;
}

export const TopicSelectionPage: React.FC<TopicSelectionPageProps> = ({
  onSessionStart,
  setError
}) => {
  const [username, setUsername] = useLocalStorage<string>('playtester_username', '');
  const [customTopic, setCustomTopic] = useState('');
  const [loading, setLoading] = useState(false);

  const defaultTopics = [
    {
      id: 'cyber',
      title: 'Cybersecurity basics',
      description: 'Navigate phishing attempts, secure password practices, multi-factor authentication, and safe network connections.',
      icon: <Shield className="w-6 h-6 text-violet-400" />,
      tag: 'Security & Compliance'
    },
    {
      id: 'ai_ethics',
      title: 'AI ethics',
      description: 'Explore bias, fairness, neural transparency, hallucinations, data privacy leakages, and global AI regulations.',
      icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
      tag: 'Emerging Tech'
    },
    {
      id: 'comms',
      title: 'Workplace communication',
      description: 'Learn constructive feedback delivery (SBI model), active listening, remote team alignment, and conflict resolution.',
      icon: <MessageSquare className="w-6 h-6 text-emerald-400" />,
      tag: 'Soft Skills'
    },
    {
      id: 'privacy',
      title: 'Data privacy',
      description: 'GDPR requirements, Personally Identifiable Information (PII) auditing, data minimization, and breach response.',
      icon: <Lock className="w-6 h-6 text-amber-400" />,
      tag: 'Compliance'
    },
    {
      id: 'collab',
      title: 'Team collaboration',
      description: "Master Tuckman's stages of development, RACI matrices, alignment guidelines, and avoiding groupthink.",
      icon: <Users className="w-6 h-6 text-rose-400" />,
      tag: 'Leadership'
    }
  ];

  const handleStartQuest = async (topicTitle: string) => {
    // Validate inputs
    const player_name = username.trim() || 'Anonymous Playtester';
    if (!username.trim()) {
      setUsername(player_name);
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.startSession({
        username: player_name,
        topic: topicTitle
      });
      onSessionStart(response);
    } catch (err: any) {
      console.error(err);
      setError('Could not start game session. Ensure the backend API is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight uppercase">
          Enter the Sandbox & Select a Quest
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Set your username to track your progress on the dashboard, then select one of our pre-built corporate training scenarios or type a custom topic.
        </p>
      </div>

      {/* Username Setup card */}
      <div className="glass-panel p-6 rounded-2xl max-w-xl mx-auto mb-10 border border-slate-700/40">
        <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Playtester Identity (Stored locally)
        </label>
        <div className="flex gap-3">
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter name or ID (e.g. jdoe_dev)"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* Standard Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {defaultTopics.map((t) => (
          <div
            key={t.id}
            onClick={() => !loading && handleStartQuest(t.title)}
            className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer transition-all-custom flex flex-col justify-between hover:glow-primary border border-slate-800"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/30">
                  {t.tag}
                </span>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  {t.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">{t.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{t.description}</p>
            </div>
            
            <button
              disabled={loading}
              className="w-full text-center py-2.5 bg-slate-900 hover:bg-violet-600 border border-slate-700/60 hover:border-violet-500 text-slate-200 hover:text-slate-100 font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-300 mt-2"
            >
              Start Quest
            </button>
          </div>
        ))}

        {/* Custom Topic Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-slate-800">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-violet-950/20 text-violet-400 border border-violet-800/20">
                Procedural AI
              </span>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <Send className="w-6 h-6 text-violet-400 animate-pulse" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Custom Topic Quest</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Type any topic (e.g. "React Hooks", "Sales pitching", "Git branching"). The backend will generate questions dynamically using procedural templates!
            </p>
          </div>

          <div>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g. Sales negotiations"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder-slate-500 mb-2.5 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
            />
            <button
              onClick={() => customTopic.trim() && !loading && handleStartQuest(customTopic)}
              disabled={!customTopic.trim() || loading}
              className="w-full text-center py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 disabled:from-slate-800 disabled:to-slate-800 border border-transparent disabled:border-slate-800 text-slate-100 disabled:text-slate-500 font-bold rounded-xl text-xs uppercase tracking-wider hover:glow-primary transition-all duration-300"
            >
              Generate Custom Quest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
