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
  Sparkles,
  Info,
  Lock,
  Eye,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

const REASON_CONFIG = {
  expired_card: {
    label: 'Expired Card',
    icon: CreditCard,
    class: 'bg-dustypink-100 dark:bg-burgundy-800/90 text-dustypink-800 dark:text-dustypink-200 border-dustypink-300 dark:border-burgundy-700'
  },
  insufficient_funds: {
    label: 'Insufficient Funds',
    icon: Wallet,
    class: 'bg-sand-200 dark:bg-burgundy-800/90 text-sand-900 dark:text-sand-200 border-sand-300 dark:border-burgundy-700'
  },
  bank_decline: {
    label: 'Bank Decline',
    icon: Building2,
    class: 'bg-burgundy-100 dark:bg-burgundy-800/90 text-burgundy-800 dark:text-dustypink-300 border-burgundy-200 dark:border-burgundy-700'
  },
  fraud_flag: {
    label: 'Fraud Flag',
    icon: ShieldAlert,
    class: 'bg-burgundy-200 dark:bg-burgundy-800 text-burgundy-950 dark:text-dustypink-200 border-burgundy-300 dark:border-burgundy-700'
  }
};

const ACTION_CONFIG = {
  send_email: {
    label: 'Send Email',
    icon: Mail,
    badgeClass: 'bg-dustypink-50 dark:bg-burgundy-900/80 text-dustypink-800 dark:text-dustypink-200 border-dustypink-300/80 dark:border-burgundy-700'
  },
  retry_later: {
    label: 'Retry in 3 Days',
    icon: Clock,
    badgeClass: 'bg-sand-100 dark:bg-burgundy-900/80 text-sand-900 dark:text-sand-200 border-sand-300/80 dark:border-burgundy-700'
  },
  retry_now: {
    label: 'Retry Now',
    icon: Zap,
    badgeClass: 'bg-burgundy-50 dark:bg-burgundy-900/80 text-burgundy-800 dark:text-dustypink-300 border-burgundy-200 dark:border-burgundy-700'
  },
  escalate_human: {
    label: 'Escalate to Human',
    icon: UserX,
    badgeClass: 'bg-burgundy-100 dark:bg-burgundy-900 text-burgundy-950 dark:text-dustypink-200 border-burgundy-300 dark:border-burgundy-700'
  }
};

const STATUS_CONFIG = {
  failed: {
    label: 'Action Needed',
    badgeClass: 'bg-dustypink-100 dark:bg-burgundy-800/90 text-dustypink-800 dark:text-dustypink-200 border-dustypink-300 dark:border-burgundy-700',
    icon: AlertCircle
  },
  recovered: {
    label: 'Recovered',
    badgeClass: 'bg-burgundy-800 dark:bg-burgundy-700 text-creme-50 border-burgundy-900 dark:border-burgundy-600 shadow-2xs',
    icon: CheckCircle2
  },
  pending: {
    label: 'Pending Retry (3d)',
    badgeClass: 'bg-sand-200 dark:bg-burgundy-800 text-sand-900 dark:text-sand-200 border-sand-300 dark:border-burgundy-700',
    icon: Clock
  },
  escalated: {
    label: 'Escalated to Ops',
    badgeClass: 'bg-burgundy-900 dark:bg-burgundy-950 text-dustypink-200 border-burgundy-950 dark:border-burgundy-800',
    icon: ShieldAlert
  }
};

// Mask email partially: e.g. "s.martinez@***.io"
function maskEmail(email) {
  if (!email) return 'customer@***.com';
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const dotIndex = domain.lastIndexOf('.');
  const tld = dotIndex !== -1 ? domain.substring(dotIndex) : '.com';
  
  const parts = local.split('.');
  if (parts.length > 1) {
    const formattedFirst = parts[0].charAt(0);
    const rest = parts.slice(1).join('.');
    return `${formattedFirst}.${rest}@***${tld}`;
  }
  return `${local.charAt(0)}***@***${tld}`;
}

// Mask card: e.g. "****4242"
function maskCard(last4) {
  return `****${last4 || '••••'}`;
}

export default function PaymentTable({ 
  payments, 
  onExecuteAction, 
  onSelectPayment,
  onOpenCustomerView,
  selectedReason,
  onSelectReason,
  searchQuery,
  onSearchChange,
  onOpenAuditLog,
  processingMap = {},
  userRole = 'Admin'
}) {
  const [activeTab, setActiveTab] = useState('all');
  const isViewer = userRole === 'Viewer';

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
      const matchBank = p.bank_name?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchId && !matchReason && !matchAction && !matchBank) {
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
    <div className="glass-panel-elevated dark:bg-burgundy-900/60 dark:border-burgundy-800/80 rounded-3xl overflow-hidden shadow-soft-lg border border-sand-200/80 transition-all">
      
      {/* Table Header & Controls */}
      <div className="p-6 border-b border-sand-200/80 dark:border-burgundy-800/70 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-creme-50/70 dark:bg-burgundy-950/70">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0">
          {[
            { id: 'all', label: 'All Payments' },
            { id: 'failed', label: 'Action Needed' },
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
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-burgundy-800 dark:bg-burgundy-700 text-creme-50 shadow-sm shadow-burgundy-900/20'
                    : 'text-sand-800 dark:text-sand-300 hover:text-burgundy-900 dark:hover:text-creme-50 hover:bg-sand-200/60 dark:hover:bg-burgundy-800/60'
                }`}
              >
                {tab.label}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isActive ? 'bg-dustypink-300 text-burgundy-950' : 'bg-sand-200 dark:bg-burgundy-800 text-sand-800 dark:text-sand-200'
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
            <Search className="w-4 h-4 text-sand-500 dark:text-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer, ID, bank..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white/80 dark:bg-burgundy-950/80 border border-sand-300/80 dark:border-burgundy-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-burgundy-950 dark:text-creme-50 placeholder-sand-500 dark:placeholder-sand-400 focus:outline-none focus:border-burgundy-600 focus:ring-2 focus:ring-burgundy-600/10 transition-all font-medium"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            <Filter className="w-4 h-4 text-sand-500 dark:text-sand-400" />
            <select
              value={selectedReason}
              onChange={(e) => onSelectReason(e.target.value)}
              className="bg-white/80 dark:bg-burgundy-950/80 border border-sand-300/80 dark:border-burgundy-700 rounded-xl px-3 py-2 text-xs text-burgundy-950 dark:text-creme-50 font-semibold focus:outline-none focus:border-burgundy-600 cursor-pointer shadow-2xs"
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
            <tr className="border-b border-sand-200/80 dark:border-burgundy-800/80 bg-sand-100/60 dark:bg-burgundy-950/60 text-[11px] font-bold uppercase tracking-wider text-sand-800 dark:text-sand-300">
              <th className="py-3.5 px-5">Customer & Card</th>
              <th className="py-3.5 px-5">Amount</th>
              <th className="py-3.5 px-5">History</th>
              <th className="py-3.5 px-5">Failure Reason</th>
              <th className="py-3.5 px-5">AI Strategy</th>
              <th className="py-3.5 px-5 min-w-[260px]">Autonomous Rationale & Bank Signal</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200/60 dark:divide-burgundy-800/40 text-xs bg-white/40 dark:bg-transparent">
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-14 text-center text-sand-600 dark:text-sand-400">
                  <div className="flex flex-col items-center justify-center space-y-2.5">
                    <HelpCircle className="w-9 h-9 text-sand-400 dark:text-sand-600" />
                    <p className="text-sm font-bold text-burgundy-950 dark:text-creme-50 font-serif-luxury">No payments match the filter criteria</p>
                    <p className="text-xs text-sand-600 dark:text-sand-400">Try adjusting your search query or selected cause</p>
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
                const isFraud = payment.failure_reason === 'fraud_flag';
                const isFailed = payment.status === 'failed';
                
                // Active 30-second processing state for this payment
                const processingInfo = processingMap[payment.id];
                const isProcessing = !!processingInfo;

                return (
                  <tr 
                    key={payment.id} 
                    className="hover:bg-creme-200/40 dark:hover:bg-burgundy-900/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectPayment(payment)}
                  >
                    {/* Customer & Masked Card */}
                    <td className="py-4 px-5">
                      <div className="font-bold text-burgundy-950 dark:text-creme-50 group-hover:text-burgundy-700 dark:group-hover:text-dustypink-300 transition-colors">
                        {payment.customer_name}
                      </div>
                      <div className="text-[11px] text-sand-700 dark:text-sand-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <span>{maskEmail(payment.customer_email)}</span>
                        <span className="text-sand-400">•</span>
                        <span className="text-sand-600 dark:text-sand-300 font-bold bg-sand-100 dark:bg-burgundy-900/90 px-1.5 py-0.2 rounded border border-sand-200/60 dark:border-burgundy-800">
                          {maskCard(payment.card_last4)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {payment.plan_name && (
                          <span className="text-[10px] text-sand-600 dark:text-sand-400 font-medium">
                            {payment.plan_name}
                          </span>
                        )}
                        {payment.bank_name && (
                          <span className="text-[10px] text-sand-500 dark:text-sand-500 font-mono">
                            • {payment.bank_name}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-5 font-mono font-bold text-burgundy-950 dark:text-creme-50 text-sm">
                      ${payment.amount?.toFixed(2)}
                      <span className="text-[10px] text-sand-600 dark:text-sand-400 ml-1 font-normal font-sans">USD</span>
                    </td>

                    {/* Customer History */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                        historyCount >= 15 ? 'bg-burgundy-100 dark:bg-burgundy-800 text-burgundy-800 dark:text-dustypink-200 border border-burgundy-300 dark:border-burgundy-700' :
                        historyCount >= 5 ? 'bg-dustypink-100 dark:bg-burgundy-800/80 text-dustypink-800 dark:text-dustypink-200 border border-dustypink-300 dark:border-burgundy-700' :
                        historyCount > 0 ? 'bg-sand-100 dark:bg-burgundy-900 text-sand-800 dark:text-sand-200 border border-sand-300 dark:border-burgundy-800' :
                        'bg-sand-200 dark:bg-burgundy-950 text-sand-700 dark:text-sand-400 border border-sand-300 dark:border-burgundy-800'
                      }`}>
                        {historyCount} {historyCount === 1 ? 'pmt' : 'pmts'}
                        {historyCount >= 20 && ' ★'}
                      </span>
                    </td>

                    {/* Failure Reason */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${reasonMeta.class}`}>
                        <ReasonIcon className="w-3.5 h-3.5" />
                        {reasonMeta.label}
                      </span>
                    </td>

                    {/* AI Chosen Action */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${actionMeta.badgeClass}`}>
                        <ActionIcon className="w-3.5 h-3.5" />
                        {actionMeta.label}
                      </span>
                    </td>

                    {/* AI Reasoning, Risk Signal & Bank Notification status */}
                    <td className="py-4 px-5 text-xs text-sand-900 dark:text-sand-200 max-w-sm">
                      <div className="line-clamp-2 text-[11px] leading-relaxed text-sand-800 dark:text-sand-300 font-medium">
                        {payment.reasoning}
                      </div>

                      {/* Bank Notification status telemetry */}
                      {payment.bank_name && (
                        <div className="mt-1 text-[10px] text-sand-600 dark:text-sand-400 font-mono flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          <span>Decline reason sent to {payment.bank_name} for reference</span>
                        </div>
                      )}

                      {/* Risk Signal Line for Fraud Flag cases */}
                      {isFraud && (
                        <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-burgundy-100/90 dark:bg-burgundy-900/90 text-burgundy-900 dark:text-dustypink-200 border border-burgundy-300/80 dark:border-burgundy-700 text-[10px] font-medium leading-tight">
                          <AlertTriangle className="w-3 h-3 text-burgundy-700 dark:text-dustypink-300 flex-shrink-0" />
                          <span>
                            <strong>Risk Signal:</strong> {payment.risk_signal || 'New account, zero payment history, high transaction amount relative to plan tier'}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Status & Processing Progress */}
                    <td className="py-4 px-5">
                      {isProcessing ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-dustypink-100 dark:bg-burgundy-800 text-burgundy-900 dark:text-dustypink-200 border-dustypink-300 dark:border-burgundy-700 animate-pulse">
                            <RefreshCw className="w-3 h-3 animate-spin text-burgundy-700 dark:text-dustypink-300" />
                            Processing ({processingInfo.secondsRemaining}s)
                          </span>
                          <div className="w-24 bg-sand-200 dark:bg-burgundy-900 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-dustypink-400 to-burgundy-700 transition-all duration-300"
                              style={{ width: `${processingInfo.progress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusMeta.badgeClass}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusMeta.label}
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        
                        {/* Customer View Button */}
                        <button
                          onClick={() => onOpenCustomerView(payment)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl text-sand-800 dark:text-sand-200 hover:text-burgundy-900 dark:hover:text-creme-50 bg-sand-100 dark:bg-burgundy-900/90 hover:bg-sand-200 dark:hover:bg-burgundy-800 border border-sand-300/80 dark:border-burgundy-700 transition-all shadow-2xs"
                          title="Preview what the customer sees"
                        >
                          <Eye className="w-3.5 h-3.5 text-sand-600 dark:text-sand-400" />
                          Customer View
                        </button>

                        {/* Execute / Details / Human Approval state */}
                        {isFailed ? (
                          isFraud ? (
                            /* Fraud cases require human approval */
                            <div 
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl text-burgundy-900 dark:text-dustypink-200 bg-sand-200/90 dark:bg-burgundy-900/90 border border-sand-300 dark:border-burgundy-700 cursor-not-allowed opacity-90 shadow-2xs"
                              title="Compliance Policy: Fraud flags require manual human compliance verification before execution"
                            >
                              <Lock className="w-3 h-3 text-burgundy-700 dark:text-dustypink-300" />
                              Requires Human Approval
                            </div>
                          ) : isProcessing ? (
                            /* Currently processing ~30 second recovery */
                            <button
                              disabled
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-sand-500 dark:text-sand-400 bg-sand-200 dark:bg-burgundy-900 border border-sand-300 dark:border-burgundy-800 cursor-not-allowed"
                            >
                              <RefreshCw className="w-3 h-3 animate-spin text-burgundy-700 dark:text-dustypink-300" />
                              Processing...
                            </button>
                          ) : isViewer ? (
                            /* Viewer role: execute disabled */
                            <button
                              disabled
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl text-sand-500 dark:text-sand-400 bg-sand-200 dark:bg-burgundy-900 border border-sand-300 dark:border-burgundy-800 cursor-not-allowed"
                              title="Viewer role is read-only (Execute requires Admin or Ops)"
                            >
                              <Lock className="w-3 h-3 text-sand-500" />
                              View-Only
                            </button>
                          ) : (
                            /* Normal Execute Recovery */
                            <button
                              onClick={() => onExecuteAction(payment.id)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl text-creme-50 bg-gradient-to-r from-burgundy-800 to-burgundy-600 hover:from-burgundy-900 hover:to-burgundy-700 shadow-sm shadow-burgundy-900/20 hover:shadow transition-all active:scale-95"
                            >
                              <Sparkles className="w-3 h-3 text-dustypink-300" />
                              Execute
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => onSelectPayment(payment)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl text-sand-800 dark:text-sand-200 hover:text-burgundy-900 dark:hover:text-creme-50 bg-sand-100 dark:bg-burgundy-900/90 hover:bg-sand-200 dark:hover:bg-burgundy-800 border border-sand-300/80 dark:border-burgundy-700 transition-all shadow-2xs"
                          >
                            <Info className="w-3.5 h-3.5 text-sand-600 dark:text-sand-400" />
                            Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 bg-sand-100/50 dark:bg-burgundy-950/70 border-t border-sand-200/80 dark:border-burgundy-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sand-700 dark:text-sand-400 font-medium">
        <div>
          Showing <span className="text-burgundy-950 dark:text-creme-50 font-bold">{filteredPayments.length}</span> of <span className="text-burgundy-950 dark:text-creme-50 font-bold">{payments.length}</span> payment records
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sand-700 dark:text-sand-400">🔒 PII Masked & Tokenized</span>
          {onOpenAuditLog && (
            <button
              onClick={onOpenAuditLog}
              className="text-burgundy-800 dark:text-dustypink-300 hover:text-burgundy-950 dark:hover:text-creme-50 font-bold underline font-sans flex items-center gap-1"
            >
              View Security Audit Log
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
