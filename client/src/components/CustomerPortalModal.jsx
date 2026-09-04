import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  FileCheck
} from 'lucide-react';

export default function CustomerPortalModal({ payment, onClose, onSimulateCustomerUpdate }) {
  if (!payment) return null;

  const [cardUpdated, setCardUpdated] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [updating, setUpdating] = useState(false);

  const bankNotification = payment.bank_notification || {
    bank_name: payment.bank_name || 'Issuing Bank Network',
    status: 'Notified',
    event: 'Decline telemetry registered',
    reference_id: `BNK-REF-${(payment.id || '00').toUpperCase()}`,
    notified_at: payment.date || new Date().toISOString()
  };

  const handleCardUpdateSubmit = (e) => {
    e.preventDefault();
    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
      setCardUpdated(true);
      if (onSimulateCustomerUpdate) {
        onSimulateCustomerUpdate(payment.id);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-950/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-creme-50 border border-sand-300 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Customer Portal Top Banner */}
        <div className="p-6 sm:p-7 border-b border-sand-200 bg-gradient-to-r from-sand-100 via-creme-100 to-dustypink-100 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-burgundy-800 text-creme-50 shadow-sm">
              <CreditCard className="w-6 h-6 text-dustypink-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-serif-luxury text-burgundy-950">
                  Customer Billing Notification
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sand-200 text-burgundy-900 border border-sand-300">
                  Customer View
                </span>
              </div>
              <p className="text-xs text-sand-700 mt-0.5 font-medium">
                Recipient: <strong className="text-burgundy-950">{payment.customer_name}</strong> • Plan: {payment.plan_name || 'Subscription'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sand-600 hover:text-burgundy-950 hover:bg-sand-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* Payment Amount Alert Header */}
          <div className="p-4 rounded-2xl bg-white/90 border border-dustypink-300/80 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-sand-700 uppercase tracking-wider">Unsuccessful Transaction</span>
              <div className="text-xl font-bold font-mono text-burgundy-950 mt-0.5">
                ${payment.amount?.toFixed(2)} <span className="text-xs font-normal text-sand-600">USD</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono bg-dustypink-100 text-dustypink-800 px-2.5 py-1 rounded-full font-bold border border-dustypink-300">
                Payment Failed
              </span>
              <div className="text-[11px] text-sand-600 font-mono mt-1">
                Card ending in ****{payment.card_last4 || '••••'}
              </div>
            </div>
          </div>

          {/* 1. Plain Customer-Facing Decline Explanation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy-950 flex items-center gap-1.5 font-serif-luxury text-sm">
              <AlertCircle className="w-4 h-4 text-burgundy-700" />
              Why Was Your Payment Declined?
            </h4>

            <div className="p-4 rounded-2xl bg-sand-100/70 border border-sand-200 text-xs text-burgundy-950 leading-relaxed font-medium">
              <p className="font-semibold text-burgundy-900">
                {payment.customer_explanation || `Your card was declined because it has expired. ${bankNotification.bank_name} requires updated card details to process this payment.`}
              </p>
            </div>
          </div>

          {/* 2. What is being done about it */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy-950 flex items-center gap-1.5 font-serif-luxury text-sm">
              <Clock className="w-4 h-4 text-burgundy-700" />
              Next Steps & Recovery Status
            </h4>

            <div className="p-4 rounded-2xl bg-creme-100/90 border border-sand-200 text-xs text-sand-800 leading-relaxed space-y-2">
              <p className="font-medium text-burgundy-950">
                {payment.customer_next_step || 'Please update your card payment details via our secure link to avoid interruption to your subscription.'}
              </p>
              
              <div className="pt-2 border-t border-sand-200/70 flex items-center justify-between text-[11px] font-mono text-sand-700">
                <span>Autonomous Policy:</span>
                <span className="font-bold text-burgundy-900 bg-sand-200/80 px-2 py-0.5 rounded">
                  {payment.action === 'send_email' ? 'Update Email Dispatched' :
                   payment.action === 'retry_later' ? 'Automated Retry in 3 Days' :
                   payment.action === 'retry_now' ? 'Instant Smart Re-attempt' : 'Compliance Identity Review'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Bank Notification Confirmation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy-950 flex items-center gap-1.5 font-serif-luxury text-sm">
              <Building2 className="w-4 h-4 text-burgundy-700" />
              Issuing Bank Notification Telemetry
            </h4>

            <div className="p-4 rounded-2xl bg-white/90 border border-sand-200 text-xs space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-sand-700 font-medium">Issuing Bank:</span>
                <span className="font-bold text-burgundy-950 font-sans">{bankNotification.bank_name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sand-700 font-medium">Notification Event:</span>
                <span className="font-semibold text-burgundy-800 bg-sand-100 px-2 py-0.5 rounded border border-sand-200 font-mono text-[11px]">
                  {bankNotification.event}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sand-700 font-medium">Bank Reference ID:</span>
                <span className="font-mono text-sand-700 font-bold text-[11px]">{bankNotification.reference_id}</span>
              </div>

              <div className="pt-2 border-t border-sand-200/70 flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Decline reason sent to {bankNotification.bank_name} for reference</span>
              </div>
            </div>
          </div>

          {/* Interactive Customer Card Update Simulator (for expired card cases) */}
          {payment.failure_reason === 'expired_card' && !cardUpdated && (
            <div className="p-4 rounded-2xl bg-dustypink-50 border border-dustypink-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-burgundy-950 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-burgundy-700" />
                  Update Payment Method
                </span>
                <span className="text-[10px] font-mono text-dustypink-800">256-Bit SSL</span>
              </div>

              <form onSubmit={handleCardUpdateSubmit} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="New Card Number (**** 4242)"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                    className="col-span-2 bg-white border border-dustypink-300 rounded-xl px-3 py-2 text-xs font-mono text-burgundy-950 focus:outline-none focus:border-burgundy-700"
                  />
                  <input
                    type="text"
                    required
                    placeholder="MM / YY (12/28)"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="bg-white border border-dustypink-300 rounded-xl px-3 py-2 text-xs font-mono text-burgundy-950 focus:outline-none focus:border-burgundy-700"
                  />
                  <input
                    type="text"
                    required
                    placeholder="CVV (123)"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="bg-white border border-dustypink-300 rounded-xl px-3 py-2 text-xs font-mono text-burgundy-950 focus:outline-none focus:border-burgundy-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-creme-50 bg-gradient-to-r from-burgundy-800 to-burgundy-600 hover:from-burgundy-900 hover:to-burgundy-700 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving & Validating with {bankNotification.bank_name}...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-dustypink-300" />
                      <span>Simulate Customer Card Update</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {cardUpdated && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <div>
                <strong className="block font-bold">Card Successfully Updated</strong>
                <span>New card registered and verification token sent to {bankNotification.bank_name}.</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-sand-200 bg-creme-100/70 flex items-center justify-between">
          <span className="text-xs text-sand-700 font-mono">
            Transaction Ref: {payment.id}
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl text-creme-50 bg-burgundy-800 hover:bg-burgundy-900 transition-colors shadow-sm"
          >
            Close Customer View
          </button>
        </div>
      </div>
    </div>
  );
}
