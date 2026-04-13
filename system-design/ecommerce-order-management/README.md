# Ecommerce Order Management System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Create order from checkout cart with pricing snapshot.
2. Reserve inventory at checkout and finalize on payment success.
3. Support split shipments across multiple warehouses.
4. Orchestrate order lifecycle:
	- CREATED
	- PAYMENT_PENDING
	- PAID
	- PACKING
	- SHIPPED
	- DELIVERED
	- CANCELED
	- RETURN_REQUESTED
	- RETURNED
	- REFUNDED
5. Handle cancellations, partial returns, and refunds.
6. Track shipment status and delivery events.
7. Expose customer order history and support tooling.
8. Generate invoices and tax-compliant order records.

### 1.2 Non-Functional Requirements

1. Availability:
	- Order write APIs: 99.95% monthly.
	- Order read APIs: 99.9% monthly.
2. Latency (p95):
	- Place order: < 300 ms excluding payment provider time.
	- Order detail fetch: < 180 ms.
3. Throughput:
	- Baseline: 1k order writes/sec, 8k reads/sec.
	- Peak sale: 10k writes/sec, 80k reads/sec.
4. Durability:
	- Paid orders and invoices must be durable and recoverable.
5. Consistency:
	- Strong consistency for order status and inventory reservation.
	- Eventual consistency allowed for analytics and search.

## 2. Architecture Diagram (Textual)

Web/Mobile Client
-> API Gateway
-> Auth Service
-> Order API

Order API -> Order Service -> OLTP DB
Order API -> Inventory Service -> OLTP DB + Redis
Order API -> Payment Orchestrator -> Payment Gateway
Order API -> Fulfillment Service -> WMS/Shipping Integrations
Order API -> Returns Service -> OLTP DB
Order API -> Notification Service -> Queue -> Email/SMS

Shared:
1. Event bus for order and shipment domain events.
2. Search index for customer support/order lookup.
3. Warehouse and finance exports.

## 3. Components and Responsibilities

1. Order Service
	- Owns order aggregate and status machine.

2. Inventory Service
	- Atomic reserve/confirm/release stock operations.

3. Payment Orchestrator
	- Payment intent creation, webhook validation, settlement status.

4. Fulfillment Service
	- Warehouse allocation, pick-pack-ship workflows.

5. Returns Service
	- Return approval, pickup/drop, refund workflow.

6. Notification Service
	- State-change notifications and customer communication.

## 4. Data Design

### 4.1 Storage Choices

1. OLTP DB (PostgreSQL): orders, items, statuses, returns, refunds.
2. Redis: short-lived inventory reservation tokens and hot reads.
3. Kafka/PubSub: order events and async processing.
4. Search index: fast by order number/email/phone.
5. Object store: invoice PDFs and return evidence.

### 4.2 Core Entities

1. order(order_id, customer_id, order_no, status, currency, subtotal, tax, shipping_fee, discount, total, created_at)
2. order_item(order_item_id, order_id, sku, quantity, unit_price, tax, discount)
3. order_status_history(hist_id, order_id, from_status, to_status, reason, changed_at)
4. inventory_reservation(res_id, order_id, sku, warehouse_id, qty, status, expires_at)
5. payment(payment_id, order_id, provider, provider_ref, status, amount, idempotency_key)
6. shipment(shipment_id, order_id, carrier, tracking_no, status, shipped_at, delivered_at)
7. return_request(return_id, order_id, order_item_id, qty, reason_code, status, created_at)
8. refund(refund_id, return_id, amount, status, provider_ref, created_at)

### 4.3 Indexes and Constraints

1. Unique(order_no).
2. Unique(payment.idempotency_key).
3. Index order(customer_id, created_at desc).
4. Index shipment(tracking_no).
5. Check quantity > 0 and monetary fields >= 0.

### 4.4 Concurrency Control

1. Inventory reservation uses conditional update on available stock.
2. Status transitions validated through finite-state rules.
3. Idempotency keys for place-order, payment, cancel, return operations.
4. Outbox table ensures reliable event publication after DB commit.

## 5. API Contracts

### 5.1 Order Placement

1. POST /v1/orders
	- Request: { customerId, items[], addresses, paymentMethod, idempotencyKey }
	- Response: { orderId, orderNo, status, paymentIntent }

2. GET /v1/orders/{orderId}

3. GET /v1/orders?customerId=...&cursor=...

### 5.2 Payment and Confirmation

1. POST /v1/payments/webhooks/{provider}
	- Updates payment and order status.

2. POST /v1/orders/{orderId}/cancel
	- Request: { reason, idempotencyKey }

### 5.3 Fulfillment and Tracking

1. POST /v1/orders/{orderId}/shipments
	- Internal service endpoint for warehouse actions.

2. GET /v1/orders/{orderId}/shipments

### 5.4 Returns and Refunds

1. POST /v1/returns
	- Request: { orderId, items[], reason, idempotencyKey }

2. POST /v1/returns/{returnId}/refund

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Partition orders by creation month + hash(order_id).
2. Use read replicas for order history and support lookup traffic.
3. Async processing for non-critical post-order tasks.
4. Cache immutable pricing snapshots and product metadata references.

### 6.2 Handling Spikes

1. Queue admission at checkout during flash sale bursts.
2. Backpressure on downstream integrations (carrier/payment).
3. Prioritize paid-order processing over report generation.

### 6.3 Reliability Plan

1. Retries with jitter for transient provider failures.
2. Dead-letter queues for failed async consumers.
3. Saga pattern for multi-step order workflows.
4. Multi-AZ DB, replicated queue, and stateless service autoscaling.
5. DR:
	- PITR backups + cross-region copies.
	- Target RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. AuthN/AuthZ with role and tenant scoping.
2. PII encryption and data minimization.
3. PCI scope reduction by tokenized payment handling.
4. Signed webhook verification and replay protection.
5. Immutable audit logs for order/payment/refund actions.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, order_id, payment_id, customer_id hash.
2. Metrics:
	- order_create_success_rate
	- inventory_reservation_conflict_rate
	- order_to_ship_time_sec
	- return_rate
	- refund_failure_rate
3. Traces:
	- checkout -> order create -> payment callback -> fulfillment.
4. SLOs:
	- 99.95% successful order creation.
	- p95 order read latency < 180 ms.
	- 99% payment webhook processing within 5 seconds.

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Strict reservation consistency lowers oversell risk but increases lock contention.
2. Rich orchestration improves resilience but raises workflow complexity.
3. Search index improves support UX with eventual consistency lag.

### 8.2 Bottlenecks

1. Inventory hotspots on limited-stock SKUs.
2. Third-party carrier and payment latency.
3. Return spikes after major sales events.

### 8.3 Future Extensions

1. Multi-seller marketplace order splitting and escrow.
2. Intelligent fulfillment routing by cost and SLA.
3. Returns fraud scoring.
4. Event-driven customer self-service automation.
5. Carbon-aware shipping option recommendation.

## Folder Structure

1. prompt.md
2. README.md
3. src/
