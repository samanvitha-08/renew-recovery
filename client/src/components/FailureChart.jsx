import React from 'react';
import { 
  CreditCard, 
  Wallet, 
  Building2, 
  ShieldAlert, 
  Mail, 
  Clock, 
  Zap, 
  UserX,
  PieChart as ChartIcon
} from 'lucide-react';

const REASON_METADATA = {
  expired_card: {
    label: 'Expired Card',
    description: 'Card past expiry date',
    icon: CreditCard,
    action: 'send_email',
    actionLabel: 'Send Email Link',
    actionIcon: Mail,
    color: 'amber',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    barColor: 'bg-gradient-to-r from-amber-500 to-amber-400',
  },
  insufficient_funds: {
    label: 'Insufficient Funds',
    description: 'Declined due to low balance',
    icon: Wallet,
    action: 'retry_later',
    actionLabel: 'Smart Retry in 3d',
    actionIcon: Clock,
    color: 'blue',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    barColor: 'bg-gradient-to-r from-blue-500 to-cyan-400',
  },
  bank_decline: {
    label: 'Bank Decline',
    description: 'Generic issuer / network drop',
    icon: Building2,
    action: 'retry_now',
    actionLabel: 'Instant Gateway Retry',
    actionIcon: Zap,
    color: 'indigo',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    barColor: 'bg-gradient-to-r from-indigo-500 to-purple-400',
  },
  fraud_flag: {
    label: 'Fraud Flag',
    description: 'High risk score / bot activity',
    icon: ShieldAlert,
    action: 'escalate_human',
    actionLabel: 'Escalate to Compliance',
    actionIcon: UserX,
    color: 'rose',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    barColor: 'bg-gradient-to-r from-rose-500 to-pink-500',
  }
};

export default function FailureChart({ stats, selectedReason, onSelectReason }) {
  const breakdown = stats?.breakdownByReason || {};
  const totalCount = stats?.totalCount || 30;
  const totalAtRisk = stats?.totalAtRisk || 1;

  const reasons = ['expired_card', 'insufficient_funds', 'bank_decline', 'fraud_flag'];

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <ChartIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Root-Cause Breakdown</h2>
            <p className="text-xs text-slate-400">Distribution of payment failures & autonomous recovery policies</p>
          </div>
        </div>

        {selectedReason !== 'all' && (
          <button
            onClick={() => onSelectReason('all')}
            className="text-xs text-brand-400 hover:text-brand-300 underline font-medium self-start sm:self-auto"
          >
            Clear filter ({REASON_METADATA[selectedReason]?.label})
          </button>
        )}
      </div>

      {/* Breakdown List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {reasons.map((key) => {
          const meta = REASON_METADATA[key];
          const data = breakdown[key] || { count: 0, amount: 0, recoveredCount: 0, recoveredAmount: 0 };
          const count = data.count || 0;
          const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
          const isSelected = selectedReason === key;
          const ActionIcon = meta.actionIcon;
          const ReasonIcon = meta.icon;

          return (
            <div
              key={key}
              onClick={() => onSelectReason(isSelected ? 'all' : key)}
              className={`group p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-brand-500 shadow-md ring-1 ring-brand-500/30'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-lg ${meta.badgeClass} border`}>
                    <ReasonIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">
                      {meta.label}
                    </span>
                    <p className="text-[11px] text-slate-400">{meta.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-white">
                    {count} <span className="text-xs font-normal text-slate-400">({percentage}%)</span>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    ${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3.5 space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Volume share</span>
                  <span className="font-mono text-emerald-400">
                    {data.recoveredCount > 0 ? `${data.recoveredCount} recovered ($${data.recoveredAmount.toFixed(0)})` : 'Pending recovery'}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full ${meta.barColor} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Assigned AI Agent Action */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">AI Strategy:</span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  <ActionIcon className="w-3 h-3 text-brand-400" />
                  {meta.actionLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
