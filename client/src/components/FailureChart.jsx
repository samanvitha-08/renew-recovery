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
  PieChart as ChartIcon,
  Sparkles
} from 'lucide-react';

const REASON_METADATA = {
  expired_card: {
    label: 'Expired Card',
    description: 'Card past expiry date',
    icon: CreditCard,
    action: 'send_email',
    actionLabel: 'Send Email Link',
    actionIcon: Mail,
    badgeClass: 'bg-dustypink-100 text-dustypink-700 border-dustypink-300',
    barColor: 'bg-gradient-to-r from-dustypink-300 via-dustypink-400 to-dustypink-500',
    accentBorder: 'hover:border-dustypink-400',
  },
  insufficient_funds: {
    label: 'Insufficient Funds',
    description: 'Declined due to temporary balance',
    icon: Wallet,
    action: 'retry_later',
    actionLabel: 'Smart Retry in 3d',
    actionIcon: Clock,
    badgeClass: 'bg-sand-100 text-sand-800 border-sand-300',
    barColor: 'bg-gradient-to-r from-sand-300 via-sand-400 to-sand-500',
    accentBorder: 'hover:border-sand-400',
  },
  bank_decline: {
    label: 'Bank Decline',
    description: 'Generic issuer / network drop',
    icon: Building2,
    action: 'retry_now',
    actionLabel: 'Instant Gateway Retry',
    actionIcon: Zap,
    badgeClass: 'bg-burgundy-50 text-burgundy-700 border-burgundy-200',
    barColor: 'bg-gradient-to-r from-burgundy-400 via-burgundy-500 to-burgundy-600',
    accentBorder: 'hover:border-burgundy-400',
  },
  fraud_flag: {
    label: 'Fraud Flag',
    description: 'High risk score / bot activity',
    icon: ShieldAlert,
    action: 'escalate_human',
    actionLabel: 'Escalate to Compliance',
    actionIcon: UserX,
    badgeClass: 'bg-burgundy-100 text-burgundy-900 border-burgundy-300',
    barColor: 'bg-gradient-to-r from-burgundy-600 via-burgundy-800 to-burgundy-950',
    accentBorder: 'hover:border-burgundy-600',
  }
};

export default function FailureChart({ stats, selectedReason, onSelectReason }) {
  const breakdown = stats?.breakdownByReason || {};
  const totalCount = stats?.totalCount || 30;

  const reasons = ['expired_card', 'insufficient_funds', 'bank_decline', 'fraud_flag'];

  return (
    <div className="glass-panel-elevated rounded-3xl p-6 sm:p-7 shadow-soft transition-all">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-sand-200/80 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-dustypink-100 border border-dustypink-200 text-burgundy-700">
            <ChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-burgundy-950 font-serif-luxury tracking-tight">Root-Cause Breakdown</h2>
            <p className="text-xs text-sand-700">Distribution of payment failures & autonomous recovery policies</p>
          </div>
        </div>
      </div>

      {/* Grid of Causes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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
              className={`group p-5 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md ${
                isSelected
                  ? 'bg-gradient-to-br from-creme-50 to-dustypink-100/70 border-burgundy-600 ring-2 ring-burgundy-600/30 scale-[1.01]'
                  : `bg-creme-50/90 border-sand-200/90 hover:bg-creme-50 hover:-translate-y-0.5 ${meta.accentBorder}`
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${meta.badgeClass} border transition-transform duration-300 group-hover:scale-105`}>
                    <ReasonIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-burgundy-950 group-hover:text-burgundy-700 transition-colors">
                      {meta.label}
                    </span>
                    <p className="text-[11px] text-sand-700">{meta.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-burgundy-950">
                    {count} <span className="text-xs font-medium text-sand-600 font-sans">({percentage}%)</span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-dustypink-700">
                    ${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Progress & Recovery Share */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-[11px] font-medium text-sand-700">
                  <span>Volume share</span>
                  <span className="font-mono font-bold text-burgundy-800">
                    {data.recoveredCount > 0 ? `${data.recoveredCount} recovered ($${data.recoveredAmount.toFixed(0)})` : 'Pending recovery'}
                  </span>
                </div>
                <div className="w-full bg-sand-200/80 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full ${meta.barColor} transition-all duration-700 rounded-full`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Strategy Footer */}
              <div className="mt-3.5 pt-3 border-t border-sand-200/60 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-sand-700">AI Strategy:</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-burgundy-900 bg-sand-100/90 px-2.5 py-1 rounded-lg border border-sand-300/80 shadow-2xs">
                  <ActionIcon className="w-3.5 h-3.5 text-burgundy-700" />
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
