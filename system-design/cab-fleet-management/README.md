# Cab Fleet Management System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Ingest and maintain live driver location, status, and vehicle metadata.
2. Accept ride requests and dispatch the best available driver based on policy.
3. Support driver lifecycle states: OFFLINE, IDLE, ASSIGNED, ON_TRIP, BREAK.
4. Track trips in real time (pickup ETA, en-route progress, drop-off completion).
5. Support driver operations:
	- shift start/end
	- break handling
	- assignment acceptance/rejection
6. Re-dispatch if driver rejects/timeout/no-show.
7. Store trip history, earnings, utilization, and SLA adherence.
8. Provide fleet operations dashboard (heat map, supply-demand, alerting).
9. Generate settlement-ready trip records and driver payouts.

### 1.2 Non-Functional Requirements

1. Availability:
	- Dispatch and trip lifecycle APIs: 99.95% monthly.
	- Analytics dashboard APIs: 99.9% monthly.
2. Latency (p95):
	- Driver heartbeat ingest: < 120 ms.
	- Match + dispatch decision: < 250 ms.
	- Trip status update: < 150 ms.
3. Throughput:
	- Steady: 20k location updates/sec.
	- Peak events: 120k location updates/sec, 5k ride requests/sec.
4. Durability:
	- Completed trips and payout records must be durable across AZ failure.
5. Consistency:
	- Strong consistency for assignment ownership (one trip, one active driver).
	- Eventual consistency acceptable for dashboard aggregates.

## 2. Architecture Diagram (Textual)

Driver App / Rider App / Ops Dashboard
-> API Gateway
-> Auth Service
-> Service Mesh Routing

Routing -> Driver Service -> OLTP DB + Redis
Routing -> Dispatch Service -> Redis Geo Index + Rules Engine
Routing -> Trip Service -> OLTP DB
Routing -> Tracking Service -> Stream Ingest + Time-series Store
Routing -> Pricing/Fare Service -> OLTP DB + Cache
Routing -> Payout Service -> OLTP DB + External Banking API
Routing -> Notification Service -> Queue -> Push/SMS providers

Shared:
1. Event Bus (Kafka/PubSub) for trip/dispatch/location events.
2. Batch/stream processors for metrics, ETA model features, and anomaly detection.
3. Observability stack for logs, metrics, tracing, and alerting.

## 3. Components and Responsibilities

1. Driver Service
	- Driver profile, verification state, shift status, and current availability.

2. Dispatch Service
	- Core matching engine.
	- Uses geo proximity, ETA, surge zone policy, vehicle type, rating threshold.
	- Handles assignment offers and fallbacks.

3. Tracking Service
	- Ingests high-frequency GPS pings.
	- Maintains latest location in hot store and archives trajectory.

4. Trip Service
	- Trip lifecycle state machine:
	  REQUESTED -> ASSIGNED -> ARRIVED -> STARTED -> COMPLETED / CANCELED.

5. Fare and Pricing Service
	- Base fare, distance/time fare, surge, tolls, cancellation fees.

6. Payout Service
	- Driver earnings and payout reconciliation.

7. Ops Dashboard Service
	- Real-time fleet visibility, SLA and incident panels.

## 4. Data Design

### 4.1 Storage Choices

1. Primary OLTP DB: PostgreSQL for transactional trip/driver/payout states.
2. Redis:
	- geo indexes for nearby driver search
	- ephemeral assignment offers and session state
3. Kafka:
	- location_update, dispatch_offer, trip_state_changed topics.
4. Time-series DB (or columnar store): driver location history and telemetry.
5. Data warehouse: fleet analytics and operational reporting.

### 4.2 Core Entities

1. driver(driver_id, name, phone, city_id, rating, verification_status)
2. vehicle(vehicle_id, driver_id, type, plate_no, capacity, status)
3. driver_shift(shift_id, driver_id, start_at, end_at, state)
4. driver_presence(driver_id, status, last_seen_at, lat, lon, heading, speed)
5. ride_request(request_id, rider_id, pickup_lat, pickup_lon, drop_lat, drop_lon, requested_vehicle_type, status)
6. dispatch_assignment(assignment_id, request_id, driver_id, offered_at, expires_at, state)
7. trip(trip_id, request_id, rider_id, driver_id, state, started_at, ended_at, cancel_reason)
8. trip_event(event_id, trip_id, event_type, occurred_at, payload)
9. fare(trip_id, base_amount, distance_amount, time_amount, surge_amount, toll_amount, total_amount)
10. payout(payout_id, driver_id, period_start, period_end, gross, commission, net, status)

### 4.3 Indexes and Constraints

1. Unique active assignment per request (partial unique index where state in OFFERED/ACCEPTED).
2. Unique active trip per driver (state not in COMPLETED/CANCELED).
3. Index trip by (driver_id, started_at desc).
4. Geospatial index for driver_presence (in Redis geo or PostGIS).

### 4.4 Concurrency and Race Prevention

1. Assignment claim uses compare-and-set semantics:
	- transition request state REQUESTED -> ASSIGNED only if current state is REQUESTED.
2. Driver accept endpoint checks assignment validity and expiry in one transaction.
3. Distributed lock key on request_id during final assignment to avoid dual assignment.
4. Idempotency keys on ride request, assignment accept, and trip complete endpoints.

## 5. API Contracts

### 5.1 Driver Operations

1. POST /v1/drivers/{driverId}/shift/start
	- Request: { lat, lon, vehicleId }
	- Response: { shiftId, status: "IDLE" }

2. POST /v1/drivers/{driverId}/presence
	- Request: { lat, lon, heading, speed, timestamp }
	- High-frequency ingest endpoint.

3. POST /v1/drivers/{driverId}/assignments/{assignmentId}/accept
	- Request: { idempotencyKey }
	- Errors: 409 expired/already claimed.

4. POST /v1/drivers/{driverId}/assignments/{assignmentId}/reject

### 5.2 Rider and Dispatch

1. POST /v1/ride-requests
	- Request: { riderId, pickup, drop, vehicleType, paymentMethodId, idempotencyKey }
	- Response: { requestId, etaSec, fareEstimate }

2. GET /v1/ride-requests/{requestId}/status
	- Returns dispatch status and assigned driver (if any).

### 5.3 Trip Lifecycle

1. POST /v1/trips/{tripId}/arrived
2. POST /v1/trips/{tripId}/start
3. POST /v1/trips/{tripId}/complete
	- Request includes final distance/time readings.
	- Response includes fare breakdown.

### 5.4 Fleet Operations

1. GET /v1/ops/zones/supply-demand?cityId=...&window=5m
2. GET /v1/ops/drivers/active?cityId=...&status=IDLE
3. GET /v1/ops/trips/live?cityId=...

## 6. Scalability and Reliability

### 6.1 Scalability Strategy

1. Partition live traffic by city/region to reduce cross-zone chatter.
2. Isolate ingest path (presence updates) from transactional path (assignment/trip state).
3. Use stream processing for derived data (heat maps, ETAs, utilization).
4. Cache frequently requested rider data (recent routes, pricing configs).

### 6.2 Uneven Traffic and Spikes

1. Zone-level admission control when demand outpaces supply.
2. Dynamic dispatch radius expansion during scarcity.
3. Backpressure and batching for telemetry ingest.
4. Priority queues for airport/event zones.

### 6.3 Reliability Plan

1. Retries with exponential backoff + jitter for transient dependency failures.
2. Exactly-once effect for critical state transitions via idempotency and version checks.
3. Dead-letter queues for failed notifications/webhooks.
4. Multi-AZ DB and Redis replication.
5. DR:
	- WAL/binlog shipping and periodic snapshot backups.
	- Cross-region warm standby.
	- Target RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. OAuth2/JWT with role-based access (driver, rider, ops admin).
2. PII protection: encrypt driver/rider personal fields at rest.
3. Signed requests from mobile apps with rotating device tokens.
4. Anti-fraud checks:
	- impossible travel detection
	- GPS spoofing anomaly checks
5. Immutable audit trail for assignment overrides and payout changes.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, request_id, trip_id, driver_id.
2. Metrics:
	- dispatch_success_rate
	- dispatch_time_ms
	- assignment_reject_rate
	- active_drivers_count
	- trip_completion_rate
	- payout_failure_rate
3. Traces:
	- request -> matching -> assignment -> trip complete.
4. SLOs:
	- p95 dispatch decision latency < 250 ms.
	- 99.95% successful trip state transitions.
	- < 0.5% duplicate assignment incident rate (target near zero).

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Aggressive geo-caching improves speed but can use stale presence data briefly.
2. Strong assignment consistency reduces throughput but avoids costly double dispatch.
3. Rich dispatch policy increases compute complexity and tuning burden.

### 8.2 Bottlenecks

1. High-frequency location ingest in dense zones.
2. Hot partition risk during major events/airports.
3. External payout/provider downtime affecting settlement flow.

### 8.3 Future Extensions

1. ML-driven dispatch with real-time demand forecasts.
2. Dynamic pooling and multi-stop optimization.
3. Driver incentive engine (quest/boost) integrated with supply balancing.
4. EV fleet-specific routing (charging-aware dispatch).
5. Multi-region active-active by city ownership model.

## Folder Structure

1. prompt.md
2. README.md
3. src/
