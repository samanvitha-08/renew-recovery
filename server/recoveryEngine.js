const fs = require('fs');
const path = require('path');

const SEED_DATA_PATH = path.join(__dirname, '..', 'data', 'failed_payments.json');

const MOCK_ISSUING_BANKS = [
  'JPMorgan Chase Bank, N.A.',
  'Citibank, N.A.',
  'Bank of America, N.A.',
  'Wells Fargo Bank, N.A.',
  'Barclays Bank UK PLC',
  'Capital One, N.A.',
  'HSBC Bank USA, N.A.',
  'TD Bank, N.A.'
];

function getIssuingBank(id, cardLast4) {
  const safeId = id || 'pay_default';
  const digits = (cardLast4 || '').replace(/\D/g, '');
  const num = digits.length > 0 ? parseInt(digits, 10) : 4242;
  const hash = safeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + num;
  return MOCK_ISSUING_BANKS[Math.abs(hash) % MOCK_ISSUING_BANKS.length];
}

/**
 * Intelligent Action Decision Engine for Revenue Recovery
 * @param {Object} payment - Failed payment record
 * @returns {Object} action decision details
 */
function decideAction(payment) {
  const reason = payment.failure_reason;
  const history = payment.past_successful_payments || 0;
  const amount = payment.amount || 0;
  const name = payment.customer_name || 'Valued Customer';
  const last4 = payment.card_last4 || '••••';
  const bankName = payment.bank_name || getIssuingBank(payment.id, last4);
  const paymentDate = payment.date || new Date().toISOString();

  // Plain customer-facing explanations & simulated bank notifications
  let customerExplanation = '';
  let customerNextStep = '';

  switch (reason) {
    case 'expired_card': {
      customerExplanation = `Your card was declined because it has expired. ${bankName} requires updated expiration and CVV details to process this payment.`;
      customerNextStep = 'Please update your card payment details via our secure link to avoid interruption to your subscription.';
      const loyaltyDesc = history > 10 ? `high-LTV customer (${history} successful payments)` : `customer with ${history} past payments`;
      return {
        action: 'send_email',
        message: `Hi ${name}, your $${amount.toFixed(2)} payment failed due to an expired card ending in ${last4}. Please update your billing details to maintain uninterrupted access.`,
        reasoning: `Card expired. Customer is a ${loyaltyDesc}. Autonomous email dispatched with secure 1-click update link.`,
        customer_explanation: customerExplanation,
        customer_next_step: customerNextStep,
        bank_name: bankName,
        bank_notification: {
          bank_name: bankName,
          status: 'Notified',
          event: 'Decline reason and card update request registered',
          reference_id: `BNK-DECL-EXP-${(payment.id || '00').toUpperCase()}`,
          notified_at: paymentDate
        },
        risk_signal: null,
        retryInDays: null,
        simulatedOutcome: 'recovered', // customer receives email and updates card
        recoveryProbability: 0.92
      };
    }

    case 'insufficient_funds': {
      customerExplanation = `Your payment of $${amount.toFixed(2)} could not be processed due to a temporary balance constraint reported by ${bankName}.`;
      customerNextStep = `No manual action required. An automated smart retry is scheduled in 3 days aligned with typical banking settlement cycles.`;
      return {
        action: 'retry_later',
        message: `Temporary insufficient balance detected for $${amount.toFixed(2)}. Automated retry scheduled in 3 days.`,
        reasoning: `Insufficient funds flagged. Immediate retry causes churn; AI scheduled intelligent retry in 3 days aligned with typical pay cycle (${history} historical payments).`,
        customer_explanation: customerExplanation,
        customer_next_step: customerNextStep,
        bank_name: bankName,
        bank_notification: {
          bank_name: bankName,
          status: 'Notified',
          event: `Decline reason registered with ${bankName}; 72h retry window reserved`,
          reference_id: `BNK-DECL-NSF-${(payment.id || '00').toUpperCase()}`,
          notified_at: paymentDate
        },
        risk_signal: null,
        retryInDays: 3,
        simulatedOutcome: 'pending', // scheduled for later
        recoveryProbability: 0.78
      };
    }

    case 'bank_decline': {
      customerExplanation = `Your issuing bank (${bankName}) returned a temporary network decline or rate limit during transaction processing.`;
      customerNextStep = `Our autonomous gateway routing system has queued an instant smart re-attempt using optimized network routing.`;
      return {
        action: 'retry_now',
        message: `Instant retry executed for $${amount.toFixed(2)} with optimized gateway routing.`,
        reasoning: `Transient issuer/network decline detected. Executed immediate smart retry with alternative routing to resolve soft decline.`,
        customer_explanation: customerExplanation,
        customer_next_step: customerNextStep,
        bank_name: bankName,
        bank_notification: {
          bank_name: bankName,
          status: 'Notified',
          event: `Network decline telemetry transmitted to ${bankName}; alternative routing active`,
          reference_id: `BNK-DECL-NET-${(payment.id || '00').toUpperCase()}`,
          notified_at: paymentDate
        },
        risk_signal: null,
        retryInDays: 0,
        simulatedOutcome: 'recovered', // soft decline resolved upon instant re-attempt
        recoveryProbability: 0.85
      };
    }

    case 'fraud_flag': {
      const riskSignal = history === 0
        ? "New account, zero payment history, high transaction amount relative to plan tier"
        : "Unusual velocity, geographic mismatch with card issuer network";
      customerExplanation = `Your transaction was flagged by automated security protocols at ${bankName} and our risk engine for additional identity verification.`;
      customerNextStep = `Our compliance and fraud team has been notified. Automated charges have been halted to protect your account security.`;
      return {
        action: 'escalate_human',
        message: `Risk flag raised for $${amount.toFixed(2)}. Automated retries blocked. Escalated to Fraud & Compliance team.`,
        reasoning: `High risk score (${history === 0 ? 'new account with zero past payments' : 'abnormal velocity'}). Automated recovery halted to avoid chargeback penalties and merchant dispute fees.`,
        customer_explanation: customerExplanation,
        customer_next_step: customerNextStep,
        bank_name: bankName,
        bank_notification: {
          bank_name: bankName,
          status: 'Notified',
          event: `Suspicious activity lock reported to ${bankName} fraud prevention network`,
          reference_id: `BNK-RISK-FLG-${(payment.id || '00').toUpperCase()}`,
          notified_at: paymentDate
        },
        risk_signal: riskSignal,
        retryInDays: null,
        simulatedOutcome: 'escalated', // requires manual inspection
        recoveryProbability: 0.0
      };
    }

    default:
      return {
        action: 'escalate_human',
        message: `Unclassified payment failure for $${amount.toFixed(2)}.`,
        reasoning: `Unknown failure reason '${reason}'. Escalated for manual review.`,
        customer_explanation: `Your payment could not be processed. Please check with ${bankName} or contact support.`,
        customer_next_step: `Escalated to our support specialists for manual resolution.`,
        bank_name: bankName,
        bank_notification: {
          bank_name: bankName,
          status: 'Notified',
          event: `Decline record sent to ${bankName}`,
          reference_id: `BNK-GEN-${(payment.id || '00').toUpperCase()}`,
          notified_at: paymentDate
        },
        risk_signal: "Unclassified transaction pattern",
        retryInDays: null,
        simulatedOutcome: 'escalated',
        recoveryProbability: 0.0
      };
  }
}

class RecoveryStore {
  constructor() {
    this.payments = [];
    this.auditLogs = [];
    this.loadSeedData();
  }

  loadSeedData() {
    try {
      const raw = fs.readFileSync(SEED_DATA_PATH, 'utf-8');
      const seed = JSON.parse(raw);
      this.auditLogs = [];
      
      this.payments = seed.map(item => {
        const bankName = getIssuingBank(item.id, item.card_last4);
        const decision = decideAction({ ...item, bank_name: bankName });
        
        // Initial ingest audit log entry
        this.auditLogs.push({
          id: `log_init_${item.id}`,
          paymentId: item.id,
          timestamp: item.date || new Date().toISOString(),
          customer: item.customer_name,
          customer_email: item.customer_email,
          amount: item.amount,
          action: decision.action,
          actionLabel: decision.action === 'send_email' ? 'Card Update Email Dispatched' :
                       decision.action === 'retry_later' ? 'Smart Retry Scheduled (3d)' :
                       decision.action === 'retry_now' ? 'Instant Network Retry Evaluated' : 'Fraud Escalation Ticket Opened',
          outcome: 'Initial Detection',
          outcomeStatus: 'detected',
          bank_name: bankName,
          reasoning: decision.reasoning,
          immutableHash: Buffer.from(`${item.id}:${item.amount}:${decision.action}`).toString('base64').substring(0, 12)
        });

        return {
          ...item,
          bank_name: bankName,
          status: 'failed', // failed | recovered | pending | escalated
          action: decision.action,
          message: decision.message,
          reasoning: decision.reasoning,
          customer_explanation: decision.customer_explanation,
          customer_next_step: decision.customer_next_step,
          bank_notification: decision.bank_notification,
          risk_signal: decision.risk_signal,
          retryInDays: decision.retryInDays,
          simulatedOutcome: decision.simulatedOutcome,
          recoveryProbability: decision.recoveryProbability,
          action_executed_at: null,
          execution_log: null
        };
      });
      console.log(`Loaded ${this.payments.length} payment records into memory.`);
    } catch (err) {
      console.error('Error loading seed data:', err);
      this.payments = [];
      this.auditLogs = [];
    }
  }

  getPayments() {
    return this.payments;
  }

  getPaymentById(id) {
    return this.payments.find(p => p.id === id);
  }

  getAuditLogs() {
    return this.auditLogs;
  }

  executeAction(id) {
    const payment = this.getPaymentById(id);
    if (!payment) {
      return null;
    }

    if (payment.status !== 'failed') {
      return payment; // already processed
    }

    const now = new Date().toISOString();
    payment.action_executed_at = now;

    let outcomeText = '';
    let outcomeStatus = '';

    if (payment.action === 'send_email') {
      payment.status = 'recovered';
      payment.execution_log = `[${now}] Sent card update email to ${payment.customer_email}. Customer updated card via secure portal. $${payment.amount} successfully captured.`;
      outcomeText = `Recovered ($${payment.amount.toFixed(2)}) via Secure Card Update`;
      outcomeStatus = 'recovered';
    } else if (payment.action === 'retry_now') {
      payment.status = 'recovered';
      payment.execution_log = `[${now}] Executed instant network retry via secondary gateway. Bank approval received from ${payment.bank_name}. $${payment.amount} recovered.`;
      outcomeText = `Recovered ($${payment.amount.toFixed(2)}) via Instant Gateway Retry`;
      outcomeStatus = 'recovered';
    } else if (payment.action === 'retry_later') {
      payment.status = 'pending';
      payment.execution_log = `[${now}] Smart retry scheduled for 3 days from now (${new Date(Date.now() + 3*86400000).toLocaleDateString()}). Notification queued with ${payment.bank_name}.`;
      outcomeText = `Pending Retry in 3 Days`;
      outcomeStatus = 'pending';
    } else if (payment.action === 'escalate_human') {
      payment.status = 'escalated';
      payment.execution_log = `[${now}] Automated recovery halted. Support ticket #RISK-${payment.id.toUpperCase()} generated and assigned to Compliance Ops.`;
      outcomeText = `Escalated to Compliance (Human Review Ticket Created)`;
      outcomeStatus = 'escalated';
    }

    // Append tamper-evident audit log record
    this.auditLogs.unshift({
      id: `log_exec_${payment.id}_${Date.now()}`,
      paymentId: payment.id,
      timestamp: now,
      customer: payment.customer_name,
      customer_email: payment.customer_email,
      amount: payment.amount,
      action: payment.action,
      actionLabel: payment.action === 'send_email' ? 'Card Update Link Sent' :
                   payment.action === 'retry_later' ? 'Smart Retry Deferred (+3d)' :
                   payment.action === 'retry_now' ? 'Instant Gateway Retry' : 'Compliance Escalation Ticket',
      outcome: outcomeText,
      outcomeStatus: outcomeStatus,
      bank_name: payment.bank_name,
      reasoning: payment.reasoning,
      immutableHash: Buffer.from(`${payment.id}:${now}:${outcomeStatus}`).toString('base64').substring(0, 12)
    });

    return payment;
  }

  executeAll() {
    const results = [];
    for (const payment of this.payments) {
      if (payment.status === 'failed') {
        const updated = this.executeAction(payment.id);
        results.push(updated);
      }
    }
    return {
      processedCount: results.length,
      payments: this.payments,
      auditLogs: this.auditLogs,
      stats: this.getStats()
    };
  }

  getStats() {
    const totalAtRisk = this.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const recoveredPayments = this.payments.filter(p => p.status === 'recovered');
    const totalRecovered = recoveredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingPayments = this.payments.filter(p => p.status === 'pending');
    const totalPending = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const escalatedPayments = this.payments.filter(p => p.status === 'escalated');
    const totalEscalated = escalatedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const failedPayments = this.payments.filter(p => p.status === 'failed');
    const totalFailed = failedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const breakdownByReason = {};
    const breakdownByAction = {};
    const breakdownByStatus = {
      failed: { count: failedPayments.length, amount: totalFailed },
      recovered: { count: recoveredPayments.length, amount: totalRecovered },
      pending: { count: pendingPayments.length, amount: totalPending },
      escalated: { count: escalatedPayments.length, amount: totalEscalated }
    };

    for (const p of this.payments) {
      // Reason breakdown
      if (!breakdownByReason[p.failure_reason]) {
        breakdownByReason[p.failure_reason] = { count: 0, amount: 0, recoveredCount: 0, recoveredAmount: 0 };
      }
      breakdownByReason[p.failure_reason].count += 1;
      breakdownByReason[p.failure_reason].amount += p.amount;
      if (p.status === 'recovered') {
        breakdownByReason[p.failure_reason].recoveredCount += 1;
        breakdownByReason[p.failure_reason].recoveredAmount += p.amount;
      }

      // Action breakdown
      if (!breakdownByAction[p.action]) {
        breakdownByAction[p.action] = { count: 0, amount: 0 };
      }
      breakdownByAction[p.action].count += 1;
      breakdownByAction[p.action].amount += p.amount;
    }

    const recoveryRate = totalAtRisk > 0 ? (totalRecovered / totalAtRisk) * 100 : 0;

    return {
      totalAtRisk,
      totalRecovered,
      totalPending,
      totalEscalated,
      totalFailed,
      recoveryRate: Number(recoveryRate.toFixed(1)),
      totalCount: this.payments.length,
      recoveredCount: recoveredPayments.length,
      pendingCount: pendingPayments.length,
      escalatedCount: escalatedPayments.length,
      failedCount: failedPayments.length,
      breakdownByReason,
      breakdownByAction,
      breakdownByStatus
    };
  }

  reset() {
    this.loadSeedData();
    return this.getStats();
  }
}

const store = new RecoveryStore();

module.exports = {
  decideAction,
  store,
  getIssuingBank
};
