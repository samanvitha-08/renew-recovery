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
  ShieldAlert, 
  TrendingUp,
  Sparkles,
  Bot,
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
      <div className="min-h-screen bg-creme-100 flex flex-col items-center justify-center text-sand-800 space-y-4">
        <div className="w-14 h-14 rounded-3xl bg-dustypink-100 border border-dustypink-300 flex items-center justify-center animate-pulse shadow-soft">
          <Bot className="w-7 h-7 text-burgundy-700" />
        </div>
        <div className="text-base font-bold text-burgundy-950 font-serif-luxury">Initializing Recover AI Engine...</div>
      </div>
    );
  }

  const totalAtRisk = stats?.totalAtRisk || 0;
  const totalRecovered = stats?.totalRecovered || 0;
  const totalPending = stats?.totalPending || 0;
  const totalEscalated = stats?.totalEscalated || 0;
  const recoveryRate = stats?.recoveryRate || 0;

  return (
    <div className="min-h-screen bg-creme-100 text-burgundy-950 flex flex-col selection:bg-dustypink-200 selection:text-burgundy-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div className="flex items-center space-x-3 px-5 py-3.5 bg-burgundy-950 border border-dustypink-400 text-creme-50 rounded-2xl shadow-soft-xl shadow-burgundy-950/40">
            <div className="p-1.5 rounded-full bg-dustypink-300/20 text-dustypink-200">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">{toastMessage}</span>
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
        <div className="relative overflow-hidden rounded-3xl border border-sand-300/80 bg-gradient-to-br from-creme-50 via-sand-50/90 to-dustypink-50/70 p-7 sm:p-9 shadow-soft-lg">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-dustypink-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-sand-200/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dustypink-100 text-burgundy-800 border border-dustypink-300 text-xs font-bold font-sans">
                <Sparkles className="w-3.5 h-3.5 text-burgundy-600" />
                Autonomous Revenue Recovery
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury tracking-tight text-burgundy-950 leading-tight">
                Turn Involuntary Churn into Recovered Revenue
              </h2>
              <p className="text-sm text-sand-800 leading-relaxed font-medium">
                Recover monitors failed subscription transactions, predicts customer payment behavior, and executes intelligent automated recovery workflows with precision.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="p-5 rounded-2xl bg-white/80 border border-sand-300/80 text-center min-w-[150px] shadow-sm">
                <div className="text-[11px] uppercase tracking-wider text-sand-700 font-bold">System Status</div>
                <div className="text-sm font-bold text-burgundy-800 flex items-center justify-center gap-2 mt-1.5 font-serif-luxury">
                  <span className="w-2.5 h-2.5 rounded-full bg-burgundy-600 animate-pulse"></span>
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
            subtitle={`${stats?.pendingCount || 0} retrying in 3d • ${stats?.escalatedCount || 0} escalated`}
            icon={ShieldAlert}
            variant="default"
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
      <footer className="mt-auto border-t border-sand-300/80 bg-creme-50/70 py-6 text-xs text-sand-700 text-center font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Recover AI Revenue Recovery Engine • Built with Creme, Sand, Dusty Pink & Burgundy</span>
          <span className="font-serif-luxury font-bold text-burgundy-900">Node.js Express + React 18</span>
        </div>
      </footer>
    </div>
  );
}
