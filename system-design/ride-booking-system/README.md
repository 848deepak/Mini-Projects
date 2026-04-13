# Ride Booking System

Category: system-design

## Implementation Status

This folder now includes a working static MVP for ride booking simulation.

## Files

1. `index.html` - UI shell and Leaflet map mount point.
2. `style.css` - visual system and responsive layout.
3. `data.js` - city locations, ride types, mock drivers, and pricing.
4. `booking.js` - fare/ETA helpers and localStorage ride history.
5. `map.js` - autocomplete, map markers, matching simulation, and state machine.

## How to Use

1. Open `index.html` in a browser.
2. Select pickup and drop locations from the autocomplete suggestions.
3. Choose a ride type.
4. Click `Book ride` to simulate matching, route animation, and ride completion.
5. Completed rides are saved in localStorage and shown in the history panel.

## Notes

- Uses Leaflet from a CDN for the visual map.
- No backend is required; all state is simulated locally.
# Ride Booking System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Rider can request a ride from pickup to destination.
2. Match rider with nearby available driver in real time.
3. Support ride types such as economy, premium, and XL.
4. Track trip lifecycle:
	- REQUESTED
	- MATCHING
	- DRIVER_ASSIGNED
	- ARRIVING
	- IN_PROGRESS
	- COMPLETED
	- CANCELED
5. Support price estimate, ETA, and surge pricing.
6. Allow driver acceptance/rejection and re-dispatch.
7. Live location tracking during the trip.
8. Trip history, receipts, and rating flow.

### 1.2 Non-Functional Requirements

1. Availability:
	- Matching and trip APIs: 99.95% monthly.
	- Tracking APIs: 99.9% monthly.
2. Latency (p95):
	- Match decision: < 250 ms.
	- Ride request ack: < 180 ms.
	- Location update ingest: < 120 ms.
3. Throughput:
	- Baseline: 2k ride requests/sec, 20k location updates/sec.
	- Peak demand spikes: 10k ride requests/sec, 100k location updates/sec.
4. Durability:
	- Trip records, driver assignment, and fare data must be durable.
5. Consistency:
	- Strong consistency for assignment ownership and trip state.
	- Eventual consistency acceptable for analytics and demand heat maps.

## 2. Architecture Diagram (Textual)

Rider App / Driver App / Ops Console
-> API Gateway
-> Auth Service
-> Ride Platform Services

Ride Platform Services -> Ride Request Service -> OLTP DB
Ride Platform Services -> Matching Service -> Geo Index + Rules Engine
Ride Platform Services -> Driver Presence Service -> Redis + Ephemeral Store
Ride Platform Services -> Trip Service -> OLTP DB
Ride Platform Services -> Tracking Service -> Stream Ingest + Time-series Store
Ride Platform Services -> Pricing Service -> Rules Engine + Cache
Ride Platform Services -> Notification Service -> Queue -> Push/SMS

Shared:
1. Event bus for request, assignment, trip state, and location events.
2. Analytics pipeline for ETAs, heat maps, and SLA monitoring.
3. Observability and anti-fraud stack.

## 3. Components and Responsibilities

1. Ride Request Service
	- Creates ride requests and tracks request lifecycle.

2. Matching Service
	- Selects best-fit driver based on distance, ETA, rating, and policy.

3. Driver Presence Service
	- Maintains live driver availability, location, and status.

4. Trip Service
	- Trip lifecycle and ownership transitions.

5. Tracking Service
	- High-frequency GPS ingest and rider-facing trip tracking.

6. Pricing Service
	- Fare estimate, surge, tolls, cancellation fee, and route pricing.

## 4. Data Design

### 4.1 Storage Choices

1. OLTP DB (PostgreSQL): ride requests, trips, payments, ratings.
2. Redis: geo indexing and online driver presence.
3. Kafka/PubSub: trip events and dispatch fan-out.
4. Time-series store: location trails and telemetry.

### 4.2 Core Entities

1. rider(rider_id, name, phone, status, created_at)
2. driver(driver_id, name, rating, vehicle_type, status, last_seen_at)
3. driver_location(driver_id, lat, lon, heading, speed, updated_at)
4. ride_request(request_id, rider_id, pickup_lat, pickup_lon, drop_lat, drop_lon, ride_type, status, requested_at)
5. dispatch_offer(offer_id, request_id, driver_id, status, expires_at, created_at)
6. trip(trip_id, request_id, rider_id, driver_id, status, started_at, ended_at)
7. trip_event(event_id, trip_id, event_type, occurred_at, payload)
8. fare(fare_id, trip_id, base_amount, distance_amount, surge_amount, total_amount, currency)
9. rating(rating_id, trip_id, rater_id, rated_id, score, comment, created_at)

### 4.3 Indexes and Constraints

1. Index ride_request(status, requested_at desc).
2. Unique active trip per driver (state not in COMPLETED/CANCELED).
3. Index driver_location using geo-capable store.
4. Version check on dispatch_offer and trip state updates.

### 4.4 Concurrency and Race Prevention

1. Assignment claimed with compare-and-set on request state.
2. Driver accept path enforces single active offer claim.
3. Idempotency keys for ride request, assignment accept, and trip complete.
4. Reject stale location/trip updates using version/timestamp checks.

## 5. API Contracts

### 5.1 Request and Matching

1. POST /v1/ride-requests
	- Request: { riderId, pickup, drop, rideType, paymentMethodId, idempotencyKey }
	- Response: { requestId, estimatedFare, etaSec, status }

2. GET /v1/ride-requests/{requestId}/status

3. POST /v1/ride-requests/{requestId}/cancel

### 5.2 Driver Operations

1. POST /v1/drivers/{driverId}/presence
2. POST /v1/dispatch/offers/{offerId}/accept
3. POST /v1/dispatch/offers/{offerId}/reject

### 5.3 Trip Lifecycle

1. POST /v1/trips/{tripId}/start
2. POST /v1/trips/{tripId}/complete
3. GET /v1/trips/{tripId}

### 5.4 Tracking and Ratings

1. GET /v1/trips/{tripId}/track
2. POST /v1/trips/{tripId}/ratings

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Partition by city/zone to reduce geo search scope.
2. Cache active drivers in Redis for rapid matching.
3. Separate write path for dispatch from read path for trip tracking.
4. Async fan-out to notifications and analytics.

### 6.2 Spike Handling

1. Surge-aware admission control.
2. Expand dispatch radius dynamically when supply is low.
3. Backpressure on location ingest during network bursts.

### 6.3 Reliability Plan

1. Retries with backoff for non-critical downstream services.
2. Idempotent ride request and trip transition APIs.
3. Outbox pattern for event publication.
4. Multi-AZ DB and replicated cache/queue infrastructure.
5. DR:
	- PITR and cross-region backups.
	- RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. JWT auth and role-based access for rider, driver, ops.
2. PII encryption at rest and in transit.
3. Anti-fraud checks: spoofed GPS and fake trip detection.
4. Audit logs for assignment overrides and payouts.
5. Privacy controls for rider and driver data retention.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, request_id, request_id, trip_id, driver_id.
2. Metrics:
	- match_latency_ms
	- assignment_accept_rate
	- trip_completion_rate
	- location_update_latency_ms
	- cancellation_rate
3. Traces:
	- ride request -> matching -> assignment -> trip complete.
4. SLOs:
	- 99.95% successful ride request handling.
	- p95 match decision < 250 ms.
	- 99% trip tracking updates < 3 seconds.

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Strong assignment consistency avoids double-booking but adds coordination overhead.
2. Frequent driver updates improve ETA accuracy but increase ingest cost.
3. Zone partitioning improves scale but complicates cross-zone matching.

### 8.2 Bottlenecks

1. Airport/event surge zones.
2. Hot geo partitions in dense cities.
3. External mapping/ETA dependency latency.

### 8.3 Future Extensions

1. Ride pooling and multi-stop trips.
2. Driver incentives and supply forecasting.
3. EV-aware routing and charging station routing.
4. Multi-city active-active architecture.
5. ML-based matching and ETA optimization.

## Folder Structure

1. prompt.md
2. README.md
3. src/
