# Movie Ticket Booking System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Users can browse movies by city, date, and theater.
2. Users can view showtimes and seat availability in near real time.
3. Users can start a seat hold (temporary lock) for one or more seats.
4. Seat hold expires automatically after a configurable TTL (for example 5 minutes).
5. Users can create an order from a valid hold and proceed to payment.
6. Users can confirm booking after successful payment webhook/callback.
7. System returns booking reference (PNR-like code) and booked seat list.
8. Users can view booking status and ticket details.
9. Admin/ops can create movies, theaters, screens, showtimes, and pricing rules.

### 1.2 Non-Functional Requirements

1. Availability:
	- Booking APIs: 99.95% monthly.
	- Catalog/read APIs: 99.9% monthly.
2. Latency (p95):
	- Catalog reads: < 150 ms.
	- Seat map read: < 200 ms.
	- Hold creation: < 250 ms.
	- Booking confirmation: < 400 ms (excluding payment provider latency).
3. Throughput:
	- Normal: 5k RPS reads, 500 RPS writes.
	- Peak (blockbuster release): 30k RPS reads, 4k RPS writes.
4. Durability:
	- Confirmed bookings must survive region AZ failure.
	- RPO <= 5 minutes, RTO <= 30 minutes for regional disaster.
5. Consistency:
	- Strong consistency for seat allocation per showtime-seat.
	- Eventual consistency acceptable for search/index and analytics.

## 2. Architecture Diagram (Textual)

Client (Web/Mobile)
-> API Gateway
-> Auth Service (JWT/OAuth2)
-> Routing Layer

Routing Layer -> Catalog Service -> Read Replica + Cache (Redis)
Routing Layer -> Inventory Service -> Seat Lock Store (Redis) + Primary SQL
Routing Layer -> Order Service -> Primary SQL
Routing Layer -> Payment Service -> External Payment Gateway
Routing Layer -> Booking Service -> Primary SQL
Routing Layer -> Notification Service -> Message Queue -> Email/SMS Provider

Cross-cutting:
1. Event Bus (Kafka/PubSub) for booking, payment, hold-expiry events.
2. Observability stack (logs, metrics, traces).
3. Background workers for hold expiration, reconciliation, retries.

## 3. Components and Responsibilities

1. API Gateway
	- TLS termination, rate limiting, request auth pass-through.

2. Catalog Service
	- Movies, theaters, showtimes, pricing metadata.
	- Heavy read path with cache-first strategy.

3. Inventory Service
	- Source of truth for seat state transitions: AVAILABLE -> HELD -> BOOKED.
	- Enforces single-writer invariants via transactional updates.

4. Order Service
	- Creates provisional orders from valid holds.
	- Owns order lifecycle: PENDING_PAYMENT, PAID, FAILED, EXPIRED.

5. Payment Service
	- Integrates with external gateways.
	- Idempotent payment intent creation and webhook handling.

6. Booking Service
	- Converts PAID orders to confirmed bookings.
	- Generates booking reference and immutable ticket record.

7. Notification Service
	- Sends booking confirmations asynchronously.

8. Expiry Worker
	- Scans or consumes delayed events to release expired holds.

## 4. Data Design

### 4.1 Storage Choices

1. Primary OLTP DB: PostgreSQL (or MySQL) for transactional integrity.
2. Cache + ephemeral locks: Redis with key TTL.
3. Event stream: Kafka for reliable async workflows.
4. Search/index (optional at scale): OpenSearch/Elastic for rich filtering.

### 4.2 Core Entities

1. movie(movie_id, title, language, genre, duration_min, certificate, status)
2. theater(theater_id, name, city_id, address, timezone)
3. screen(screen_id, theater_id, name, seat_layout_version)
4. showtime(showtime_id, movie_id, screen_id, starts_at, base_price, status)
5. seat(seat_id, screen_id, row_label, seat_number, class_type)
6. seat_inventory(showtime_id, seat_id, state, hold_id, version, updated_at)
7. hold(hold_id, user_id, showtime_id, expires_at, status)
8. hold_item(hold_id, seat_id)
9. order(order_id, user_id, hold_id, amount, currency, status, created_at)
10. payment(payment_id, order_id, provider_ref, status, idempotency_key)
11. booking(booking_id, order_id, showtime_id, booking_code, status)
12. booking_item(booking_id, seat_id, price)

### 4.3 Indexing and Constraints

1. Unique(showtime_id, seat_id) in seat_inventory.
2. Unique(booking_code).
3. Unique(idempotency_key) in payment.
4. Partial index on hold(expires_at) where status = 'ACTIVE'.
5. Foreign keys for all order/payment/booking relations.

### 4.4 Concurrency Control

Use optimistic concurrency in seat_inventory via version column, combined with conditional update:

1. Validate seat state is AVAILABLE.
2. Update to HELD with hold_id and version = version + 1.
3. Commit in a single DB transaction for all selected seats.
4. If any seat update fails, rollback entire hold creation.

This prevents double booking under high contention.

## 5. API Contracts

### 5.1 Browse and Discovery

1. GET /v1/cities/{cityId}/movies?date=YYYY-MM-DD
	- Returns movies and showtime summary.

2. GET /v1/showtimes/{showtimeId}/seats
	- Returns seat map with states: AVAILABLE, HELD, BOOKED.
	- Response contains server_time and hold_ttl_sec.

### 5.2 Seat Hold

1. POST /v1/holds
	- Request: { userId, showtimeId, seatIds[], idempotencyKey }
	- Response: { holdId, expiresAt, amount }
	- Errors: 409 if one or more seats not available.

2. DELETE /v1/holds/{holdId}
	- Manual release before expiry.

### 5.3 Order and Payment

1. POST /v1/orders
	- Request: { holdId, userId, idempotencyKey }
	- Preconditions: hold ACTIVE and not expired.

2. POST /v1/payments/intents
	- Request: { orderId, method, idempotencyKey }
	- Response: provider intent details.

3. POST /v1/payments/webhooks/provider-x
	- Validates signature and transitions order/payment status.

### 5.4 Booking

1. POST /v1/bookings/confirm
	- Request: { orderId, idempotencyKey }
	- Converts PAID order to BOOKED seats transactionally.

2. GET /v1/bookings/{bookingId}
	- Returns booking details and ticket info.

### 5.5 Idempotency Rules

1. All mutating endpoints require Idempotency-Key header or field.
2. Key scope: (tenant, route, user, idempotency_key).
3. Store request hash + response body for replay safety.

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Horizontal stateless scaling for API services.
2. Read-heavy endpoints behind Redis cache and CDN for static metadata.
3. Partitioning strategy:
	- Primary partition key for hot transactional tables: showtime_id.
	- Secondary partitioning by theater/city at very large scale.
4. Async offload for notifications and analytics via event bus.

### 6.2 Traffic Spike Handling

1. Virtual waiting room for extreme spikes.
2. Per-user and per-IP rate limits.
3. Adaptive lock TTL to reduce abandoned inventory during flash demand.
4. Bulkhead isolation between catalog and booking write path.

### 6.3 Reliability Plan

1. Retries:
	- Exponential backoff with jitter for transient failures.
	- No blind retries on non-idempotent operations.
2. Timeout budgets:
	- Upstream call timeouts set per dependency.
3. Circuit breakers for payment and notification integrations.
4. Idempotency for order/payment/booking mutations.
5. Failover:
	- Multi-AZ database deployment with automatic failover.
	- Redis with replication/sentinel or managed equivalent.
6. Disaster recovery:
	- Continuous WAL/binlog shipping.
	- Cross-region replica and periodic restore drills.
	- RPO <= 5m, RTO <= 30m target.

## 7. Security and Observability

### 7.1 Security and Compliance

1. OAuth2/JWT auth, role-based authorization for admin operations.
2. TLS in transit, encryption at rest for databases and backups.
3. PCI scope minimization:
	- Do not store raw card data.
	- Use payment tokenization/provider-hosted fields.
4. Signed webhook validation and nonce/timestamp checks.
5. PII minimization and retention policy.
6. Audit logs for booking lifecycle and admin changes.

### 7.2 Observability

1. Logs:
	- Structured JSON logs with trace_id, user_id (hashed), showtime_id, hold_id, order_id.
2. Metrics:
	- hold_create_success_rate
	- seat_conflict_rate
	- booking_confirm_latency_ms (p50/p95/p99)
	- payment_webhook_failures_total
	- hold_expiry_release_lag_sec
3. Traces:
	- End-to-end trace from hold creation -> payment -> booking confirmation.
4. SLOs:
	- 99.95% successful booking confirmations per 30 days.
	- p95 hold creation latency < 250 ms.
	- < 0.1% double-allocation incidents (target effectively zero with controls).

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Redis lock-first designs are fast but require strict reconciliation with DB source of truth.
2. Strong consistency on seat state reduces throughput relative to eventual models, but is required to prevent overselling.
3. Multi-region active-active booking is complex for strict seat consistency; start single-writer region per showtime.

### 8.2 Bottlenecks

1. Hot showtime rows/seats during blockbuster drops.
2. Payment gateway latency/outages.
3. Large fan-out updates for seat map polling.

### 8.3 Future Evolution

1. Move seat updates to push model with WebSockets/SSE to reduce polling.
2. Add dynamic pricing and promotion engine with rule evaluation cache.
3. Introduce event sourcing for booking lifecycle auditability.
4. Add fraud/risk scoring before payment capture.
5. Support geo-distributed read replicas and city-level shard routing.

## Folder Structure

1. prompt.md
2. README.md
3. src/
