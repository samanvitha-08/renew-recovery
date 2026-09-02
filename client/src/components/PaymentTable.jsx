import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  Building2, 
  ShieldAlert, 
  Mail, 
  Clock, 
  Zap, 
  UserX, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

const REASON_CONFIG = {
  expired_card: {
    label: 'Expired Card',
    icon: CreditCard,
    class: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  },
  insufficient_funds: {
    label: 'Insufficient Funds',
    icon: Wallet,
    class: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  },
  bank_decline: {
    label: 'Bank Decline',
    icon: Building2,
    class: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
  },
  fraud_flag: {
    label: 'Fraud Flag',
    icon: ShieldAlert,
    class: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
  }
};

const ACTION_CONFIG = {
  send_email: {
    label: 'Send Email',
    icon: Mail,
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/20'
  },
  retry_later: {
    label: 'Retry in 3 Days',
    icon: Clock,
    badgeClass: 'bg-blue-500/10 text-blue-300 border-blue-500/20'
  },
  retry_now: {
    label: 'Retry Now',
    icon: Zap,
    badgeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
  },
  escalate_human: {
    label: 'Escalate to Human',
    icon: UserX,
    badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/20'
  }
};

const STATUS_CONFIG = {
  failed: {
    label: 'Failed',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    icon: AlertCircle
  },
  recovered: {
    label: 'Recovered',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: CheckCircle2
  },
  pending: {
    label: 'Pending Retry (3d)',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    icon: Clock
  },
  escalated: {
    label: 'Escalated to Ops',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    icon: ShieldAlert
  }
};

export default function PaymentTable({ 
  payments, 
  onExecuteAction, 
  onSelectPayment,
  selectedReason,
  onSelectReason,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredPayments = payments.filter(p => {
    // Reason filter
    if (selectedReason !== 'all' && p.failure_reason !== selectedReason) {
      return false;
    }
    // Status tab filter
    if (activeTab !== 'all' && p.status !== activeTab) {
      return false;
    }
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.customer_name?.toLowerCase().includes(q);
      const matchEmail = p.customer_email?.toLowerCase().includes(q);
      const matchId = p.id?.toLowerCase().includes(q);
      const matchReason = p.failure_reason?.toLowerCase().includes(q);
      const matchAction = p.action?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchId && !matchReason && !matchAction) {
        return false;
      }
    }
    return true;
  });

  const getTabCount = (tab) => {
    if (tab === 'all') return payments.length;
    return payments.filter(p => p.status === tab).length;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 lg:pb-0">
          {[
            { id: 'all', label: 'All Payments' },
            { id: 'failed', label: 'Failed (Action Needed)' },
            { id: 'recovered', label: 'Recovered' },
            { id: 'pending', label: 'Pending Retry' },
            { id: 'escalated', label: 'Escalated' }
          ].map((tab) => {
            const count = getTabCount(tab.id);
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-black/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Reason Filter */}
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer, ID, reason..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedReason}
              onChange={(e) => onSelectReason(e.target.value)}
              className="bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Failure Causes</option>
              <option value="expired_card">Expired Card</option>
              <option value="insufficient_funds">Insufficient Funds</option>
              <option value="bank_decline">Bank Decline</option>
              <option value="fraud_flag">Fraud Flag</option>
            </select>
          </div>
        </div>

      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Customer History</th>
              <th className="py-3 px-4">Failure Reason</th>
              <th className="py-3 px-4">AI Chosen Action</th>
              <th className="py-3 px-4 min-w-[240px]">AI Reasoning</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <HelpCircle className="w-8 h-8 text-slate-600" />
                    <p className="text-sm font-medium">No payments match the filter criteria</p>
                    <p className="text-xs text-slate-600">Try adjusting your search query or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => {
                const reasonMeta = REASON_CONFIG[payment.failure_reason] || REASON_CONFIG.bank_decline;
                const actionMeta = ACTION_CONFIG[payment.action] || ACTION_CONFIG.retry_now;
                const statusMeta = STATUS_CONFIG[payment.status] || STATUS_CONFIG.failed;
                const ReasonIcon = reasonMeta.icon;
                const ActionIcon = actionMeta.icon;
                const StatusIcon = statusMeta.icon;
                const historyCount = payment.past_successful_payments || 0;

                return (
                  <tr 
                    key={payment.id} 
                    className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    onClick={() => onSelectPayment(payment)}
                  >
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-100 group-hover:text-brand-300 transition-colors">
                        {payment.customer_name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {payment.customer_email || payment.id}
                      </div>
                      {payment.plan_name && (
                        <span className="text-[10px] text-slate-500 font-sans">
                          {payment.plan_name}
                        </span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">
                      ${payment.amount?.toFixed(2)}
                      <span className="text-[10px] text-slate-500 ml-1 font-normal font-sans">USD</span>
                    </td>

                    {/* Customer History */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono ${
                        historyCount >= 15 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
                        historyCount >= 5 ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20' :
                        historyCount > 0 ? 'bg-slate-800 text-slate-300 border border-slate-700' :
                        'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      }`}>
                        {historyCount} {historyCount === 1 ? 'payment' : 'payments'}
                        {historyCount >= 20 && ' (VIP)'}
                      </span>
                    </td>

                    {/* Failure Reason */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${reasonMeta.class}`}>
                        <ReasonIcon className="w-3.5 h-3.5" />
                        {reasonMeta.label}
                      </span>
                    </td>

                    {/* AI Chosen Action */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${actionMeta.badgeClass}`}>
                        <ActionIcon className="w-3.5 h-3.5" />
                        {actionMeta.label}
                      </span>
                    </td>

                    {/* AI Reasoning */}
                    <td className="py-3.5 px-4 text-xs text-slate-300 max-w-xs">
                      <div className="line-clamp-2 text-[11px] leading-relaxed text-slate-300/90 font-sans">
                        {payment.reasoning}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusMeta.badgeClass}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusMeta.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {payment.status === 'failed' ? (
                        <button
                          onClick={() => onExecuteAction(payment.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all shadow-sm"
                        >
                          <Sparkles className="w-3 h-3" />
                          Execute
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectPayment(payment)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        >
                          <Info className="w-3.5 h-3.5" />
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="p-4 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing <span className="text-white font-medium">{filteredPayments.length}</span> of <span className="text-white font-medium">{payments.length}</span> payment records
        </div>
        <div className="font-mono text-slate-400">
          Auto-evaluating with autonomous recovery rules
        </div>
      </div>
    </div>
  );
}
