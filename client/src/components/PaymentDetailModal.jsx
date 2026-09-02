import React from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Mail, 
  Zap, 
  UserX,
  CreditCard,
  History,
  FileCode,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function PaymentDetailModal({ payment, onClose, onExecuteAction }) {
  if (!payment) return null;

  const isPending = payment.status === 'failed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  Payment #{payment.id}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {payment.plan_name || 'Subscription Plan'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Customer: <span className="text-slate-200 font-medium">{payment.customer_name}</span> ({payment.customer_email})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Key Metrics row */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Amount</span>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                ${payment.amount?.toFixed(2)} <span className="text-xs font-normal text-slate-400">USD</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Customer History</span>
              <div className="text-sm font-semibold text-slate-200 mt-1 flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-brand-400" />
                {payment.past_successful_payments} past payments
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Current Status</span>
              <div className="text-sm font-semibold mt-1">
                {payment.status === 'recovered' && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Recovered</span>}
                {payment.status === 'pending' && <span className="text-blue-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Retry Scheduled</span>}
                {payment.status === 'escalated' && <span className="text-purple-400 flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Escalated</span>}
                {payment.status === 'failed' && <span className="text-rose-400 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Failed</span>}
              </div>
            </div>
          </div>

          {/* AI Decision & Reasoning Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Agentic AI Decision Trail
            </h4>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Classified Root Cause:</span>
                <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                  {payment.failure_reason}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Decided Action:</span>
                <span className="text-xs font-semibold text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20 font-mono">
                  {payment.action}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-xs font-medium text-slate-300">Autonomous Reasoning:</span>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-slate-300">
                  {payment.reasoning}
                </p>
              </div>
            </div>
          </div>

          {/* Execution Payload / Message Simulation */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-brand-400" />
              Simulated Execution Payload
            </h4>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
              <p className="text-slate-400">// Output generated by Recover Engine:</p>
              <p className="mt-1 text-emerald-400">"{payment.message}"</p>
              {payment.execution_log && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-slate-400">
                  <span className="text-blue-400 font-bold">Audit Log:</span> {payment.execution_log}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Date: {new Date(payment.date).toLocaleString()}
          </span>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            {isPending && (
              <button
                onClick={() => {
                  onExecuteAction(payment.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 shadow-lg shadow-emerald-950/40 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Execute Autonomous Action
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
