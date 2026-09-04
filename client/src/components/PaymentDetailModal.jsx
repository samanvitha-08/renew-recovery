import React from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  History,
  FileCode,
  Lock,
  Building2,
  Eye,
  RefreshCw
} from 'lucide-react';

function maskEmail(email) {
  if (!email) return 'customer@***.com';
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const dotIndex = domain.lastIndexOf('.');
  const tld = dotIndex !== -1 ? domain.substring(dotIndex) : '.com';
  const parts = local.split('.');
  if (parts.length > 1) {
    return `${parts[0].charAt(0)}.${parts.slice(1).join('.')}@***${tld}`;
  }
  return `${local.charAt(0)}***@***${tld}`;
}

export default function PaymentDetailModal({ 
  payment, 
  onClose, 
  onExecuteAction, 
  onOpenCustomerView,
  isProcessing = false,
  userRole = 'Admin' 
}) {
  if (!payment) return null;

  const isPending = payment.status === 'failed';
  const isFraud = payment.failure_reason === 'fraud_flag';
  const isViewer = userRole === 'Viewer';

  const bankNotification = payment.bank_notification || {
    bank_name: payment.bank_name || 'Issuing Bank Network',
    status: 'Notified',
    event: 'Decline telemetry registered',
    reference_id: `BNK-REF-${(payment.id || '00').toUpperCase()}`,
    notified_at: payment.date || new Date().toISOString()
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-creme-50 border border-sand-300 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-sand-200 flex items-start justify-between bg-creme-100/80">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-dustypink-100 border border-dustypink-200 text-burgundy-700 shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold font-serif-luxury text-burgundy-950">
                  Payment #{payment.id}
                </h3>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-sand-200 text-burgundy-900 border border-sand-300">
                  {payment.plan_name || 'Subscription Plan'}
                </span>
              </div>
              <p className="text-xs text-sand-700 mt-1 font-medium flex items-center gap-1.5">
                <span>Customer: <strong className="text-burgundy-950 font-bold">{payment.customer_name}</strong></span>
                <span className="text-sand-400">•</span>
                <span className="font-mono text-sand-600">({maskEmail(payment.customer_email)})</span>
                <span className="text-sand-400">•</span>
                <span className="font-mono bg-sand-200/80 px-1.5 py-0.2 rounded text-[11px] text-sand-800">
                  ****{payment.card_last4 || '••••'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenCustomerView && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCustomerView(payment);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl text-burgundy-900 bg-sand-100 hover:bg-sand-200 border border-sand-300 transition-all"
                title="View customer-facing billing screen"
              >
                <Eye className="w-3.5 h-3.5 text-burgundy-700" />
                Customer View
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-sand-600 hover:text-burgundy-950 hover:bg-sand-200/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-3.5 p-4 bg-sand-100/60 rounded-2xl border border-sand-200">
            <div>
              <span className="text-[11px] text-sand-700 font-bold uppercase tracking-wider">Amount</span>
              <div className="text-xl font-bold font-mono text-burgundy-950 mt-0.5">
                ${payment.amount?.toFixed(2)} <span className="text-xs font-normal text-sand-600">USD</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] text-sand-700 font-bold uppercase tracking-wider">Customer History</span>
              <div className="text-sm font-bold text-burgundy-900 mt-1 flex items-center gap-1.5 font-mono">
                <History className="w-4 h-4 text-burgundy-700" />
                {payment.past_successful_payments} past payments
              </div>
            </div>
            <div>
              <span className="text-[11px] text-sand-700 font-bold uppercase tracking-wider">Current Status</span>
              <div className="text-sm font-bold mt-1">
                {payment.status === 'recovered' && <span className="text-burgundy-800 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-burgundy-700" /> Recovered</span>}
                {payment.status === 'pending' && <span className="text-sand-800 flex items-center gap-1"><Clock className="w-4 h-4 text-sand-700" /> Retry Scheduled</span>}
                {payment.status === 'escalated' && <span className="text-burgundy-950 flex items-center gap-1"><ShieldAlert className="w-4 h-4 text-burgundy-700" /> Escalated</span>}
                {payment.status === 'failed' && <span className="text-dustypink-800 flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-dustypink-600" /> Action Needed</span>}
              </div>
            </div>
          </div>

          {/* 1. Plain Customer-Facing Decline Explanation (Transparency feature) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy-900 flex items-center gap-1.5 font-serif-luxury text-sm">
              <Building2 className="w-4 h-4 text-burgundy-700" />
              Customer-Facing Decline Explanation
            </h4>

            <div className="p-4 bg-white/90 rounded-2xl border border-sand-200 space-y-2 shadow-2xs">
              <p className="text-xs text-burgundy-950 font-medium leading-relaxed">
                "{payment.customer_explanation || `Your card was declined because it has expired. ${bankNotification.bank_name} requires updated card details to process this payment.`}"
              </p>

              {/* Simulated Issuing Bank Notification Status */}
              <div className="pt-2 border-t border-sand-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-sand-700">
                <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Decline reason sent to {bankNotification.bank_name} for reference
                </span>
                <span className="text-sand-500">Ref: {bankNotification.reference_id}</span>
              </div>
            </div>
          </div>

          {/* AI Decision & Reasoning Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy-900 flex items-center gap-1.5 font-serif-luxury text-sm">
              <Sparkles className="w-4 h-4 text-burgundy-600" />
              Agentic AI Decision Trail
            </h4>

            <div className="p-5 bg-white/80 rounded-2xl border border-sand-200 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-sand-700 font-medium">Classified Root Cause:</span>
                <span className="text-xs font-bold text-dustypink-800 bg-dustypink-100 px-2.5 py-1 rounded-lg border border-dustypink-300 font-mono">
                  {payment.failure_reason}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-sand-700 font-medium">Decided Action:</span>
                <span className="text-xs font-bold text-burgundy-800 bg-burgundy-100 px-2.5 py-1 rounded-lg border border-burgundy-200 font-mono">
                  {payment.action}
                </span>
              </div>

              {/* Risk Signal Callout */}
              {isFraud && (
                <div className="p-3 bg-burgundy-100/80 rounded-xl border border-burgundy-300 text-xs text-burgundy-950 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-burgundy-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Risk Signal: </span>
                    <span>{payment.risk_signal || 'New account, zero payment history, high transaction amount relative to plan tier'}</span>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-sand-200">
                <span className="text-xs font-bold text-burgundy-950">Autonomous Reasoning:</span>
                <p className="mt-1.5 text-xs leading-relaxed bg-creme-100/90 p-3.5 rounded-xl border border-sand-200 text-burgundy-950 font-medium">
                  {payment.reasoning}
                </p>
              </div>
            </div>
          </div>

          {/* Execution Payload / Message Simulation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy-900 flex items-center gap-1.5 font-serif-luxury text-sm">
              <FileCode className="w-4 h-4 text-burgundy-600" />
              Simulated Execution Payload
            </h4>

            <div className="p-4 bg-burgundy-950 rounded-2xl border border-burgundy-800 font-mono text-xs text-creme-100 leading-relaxed overflow-x-auto shadow-inner">
              <p className="text-dustypink-300 font-sans text-[11px] font-medium">// Output generated by Recover Engine:</p>
              <p className="mt-1.5 text-dustypink-200 font-bold">"{payment.message}"</p>
              {payment.execution_log && (
                <div className="mt-2.5 pt-2.5 border-t border-burgundy-800 text-sand-300">
                  <span className="text-dustypink-300 font-bold">Audit Log:</span> {payment.execution_log}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-sand-200 bg-creme-100/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-sand-700 font-mono font-medium">
            Date: {new Date(payment.date).toLocaleString()}
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl text-sand-800 hover:bg-sand-200 transition-colors"
            >
              Close
            </button>
            {isPending && (
              isFraud ? (
                <div 
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-burgundy-900 bg-sand-200/90 border border-sand-300 cursor-not-allowed opacity-90 shadow-2xs"
                  title="Compliance policy blocks 1-click execution on high fraud risk flags"
                >
                  <Lock className="w-3.5 h-3.5 text-burgundy-700" />
                  Requires Human Approval
                </div>
              ) : isProcessing ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-sand-500 bg-sand-200 border border-sand-300 cursor-not-allowed">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-burgundy-700" />
                  Processing Recovery (~30s)...
                </div>
              ) : isViewer ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-sand-500 bg-sand-200 border border-sand-300 cursor-not-allowed">
                  <Lock className="w-3.5 h-3.5 text-sand-500" />
                  View-Only Role
                </div>
              ) : (
                <button
                  onClick={() => {
                    onExecuteAction(payment.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-creme-50 bg-gradient-to-r from-burgundy-800 to-burgundy-600 hover:from-burgundy-900 hover:to-burgundy-700 shadow-md shadow-burgundy-900/20 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-dustypink-300" />
                  Execute Autonomous Action
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
