const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { store } = require('./recoveryEngine');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all failed payments with decided actions and reasoning
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
      p.id.toLowerCase().includes(q)
    );
  }

  res.json({
    payments,
    stats: store.getStats()
  });
});

// Get statistics summary and breakdown
app.get('/api/stats', (req, res) => {
  res.json(store.getStats());
});

// Simulate executing recovery action on a single payment
app.post('/api/payments/:id/recover', (req, res) => {
  const { id } = req.params;
  const payment = store.executeAction(id);
  if (!payment) {
    return res.status(404).json({ error: `Payment ${id} not found` });
  }
  res.json({
    message: `Recovery action executed for ${payment.customer_name}`,
    payment,
    stats: store.getStats()
  });
});

// Simulate executing recovery actions on all pending failed payments
app.post('/api/payments/recover-all', (req, res) => {
  const result = store.executeAll();
  res.json({
    message: `Autonomously processed ${result.processedCount} payment(s)`,
    processedCount: result.processedCount,
    payments: result.payments,
    stats: result.stats
  });
});

// Reset dataset to initial seed state
app.post('/api/reset', (req, res) => {
  const stats = store.reset();
  res.json({
    message: 'Reset demo data to initial seed state',
    payments: store.getPayments(),
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
