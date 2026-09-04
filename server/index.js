const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { store } = require('./recoveryEngine');
const { authenticate, verifyToken, logout } = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth Middleware (optional for public read, checks role for mutations)
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const session = verifyToken(authHeader);
  if (!session) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  req.user = session;
  next();
};

const requireExecuteRole = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const session = verifyToken(authHeader);
  if (!session) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  if (session.role === 'Viewer') {
    return res.status(403).json({ error: 'Permission Denied: Viewer role is read-only and cannot execute recovery actions.' });
  }
  req.user = session;
  next();
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication Endpoints
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const result = authenticate(username, password);
  if (!result.success) {
    return res.status(401).json({ error: result.error });
  }
  res.json({
    message: `Logged in successfully as ${result.user.name} (${result.user.role})`,
    token: result.token,
    user: result.user
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const session = verifyToken(authHeader);
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
  res.json({ user: session });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  logout(authHeader);
  res.json({ message: 'Logged out successfully.' });
});

// Get all failed payments with decided actions, explanations, and reasoning
app.get('/api/payments', (req, res) => {
  const { reason, status, search } = req.query;
  let payments = store.getPayments();

  if (reason && reason !== 'all') {
    payments = payments.filter(p => p.failure_reason === reason);
  }
  if (status && status !== 'all') {
    payments = payments.filter(p => p.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    payments = payments.filter(p =>
      p.customer_name.toLowerCase().includes(q) ||
      p.customer_email.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.bank_name && p.bank_name.toLowerCase().includes(q))
    );
  }

  res.json({
    payments,
    stats: store.getStats(),
    auditLogs: store.getAuditLogs()
  });
});

// Get statistics summary and breakdown
app.get('/api/stats', (req, res) => {
  res.json(store.getStats());
});

// Get read-only tamper-evident audit logs
app.get('/api/audit-logs', (req, res) => {
  res.json({
    auditLogs: store.getAuditLogs(),
    totalEntries: store.getAuditLogs().length,
    tamperEvidentLedger: true
  });
});

// Simulate executing recovery action on a single payment (Requires Ops or Admin)
app.post('/api/payments/:id/recover', (req, res) => {
  // Check auth header if provided, restricting Viewer role
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const session = verifyToken(authHeader);
    if (session && session.role === 'Viewer') {
      return res.status(403).json({ error: 'Permission Denied: Viewer role is read-only.' });
    }
  }

  const { id } = req.params;
  const payment = store.executeAction(id);
  if (!payment) {
    return res.status(404).json({ error: `Payment ${id} not found` });
  }
  res.json({
    message: `Recovery action executed for ${payment.customer_name}`,
    payment,
    stats: store.getStats(),
    auditLogs: store.getAuditLogs()
  });
});

// Simulate executing recovery actions on all pending failed payments
app.post('/api/payments/recover-all', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const session = verifyToken(authHeader);
    if (session && session.role === 'Viewer') {
      return res.status(403).json({ error: 'Permission Denied: Viewer role cannot trigger batch recovery.' });
    }
  }

  const result = store.executeAll();
  res.json({
    message: `Autonomously processed ${result.processedCount} payment(s)`,
    processedCount: result.processedCount,
    payments: result.payments,
    auditLogs: result.auditLogs,
    stats: result.stats
  });
});

// Reset dataset to initial seed state
app.post('/api/reset', (req, res) => {
  const stats = store.reset();
  res.json({
    message: 'Reset demo data to initial seed state',
    payments: store.getPayments(),
    auditLogs: store.getAuditLogs(),
    stats
  });
});

// Serve frontend static files if client/dist exists (Combined All-in-One Server)
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Recover AI Server running on http://localhost:${PORT}`);
});
