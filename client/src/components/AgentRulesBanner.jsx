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
      accent: 'border-dustypink-300/80 text-burgundy-900 bg-gradient-to-br from-creme-50 to-dustypink-50/50 hover:border-dustypink-400',
      iconBg: 'bg-dustypink-100 text-burgundy-700'
    },
    {
      cause: 'Insufficient Funds',
      action: 'Retry in 3 Days',
      desc: 'Defers retry to align with payroll cycle to prevent churn',
      icon: Clock,
      accent: 'border-sand-300/80 text-burgundy-900 bg-gradient-to-br from-creme-50 to-sand-100/50 hover:border-sand-400',
      iconBg: 'bg-sand-200 text-sand-800'
    },
    {
      cause: 'Bank Decline',
      action: 'Retry Now',
      desc: 'Executes instant network re-attempt with optimized gateway routing',
      icon: Zap,
      accent: 'border-burgundy-200 text-burgundy-900 bg-gradient-to-br from-creme-50 to-burgundy-50/40 hover:border-burgundy-300',
      iconBg: 'bg-burgundy-100 text-burgundy-700'
    },
    {
      cause: 'Fraud Flag',
      action: 'Escalate to Human',
      desc: 'Halts automated retries; assigns security review ticket to ops',
      icon: ShieldAlert,
      accent: 'border-burgundy-300 text-burgundy-950 bg-gradient-to-br from-creme-50 to-burgundy-100/30 hover:border-burgundy-400',
      iconBg: 'bg-burgundy-200 text-burgundy-900'
    }
  ];

  return (
    <div className="glass-panel-elevated rounded-3xl p-6 shadow-soft">
      <div className="flex items-center space-x-2 text-xs font-bold text-burgundy-900 uppercase tracking-wider mb-4">
        <Sparkles className="w-4 h-4 text-burgundy-600" />
        <span className="font-serif-luxury text-sm">Autonomous Decision Policies</span>
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
                  <span className="text-burgundy-950 font-semibold">{rule.cause}</span>
                  <div className="flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-sand-500" />
                    <span className="font-mono font-bold text-burgundy-700 bg-white/70 px-2 py-0.5 rounded border border-sand-200/80">{rule.action}</span>
                  </div>
                </div>
                <p className="text-[11px] text-sand-800 leading-relaxed mt-1 font-medium">
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
