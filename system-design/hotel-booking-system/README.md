# Hotel Booking System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Search hotels by city, dates, guests, amenities, and rating.
2. Display room types, rates, availability, taxes, and cancellation terms.
3. Reserve room inventory with temporary hold.
4. Confirm booking after payment authorization.
5. Support modify/cancel booking with policy rules.
6. Support promotions, packages, and loyalty pricing.
7. Manage hotel inventory, blackout dates, and rate plans.
8. Support overbooking controls and reconciliation.
9. Provide guest booking history and hotel ops dashboards.

### 1.2 Non-Functional Requirements

1. Availability:
	- Search and booking APIs: 99.95% monthly.
	- Inventory management APIs: 99.9% monthly.
2. Latency (p95):
	- Search results: < 200 ms.
	- Hold creation: < 250 ms.
	- Booking confirmation: < 350 ms excluding payment gateway time.
3. Throughput:
	- Baseline: 1.5k writes/sec, 10k reads/sec.
	- Peak travel season: 8k writes/sec, 60k reads/sec.
4. Durability:
	- Confirmed bookings and invoices must be durably stored.
5. Consistency:
	- Strong consistency for inventory reservation and booking state.
	- Eventual consistency acceptable for search and recommendations.

## 2. Architecture Diagram (Textual)

Web/Mobile App / Hotel Ops Console / Channel Manager
-> API Gateway
-> Auth Service
-> Hotel Booking Core

Hotel Booking Core -> Search Service -> Search Index + Cache
Hotel Booking Core -> Inventory Service -> OLTP DB + Redis Hold Store
Hotel Booking Core -> Pricing Service -> Rules Engine + Cache
Hotel Booking Core -> Booking Service -> OLTP DB
Hotel Booking Core -> Payment Service -> External Gateway
Hotel Booking Core -> Cancellation Service -> OLTP DB
Hotel Booking Core -> Notification Service -> Queue

Shared:
1. Event bus for booking, cancellation, and inventory sync events.
2. Batch jobs for rate refresh and reconciliation.
3. Observability and audit logs.

## 3. Components and Responsibilities

1. Search Service
	- Hotel discovery, filtering, ranking, and availability snippets.

2. Inventory Service
	- Room type availability, hold, confirm, and release logic.

3. Pricing Service
	- Rate plans, taxes, promotions, and dynamic pricing.

4. Booking Service
	- Booking lifecycle and guest allocation.

5. Cancellation Service
	- Policy evaluation and refund orchestration.

6. Sync Service
	- Channel manager updates and hotel system reconciliation.

## 4. Data Design

### 4.1 Storage Choices

1. OLTP DB (PostgreSQL): bookings, room inventory, rate plans, cancellation rules.
2. Redis: short-lived holds and hot availability lookups.
3. Search index: hotel and room search.
4. Event bus: inventory sync and downstream notifications.
5. Object store: invoices and policy documents.

### 4.2 Core Entities

1. hotel(hotel_id, name, city_id, star_rating, status)
2. room_type(room_type_id, hotel_id, name, max_guests, bed_config)
3. rate_plan(rate_plan_id, room_type_id, name, base_price, currency, cancellation_policy_id)
4. room_inventory(inventory_id, hotel_id, room_type_id, stay_date, available_qty, held_qty, sold_qty, version)
5. hold(hold_id, user_id, hotel_id, room_type_id, check_in, check_out, qty, expires_at, status)
6. booking(booking_id, user_id, hotel_id, status, total_amount, taxes, created_at)
7. booking_item(item_id, booking_id, room_type_id, rate_plan_id, qty, stay_date_range)
8. cancellation_policy(policy_id, name, refund_percent, cutoff_hours)
9. payment(payment_id, booking_id, provider_ref, status, amount, idempotency_key)
10. reconciliation_record(record_id, hotel_id, date_range, status, mismatch_count)

### 4.3 Indexes and Constraints

1. Unique(booking_idempotency scope, idempotency key) on payment and booking writes.
2. Index room_inventory(hotel_id, room_type_id, stay_date).
3. Index booking(user_id, created_at desc).
4. Version column for inventory optimistic locking.

### 4.4 Concurrency and Race Prevention

1. Availability decremented atomically in transaction while creating hold.
2. Booking confirmation re-validates hold and inventory state.
3. Channel sync writes use versioned updates to avoid stale overwrites.
4. Idempotency keys on search-irrelevant mutations: hold, booking, cancel, refund.

## 5. API Contracts

### 5.1 Search and Discovery

1. GET /v1/hotels?city=...&checkIn=...&checkOut=...&guests=...&filters=...
2. GET /v1/hotels/{hotelId}
3. GET /v1/hotels/{hotelId}/availability?checkIn=...&checkOut=...

### 5.2 Hold and Booking

1. POST /v1/holds
	- Request: { hotelId, roomTypeId, checkIn, checkOut, qty, userId, idempotencyKey }
	- Response: { holdId, expiresAt, amount }

2. POST /v1/bookings
	- Request: { holdId, guestDetails, paymentMethod, idempotencyKey }
	- Response: { bookingId, status, confirmationNo }

3. GET /v1/bookings/{bookingId}

### 5.3 Cancellation and Refunds

1. POST /v1/bookings/{bookingId}/cancel
	- Request: { reason, idempotencyKey }
	- Response: { status, refundAmount }

2. POST /v1/refunds/{refundId}/retry

### 5.4 Ops and Sync

1. POST /v1/hotels/{hotelId}/inventory/sync
2. POST /v1/hotels/{hotelId}/rates/sync

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Partition inventory by hotel_id and stay_date to localize hot rows.
2. Search index for read-heavy discovery traffic.
3. Cache hotel pages and availability snapshots briefly.
4. Async sync jobs for channel manager updates.

### 6.2 Spike Handling

1. Virtual waiting room for flash promotions.
2. Rate limiting on hold and booking endpoints.
3. Separate search cluster from transactional inventory cluster.

### 6.3 Reliability Plan

1. Retries with jitter for payment and sync failures.
2. Idempotent mutation APIs.
3. Outbox pattern for domain events.
4. Multi-AZ database, cache replication, and queue durability.
5. DR:
	- PITR backups and cross-region copies.
	- RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. RBAC for guest, hotel staff, and platform admin.
2. Encryption at rest/in transit.
3. PCI-safe payment tokenization.
4. Audit logs for rate and inventory changes.
5. Secure cancellation/refund policy enforcement.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, hotel_id, booking_id, hold_id.
2. Metrics:
	- search_latency_ms
	- hold_success_rate
	- booking_conversion_rate
	- cancellation_rate
	- refund_failure_rate
3. Traces:
	- search -> hold -> payment -> booking -> cancellation.
4. SLOs:
	- 99.95% booking mutation availability.
	- p95 search latency < 200 ms.
	- 99% booking confirmations < 350 ms excluding payment provider time.

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Strong inventory consistency reduces oversell risk but increases lock contention.
2. Rich rate rules improve monetization but increase pricing complexity.
3. Cache-heavy search improves UX but can show slightly stale availability.

### 8.2 Bottlenecks

1. Peak-season searches and hold spikes.
2. Inventory sync delays with channel managers.
3. Payment provider latency during high-demand periods.

### 8.3 Future Extensions

1. Loyalty tier pricing and member-only inventory.
2. Multi-property booking and bundled itineraries.
3. AI-based rate optimization.
4. Group booking and corporate travel support.
5. Offline hotel POS reconciliation.

## Folder Structure

1. prompt.md
2. README.md
3. src/
