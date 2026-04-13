# Food Delivery System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Customer can browse restaurants, menus, pricing, and ETA.
2. Customer can place order with address, payment method, and special instructions.
3. Platform manages order lifecycle:
	- CREATED
	- ACCEPTED_BY_RESTAURANT
	- PREPARING
	- READY_FOR_PICKUP
	- PICKED_UP
	- OUT_FOR_DELIVERY
	- DELIVERED
	- CANCELED
4. Assign delivery partner based on proximity and load.
5. Real-time order and courier tracking.
6. Support offers, coupons, and surge delivery fees.
7. Handle refunds/cancellations with policy rules.
8. Support restaurant and driver dashboards.

### 1.2 Non-Functional Requirements

1. Availability:
	- Order and dispatch APIs: 99.95% monthly.
	- Catalog APIs: 99.9% monthly.
2. Latency (p95):
	- Place order: < 280 ms (excluding payment gateway latency).
	- Dispatch decision: < 250 ms.
	- Tracking update fan-out: < 3 seconds.
3. Throughput:
	- Baseline: 2k order writes/sec.
	- Peak meal windows: 15k order writes/sec, 80k reads/sec.
4. Durability:
	- Paid order records and payout data must be durable.
5. Consistency:
	- Strong consistency for order state transitions and assignment ownership.
	- Eventual consistency for search and analytics.

## 2. Architecture Diagram (Textual)

Customer App / Restaurant App / Driver App / Ops Console
-> API Gateway
-> Auth Service
-> Food Platform Services

Food Platform Services -> Catalog Service -> OLTP DB + Cache
Food Platform Services -> Order Service -> OLTP DB
Food Platform Services -> Payment Service -> External Gateway
Food Platform Services -> Dispatch Service -> Geo Index + Rules Engine
Food Platform Services -> Tracking Service -> Stream + Cache
Food Platform Services -> Delivery Service -> OLTP DB
Food Platform Services -> Notification Service -> Queue

Shared:
1. Event bus for order, dispatch, and delivery lifecycle.
2. ETA model service and demand forecasting pipeline.
3. Observability and incident alerting stack.

## 3. Components and Responsibilities

1. Catalog Service
	- Restaurants, menu items, availability windows, pricing snapshots.

2. Order Service
	- Order aggregate and status transitions.

3. Dispatch Service
	- Rider matching and assignment with fallback.

4. Tracking Service
	- Live location ingestion and status broadcasting.

5. Payment and Refund Service
	- Authorize/capture/refund with webhook handling.

6. Delivery Service
	- Rider lifecycle and handoff management.

## 4. Data Design

### 4.1 Storage Choices

1. OLTP DB (PostgreSQL): orders, assignments, payments, entities.
2. Redis: geo lookups, active order snapshots, idempotency records.
3. Kafka/PubSub: event-driven transitions and notifications.
4. Time-series store: location trails and ETA analytics.

### 4.2 Core Entities

1. restaurant(restaurant_id, name, city_id, status, rating)
2. menu_item(item_id, restaurant_id, name, price, availability)
3. customer_order(order_id, customer_id, restaurant_id, status, total_amount, payment_status, created_at)
4. order_item(order_item_id, order_id, item_id, quantity, unit_price)
5. delivery_assignment(assign_id, order_id, partner_id, status, offered_at, accepted_at)
6. delivery_partner(partner_id, status, lat, lon, vehicle_type, rating)
7. order_event(event_id, order_id, event_type, occurred_at, payload)
8. payment(payment_id, order_id, provider_ref, status, amount, idempotency_key)

### 4.3 Indexes and Constraints

1. Unique active assignment per order (partial index).
2. Index customer_order(customer_id, created_at desc).
3. Index delivery_partner(status, updated_at).
4. Unique(payment.idempotency_key).

### 4.4 Race Condition Prevention

1. Assignment claim uses compare-and-set on order assignment state.
2. Order state transitions validated by finite state machine.
3. Idempotency keys for place-order, payment, cancellation, and assign endpoints.
4. Duplicate webhook handling with provider_ref uniqueness constraints.

## 5. API Contracts

### 5.1 Customer Journeys

1. GET /v1/restaurants?lat=...&lon=...&sort=...
2. GET /v1/restaurants/{restaurantId}/menu
3. POST /v1/orders
	- Request: { customerId, restaurantId, items[], addressId, paymentMethod, couponCode?, idempotencyKey }
	- Response: { orderId, status, etaSec }
4. GET /v1/orders/{orderId}

### 5.2 Restaurant and Dispatch

1. POST /v1/orders/{orderId}/accept
2. POST /v1/orders/{orderId}/ready
3. POST /v1/dispatch/assign
	- Internal endpoint to trigger rider selection.

### 5.3 Delivery Tracking

1. POST /v1/partners/{partnerId}/location
2. GET /v1/orders/{orderId}/track

### 5.4 Payments and Refunds

1. POST /v1/payments/webhooks/{provider}
2. POST /v1/orders/{orderId}/cancel
3. POST /v1/orders/{orderId}/refund

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Partition by city/zone for dispatch and partner presence data.
2. Separate read/write services for catalog and orders.
3. Use cache for restaurant/menu and active order snapshots.
4. Async fan-out for notifications and analytics.

### 6.2 Spike Handling

1. Mealtime surge controls with queue-based order admission.
2. Adaptive dispatch radius expansion under low partner supply.
3. Priority lanes for in-flight order updates over non-critical queries.

### 6.3 Reliability Plan

1. Retries with exponential backoff for transient dependencies.
2. Circuit breakers around payment and notification providers.
3. Idempotent mutation APIs and outbox events.
4. Multi-AZ DB/caches and replicated message bus.
5. DR targets: RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. Role-based auth for customer, restaurant, partner, ops.
2. Encryption at rest/in transit.
3. Payment tokenization and webhook signature verification.
4. Address/contact PII minimization and retention controls.
5. Fraud controls for abuse, fake orders, and promo misuse.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, order_id, partner_id, restaurant_id.
2. Metrics:
	- order_placement_success_rate
	- dispatch_latency_ms
	- on_time_delivery_rate
	- cancellation_rate
	- refund_failure_rate
3. Traces:
	- place order -> payment -> restaurant accept -> dispatch -> delivery.
4. SLOs:
	- 99.95% successful order updates.
	- p95 dispatch latency < 250 ms.
	- 99% tracking updates visible within 3 seconds.

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Strong dispatch consistency prevents duplicate assignments but increases contention.
2. Real-time tracking accuracy increases device/network cost.
3. Rich pricing logic improves margins but adds complexity.

### 8.2 Bottlenecks

1. Peak order windows and uneven geographic demand.
2. Payment provider latency.
3. Courier scarcity in high-demand zones.

### 8.3 Future Extensions

1. Batched delivery and route optimization.
2. ML-based prep time and ETA prediction.
3. Subscription/free-delivery plans with dynamic constraints.
4. Voice/assistant ordering channel.
5. Dark kitchen supply orchestration integration.

## Folder Structure

1. prompt.md
2. README.md
3. src/
