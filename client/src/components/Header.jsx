import React from 'react';
import { 
  Bot, 
  Sparkles, 
  RotateCcw, 
  Activity,
  ShieldCheck,
  Lock,
  FileText,
  LogOut,
  User
} from 'lucide-react';

export default function Header({ 
  onRecoverAll, 
  onReset, 
  isRecovering, 
  stats,
  onOpenAuditLog,
  onOpenProfile,
  user,
  onLogout
}) {
  const pendingCount = stats?.failedCount || 0;
  const isViewer = user?.role === 'Viewer';

  return (
    <header className="border-b border-sand-300/60 bg-creme-50/80 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-burgundy-700 via-burgundy-600 to-dustypink-400 p-[1.5px] shadow-md shadow-burgundy-900/15 transition-transform hover:scale-105 duration-300">
              <div className="w-full h-full bg-creme-50 rounded-[14px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-burgundy-700" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-2xl font-serif-luxury font-bold tracking-tight text-burgundy-950 flex items-center gap-2">
                  Recover
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-dustypink-100 text-burgundy-700 border border-dustypink-300 font-sans font-semibold tracking-normal">
                    AI Agent
                  </span>
                </h1>
              </div>

              <p className="text-xs text-sand-700 flex items-center gap-2 mt-0.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-burgundy-600 animate-ping"></span>
                Autonomous Revenue Recovery & Involuntary Churn Engine
              </p>
            </div>
          </div>

          {/* User Profile & Action Controls */}
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
            
            {/* Logged in User Profile & Performance Trigger Button */}
            {user && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-sand-300/80 hover:border-burgundy-400 shadow-2xs hover:shadow transition-all group active:scale-95 text-left cursor-pointer"
                title="View Operator Profile & Shift Performance Metrics"
              >
                <div className="w-6 h-6 rounded-lg bg-burgundy-100 text-burgundy-800 group-hover:bg-burgundy-800 group-hover:text-creme-50 flex items-center justify-center font-bold text-[11px] transition-colors">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="text-left">
                  <span className="block text-[11px] font-bold text-burgundy-950 group-hover:text-burgundy-800 transition-colors leading-tight">
                    {user.name || user.username}
                  </span>
                  <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                    user.role === 'Admin' ? 'bg-burgundy-100 text-burgundy-900' :
                    user.role === 'Ops' ? 'bg-dustypink-100 text-dustypink-900' :
                    'bg-sand-200 text-sand-800'
                  }`}>
                    {user.role} Role
                  </span>
                </div>
              </button>
            )}

            {/* Performance View Trigger Button */}
            <button
              onClick={onOpenProfile}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-xl text-burgundy-900 bg-sand-100 hover:bg-sand-200 border border-sand-300/80 transition-all duration-200 shadow-2xs hover:shadow active:scale-95"
              title="View your recovery impact, success rate & stats"
            >
              <User className="w-3.5 h-3.5 mr-1.5 text-burgundy-700" />
              Performance
            </button>

            {/* Audit Log Trigger Button */}
            <button
              onClick={onOpenAuditLog}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-xl text-burgundy-900 bg-sand-100 hover:bg-sand-200 border border-sand-300/80 transition-all duration-200 shadow-2xs hover:shadow active:scale-95"
              title="View tamper-evident decision audit trail"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5 text-burgundy-700" />
              Audit Log
            </button>

            {/* Reset Demo Button (Admin/Ops) */}
            <button
              onClick={onReset}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-xl text-sand-800 bg-sand-100 hover:bg-sand-200 border border-sand-300/80 transition-all duration-200 shadow-2xs hover:shadow active:scale-95"
              title="Reset dataset to initial 30 seed records"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-sand-700" />
              Reset Demo
            </button>

            {/* Run AI Recovery Agent Button */}
            <button
              onClick={onRecoverAll}
              disabled={isRecovering || pendingCount === 0 || isViewer}
              className={`inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl shadow-md transition-all duration-300 active:scale-95 ${
                pendingCount === 0 || isViewer
                  ? 'bg-sand-200 text-sand-500 cursor-not-allowed border border-sand-300'
                  : 'bg-gradient-to-r from-burgundy-800 via-burgundy-700 to-burgundy-600 hover:from-burgundy-900 hover:to-burgundy-700 text-creme-50 shadow-burgundy-900/20 hover:shadow-lg hover:shadow-burgundy-800/30 ring-1 ring-dustypink-300/30'
              }`}
              title={isViewer ? 'Viewer role is read-only' : 'Autonomously process all pending failed payments'}
            >
              {isRecovering ? (
                <>
                  <Activity className="w-3.5 h-3.5 mr-2 animate-spin text-dustypink-200" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-dustypink-300" />
                  Run AI Agent
                  {pendingCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.2 text-[10px] bg-dustypink-200 text-burgundy-900 rounded-full font-mono font-bold">
                      {pendingCount}
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-sand-700 hover:text-burgundy-950 hover:bg-sand-200/80 border border-sand-300/70 transition-colors"
                title="Logout session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
