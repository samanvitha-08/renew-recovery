import React, { useState, useMemo } from 'react';
import { 
  User, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Zap, 
  ShieldAlert, 
  Sparkles, 
  Calendar, 
  Award, 
  Activity, 
  X, 
  BarChart3, 
  Target, 
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function WorkerProfileModal({ 
  user, 
  onClose, 
  payments = [], 
  auditLogs = [],
  sessionActivities = []
}) {
  const [timeframe, setTimeframe] = useState('week'); // 'week' | 'all'

  // Derive worker performance statistics based on payments and session/shift activity
  const performance = useMemo(() => {
    const isViewer = user?.role === 'Viewer';
    
    // Payments that have been executed / recovered in the current system state
    const recoveredPayments = payments.filter(p => p.status === 'recovered');
    const pendingPayments = payments.filter(p => p.status === 'pending');
    const escalatedPayments = payments.filter(p => p.status === 'escalated');
    const totalProcessedPayments = recoveredPayments.length + pendingPayments.length + escalatedPayments.length;

    // Baseline historical shift figures for realism (Razorpay ops shift stats)
    const baseWeeklyShift = isViewer ? {
      handledCount: 0,
      recoveredAmount: 0,
      recoveredCount: 0,
      emailCount: 0,
      retryNowCount: 0,
      retryLaterCount: 0,
      escalatedCount: 0,
      bonusShiftEntries: []
    } : {
      handledCount: 14,
      recoveredAmount: 2450.00,
      recoveredCount: 11,
      emailCount: 6,
      retryNowCount: 5,
      retryLaterCount: 2,
      escalatedCount: 1,
      bonusShiftEntries: [
        {
          id: 'shift_prev_1',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          customerName: 'Marcus Vance',
          customerEmail: 'm.vance@***.com',
          cardLast4: '9081',
          amount: 299.00,
          action: 'send_email',
          actionLabel: 'Dispatched 1-Click Update Email',
          outcome: 'Recovered ($299.00) via Card Update',
          status: 'recovered'
        },
        {
          id: 'shift_prev_2',
          timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
          customerName: 'Elena Rostova',
          customerEmail: 'e.rostova@***.io',
          cardLast4: '1142',
          amount: 450.00,
          action: 'retry_now',
          actionLabel: 'Executed Instant Gateway Retry',
          outcome: 'Recovered ($450.00) via Network Routing',
          status: 'recovered'
        },
        {
          id: 'shift_prev_3',
          timestamp: new Date(Date.now() - 3600000 * 26).toISOString(),
          customerName: 'Harrison Ford Logistics',
          customerEmail: 'h.ford@***.com',
          cardLast4: '7721',
          amount: 180.00,
          action: 'retry_later',
          actionLabel: 'Scheduled NSF Smart Retry (+3d)',
          outcome: 'Pending Retry in 3 Days',
          status: 'pending'
        }
      ]
    };

    const baseAllTimeShift = isViewer ? {
      handledCount: 0,
      recoveredAmount: 0,
      recoveredCount: 0,
      emailCount: 0,
      retryNowCount: 0,
      retryLaterCount: 0,
      escalatedCount: 0,
      bonusShiftEntries: []
    } : {
      handledCount: 52,
      recoveredAmount: 8920.00,
      recoveredCount: 44,
      emailCount: 22,
      retryNowCount: 18,
      retryLaterCount: 8,
      escalatedCount: 4,
      bonusShiftEntries: [
        ...baseWeeklyShift.bonusShiftEntries,
        {
          id: 'shift_prev_4',
          timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
          customerName: 'Nexus Cloud Labs',
          customerEmail: 'n.labs@***.com',
          cardLast4: '5512',
          amount: 620.00,
          action: 'send_email',
          actionLabel: 'Dispatched 1-Click Update Email',
          outcome: 'Recovered ($620.00) via Card Update',
          status: 'recovered'
        },
        {
          id: 'shift_prev_5',
          timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
          customerName: 'Summit Analytics',
          customerEmail: 'ops@***.dev',
          cardLast4: '3310',
          amount: 790.00,
          action: 'retry_now',
          actionLabel: 'Executed Instant Gateway Retry',
          outcome: 'Recovered ($790.00) via Network Routing',
          status: 'recovered'
        }
      ]
    };

    const base = timeframe === 'week' ? baseWeeklyShift : baseAllTimeShift;

    // Calculate current live session contributions
    const currentRecoveredAmount = recoveredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const currentHandledCount = totalProcessedPayments;
    const currentRecoveredCount = recoveredPayments.length;
    
    // Current action counts from live payments state
    const currentEmailCount = payments.filter(p => p.status !== 'failed' && p.action === 'send_email').length;
    const currentRetryNowCount = payments.filter(p => p.status !== 'failed' && p.action === 'retry_now').length;
    const currentRetryLaterCount = payments.filter(p => p.status !== 'failed' && p.action === 'retry_later').length;
    const currentEscalatedCount = payments.filter(p => p.status !== 'failed' && p.action === 'escalate_human').length;

    // Totals
    const totalHandled = isViewer ? 0 : (base.handledCount + currentHandledCount);
    const totalRecoveredDollars = isViewer ? 0 : (base.recoveredAmount + currentRecoveredAmount);
    const totalRecoveredCount = isViewer ? 0 : (base.recoveredCount + currentRecoveredCount);

    const emailSends = isViewer ? 0 : (base.emailCount + currentEmailCount);
    const retryNows = isViewer ? 0 : (base.retryNowCount + currentRetryNowCount);
    const retryLaters = isViewer ? 0 : (base.retryLaterCount + currentRetryLaterCount);
    const escalations = isViewer ? 0 : (base.escalatedCount + currentEscalatedCount);

    const successRate = totalHandled > 0 
      ? Math.min(100, Math.round((totalRecoveredCount / Math.max(totalHandled, 1)) * 100))
      : 0;

    // Combine live payment audit logs and baseline shift activity
    const liveActivityList = payments
      .filter(p => p.status !== 'failed')
      .map(p => ({
        id: `live_${p.id}`,
        timestamp: p.action_executed_at || p.date || new Date().toISOString(),
        customerName: p.customer_name,
        customerEmail: p.customer_email,
        cardLast4: p.card_last4,
        amount: p.amount,
        action: p.action,
        actionLabel: p.action === 'send_email' ? 'Dispatched 1-Click Update Email' :
                     p.action === 'retry_now' ? 'Executed Instant Gateway Retry' :
                     p.action === 'retry_later' ? 'Scheduled NSF Smart Retry (+3d)' : 'Fraud Ticket Escalated to Ops',
        outcome: p.status === 'recovered' ? `Recovered ($${p.amount.toFixed(2)})` :
                 p.status === 'pending' ? 'Pending Retry in 3 Days' : 'Escalated to Human Review',
        status: p.status
      }));

    const allActivities = [...liveActivityList, ...base.bonusShiftEntries];

    return {
      totalHandled,
      totalRecoveredDollars,
      successRate,
      emailSends,
      retryNows,
      retryLaters,
      escalations,
      allActivities
    };
  }, [user, timeframe, payments]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-creme-50 border border-sand-300 rounded-3xl shadow-soft-xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-sand-100 via-creme-50 to-dustypink-50/80 border-b border-sand-200/90 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {/* Worker Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-burgundy-800 to-burgundy-600 text-creme-50 flex items-center justify-center font-bold text-xl shadow-md shadow-burgundy-900/20 ring-2 ring-dustypink-300/40">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl font-bold font-serif-luxury text-burgundy-950">
                  {user?.name || 'Worker Profile'}
                </h3>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono border ${
                  user?.role === 'Admin' ? 'bg-burgundy-100 text-burgundy-900 border-burgundy-300' :
                  user?.role === 'Ops' ? 'bg-dustypink-100 text-dustypink-900 border-dustypink-300' :
                  'bg-sand-200 text-sand-800 border-sand-300'
                }`}>
                  {user?.role || 'Operator'} Role
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-sand-200/80 text-sand-800 border border-sand-300 font-medium">
                  💳 Involuntary Churn Ops Desk
                </span>
              </div>
              <p className="text-xs text-sand-700 font-mono mt-1">
                {user?.email || user?.username || 'operator@recover.demo'} • ID: REC-OP-{user?.role?.toUpperCase() || '01'}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sand-500 hover:text-burgundy-950 hover:bg-sand-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-creme-100/40">
          
          {/* Controls Bar: Timeframe Toggle & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 p-3.5 rounded-2xl border border-sand-200/90 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></div>
              <span className="text-xs font-bold text-burgundy-950">Operator Shift Performance</span>
              <span className="text-[11px] text-sand-600 font-medium">• Live Telemetry</span>
            </div>

            {/* "This Week" vs "All Time" Toggle */}
            <div className="inline-flex bg-sand-200/70 p-1 rounded-xl border border-sand-300/80">
              <button
                onClick={() => setTimeframe('week')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  timeframe === 'week'
                    ? 'bg-burgundy-800 text-creme-50 shadow-2xs'
                    : 'text-sand-700 hover:text-burgundy-900'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimeframe('all')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  timeframe === 'all'
                    ? 'bg-burgundy-800 text-creme-50 shadow-2xs'
                    : 'text-sand-700 hover:text-burgundy-900'
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Total Revenue Recovered */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white via-creme-50 to-dustypink-50/50 border border-sand-300/80 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-sand-700">
                <span className="text-[11px] font-bold uppercase tracking-wider">Revenue Recovered</span>
                <div className="p-1.5 rounded-lg bg-burgundy-100 text-burgundy-700">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-serif-luxury text-burgundy-950">
                ${performance.totalRecoveredDollars.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-sand-600 font-medium flex items-center gap-1 pt-0.5">
                <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                Personal contribution to revenue
              </p>
            </div>

            {/* Total Transactions Handled */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white via-creme-50 to-sand-50 border border-sand-300/80 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-sand-700">
                <span className="text-[11px] font-bold uppercase tracking-wider">Transactions Handled</span>
                <div className="p-1.5 rounded-lg bg-sand-200 text-sand-800">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-serif-luxury text-burgundy-950">
                {performance.totalHandled} <span className="text-xs font-normal text-sand-600 font-sans">payments</span>
              </div>
              <p className="text-[11px] text-sand-600 font-medium pt-0.5">
                Executed via 1-click & AI workflows
              </p>
            </div>

            {/* Success Rate */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white via-creme-50 to-dustypink-50/50 border border-sand-300/80 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-sand-700">
                <span className="text-[11px] font-bold uppercase tracking-wider">Recovery Success Rate</span>
                <div className="p-1.5 rounded-lg bg-dustypink-200 text-burgundy-800">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-serif-luxury text-burgundy-950">
                {performance.successRate}%
              </div>
              <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-gradient-to-r from-dustypink-400 to-burgundy-700 h-full rounded-full transition-all duration-500"
                  style={{ width: `${performance.successRate}%` }}
                />
              </div>
            </div>

          </div>

          {/* Breakdown By Action Type */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-burgundy-700" />
              Breakdown by Action Type Handled
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Emails */}
              <div className="p-3.5 rounded-xl bg-white/90 border border-sand-300/80 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-dustypink-800 text-xs font-bold">
                  <Mail className="w-3.5 h-3.5 text-dustypink-600" />
                  Card Update Emails
                </div>
                <div className="text-lg font-bold font-serif-luxury text-burgundy-950">
                  {performance.emailSends} <span className="text-[10px] font-normal text-sand-600 font-sans">sends</span>
                </div>
                <div className="text-[10px] text-sand-600">Expired card workflows</div>
              </div>

              {/* Instant Retries */}
              <div className="p-3.5 rounded-xl bg-white/90 border border-sand-300/80 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-burgundy-800 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 text-burgundy-600" />
                  Instant Retries
                </div>
                <div className="text-lg font-bold font-serif-luxury text-burgundy-950">
                  {performance.retryNows} <span className="text-[10px] font-normal text-sand-600 font-sans">retries</span>
                </div>
                <div className="text-[10px] text-sand-600">Smart gateway routing</div>
              </div>

              {/* Scheduled 3d Retries */}
              <div className="p-3.5 rounded-xl bg-white/90 border border-sand-300/80 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-sand-800 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-sand-700" />
                  Scheduled Retries
                </div>
                <div className="text-lg font-bold font-serif-luxury text-burgundy-950">
                  {performance.retryLaters} <span className="text-[10px] font-normal text-sand-600 font-sans">queued</span>
                </div>
                <div className="text-[10px] text-sand-600">3-day pay cycle timing</div>
              </div>

              {/* Fraud Escalations */}
              <div className="p-3.5 rounded-xl bg-white/90 border border-sand-300/80 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-burgundy-900 text-xs font-bold">
                  <ShieldAlert className="w-3.5 h-3.5 text-burgundy-800" />
                  Risk Escalations
                </div>
                <div className="text-lg font-bold font-serif-luxury text-burgundy-950">
                  {performance.escalations} <span className="text-[10px] font-normal text-sand-600 font-sans">cases</span>
                </div>
                <div className="text-[10px] text-sand-600">Halted high risk flags</div>
              </div>
            </div>
          </div>

          {/* Worker Activity Log Stream */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-burgundy-700" />
                Operator Activity Ledger ({performance.allActivities.length} actions)
              </h4>
              <span className="text-[11px] text-sand-600 font-mono">
                Attributed to: {user?.name || 'Samanvitha'}
              </span>
            </div>

            <div className="border border-sand-200/90 rounded-2xl overflow-hidden bg-white/80 shadow-2xs divide-y divide-sand-200/70 max-h-64 overflow-y-auto">
              {performance.allActivities.length === 0 ? (
                <div className="p-8 text-center text-xs text-sand-600 font-medium">
                  No recovery actions executed yet in this session. Click &quot;Execute&quot; on a payment in the queue to record your operator impact!
                </div>
              ) : (
                performance.allActivities.map((item) => (
                  <div key={item.id} className="p-3.5 hover:bg-sand-50/80 transition-colors flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-burgundy-950">{item.customerName}</span>
                        <span className="text-[11px] text-sand-600 font-mono">{item.customerEmail}</span>
                        <span className="text-[10px] text-sand-500 font-mono">••••{item.cardLast4}</span>
                      </div>
                      <div className="text-[11px] text-sand-700 flex items-center gap-1.5">
                        <span className="font-medium text-burgundy-900">{item.actionLabel}</span>
                        <span className="text-sand-400">•</span>
                        <span className="text-sand-500 font-mono">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-burgundy-950 text-xs block">
                        ${item.amount?.toFixed(2)}
                      </span>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                        item.status === 'recovered' ? 'bg-burgundy-100 text-burgundy-900 border border-burgundy-200' :
                        item.status === 'pending' ? 'bg-sand-200 text-sand-800 border border-sand-300' :
                        'bg-dustypink-100 text-dustypink-900 border border-dustypink-300'
                      }`}>
                        {item.outcome}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-sand-100/60 border-t border-sand-200/80 flex items-center justify-between text-xs text-sand-700">
          <div className="flex items-center gap-1.5 text-sand-600">
            <Award className="w-4 h-4 text-burgundy-700" />
            <span>Autonomous Involuntary Churn Recovery Metrics</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold text-xs bg-burgundy-800 text-creme-50 rounded-xl hover:bg-burgundy-900 transition-all shadow-2xs active:scale-95"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
