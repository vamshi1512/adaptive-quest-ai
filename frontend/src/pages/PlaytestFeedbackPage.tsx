import React, { useState } from 'react';
import { api } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Star, Send, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface PlaytestFeedbackPageProps {
  latestSession?: {
    sessionId: string;
    topic: string;
  } | null;
  setView: (view: string) => void;
  setError: (err: string) => void;
}

export const PlaytestFeedbackPage: React.FC<PlaytestFeedbackPageProps> = ({
  latestSession,
  setView,
  setError
}) => {
  const [username] = useLocalStorage<string>('playtester_username', 'Anonymous Playtester');
  
  const [topic, setTopic] = useState(latestSession?.topic || 'Cybersecurity basics');
  const [wasFun, setWasFun] = useState<number>(5);
  const [wasUseful, setWasUseful] = useState<number>(5);
  const [difficultyFit, setDifficultyFit] = useState<string>('Perfect');
  const [wouldReplay, setWouldReplay] = useState<boolean>(true);
  const [comments, setComments] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.submitFeedback({
        session_id: latestSession?.sessionId || undefined,
        username: username,
        topic: topic,
        was_fun: wasFun,
        was_useful: wasUseful,
        difficulty_fit: difficultyFit,
        would_replay: wouldReplay,
        comments: comments.trim() || undefined
      });
      setSuccess(true);
      setTimeout(() => {
        setView('dashboard');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError('Failed to submit feedback. Check backend connections.');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            className="focus:outline-none transition-transform duration-150 hover:scale-110 cursor-pointer"
          >
            <Star
              className={`w-8 h-8 ${
                star <= value
                  ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_5px_rgba(245,158,11,0.4)]'
                  : 'text-slate-700'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
      <div className="text-center mb-8">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-violet-950/40 border border-violet-800/40 rounded-full text-violet-400 font-semibold text-xs uppercase tracking-wider mb-4">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Evaluation Survey</span>
        </span>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight uppercase">
          Playtest Feedback
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Your input is valuable! Help us refine the adaptive difficulty algorithms and narrative learning mechanics.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
        {success ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
              <Star className="w-8 h-8 fill-emerald-400" />
            </div>
            <h3 className="text-xl font-extrabold text-emerald-400">Feedback Transmitted!</h3>
            <p className="text-sm text-slate-400">
              Your feedback was saved. Redirecting to the KPI Dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Meta Fields display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Playtester Profile
                </label>
                <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-400 font-semibold">
                  {username}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Quest Evaluated
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 font-medium"
                />
              </div>
            </div>

            <hr className="border-slate-800/80" />

            {/* Fun Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Was the game gameplay engaging / fun?
              </label>
              <StarRating value={wasFun} onChange={setWasFun} />
              <span className="text-[10px] text-slate-500 font-bold block mt-1">
                {['Dull', 'Boring', 'Average', 'Engaging', 'Extremely Fun!'][wasFun - 1]}
              </span>
            </div>

            {/* Usefulness Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Was the content pedagogically useful / educational?
              </label>
              <StarRating value={wasUseful} onChange={setWasUseful} />
              <span className="text-[10px] text-slate-500 font-bold block mt-1">
                {['Useless', 'Poor Value', 'Marginal', 'Highly Educational', 'Perfect Mastery Resource!'][wasUseful - 1]}
              </span>
            </div>

            {/* Difficulty appropriateness */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                How was the adaptive difficulty scaling?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Too Easy', 'Perfect', 'Too Hard'].map((level) => {
                  const isActive = difficultyFit === level;
                  return (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setDifficultyFit(level)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-violet-600/10 border-violet-500 text-violet-400'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Replayability */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Would you replay this quest or try a new topic?
              </label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setWouldReplay(true)}
                  className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    wouldReplay
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Yes, absolutely</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setWouldReplay(false)}
                  className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    !wouldReplay
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-400 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>No, probably not</span>
                </button>
              </div>
            </div>

            {/* Comments text area */}
            <div>
              <label htmlFor="comments" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                General Feedback / Suggestions
              </label>
              <textarea
                id="comments"
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share your thoughts on questions clarity, narrative feel, or specific bugs..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center space-x-2 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:glow-primary text-slate-100 font-bold rounded-xl text-xs uppercase tracking-wider transition-all-custom cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Transmitting...' : 'Submit Feedback'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
