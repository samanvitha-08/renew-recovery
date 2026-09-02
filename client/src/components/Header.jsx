import React from 'react';
import { 
  Bot, 
  Sparkles, 
  RotateCcw, 
  Play, 
  ShieldCheck, 
  Activity,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';

export default function Header({ 
  onRecoverAll, 
  onReset, 
  isRecovering, 
  stats 
}) {
  const pendingCount = stats?.failedCount || 0;

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 p-[1.5px] shadow-lg shadow-brand-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-brand-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  Recover
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono font-medium">
                    AI Agent v1.0
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Autonomous Revenue Recovery & Involuntary Churn Engine
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onReset}
              className="inline-flex items-center px-3.5 py-2 text-xs font-medium rounded-lg text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              title="Reset dataset to initial 30 seed records"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Reset Demo
            </button>

            <button
              onClick={onRecoverAll}
              disabled={isRecovering || pendingCount === 0}
              className={`inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg shadow-md transition-all ${
                pendingCount === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white shadow-emerald-950/40 ring-1 ring-emerald-400/30'
              }`}
            >
              {isRecovering ? (
                <>
                  <Activity className="w-3.5 h-3.5 mr-2 animate-spin text-white" />
                  Processing Recovery...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-200" />
                  Run AI Recovery Agent
                  {pendingCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-white/20 rounded-full font-mono">
                      {pendingCount} Pending
                    </span>
                  )}
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
