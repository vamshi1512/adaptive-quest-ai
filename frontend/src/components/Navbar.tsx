import React, { useState } from 'react';
import { Compass, BarChart2, BookOpen, MessageSquare, Menu, X, Zap } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  resetGame?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setView,
  resetGame
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'topic-selection', label: 'Quest Topics', icon: <Compass className="w-4 h-4" /> },
    { id: 'dashboard', label: 'KPI Dashboard', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'methodology', label: 'Methodology', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'playtest-feedback', label: 'Playtest Feedback', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const handleNavClick = (viewId: string) => {
    if (viewId === 'topic-selection' && resetGame) {
      resetGame();
    }
    setView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-bg-dark/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => handleNavClick('landing')}
          >
            <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl group-hover:glow-primary transition-all duration-300">
              <Zap className="w-5 h-5 text-slate-100 fill-slate-100" />
            </div>
            <span className="text-lg font-black tracking-wider text-slate-100 uppercase bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent group-hover:to-rose-400 transition-all duration-300">
              Adaptive Quest AI
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === 'topic-selection' && currentView === 'game-play');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all-custom ${
                    isActive
                      ? 'bg-violet-600/10 text-violet-400 border border-violet-500/25 shadow-[0_0_15px_-3px_rgba(139,92,246,0.1)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-x-0 border-t border-b border-slate-800 py-3 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id || (item.id === 'topic-selection' && currentView === 'game-play');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-violet-600/15 text-violet-400 border border-violet-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
