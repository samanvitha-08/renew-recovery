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
      causeKey: 'expired_card',
      action: 'Send Email',
      desc: 'Dispatches 1-click update link with customer loyalty grace period',
      icon: Mail,
      accent: 'border-amber-500/20 text-amber-400 bg-amber-500/5'
    },
    {
      cause: 'Insufficient Funds',
      causeKey: 'insufficient_funds',
      action: 'Retry in 3 Days',
      desc: 'Defers retry to align with payroll cycle to prevent churn',
      icon: Clock,
      accent: 'border-blue-500/20 text-blue-400 bg-blue-500/5'
    },
    {
      cause: 'Bank Decline',
      causeKey: 'bank_decline',
      action: 'Retry Now',
      desc: 'Executes instant network re-attempt with optimized gateway routing',
      icon: Zap,
      accent: 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5'
    },
    {
      cause: 'Fraud Flag',
      causeKey: 'fraud_flag',
      action: 'Escalate to Human',
      desc: 'Halts automated retries; assigns security review ticket to ops',
      icon: ShieldAlert,
      accent: 'border-rose-500/20 text-rose-400 bg-rose-500/5'
    }
  ];

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
        <Sparkles className="w-3.5 h-3.5 text-brand-400" />
        <span>Autonomous Decision Policies</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {rules.map((rule, idx) => {
          const Icon = rule.icon;
          return (
            <div 
              key={idx}
              className={`p-3.5 rounded-xl border ${rule.accent} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-200">{rule.cause}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span className="font-mono">{rule.action}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug mt-1.5">
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
