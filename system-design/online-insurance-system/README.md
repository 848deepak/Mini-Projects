# Online Insurance System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Quote insurance products based on user risk profile and coverage needs.
2. Issue policies with underwriting checks and payment collection.
3. Manage renewals, endorsements, and cancellations.
4. Support claims submission, triage, assessment, and settlement.
5. Track policy lifecycle and premium schedules.
6. Integrate with underwriting, KYC, and external claims adjusters.
7. Provide agent/admin dashboards and customer portal.

### 1.2 Non-Functional Requirements

1. Availability:
	- Policy and claims APIs: 99.95% monthly.
	- Quote/read APIs: 99.9% monthly.
2. Latency (p95):
	- Quote generation: < 250 ms excluding third-party risk checks.
	- Claims intake: < 200 ms.
3. Throughput:
	- Baseline: 1k RPS.
	- Peak renewal campaigns: 10k RPS.
4. Durability:
	- Policy records, claims, and payment records must be durable and auditable.
5. Consistency:
	- Strong consistency for policy issuance and claim state.
	- Eventual consistency acceptable for analytics and search.

## 2. Architecture Diagram (Textual)

Customer Portal / Agent Portal / Underwriter Console
-> API Gateway
-> Auth Service
-> Insurance Platform Services

Insurance Platform Services -> Product Catalog Service -> OLTP DB + Cache
Insurance Platform Services -> Quote Engine -> Rules Engine + Feature Store
Insurance Platform Services -> Policy Service -> OLTP DB
Insurance Platform Services -> Claims Service -> OLTP DB + Document Store
Insurance Platform Services -> Billing Service -> Payment Gateway
Insurance Platform Services -> Renewal Service -> Queue + Scheduler
Insurance Platform Services -> Notification Service -> Queue

Shared:
1. Event bus for policy, claim, and billing events.
2. Document processing pipeline for claims evidence.
3. Observability and audit trail stack.

## 3. Components and Responsibilities

1. Product Catalog Service
	- Insurance products, coverages, endorsements, plan eligibility.

2. Quote Engine
	- Pricing, risk-based premium, discounts, taxes, and deductibles.

3. Policy Service
	- Policy issuance, endorsements, renewal state, cancellation state.

4. Claims Service
	- Claims intake, triage, adjudication, settlement.

5. Billing Service
	- Premium collection, refunds, installment schedules.

6. Renewal Service
	- Renewal reminders, eligibility refresh, auto-renew orchestration.

## 4. Data Design

### 4.1 Storage Choices

1. OLTP DB (PostgreSQL): policies, quotes, billing, claim workflow.
2. Document store/object storage: claim attachments and evidence.
3. Redis: quote cache and session/risk lookup cache.
4. Event bus: renewal and claim processing.
5. Warehouse: actuarial and operational analytics.

### 4.2 Core Entities

1. customer(customer_id, profile_json, kyc_status, created_at)
2. product(product_id, name, line_of_business, status)
3. quote(quote_id, customer_id, product_id, premium, coverage_json, risk_score, expires_at, status)
4. policy(policy_id, policy_no, customer_id, product_id, status, start_at, end_at, premium, deductible)
5. policy_coverage(coverage_id, policy_id, coverage_type, limit_amount, sublimit_amount)
6. endorsement(endorsement_id, policy_id, type, delta_premium, status)
7. claim(claim_id, policy_id, claim_no, status, incident_date, reported_at, reserve_amount)
8. claim_document(doc_id, claim_id, uri, doc_type, checksum)
9. billing_invoice(invoice_id, policy_id, amount, due_at, status)
10. payment(payment_id, invoice_id, provider_ref, status, idempotency_key)

### 4.3 Indexes and Constraints

1. Unique(policy_no), unique(claim_no), unique(quote_idempotency scope).
2. Index policy(customer_id, end_at).
3. Index claim(policy_id, reported_at desc).
4. Version field for policy and claim state transitions.

### 4.4 Concurrency and Race Prevention

1. Policy issuance and claim state updates executed with transactional status guards.
2. Renewal and cancellation mutually exclusive via version checks.
3. Idempotency keys required for quote bind, policy issue, claim submit, and payment.
4. Document ingestion uses immutable URIs and claim-scoped ownership.

## 5. API Contracts

### 5.1 Quotes and Policies

1. POST /v1/quotes
	- Request: { customerId, productId, coverageSelection, riskData, idempotencyKey }
	- Response: { quoteId, premium, expiresAt }

2. POST /v1/policies
	- Request: { quoteId, paymentMethod, idempotencyKey }
	- Response: { policyId, policyNo, status }

3. GET /v1/policies/{policyId}
4. POST /v1/policies/{policyId}/endorsements

### 5.2 Claims

1. POST /v1/claims
	- Request: { policyId, incidentDate, description, documents[], idempotencyKey }
	- Response: { claimId, claimNo, status }

2. POST /v1/claims/{claimId}/triage
3. POST /v1/claims/{claimId}/settle
4. POST /v1/claims/{claimId}/reject

### 5.3 Renewals and Billing

1. GET /v1/policies/{policyId}/renewal-quote
2. POST /v1/policies/{policyId}/renew
3. POST /v1/invoices/{invoiceId}/pay

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Partition by policy_id/customer_id for transactional tables.
2. Offload quote caching and eligibility lookups.
3. Async claim document processing and triage queues.
4. Read replicas for reporting and underwriter dashboards.

### 6.2 Spike Handling

1. Renewal campaign traffic smoothed via queueing and scheduled jobs.
2. Backpressure on claim document uploads.
3. Rate limiting on quote generation to protect underwriting integrations.

### 6.3 Reliability Plan

1. Retries with bounded attempts for external risk, payment, and adjuster calls.
2. Idempotent mutation APIs across policy/claim/payment flows.
3. Outbox pattern for downstream notifications and analytics.
4. Multi-AZ DB and replicated queue/object storage.
5. DR:
	- PITR backups and cross-region copies.
	- RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. Strong auth with RBAC for customer, agent, underwriter, admin roles.
2. Encryption at rest/in transit.
3. PII protection and masked document access.
4. Audit logs for policy changes, claims, and payment actions.
5. Compliance-ready retention and legal-hold mechanisms.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, policy_id, claim_id, quote_id.
2. Metrics:
	- quote_latency_ms
	- policy_issue_success_rate
	- claim_intake_latency_ms
	- renewal_conversion_rate
	- payment_failure_rate
3. Traces:
	- quote -> bind -> policy issue -> billing -> claim.
4. SLOs:
	- 99.95% successful policy issuance/claims API operations.
	- p95 quote latency < 250 ms.
	- 99% claims intake < 200 ms.

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Strong workflow validation improves correctness but increases orchestration overhead.
2. Document-heavy claims improve auditability but increase storage and indexing cost.
3. Cached quote eligibility improves UX but can slightly lag underwriting updates.

### 8.2 Bottlenecks

1. Renewal bursts and campaign traffic.
2. Third-party underwriting/risk provider delays.
3. Large claim evidence uploads and OCR processing.

### 8.3 Future Extensions

1. AI-assisted claims triage and fraud scoring.
2. Usage-based and telematics pricing models.
3. Multi-product policy bundling.
4. Embedded insurance APIs for partners.
5. Self-service document extraction and status estimation.

## Folder Structure

1. prompt.md
2. README.md
3. src/
