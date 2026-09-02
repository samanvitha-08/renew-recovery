import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import FailureChart from './components/FailureChart';
import AgentRulesBanner from './components/AgentRulesBanner';
import PaymentTable from './components/PaymentTable';
import PaymentDetailModal from './components/PaymentDetailModal';
import { 
  AlertTriangle, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  TrendingUp,
  Sparkles,
  Bot,
  Activity,
  Check
} from 'lucide-react';

export default function App() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecovering, setIsRecovering] = useState(false);
  const [selectedReason, setSelectedReason] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalPayment, setActiveModalPayment] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/payments');
      const data = await res.json();
      setPayments(data.payments || []);
      setStats(data.stats || null);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Execute recovery for a single payment
  const handleExecuteAction = async (id) => {
    try {
      const res = await fetch(`/api/payments/${id}/recover`, { method: 'POST' });
      const data = await res.json();
      if (data.payment) {
        setPayments(prev => prev.map(p => p.id === id ? data.payment : p));
        setStats(data.stats);
        showToast(`Action executed: ${data.payment.action} for ${data.payment.customer_name} ($${data.payment.amount})`);
        
        // Update modal if open
        if (activeModalPayment && activeModalPayment.id === id) {
          setActiveModalPayment(data.payment);
        }
      }
    } catch (err) {
      console.error('Error executing action:', err);
    }
  };

  // Run batch AI recovery agent
  const handleRecoverAll = async () => {
    setIsRecovering(true);
    try {
      const res = await fetch('/api/payments/recover-all', { method: 'POST' });
      const data = await res.json();
      if (data.payments) {
        setPayments(data.payments);
        setStats(data.stats);
        showToast(`AI Agent processed ${data.processedCount} payments! Recovered $${data.stats.totalRecovered.toFixed(2)}`);
      }
    } catch (err) {
      console.error('Error in batch recovery:', err);
    } finally {
      setIsRecovering(false);
    }
  };

  // Reset to seed data
  const handleReset = async () => {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.payments) {
        setPayments(data.payments);
        setStats(data.stats);
        setSelectedReason('all');
        setSearchQuery('');
        showToast('Demo dataset reset to initial 30 seed records.');
      }
    } catch (err) {
      console.error('Error resetting data:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center animate-pulse">
          <Bot className="w-6 h-6 text-brand-400" />
        </div>
        <div className="text-sm font-medium text-slate-300">Initializing Recover AI Engine...</div>
      </div>
    );
  }

  const totalAtRisk = stats?.totalAtRisk || 0;
  const totalRecovered = stats?.totalRecovered || 0;
  const totalPending = stats?.totalPending || 0;
  const totalEscalated = stats?.totalEscalated || 0;
  const recoveryRate = stats?.recoveryRate || 0;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-brand-500/30 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div className="flex items-center space-x-2.5 px-4 py-3 bg-slate-900 border border-emerald-500/40 text-white rounded-xl shadow-2xl shadow-emerald-950/50">
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-slate-200">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        stats={stats}
        onRecoverAll={handleRecoverAll}
        onReset={handleReset}
        isRecovering={isRecovering}
      />

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-900/40 to-slate-950 p-6 sm:p-8">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Autonomous Revenue Recovery
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Turn Involuntary Churn into Recovered Revenue
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Recover monitors failed subscription transactions, predicts customer payment behavior, and executes intelligent automated recovery workflows without human friction.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center min-w-[140px]">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Live Status</div>
                <div className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Active Monitoring
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Financial Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Revenue at Risk"
            value={`$${totalAtRisk.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            subtitle="Sum of all 30 monitored failed payments"
            icon={AlertTriangle}
            variant="danger"
            badge="30 Failures"
          />

          <MetricCard
            title="Total Revenue Recovered"
            value={`$${totalRecovered.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            subtitle={`${stats?.recoveredCount || 0} payments successfully captured`}
            icon={DollarSign}
            variant="success"
            badge={`+${recoveryRate}%`}
            progress={recoveryRate}
          />

          <MetricCard
            title="Recovery Efficiency"
            value={`${recoveryRate}%`}
            subtitle={`Target benchmark: > 60%`}
            icon={TrendingUp}
            variant="brand"
            badge={`${stats?.recoveredCount || 0} / ${stats?.totalCount || 30}`}
            progress={recoveryRate}
          />

          <MetricCard
            title="Pending & Escalated"
            value={`$${(totalPending + totalEscalated).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            subtitle={`${stats?.pendingCount || 0} retrying in 3d • ${stats?.escalatedCount || 0} risk escalated`}
            icon={ShieldAlert}
            variant="warning"
            badge={`${(stats?.pendingCount || 0) + (stats?.escalatedCount || 0)} cases`}
          />
        </div>

        {/* Failure Breakdown & AI Policies */}
        <div className="space-y-6">
          <FailureChart
            stats={stats}
            selectedReason={selectedReason}
            onSelectReason={setSelectedReason}
          />

          <AgentRulesBanner />
        </div>

        {/* Payments Data Table */}
        <div className="space-y-4">
          <PaymentTable
            payments={payments}
            stats={stats}
            onExecuteAction={handleExecuteAction}
            onSelectPayment={setActiveModalPayment}
            selectedReason={selectedReason}
            onSelectReason={setSelectedReason}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

      </main>

      {/* Payment Detail & Trace Modal */}
      {activeModalPayment && (
        <PaymentDetailModal
          payment={activeModalPayment}
          onClose={() => setActiveModalPayment(null)}
          onExecuteAction={handleExecuteAction}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Recover AI Revenue Recovery Engine • Designed for SaaS Subscription Involuntary Churn</span>
          <span className="font-mono">Node.js Express + React 18 + Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}
