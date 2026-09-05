import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import FailureChart from './components/FailureChart';
import PaymentTable from './components/PaymentTable';
import PaymentDetailModal from './components/PaymentDetailModal';
import AuditLogModal from './components/AuditLogModal';
import CustomerPortalModal from './components/CustomerPortalModal';
import WorkerProfileModal from './components/WorkerProfileModal';
import LoginScreen from './components/LoginScreen';
import { 
  AlertTriangle, 
  DollarSign, 
  CheckCircle2, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles,
  Bot,
  Check,
  Lock,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Application Data State
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRecovering, setIsRecovering] = useState(false);
  const [selectedReason, setSelectedReason] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Sidebar State
  const [activeModalPayment, setActiveModalPayment] = useState(null);
  const [customerViewPayment, setCustomerViewPayment] = useState(null);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // ~30-Second Processing Map: { [paymentId]: { progress: number, secondsRemaining: number } }
  const [processingMap, setProcessingMap] = useState({});
  const intervalsRef = useRef({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('recover_auth_token');
    const savedUser = localStorage.getItem('recover_auth_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('recover_auth_token');
        localStorage.removeItem('recover_auth_user');
      }
    }
    setAuthChecked(true);
  }, []);

  const handleLoginSuccess = (userData, sessionToken) => {
    setUser(userData);
    setToken(sessionToken);
    localStorage.setItem('recover_auth_token', sessionToken);
    localStorage.setItem('recover_auth_user', JSON.stringify(userData));
    showToast(`Welcome back, ${userData.name}! Logged in as ${userData.role}.`);
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('recover_auth_token');
      localStorage.removeItem('recover_auth_user');
      showToast('Logged out successfully.');
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/payments', { headers });
      const data = await res.json();
      setPayments(data.payments || []);
      setStats(data.stats || null);
      setAuditLogs(data.auditLogs || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      fetchData();
    }
  }, [user, token, fetchData]);

  // Execute recovery for a single payment with 30-Second Processing Simulation
  const handleExecuteAction = (id) => {
    if (user?.role === 'Viewer') {
      showToast('Permission Denied: Viewer role is read-only.');
      return;
    }

    const target = payments.find(p => p.id === id);
    if (!target || target.status !== 'failed' || target.failure_reason === 'fraud_flag') {
      return;
    }

    if (processingMap[id]) return; // already in flight

    const TOTAL_SECONDS = 30;
    let currentSeconds = TOTAL_SECONDS;

    // Initialize processing state
    setProcessingMap(prev => ({
      ...prev,
      [id]: { progress: 0, secondsRemaining: TOTAL_SECONDS }
    }));

    showToast(`Processing recovery for ${target.customer_name} (~30s gateway handshake)...`);

    // 1-second interval ticking down for 30s
    const interval = setInterval(async () => {
      currentSeconds -= 1;
      const progressPercent = Math.round(((TOTAL_SECONDS - currentSeconds) / TOTAL_SECONDS) * 100);

      if (currentSeconds > 0) {
        setProcessingMap(prev => ({
          ...prev,
          [id]: { progress: progressPercent, secondsRemaining: currentSeconds }
        }));
      } else {
        // 30 seconds completed -> Resolve to backend
        clearInterval(interval);
        delete intervalsRef.current[id];

        setProcessingMap(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });

        try {
          const headers = { 
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          };
          const res = await fetch(`/api/payments/${id}/recover`, { method: 'POST', headers });
          const data = await res.json();
          if (data.payment) {
            setPayments(prev => prev.map(p => p.id === id ? data.payment : p));
            setStats(data.stats);
            if (data.auditLogs) setAuditLogs(data.auditLogs);
            
            showToast(`✅ ${data.payment.action === 'retry_later' ? 'Scheduled retry in 3 days' : 'Successfully recovered $' + data.payment.amount.toFixed(2)} for ${data.payment.customer_name}!`);
            
            // Update modal if open
            if (activeModalPayment && activeModalPayment.id === id) {
              setActiveModalPayment(data.payment);
            }
          }
        } catch (err) {
          showToast('Error finalizing recovery transaction.');
        }
      }
    }, 1000);

    intervalsRef.current[id] = interval;
  };

  // Run batch AI recovery agent with staggered realistic queue processing
  const handleRecoverAll = async () => {
    if (user?.role === 'Viewer') {
      showToast('Permission Denied: Viewer role cannot trigger batch recovery.');
      return;
    }

    setIsRecovering(true);
    showToast('Autonomous AI Recovery Agent initiated: Analyzing 30 payment signals...');

    try {
      // Step 1: Simulate telemetry analysis
      await new Promise(r => setTimeout(r, 1800));
      showToast('Step 1/3: Bank telemetry verified with issuing networks...');

      // Step 2: Simulate dispatching routing retries
      await new Promise(r => setTimeout(r, 2000));
      showToast('Step 2/3: Dispatched 1-click update links & scheduled smart retries...');

      // Step 3: Finalize batch execution on backend
      const headers = { 
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const res = await fetch('/api/payments/recover-all', { method: 'POST', headers });
      const data = await res.json();
      
      if (data.payments) {
        setPayments(data.payments);
        setStats(data.stats);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        showToast(`🎉 AI Agent completed recovery! Recovered $${data.stats.totalRecovered.toFixed(2)} across ${data.processedCount} transactions.`);
      }
    } catch (err) {
      showToast('Error running autonomous batch recovery.');
    } finally {
      setIsRecovering(false);
    }
  };

  // Reset to seed data
  const handleReset = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/reset', { method: 'POST', headers });
      const data = await res.json();
      if (data.payments) {
        setPayments(data.payments);
        setStats(data.stats);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        setSelectedReason('all');
        setSearchQuery('');
        setProcessingMap({});
        showToast('Demo dataset reset to initial 30 seed records.');
      }
    } catch (err) {
      showToast('Error resetting demo dataset.');
    }
  };

  // Clean up any running intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []);

  // 1. If auth not checked yet, show quick loader
  if (!authChecked) {
    return null;
  }

  // 2. Gate entire dashboard behind LoginScreen
  if (!user || !token) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

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
    <div className="min-h-screen bg-creme-100 text-burgundy-950 flex selection:bg-dustypink-200 selection:text-burgundy-950">
      
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

      {/* Navigation Sidebar */}
      <Sidebar
        user={user}
        stats={stats}
        isRecovering={isRecovering}
        onRecoverAll={handleRecoverAll}
        onReset={handleReset}
        onOpenAuditLog={() => setIsAuditLogOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Navigation Header */}
        <Header
          stats={stats}
          onRecoverAll={handleRecoverAll}
          onReset={handleReset}
          isRecovering={isRecovering}
          onOpenAuditLog={() => setIsAuditLogOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          user={user}
          onLogout={handleLogout}
          onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
        />

        {/* Main Dashboard Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Hero Section Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-sand-300/80 bg-gradient-to-br from-creme-50 via-sand-50/90 to-dustypink-50/70 p-7 sm:p-9 shadow-soft-lg">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-dustypink-200/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-sand-200/50 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-3xl space-y-2.5">
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

          {/* Failure Breakdown */}
          <div className="space-y-6">
            <FailureChart
              stats={stats}
              selectedReason={selectedReason}
              onSelectReason={setSelectedReason}
            />
          </div>

          {/* Payments Data Table */}
          <div className="space-y-4">
            <PaymentTable
              payments={payments}
              stats={stats}
              onExecuteAction={handleExecuteAction}
              onSelectPayment={setActiveModalPayment}
              onOpenCustomerView={setCustomerViewPayment}
              selectedReason={selectedReason}
              onSelectReason={setSelectedReason}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenAuditLog={() => setIsAuditLogOpen(true)}
              processingMap={processingMap}
              userRole={user?.role || 'Admin'}
            />
          </div>

        </main>

        {/* Clean Minimal Footer */}
        <footer className="mt-auto border-t border-sand-300/80 bg-creme-50/70 py-6 text-xs text-sand-700 font-medium">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <span className="font-serif-luxury font-bold text-sm text-burgundy-950">Recover</span>
              <span className="mx-2 text-sand-400">•</span>
              <span className="text-sand-700">Autonomous Revenue Recovery for Payment Platforms</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Payment Detail & Trace Modal */}
      {activeModalPayment && (
        <PaymentDetailModal
          payment={activeModalPayment}
          onClose={() => setActiveModalPayment(null)}
          onExecuteAction={handleExecuteAction}
          onOpenCustomerView={setCustomerViewPayment}
          isProcessing={!!processingMap[activeModalPayment.id]}
          userRole={user?.role || 'Admin'}
        />
      )}

      {/* Customer Portal Preview Modal */}
      {customerViewPayment && (
        <CustomerPortalModal
          payment={customerViewPayment}
          onClose={() => setCustomerViewPayment(null)}
          onSimulateCustomerUpdate={handleExecuteAction}
        />
      )}

      {/* Security Audit Log Modal */}
      {isAuditLogOpen && (
        <AuditLogModal
          logs={auditLogs}
          onClose={() => setIsAuditLogOpen(false)}
        />
      )}

      {/* Worker Profile & Performance Modal */}
      {isProfileOpen && (
        <WorkerProfileModal
          user={user}
          onClose={() => setIsProfileOpen(false)}
          payments={payments}
          auditLogs={auditLogs}
        />
      )}

    </div>
  );
}
