import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Menu,
  Sun,
  Moon,
  Clock,
  Activity,
  Zap,
  Shield,
  Sparkles
} from 'lucide-react';

export default function Header({ 
  onToggleMobileSidebar,
  theme = 'light',
  onToggleTheme
}) {
  // Live Shift Hours Timer (Simulates a standard shift started 4 hours 15 min ago, ticking in real time)
  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    // 4 hours, 18 minutes baseline shift
    return 4 * 3600 + 18 * 60;
  });

  // Current UTC Settlement Clock
  const [utcTime, setUtcTime] = useState(() => new Date().toUTCString().slice(17, 25));

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      setUtcTime(new Date().toUTCString().slice(17, 25));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  const formattedHours = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;

  return (
    <header className="border-b border-sand-300/60 dark:border-burgundy-900/60 bg-creme-50/80 dark:bg-burgundy-950/80 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left Side: Mobile Menu Button & Brand Indicator */}
          <div className="flex items-center space-x-3.5">
            {onToggleMobileSidebar && (
              <button
                onClick={onToggleMobileSidebar}
                className="lg:hidden p-2 rounded-xl text-sand-700 dark:text-sand-300 hover:text-burgundy-950 dark:hover:text-creme-50 hover:bg-sand-200/80 dark:hover:bg-burgundy-900/60 border border-sand-300/70 dark:border-burgundy-800 transition-colors"
                title="Toggle sidebar menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-burgundy-700 via-burgundy-600 to-dustypink-400 p-[1px] shadow-sm shadow-burgundy-900/10">
                <div className="w-full h-full bg-creme-50 dark:bg-burgundy-900 rounded-[11px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-burgundy-700 dark:text-dustypink-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif-luxury font-bold text-base text-burgundy-950 dark:text-creme-50 tracking-tight">
                    Recover
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-dustypink-100 dark:bg-burgundy-900/90 text-burgundy-700 dark:text-dustypink-300 border border-dustypink-300 dark:border-burgundy-700 font-sans font-bold">
                    Ops Desk
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-sand-600 dark:text-sand-400 font-medium leading-none mt-0.5">
                  Autonomous Involuntary Churn Recovery
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Useful Ops Tools (Hours Worked, Gateway Status, Theme Toggle) */}
          <div className="flex items-center space-x-2.5">
            
            {/* Hours Worked / Shift Duration Timer */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-burgundy-900/70 border border-sand-300/80 dark:border-burgundy-800 shadow-2xs text-xs"
              title="Current Active Shift Duration (Clocked in at 08:00 AM)"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <Clock className="w-3.5 h-3.5 text-burgundy-700 dark:text-dustypink-300" />
              </div>
              <div className="text-left">
                <span className="hidden sm:inline-block text-[9px] uppercase tracking-wider text-sand-600 dark:text-sand-400 font-bold block leading-none">
                  Hours Worked
                </span>
                <span className="font-mono font-bold text-burgundy-950 dark:text-creme-50 text-[11px] leading-tight">
                  {formattedHours}
                </span>
              </div>
            </div>

            {/* Gateway Telemetry & UTC Settlement Clock (Hidden on very small screens) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sand-100/80 dark:bg-burgundy-900/50 border border-sand-300/70 dark:border-burgundy-800/80 text-[11px] font-mono text-sand-700 dark:text-sand-300">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>12ms</span>
              </span>
              <span className="text-sand-400">•</span>
              <span>{utcTime} UTC</span>
            </div>

            {/* Light / Dark Theme Switcher Button */}
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-burgundy-900/80 hover:bg-sand-100 dark:hover:bg-burgundy-800 border border-sand-300/80 dark:border-burgundy-700 text-burgundy-950 dark:text-creme-50 shadow-2xs hover:shadow transition-all active:scale-95 text-xs font-semibold"
              title={`Switch to ${theme === 'light' ? 'Dark Mode' : 'Light Mode'}`}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-burgundy-700" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-dustypink-300" />
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
