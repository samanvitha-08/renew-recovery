# Recover 💸 — Agentic AI Revenue Recovery Engine

> **Autonomous AI-powered revenue recovery tool for subscription businesses to eliminate involuntary churn from failed payments.**

---

## 📌 Context & Problem Statement

Subscription and SaaS businesses lose **5–10% of total revenue to involuntary churn** — failed recurring payments caused by expired cards, temporary insufficient funds, transient bank network declines, or fraud security flags. 

**Recover** acts as an autonomous AI billing assistant whose single mission is: **"Get this money back."** It continuously analyzes failed transactions, determines the optimal recovery strategy based on root causes and customer relationship history, and automatically executes targeted recovery workflows.

---

## ⚡ Quick Start (Under 2 Minutes)

### Prerequisites
- **Node.js**: v18+ (tested on Node v20/v24)
- **npm**: v9+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/samanvitha-08/renew-recovery.git
cd renew-recovery

# Install root & client dependencies in one command
npm run setup
```

*(Alternatively, run `npm install` in the root and `npm install` inside the `client/` folder).*

### 2. Start the Application
```bash
npm run dev
```

This starts both the **Express backend** and **Vite React frontend** concurrently:
- 🌐 **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
- 🔌 **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🧠 Autonomous Decision Engine Logic

For every failed payment, `decideAction(payment)` classifies the failure and selects the optimal recovery action with human-readable rationale:

| Failure Reason | Autonomous Action | Recovery Workflow & Strategy | Outcome |
| :--- | :--- | :--- | :--- |
| **`expired_card`** | `send_email` | Dispatches personalized email with secure 1-click card update link; honors customer tenure/loyalty. | **Recovered** |
| **`insufficient_funds`** | `retry_later` | Defers retry by 3 days (optimal window aligning with payroll cycles) to avoid customer churn. | **Pending Retry (3d)** |
| **`bank_decline`** | `retry_now` | Triggers immediate intelligent re-attempt with alternate gateway routing to bypass transient network drop. | **Recovered** |
| **`fraud_flag`** | `escalate_human` | Blocks automated retries to prevent dispute/chargeback fees; routes ticket to Compliance & Risk Ops. | **Escalated** |

---

## 📊 Seed Dataset (`data/failed_payments.json`)

The application is pre-seeded with **30 realistic payment records** comprising:
- **`id`**: Unique payment transaction ID (e.g. `pay_001` through `pay_030`)
- **`customer_name`** & **`customer_email`**: Real-world customer profiles
- **`amount`**: Values ranging from \$29.00 to \$1,200.00
- **`currency`**: `"USD"`
- **`failure_reason`**: `expired_card`, `insufficient_funds`, `bank_decline`, `fraud_flag`
- **`date`**: Realistic timestamps
- **`past_successful_payments`**: Historical transaction count showing customer LTV and loyalty

---

## 🛠️ Architecture & Tech Stack

```
renew-recovery/
├── data/
│   └── failed_payments.json       # 30 realistic failed payment seed records
├── server/
│   ├── index.js                   # Express REST API
│   └── recoveryEngine.js          # AI Decision Engine & in-memory state store
├── client/                        # React 18 + Vite + Tailwind CSS dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # App navigation, agent status & batch action triggers
│   │   │   ├── MetricCard.jsx     # Financial KPIs ($ at risk, $ recovered, recovery rate)
│   │   │   ├── FailureChart.jsx   # Interactive Root-Cause Breakdown chart
│   │   │   ├── AgentRulesBanner.jsx # Autonomous policy visualizer
│   │   │   ├── PaymentTable.jsx   # Searchable & filterable payment data table
│   │   │   └── PaymentDetailModal.jsx # AI decision trail & execution payload viewer
│   │   ├── App.jsx                # Main dashboard state & coordination
│   │   └── main.jsx
│   └── vite.config.js             # Vite config with API proxy to localhost:5000
├── test/
│   └── backend.test.js            # Automated backend verification test suite
├── package.json                   # Root package manager & concurrently scripts
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/payments` | Retrieves all payments with AI actions, reasoning, and filters (`?reason=`, `?status=`, `?search=`) |
| `GET` | `/api/stats` | Returns aggregate financial metrics and failure/action breakdowns |
| `POST` | `/api/payments/:id/recover` | Simulates executing the AI recovery action on a single payment |
| `POST` | `/api/payments/recover-all` | Autonomously executes recovery on all pending failed payments |
| `POST` | `/api/reset` | Resets the in-memory dataset back to the initial 30 seed records |

---

## 🧪 Testing

Run the automated backend test suite:
```bash
npm run test:backend
```

Tests verify:
- ✅ Integrity of the 30 seed records
- ✅ Correctness of all 4 decision classification rules
- ✅ Store state mutations, running `$ recovered` totals, and statistical calculations

---

## 🚀 Live Demo Features

- **Live-Updating Financial KPIs**: Real-time revenue at risk vs. recovered revenue with live animated metrics.
- **Root-Cause Breakdown Chart**: Visual distribution showing failure reasons, dollar values, and assigned AI policies. Clickable categories filter the table instantly.
- **Autonomous Recovery Agent ("Run AI Recovery Agent")**: 1-click batch execution demonstrating the agent autonomously fixing failed payments.
- **AI Decision Trail & Audit Logs**: Inspect each payment's reasoning, customer tenure score, and simulated dispatch payloads.
- **Reset Demo Data**: Easily reset data for repeated live presentations.

---

## 📄 License
MIT License
