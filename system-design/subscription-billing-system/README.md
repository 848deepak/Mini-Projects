# Subscription Billing System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Create plans and pricing tiers.
2. Manage subscriptions, upgrades, downgrades, and cancellations.
3. Generate invoices with proration and taxes.
4. Retry failed payments and manage dunning flows.
5. Support coupons, trial periods, and metered usage.
6. Provide billing history and exportable invoices.

### 1.2 Non-Functional Requirements

1. Availability: 99.95% billing APIs.
2. Latency (p95): invoice preview < 200 ms, subscription change < 250 ms.
3. Throughput: baseline 2k RPS, peak billing cycle 15k RPS.
4. Durability: invoices, payment state, and usage records must persist.

## 2. Architecture Diagram (Textual)

Client Apps / Admin Console
-> API Gateway
-> Billing Core Services

Billing Core Services -> Catalog Service -> OLTP DB
Billing Core Services -> Subscription Service -> OLTP DB
Billing Core Services -> Invoicing Service -> OLTP DB + Ledger DB
Billing Core Services -> Payment Orchestrator -> Payment Gateway
Billing Core Services -> Usage Metering -> Stream + Warehouse
Billing Core Services -> Dunning Service -> Queue

## 3. Components and Responsibilities

1. Catalog Service: plans, add-ons, discounts, taxes.
2. Subscription Service: lifecycle and entitlement management.
3. Invoicing Service: invoice generation and proration.
4. Payment Orchestrator: charge attempts and retries.
5. Usage Metering: event aggregation for metered billing.
6. Dunning Service: retry schedule and customer notifications.

## 4. Data Design

1. plan(plan_id, name, price, billing_cycle, status)
2. subscription(subscription_id, customer_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end)
3. invoice(invoice_id, subscription_id, total_amount, due_at, status)
4. invoice_line(line_id, invoice_id, type, amount, metadata_json)
5. payment_attempt(attempt_id, invoice_id, provider_ref, status, idempotency_key)
6. usage_event(event_id, customer_id, metric, quantity, occurred_at)
7. entitlement(entitlement_id, subscription_id, feature_key, status)

Use OLTP DB, ledger tables, and stream processing for usage.

## 5. API Contracts

1. POST /v1/plans
2. POST /v1/subscriptions
3. PATCH /v1/subscriptions/{subscriptionId}
4. GET /v1/invoices/{invoiceId}
5. POST /v1/invoices/{invoiceId}/pay

## 6. Scalability and Reliability

1. Partition by customer_id/subscription_id.
2. Use idempotent billing operations and outbox events.
3. Retry failed payments with bounded dunning schedule.
4. RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

1. PCI-safe payment handling, RBAC for admin operations.
2. Metrics: invoice generation latency, payment success rate, churn, retry rate.
3. SLOs: 99.95% billing API availability, p95 invoice preview < 200 ms.

## 8. Trade-offs and Extensions

1. Strict ledgering increases correctness but adds complexity.
2. Metered billing requires robust event aggregation.
3. Future: usage-based pricing, multi-currency, revenue recognition.

