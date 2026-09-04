const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { decideAction, store } = require('../server/recoveryEngine');
const { authenticate, verifyToken, logout } = require('../server/auth');

console.log('🧪 Starting Backend Verification Tests...');

// Test 1: Seed data validity
const seedDataPath = path.join(__dirname, '..', 'data', 'failed_payments.json');
assert(fs.existsSync(seedDataPath), 'Seed data file exists');
const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
assert.strictEqual(seedData.length, 30, 'Seed data has exactly 30 records');

seedData.forEach((record, idx) => {
  assert(record.id, `Record #${idx} has id`);
  assert(record.customer_name, `Record #${idx} has customer_name`);
  assert(typeof record.amount === 'number' && record.amount > 0, `Record #${idx} has positive amount`);
  assert.strictEqual(record.currency, 'USD', `Record #${idx} has currency USD`);
  assert(['expired_card', 'insufficient_funds', 'bank_decline', 'fraud_flag'].includes(record.failure_reason), `Record #${idx} has valid failure_reason`);
  assert(record.date, `Record #${idx} has date`);
  assert(typeof record.past_successful_payments === 'number', `Record #${idx} has past_successful_payments count`);
});
console.log('✅ Seed data integrity verified (30 valid records with all required fields).');

// Test 2: Decision engine rules & Bank simulation
const testExpired = decideAction({ id: 'pay_001', customer_name: 'Alice', amount: 100, failure_reason: 'expired_card', past_successful_payments: 5 });
assert.strictEqual(testExpired.action, 'send_email', 'expired_card maps to send_email');
assert(testExpired.message.length > 0 && testExpired.reasoning.length > 0, 'has message and reasoning');
assert(testExpired.customer_explanation.includes('expired'), 'has customer-friendly explanation');
assert(testExpired.bank_notification && testExpired.bank_notification.bank_name, 'has issuing bank notification');

const testFunds = decideAction({ id: 'pay_002', customer_name: 'Bob', amount: 50, failure_reason: 'insufficient_funds', past_successful_payments: 2 });
assert.strictEqual(testFunds.action, 'retry_later', 'insufficient_funds maps to retry_later');
assert.strictEqual(testFunds.retryInDays, 3, 'insufficient_funds retries in 3 days');
assert(testFunds.customer_explanation.length > 0, 'has customer explanation for insufficient funds');

const testBank = decideAction({ id: 'pay_003', customer_name: 'Charlie', amount: 200, failure_reason: 'bank_decline', past_successful_payments: 10 });
assert.strictEqual(testBank.action, 'retry_now', 'bank_decline maps to retry_now');

const testFraud = decideAction({ id: 'pay_004', customer_name: 'Dave', amount: 900, failure_reason: 'fraud_flag', past_successful_payments: 0 });
assert.strictEqual(testFraud.action, 'escalate_human', 'fraud_flag maps to escalate_human');
assert(testFraud.risk_signal.length > 0, 'has risk signal explanation');

console.log('✅ Decision engine & bank notification simulation verified.');

// Test 3: Authentication & Roles
const primaryLogin = authenticate('samanvitha@recover.demo', 'Recover@2026');
assert.strictEqual(primaryLogin.success, true, 'Primary login succeeds');
assert.strictEqual(primaryLogin.user.role, 'Admin', 'Primary user has Admin role');

const gmailLogin = authenticate('pasupulasamanvitha@gmail.com', 'Recover@2026');
assert.strictEqual(gmailLogin.success, true, 'Gmail alias login succeeds');
assert.strictEqual(gmailLogin.user.role, 'Admin', 'Gmail alias has Admin role');

const adminLogin = authenticate('admin', 'Recover@2026');
assert.strictEqual(adminLogin.success, true, 'Admin login succeeds');
assert.strictEqual(adminLogin.user.role, 'Admin', 'Admin role assigned');

const opsLogin = authenticate('ops1', 'demo pass');
assert.strictEqual(opsLogin.success, true, 'Ops login succeeds');
assert.strictEqual(opsLogin.user.role, 'Ops', 'Ops role assigned');

const viewerLogin = authenticate('viewer', 'demo pass');
assert.strictEqual(viewerLogin.success, true, 'Viewer login succeeds');
assert.strictEqual(viewerLogin.user.role, 'Viewer', 'Viewer role assigned');

const badLogin = authenticate('admin', 'wrongpass');
assert.strictEqual(badLogin.success, false, 'Invalid credentials rejected');

assert(verifyToken(adminLogin.token), 'Token verification succeeds');
logout(adminLogin.token);
assert.strictEqual(verifyToken(adminLogin.token), null, 'Logout invalidates session');

console.log('✅ Authentication & role permissions verified (Admin, Ops, Viewer).');

// Test 4: Store and Action execution
store.reset();
const initialStats = store.getStats();
assert.strictEqual(initialStats.totalCount, 30);
assert.strictEqual(initialStats.recoveredCount, 0);
assert.strictEqual(initialStats.totalRecovered, 0);
assert(initialStats.totalAtRisk > 0, 'totalAtRisk is calculated');

// Execute single payment
const first = store.getPayments()[0];
const updated = store.executeAction(first.id);
assert(updated.status !== 'failed');
const midStats = store.getStats();
assert(midStats.recoveredCount >= 0);

// Execute all
const allResult = store.executeAll();
const endStats = store.getStats();
assert.strictEqual(endStats.failedCount, 0, 'All payments processed');
assert(endStats.totalRecovered > 0, 'Some payments recovered');
assert(endStats.pendingCount > 0, 'Some payments pending retry');
assert(endStats.escalatedCount > 0, 'Some payments escalated to human');
assert(store.getAuditLogs().length >= 30, 'Audit logs captured');

console.log(`✅ Recovery simulation executed successfully. Total at risk: $${endStats.totalAtRisk}, Total recovered: $${endStats.totalRecovered}, Recovery Rate: ${endStats.recoveryRate}%`);
console.log('🎉 All backend tests passed!');
