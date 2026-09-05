import React from 'react';
import { 
  Bot, 
  Mail, 
  Clock, 
  Zap, 
  ShieldAlert, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function AgentRulesBanner() {
  const rules = [
    {
      cause: 'Expired Card',
      action: 'Send Email',
      desc: 'Dispatches 1-click update link with customer loyalty grace period',
      icon: Mail,
      accent: 'border-dustypink-300/80 dark:border-burgundy-800 text-burgundy-900 dark:text-dustypink-200 bg-gradient-to-br from-creme-50 to-dustypink-50/50 dark:from-burgundy-900/60 dark:to-burgundy-950/60 hover:border-dustypink-400 dark:hover:border-burgundy-700',
      iconBg: 'bg-dustypink-100 dark:bg-burgundy-800 text-burgundy-700 dark:text-dustypink-300'
    },
    {
      cause: 'Insufficient Funds',
      action: 'Retry in 3 Days',
      desc: 'Defers retry to align with payroll cycle to prevent churn',
      icon: Clock,
      accent: 'border-sand-300/80 dark:border-burgundy-800 text-burgundy-900 dark:text-sand-200 bg-gradient-to-br from-creme-50 to-sand-100/50 dark:from-burgundy-900/60 dark:to-burgundy-950/60 hover:border-sand-400 dark:hover:border-burgundy-700',
      iconBg: 'bg-sand-200 dark:bg-burgundy-800 text-sand-800 dark:text-sand-300'
    },
    {
      cause: 'Bank Decline',
      action: 'Retry Now',
      desc: 'Executes instant network re-attempt with optimized gateway routing',
      icon: Zap,
      accent: 'border-burgundy-200 dark:border-burgundy-800 text-burgundy-900 dark:text-creme-100 bg-gradient-to-br from-creme-50 to-burgundy-50/40 dark:from-burgundy-900/60 dark:to-burgundy-950/60 hover:border-burgundy-300 dark:hover:border-burgundy-700',
      iconBg: 'bg-burgundy-100 dark:bg-burgundy-800 text-burgundy-700 dark:text-dustypink-300'
    },
    {
      cause: 'Fraud Flag',
      action: 'Escalate to Human',
      desc: 'Halts automated retries; assigns security review ticket to ops',
      icon: ShieldAlert,
      accent: 'border-burgundy-300 dark:border-burgundy-800 text-burgundy-950 dark:text-dustypink-300 bg-gradient-to-br from-creme-50 to-burgundy-100/30 dark:from-burgundy-900/60 dark:to-burgundy-950/60 hover:border-burgundy-400 dark:hover:border-burgundy-700',
      iconBg: 'bg-burgundy-200 dark:bg-burgundy-800 text-burgundy-900 dark:text-dustypink-400'
    }
  ];

  return (
    <div className="glass-panel-elevated dark:bg-burgundy-900/80 dark:border-burgundy-800 rounded-3xl p-6 shadow-soft">
      <div className="flex items-center space-x-2 text-xs font-bold text-burgundy-900 dark:text-dustypink-300 uppercase tracking-wider mb-4">
        <Sparkles className="w-4 h-4 text-burgundy-600 dark:text-dustypink-400" />
        <span className="font-serif-luxury text-sm dark:text-creme-50">Autonomous Decision Policies</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {rules.map((rule, idx) => {
          const Icon = rule.icon;
          return (
            <div 
              key={idx}
              className={`p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-2xs ${rule.accent} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-burgundy-950 dark:text-creme-50 font-semibold">{rule.cause}</span>
                  <div className="flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-sand-500 dark:text-sand-400" />
                    <span className="font-mono font-bold text-burgundy-700 dark:text-dustypink-300 bg-white/70 dark:bg-burgundy-950 px-2 py-0.5 rounded border border-sand-200/80 dark:border-burgundy-800">{rule.action}</span>
                  </div>
                </div>
                <p className="text-[11px] text-sand-800 dark:text-sand-300 leading-relaxed mt-1 font-medium">
                  {rule.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
