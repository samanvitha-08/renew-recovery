import React from 'react';
import { 
  Bot, 
  Sparkles, 
  RotateCcw, 
  Activity, 
  ShieldCheck, 
  FileText, 
  LogOut, 
  User, 
  TrendingUp, 
  Layers, 
  ChevronRight,
  Shield,
  Zap,
  BarChart3,
  X
} from 'lucide-react';

export default function Sidebar({
  user,
  stats,
  isRecovering,
  onRecoverAll,
  onReset,
  onOpenAuditLog,
  onOpenProfile,
  onLogout,
  isOpen = false,
  onClose
}) {
  const pendingCount = stats?.failedCount || 0;
  const isViewer = user?.role === 'Viewer';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-burgundy-950/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-creme-50 via-creme-100/95 to-sand-100/90 
        border-r border-sand-300/80 shadow-soft-xl flex flex-col justify-between transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-30 lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Top Section: Brand & User Profile */}
        <div className="p-5 space-y-5">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-burgundy-800 via-burgundy-700 to-dustypink-400 p-[1.5px] shadow-md shadow-burgundy-900/15">
                <div className="w-full h-full bg-creme-50 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-burgundy-700" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-serif-luxury font-bold tracking-tight text-burgundy-950">
                    Recover
                  </h1>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-dustypink-100 text-burgundy-700 border border-dustypink-300 font-sans font-bold">
                    AI Agent
                  </span>
                </div>
                <p className="text-[10px] text-sand-600 font-medium">Revenue Recovery Ops</p>
              </div>
            </div>

            {/* Mobile close button */}
            {onClose && (
              <button 
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-xl text-sand-500 hover:text-burgundy-950 hover:bg-sand-200/70"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User Profile Card / Performance trigger */}
          {user && (
            <button
              onClick={() => {
                onOpenProfile();
                if (onClose) onClose();
              }}
              className="w-full text-left p-3 rounded-2xl bg-white/90 hover:bg-white border border-sand-300/90 hover:border-burgundy-400 shadow-2xs hover:shadow transition-all group active:scale-[0.98]"
              title="Click to view your shift performance & impact stats"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-burgundy-800 to-burgundy-700 text-creme-50 flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-burgundy-950 group-hover:text-burgundy-800 truncate block">
                      {user.name || user.username}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-sand-400 group-hover:text-burgundy-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                      user.role === 'Admin' ? 'bg-burgundy-100 text-burgundy-900' :
                      user.role === 'Ops' ? 'bg-dustypink-100 text-dustypink-900' :
                      'bg-sand-200 text-sand-800'
                    }`}>
                      {user.role} Role
                    </span>
                    <span className="text-[10px] text-sand-500 font-mono truncate">
                      • View Profile
                    </span>
                  </div>
                </div>
              </div>
            </button>
          )}

          {/* Navigation Section */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-sand-600 px-2 py-1">
              Navigation & Views
            </div>

            {/* Recovery Dashboard (Main Table) */}
            <button
              onClick={() => {
                if (onClose) onClose();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-burgundy-950 bg-sand-200/80 border border-sand-300/80 shadow-2xs transition-all"
            >
              <div className="flex items-center space-x-2.5">
                <Layers className="w-4 h-4 text-burgundy-700" />
                <span>Recovery Dashboard</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sand-100 text-burgundy-950 font-mono font-bold">
                {stats?.totalCount || 30}
              </span>
            </button>

            {/* Performance View */}
            <button
              onClick={() => {
                onOpenProfile();
                if (onClose) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-sand-800 hover:text-burgundy-950 hover:bg-sand-200/60 transition-all text-left"
            >
              <div className="flex items-center space-x-2.5">
                <BarChart3 className="w-4 h-4 text-burgundy-700" />
                <span>Operator Performance</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-dustypink-100 text-burgundy-800 font-mono font-bold">
                Live
              </span>
            </button>

            {/* Security Audit Log */}
            <button
              onClick={() => {
                onOpenAuditLog();
                if (onClose) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-sand-800 hover:text-burgundy-950 hover:bg-sand-200/60 transition-all text-left"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-burgundy-700" />
                <span>Security Audit Log</span>
              </div>
              <ShieldCheck className="w-3.5 h-3.5 text-sand-500" />
            </button>
          </div>

          {/* Recovery Actions Section */}
          <div className="space-y-2 pt-2 border-t border-sand-200/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-sand-600 px-2">
              Autonomous Actions
            </div>

            {/* Run AI Recovery Agent Button */}
            <button
              onClick={() => {
                onRecoverAll();
                if (onClose) onClose();
              }}
              disabled={isRecovering || pendingCount === 0 || isViewer}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.98] ${
                pendingCount === 0 || isViewer
                  ? 'bg-sand-200 text-sand-500 cursor-not-allowed border border-sand-300'
                  : 'bg-gradient-to-r from-burgundy-800 via-burgundy-700 to-burgundy-600 hover:from-burgundy-900 hover:to-burgundy-700 text-creme-50 shadow-burgundy-900/20 hover:shadow-lg'
              }`}
              title={isViewer ? 'Viewer role is read-only' : 'Autonomously process all pending failed payments'}
            >
              <div className="flex items-center space-x-2">
                {isRecovering ? (
                  <Activity className="w-4 h-4 animate-spin text-dustypink-200" />
                ) : (
                  <Sparkles className="w-4 h-4 text-dustypink-300" />
                )}
                <span>{isRecovering ? 'Processing AI...' : 'Run AI Agent'}</span>
              </div>
              {pendingCount > 0 && !isRecovering && (
                <span className="px-1.5 py-0.2 text-[10px] bg-dustypink-200 text-burgundy-900 rounded-full font-mono font-bold">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={() => {
                onReset();
                if (onClose) onClose();
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-xl text-sand-800 hover:text-burgundy-950 hover:bg-sand-200/70 border border-sand-300/80 transition-all text-left"
              title="Reset dataset to initial 30 seed records"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sand-600" />
              <span>Reset Demo Queue</span>
            </button>
          </div>

        </div>

        {/* Bottom Section: System Status & Logout */}
        <div className="p-5 border-t border-sand-200/80 space-y-3 bg-creme-50/50">
          
          {/* Active Operator Status */}
          <div className="flex items-center justify-between text-[11px] text-sand-600 px-1 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Autonomous Engine Active</span>
            </div>
            <span className="font-mono text-[10px]">v2.4</span>
          </div>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-sand-700 hover:text-burgundy-950 hover:bg-sand-200/80 border border-sand-300/70 transition-all active:scale-[0.98]"
              title="Sign out of operator portal"
            >
              <LogOut className="w-3.5 h-3.5 text-sand-600" />
              <span>Sign Out</span>
            </button>
          )}

        </div>

      </aside>
    </>
  );
}
