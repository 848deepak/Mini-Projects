# Event Booking System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Create and publish events with venue, date, ticket tiers, and capacities.
2. Support ticket inventory management by tier and optional seat map.
3. Allow users to reserve tickets with temporary hold TTL.
4. Process payment and confirm booking with ticket issuance.
5. Maintain waitlist when inventory is exhausted.
6. Auto-promote waitlisted users on cancellations/expiry.
7. Generate QR/barcode ticket for check-in.
8. Validate tickets at venue gate and prevent double entry.
9. Support cancellation/refund policies and organizer controls.

### 1.2 Non-Functional Requirements

1. Availability:
	- Booking/check-in APIs: 99.95% monthly.
	- Event browse APIs: 99.9% monthly.
2. Latency (p95):
	- Event browse: < 150 ms.
	- Ticket hold: < 220 ms.
	- Check-in validation: < 120 ms.
3. Throughput:
	- Baseline: 1k booking writes/sec.
	- Peak launch: 8k booking writes/sec, 60k reads/sec.
4. Durability:
	- Confirmed tickets and check-in events must be durable.
5. Consistency:
	- Strong consistency for inventory and check-in single-use constraint.
	- Eventual consistency acceptable for recommendations/search.

## 2. Architecture Diagram (Textual)

User App / Organizer Portal / Gate Scanner App
-> API Gateway
-> Auth Service
-> Event Platform Services

Event Platform Services -> Event Catalog Service -> OLTP DB + Cache
Event Platform Services -> Inventory Service -> OLTP DB + Redis Hold Store
Event Platform Services -> Booking Service -> OLTP DB
Event Platform Services -> Payment Service -> Payment Gateway
Event Platform Services -> Waitlist Service -> Queue + OLTP DB
Event Platform Services -> Check-in Service -> OLTP DB + Cache
Event Platform Services -> Notification Service -> Queue

Shared:
1. Event bus for booking/cancellation/check-in events.
2. Analytics pipeline for organizer insights.
3. Observability and audit stack.

## 3. Components and Responsibilities

1. Event Catalog Service
	- Event metadata, venue details, ticket tier definitions.

2. Inventory Service
	- Inventory counters or seat-level state machine.
	- Hold and release logic with TTL.

3. Booking Service
	- Booking lifecycle and ticket issuance.

4. Waitlist Service
	- Queue management and promotion sequencing.

5. Check-in Service
	- Ticket validation, gate scans, anti-replay enforcement.

6. Payment Service
	- Payment intents, callback verification, refund initiation.

## 4. Data Design

### 4.1 Storage Choices

1. OLTP DB (PostgreSQL): events, tickets, bookings, check-ins.
2. Redis: short-lived holds and gate validation cache.
3. Kafka/PubSub: async waitlist and notification workflows.
4. Object store: ticket PDFs and branding assets.

### 4.2 Core Entities

1. event(event_id, organizer_id, title, venue_id, start_at, end_at, status)
2. ticket_tier(tier_id, event_id, name, price, capacity, sold_count)
3. seat_inventory(event_id, seat_id, state, hold_id, version, updated_at)
4. hold(hold_id, user_id, event_id, tier_id, qty, expires_at, status)
5. booking(booking_id, user_id, event_id, status, total_amount, created_at)
6. booking_item(item_id, booking_id, tier_id, seat_id, price)
7. ticket(ticket_id, booking_item_id, qr_token, status)
8. checkin(checkin_id, ticket_id, gate_id, checked_in_at, device_id)
9. waitlist_entry(waitlist_id, event_id, user_id, tier_id, qty, rank, status, created_at)
10. payment(payment_id, booking_id, provider_ref, status, idempotency_key)

### 4.3 Indexes and Constraints

1. Unique(ticket.qr_token).
2. Unique(checkin.ticket_id) for single check-in enforcement.
3. Unique(event_id, seat_id) in seat inventory mode.
4. Index waitlist_entry(event_id, tier_id, rank).

### 4.4 Concurrency Controls

1. Hold creation uses conditional decrement/inventory state transition.
2. Booking confirm transitions hold -> sold in one transaction.
3. Check-in uses compare-and-set to prevent duplicate scan acceptance.
4. Idempotency keys on booking, payment, cancellation, and check-in APIs.

## 5. API Contracts

### 5.1 Event Discovery

1. GET /v1/events?city=...&date=...&category=...
2. GET /v1/events/{eventId}
3. GET /v1/events/{eventId}/availability

### 5.2 Hold and Booking

1. POST /v1/holds
	- Request: { eventId, tierId, seatIds?, quantity, userId, idempotencyKey }
	- Response: { holdId, expiresAt, amount }

2. POST /v1/bookings
	- Request: { holdId, userId, paymentMethod, idempotencyKey }
	- Response: { bookingId, status, tickets[] }

3. POST /v1/bookings/{bookingId}/cancel
	- Handles cancellation policy and potential waitlist promotion.

### 5.3 Waitlist

1. POST /v1/waitlist
	- Request: { eventId, tierId, quantity, userId }

2. GET /v1/waitlist/{waitlistId}

### 5.4 Check-in

1. POST /v1/checkins/validate
	- Request: { qrToken, gateId, deviceId, idempotencyKey }
	- Response: { valid, ticketStatus, attendeeName }

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Partition by event_id for inventory and booking tables.
2. Isolate read-heavy browse APIs from write-heavy booking APIs.
3. Cache hot events and availability snapshots with short TTL.
4. Async promotion pipeline for waitlist handling.

### 6.2 Spike Handling

1. Virtual queue for high-demand event drops.
2. Rate limiting and bot protection at hold/booking endpoints.
3. Controlled retry and jitter for payment callouts.

### 6.3 Reliability Plan

1. Retries for transient failures with bounded attempts.
2. Idempotent endpoint semantics for all state mutations.
3. Outbox pattern for guaranteed event publication.
4. Multi-AZ DB and replicated caches/queues.
5. DR:
	- Cross-region backups and periodic restore drills.
	- Target RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. OAuth2/JWT and role-based organizer/user/checkin-device access.
2. Signed QR tokens with short validation windows.
3. Payment tokenization and provider webhook signature checks.
4. Abuse controls against scalping and automated bots.
5. Audit logs for organizer inventory/policy changes.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, event_id, hold_id, booking_id, ticket_id.
2. Metrics:
	- hold_success_rate
	- booking_conversion_rate
	- waitlist_promotion_latency_sec
	- checkin_reject_rate
	- duplicate_scan_attempt_count
3. Traces:
	- hold -> payment -> booking -> ticket issue -> check-in.
4. SLOs:
	- 99.95% successful booking confirmations.
	- p95 hold latency < 220 ms.
	- 99.9% check-in validations < 120 ms.

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Seat-level precision improves UX but increases write contention.
2. Waitlist fairness logic can increase promotion latency.
3. Aggressive anti-bot controls may impact some genuine users.

### 8.2 Bottlenecks

1. Flash sales causing lock contention on popular tiers/seats.
2. Payment provider slowdowns during launch windows.
3. Venue network issues impacting scanner check-ins.

### 8.3 Future Extensions

1. Dynamic pricing by demand and seat quality.
2. Resale marketplace with policy controls.
3. Group booking and split payment support.
4. Offline-capable check-in device sync.
5. Sponsor/partner bundle ticketing.

## 9. Implemented Application (This Repository)

This repository now includes a working full-stack implementation:

1. Backend:
	- Java 17 + Spring Boot 3 REST API.
	- In-memory inventory, hold TTL, idempotency keys, booking confirmation, cancellation, waitlist, and check-in validation.

2. Frontend:
	- React + Vite single-page app.
	- Login-first flow, sidebar-led layout, dense operational views, and mobile-friendly responsive behavior.

### 9.1 Tech Stack

1. Backend: Java 17, Spring Boot, Maven.
2. Frontend: React 18, Vite 5, plain CSS.

### 9.2 Repository Structure

1. backend/
	- Spring Boot API.
2. frontend/
	- React web app.
3. prompt.md
4. README.md

### 9.3 Implemented API Endpoints

1. GET /v1/events
2. GET /v1/events/{eventId}
3. GET /v1/events/{eventId}/availability
4. POST /v1/holds
5. POST /v1/bookings
6. POST /v1/bookings/{bookingId}/cancel
7. GET /v1/bookings?userId=...
8. POST /v1/waitlist
9. GET /v1/waitlist/{waitlistId}
10. POST /v1/checkins/validate

### 9.4 Local Run Instructions

1. Start backend:

```bash
cd backend
mvn spring-boot:run
```

Backend runs on http://localhost:8080.

2. Start frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173.

### 9.5 Build Verification

1. Backend compile verified:
	- mvn -DskipTests compile
2. Frontend production build verified:
	- npm run build
