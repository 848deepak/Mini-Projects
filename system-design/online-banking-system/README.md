# Online Banking System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Customer account onboarding and profile management.
2. View balances, statements, and transaction history.
3. Transfer funds between own accounts and external beneficiaries.
4. Support bill payments, standing instructions, and scheduled transfers.
5. Track transaction status and reversal/refund handling.
6. Manage beneficiaries, cards, and account limits.
7. Support fraud/risk review and step-up authentication.
8. Provide bank-admin and audit capabilities.

### 1.2 Non-Functional Requirements

1. Availability:
	- Transaction and transfer APIs: 99.99% monthly.
	- Read-only banking APIs: 99.95% monthly.
2. Latency (p95):
	- Balance read: < 100 ms.
	- Transfer initiation: < 180 ms.
	- Statement fetch: < 200 ms.
3. Throughput:
	- Baseline: 2k TPS.
	- Peak salary/payday: 20k TPS.
4. Durability:
	- Ledger entries must be append-only and durable.
5. Consistency:
	- Strong consistency for all money movement and balance mutations.
	- Eventual consistency allowed for statements and analytics.

## 2. Architecture Diagram (Textual)

Customer Web/Mobile App / Branch Admin / Ops Console
-> API Gateway
-> IAM + MFA Service
-> Banking Core Services

Banking Core Services -> Account Service -> OLTP DB
Banking Core Services -> Ledger Service -> Ledger DB
Banking Core Services -> Transfer Service -> OLTP DB + Ledger Service
Banking Core Services -> Payments Service -> External Rails
Banking Core Services -> Risk Service -> Rules Engine + Feature Store
Banking Core Services -> Notification Service -> Queue

Shared:
1. Event bus for account, transfer, and statement events.
2. Reconciliation jobs.
3. Audit and observability stack.

## 3. Components and Responsibilities

1. Account Service
	- Customer accounts, beneficiary management, limits.

2. Ledger Service
	- Double-entry ledger and immutable accounting history.

3. Transfer Service
	- Orchestrates internal/external transfers and scheduled payments.

4. Payments Service
	- Bill payments, card payments, external banking rails.

5. Risk Service
	- Fraud scoring, velocity checks, step-up auth triggers.

6. Reconciliation Service
	- Matches core ledger to external provider statements.

## 4. Data Design

### 4.1 Storage Choices

1. OLTP DB (PostgreSQL): accounts, beneficiaries, scheduling, user state.
2. Ledger DB (append-only relational schema): transaction journal.
3. Redis: idempotency and hot balance cache.
4. Event bus: notifications and analytics.
5. Warehouse: regulatory and finance reporting.

### 4.2 Core Entities

1. customer(customer_id, kyc_status, status, created_at)
2. bank_account(account_id, customer_id, account_type, currency, status, opened_at)
3. ledger_entry(entry_id, txn_id, account_id, entry_type, amount, currency, balance_after, created_at)
4. banking_txn(txn_id, txn_type, from_account_id, to_account_id, amount, currency, status, idempotency_key, created_at)
5. beneficiary(beneficiary_id, customer_id, name, bank_code, account_number, status)
6. scheduled_payment(schedule_id, customer_id, beneficiary_id, amount, frequency, next_run_at, status)
7. statement(statement_id, account_id, period_start, period_end, uri)
8. risk_decision(decision_id, txn_id, score, action, created_at)

### 4.3 Indexes and Constraints

1. Unique(idempotency_key) per mutating endpoint scope.
2. Index ledger_entry(account_id, created_at desc).
3. Index banking_txn(from_account_id, created_at desc).
4. Check amount > 0 and currency consistency.

### 4.4 Concurrency and Race Prevention

1. Mutations run in a DB transaction with row-level lock on source account.
2. Ledger and balance snapshot updated atomically.
3. Scheduled payments use advisory lock per schedule_id.
4. Idempotency required for all transfer/payment endpoints.

## 5. API Contracts

### 5.1 Account and Balance

1. GET /v1/accounts/{accountId}/balance
2. GET /v1/accounts/{accountId}/transactions?cursor=...
3. GET /v1/accounts/{accountId}/statement?period=...

### 5.2 Transfers and Payments

1. POST /v1/transfers
	- Request: { fromAccountId, toAccountId, amount, currency, purpose, idempotencyKey }
	- Response: { txnId, status }

2. POST /v1/payments/bill
3. POST /v1/scheduled-payments
4. POST /v1/beneficiaries

### 5.3 Risk and Admin

1. POST /v1/admin/txns/{txnId}/hold
2. POST /v1/admin/txns/{txnId}/release

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Partition by account_id hash for ledger and balance tables.
2. Cache read-only balance snapshots with strict invalidation.
3. Separate reporting from transactional workload.
4. Batch statement generation and reconciliation off the hot path.

### 6.2 Spike Handling

1. Payday traffic protected by admission control and queueing.
2. Priority for balance and transfer APIs over statement/reporting.
3. Rate limiting per customer/device/IP.

### 6.3 Reliability Plan

1. Retries only for transient external payment failures.
2. Strong idempotency on money movement.
3. Outbox pattern for events and notifications.
4. Multi-AZ database and replicated message bus.
5. DR:
	- PITR and cross-region backups.
	- RPO <= 1 minute for ledger, RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. MFA/step-up authentication for sensitive actions.
2. Encryption at rest/in transit.
3. Audit trail for every money movement and admin action.
4. Data minimization and retention policies.
5. Compliance hooks for banking regulations and fraud monitoring.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, account_id, txn_id, risk_decision_id.
2. Metrics:
	- transfer_latency_ms
	- insufficient_funds_rate
	- ledger_post_success_rate
	- reconciliation_mismatch_count
	- fraud_hold_rate
3. Traces:
	- transfer request -> risk check -> ledger post -> notification.
4. SLOs:
	- 99.99% successful money movement operations.
	- p95 transfer latency < 180 ms.
	- 99.9% balance reads < 100 ms.

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Strong transactional correctness reduces throughput but is required for banking.
2. Risk checks improve safety but add latency.
3. Ledger-first design simplifies auditability but increases write amplification.

### 8.2 Bottlenecks

1. Hot accounts on salary day.
2. External banking rail latency.
3. Statement generation and reconciliation spikes.

### 8.3 Future Extensions

1. Real-time fraud graph detection.
2. Open banking APIs and account aggregation.
3. Multi-currency wallets and FX transfer flows.
4. Smart cashflow insights and alerts.
5. Self-service dispute and chargeback workflows.

## Folder Structure

1. prompt.md
2. README.md
3. src/
