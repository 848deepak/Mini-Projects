# Digital Wallet System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. User wallet account creation and KYC status management.
2. Cash-in/top-up via cards, UPI, bank transfer, or partner rails.
3. Peer-to-peer transfers between wallet users.
4. Merchant payments via wallet balance.
5. Transaction history with status and failure reasons.
6. Balance inquiry with pending and available balance separation.
7. Refund and reversal handling.
8. Risk controls: velocity limits, daily transfer caps, suspicious pattern checks.
9. Dispute flow for failed debit/credit reconciliation.

### 1.2 Non-Functional Requirements

1. Availability:
	- Ledger and transfer APIs: 99.99% monthly.
	- Reporting APIs: 99.9% monthly.
2. Latency (p95):
	- Balance read: < 120 ms.
	- Transfer initiation: < 180 ms.
	- Payment authorization: < 220 ms.
3. Throughput:
	- Baseline: 3k TPS.
	- Peak campaign/festival: 25k TPS.
4. Durability:
	- Ledger entries must be append-only and strongly durable.
5. Consistency:
	- Strong consistency for balance-affecting operations.
	- Eventual consistency acceptable for analytics dashboards.

## 2. Architecture Diagram (Textual)

Mobile App / Merchant SDK / Admin Console
-> API Gateway
-> Auth and Device Trust Service
-> Wallet API Layer

Wallet API Layer -> Account Service -> OLTP DB
Wallet API Layer -> Ledger Service -> Ledger DB (append-only)
Wallet API Layer -> Transfer Service -> OLTP DB + Ledger Service
Wallet API Layer -> Payment Orchestration Service -> External Payment Rails
Wallet API Layer -> Risk Service -> Rules Engine + Feature Store
Wallet API Layer -> Notification Service -> Queue -> SMS/Push/Email

Shared:
1. Event bus for transaction lifecycle events.
2. Reconciliation workers for external rails.
3. Observability stack and immutable audit logs.

## 3. Components and Responsibilities

1. Account Service
	- Wallet profile, KYC state, limits, and status controls.

2. Ledger Service
	- Double-entry accounting.
	- Guarantees debit-credit parity per transaction.

3. Transfer Service
	- P2P and merchant transfer orchestration.
	- Validates limits, risk signals, and ledger posting.

4. Payment Orchestration Service
	- Top-up and external rail interactions.
	- Handles webhooks, retries, and reconciliation.

5. Risk Service
	- Velocity checks, rule-based risk scoring, and holds.

6. Reconciliation Service
	- Compares internal ledger vs provider settlement files.

## 4. Data Design

### 4.1 Storage Choices

1. OLTP DB (MySQL 8.0): wallet account state and transfer metadata.
2. Ledger store (MySQL append-only journal table): durable ledger entries.
3. Redis cache: balance snapshots and idempotency key cache.
4. Event bus: transaction events for notifications and analytics.
5. Warehouse: reporting and compliance exports.

### 4.2 Core Entities

1. wallet_account(wallet_id, user_id, kyc_level, status, currency, created_at)
2. wallet_limit(wallet_id, daily_send_limit, daily_receive_limit, txn_limit)
3. ledger_entry(entry_id, txn_id, wallet_id, entry_type, amount, currency, created_at)
4. wallet_txn(txn_id, txn_type, from_wallet_id, to_wallet_id, merchant_id, amount, currency, status, created_at)
5. topup_request(topup_id, wallet_id, provider, amount, status, provider_ref, created_at)
6. merchant(merchant_id, name, mcc, settlement_account, status)
7. idempotency_record(scope, idempotency_key, request_hash, response_hash, created_at)
8. reconciliation_record(rec_id, provider, date, mismatch_count, status)

### 4.3 Indexes and Constraints

1. Unique(scope, idempotency_key).
2. Index wallet_txn(from_wallet_id, created_at desc).
3. Index wallet_txn(to_wallet_id, created_at desc).
4. Check constraint amount > 0.
5. Ledger invariant: sum(debits) == sum(credits) per txn_id.

### 4.4 Race Condition Prevention

1. Balance updates are not done as mutable counters alone; they derive from ledger entries or atomic snapshot + ledger transaction.
2. For high performance, maintain balance_snapshot table updated in same transaction as ledger posting.
3. Use row-level lock on wallet rows for same-wallet concurrent debit contention.
4. Enforce insufficient funds check inside transaction boundary.

## 5. API Contracts

### 5.1 Wallet and Balance

1. GET /v1/wallets/{walletId}/balance
	- Response: { available, pending, currency, asOf }

2. GET /v1/wallets/{walletId}/transactions?cursor=...

### 5.2 Top-up

1. POST /v1/topups
	- Request: { walletId, amount, method, provider, idempotencyKey }
	- Response: { topupId, status, redirectOrIntentData }

2. POST /v1/topups/webhooks/{provider}
	- Validates signature and posts ledger credit on success.

### 5.3 P2P Transfer

1. POST /v1/transfers/p2p
	- Request: { fromWalletId, toWalletId, amount, currency, note, idempotencyKey }
	- Response: { txnId, status }
	- Errors: 409 insufficient funds / limit exceeded.

### 5.4 Merchant Payment

1. POST /v1/payments/merchant
	- Request: { walletId, merchantId, amount, currency, orderRef, idempotencyKey }
	- Response: { txnId, authStatus }

2. POST /v1/payments/{txnId}/refund
	- Partial and full refund support with policy checks.

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Partition wallet and transaction tables by wallet_id hash + time for large scale.
2. Separate read path for statements/reporting from write path for transfers.
3. Cache balance reads with strict invalidation on ledger post.
4. Asynchronous non-critical side effects (notifications, analytics).

### 6.2 Spike Handling

1. Rate limiting by user/device/merchant.
2. Priority lanes for debit/credit posting over reporting traffic.
3. Queue buffering for provider callbacks under burst conditions.

### 6.3 Reliability Plan

1. Retries with backoff on external rail failures.
2. Idempotency on all money movement APIs.
3. Outbox pattern for reliable event publication.
4. Multi-AZ DB and replicated message bus.
5. DR:
	- PITR and cross-region backup replication.
	- RPO <= 1 minute for ledger data, RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. Strong auth with device binding and step-up MFA for risky payments.
2. Encryption in transit and at rest for all sensitive data.
3. Tokenization for external payment instruments.
4. Tamper-evident audit logs for ledger and admin actions.
5. Compliance alignment for KYC/AML requirements.
6. Suspicious activity monitoring and sanctions screening hooks.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, txn_id, wallet_id, risk_decision_id.
2. Metrics:
	- transfer_success_rate
	- insufficient_funds_rate
	- payment_auth_latency_ms
	- reconciliation_mismatch_count
	- duplicate_request_rate
3. Traces:
	- transfer request -> risk check -> ledger post -> notification.
4. SLOs:
	- 99.99% successful ledger post operations.
	- p95 transfer initiation latency < 180 ms.
	- reconciliation mismatch ratio < 0.01% daily.

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Strict transactional controls improve correctness but limit peak throughput.
2. Real-time risk checks improve safety but add latency.
3. Multi-rail support improves resilience but increases integration complexity.

### 8.2 Bottlenecks

1. Hot wallets (high-frequency merchants) causing lock contention.
2. External payment rail latency and callback delays.
3. End-of-day reconciliation spikes.

### 8.3 Future Extensions

1. Offline payments with risk-limited deferred settlement.
2. Smart routing across payment rails by success rate and cost.
3. Loyalty points as parallel ledger.
4. Real-time FX support for multi-currency wallets.
5. Merchant lending using wallet cashflow history.

## Folder Structure

1. prompt.md
2. README.md
3. src/
4. pom.xml
5. docker-compose.yml

## Reference Implementation (Spring Boot)

Tech stack used in this project:

1. Java 17+
2. Spring Boot 3.x
3. Maven
4. MySQL 8.0
5. Redis
6. RabbitMQ

### Implemented APIs

1. POST /v1/wallets
2. GET /v1/wallets/{walletId}/balance
3. POST /v1/transfers/p2p

### Frontend Console

This project now includes a production-ready web console served by Spring Boot from `src/main/resources/static`.

1. Open `http://localhost:8080` after starting the app.
2. Use the console to:
	- create wallets,
	- fetch wallet balances,
	- initiate P2P transfers with generated idempotency keys.

The frontend calls the backend APIs on the same origin (`/v1/*`) and includes:

1. responsive layout for desktop/mobile,
2. API health indicator,
3. client-side UUID validation and error surfacing,
4. toast notifications and activity timeline,
5. loading states for all actions.

### Run Locally

1. Start dependencies:

```bash
docker compose up -d
```

2. Build app:

```bash
./mvnw clean package
```

If Maven Wrapper is not present, use:

```bash
mvn clean package
```

3. Run app:

```bash
./mvnw spring-boot:run
```

or

```bash
mvn spring-boot:run
```

### Notes

1. Balance reads use Redis cache with short TTL and explicit invalidation after transfers.
2. P2P transfer uses row-level locking and transactional ledger writes to avoid race conditions.
3. RabbitMQ publishes transaction-created events for downstream notifications.
