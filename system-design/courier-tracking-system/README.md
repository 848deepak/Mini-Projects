# Courier Tracking System (Spring Boot + JS)

This project is a modern implementation of the courier tracking design using:

- Java 21
- Spring Boot 3 (REST APIs)
- H2 database (development)
- Vanilla JavaScript dashboard (served from Spring static assets)

## Features

- Create shipment with sender/receiver metadata
- Auto-generate tracking number
- Ingest tracking lifecycle events with idempotency key
- Enforce shipment state-machine transitions
- Fetch live tracking timeline by tracking number
- Operations actions: reroute, hold, reattempt
- Delivery completion with OTP demo check (`123456`)

## Run

```bash
cd /Users/deepakpandey/Coding/mini-projects/system-design/courier-tracking-system
mvn spring-boot:run
```

Open:

- App UI: http://localhost:8080/
- H2 console: http://localhost:8080/h2-console

H2 JDBC URL:

```text
jdbc:h2:mem:courierdb
```

## API Summary

- `POST /api/v1/shipments`
- `POST /api/v1/tracking/events`
- `GET /api/v1/track/{trackingNo}`
- `GET /api/v1/shipments/{shipmentId}/timeline`
- `POST /api/v1/shipments/{shipmentId}/actions`
- `POST /api/v1/shipments/{shipmentId}/deliver`

## Notes

- This is a production-style starter with in-memory DB for local development.
- For production, replace H2 with PostgreSQL and add auth + message bus for ingest/notifications.
# Courier Tracking System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Create shipment with sender/receiver details and service level.
2. Assign tracking number and label metadata.
3. Track parcel lifecycle states end to end:
	- CREATED
	- PICKUP_SCHEDULED
	- PICKED_UP
	- IN_TRANSIT
	- AT_HUB
	- OUT_FOR_DELIVERY
	- DELIVERED
	- DELIVERY_FAILED
	- RETURN_INITIATED
	- RETURNED
4. Ingest live location updates from courier devices/scan events.
5. Expose real-time tracking timeline to customers.
6. Support delivery proof (OTP/signature/photo reference).
7. Trigger notifications on critical state changes.
8. Enable operations actions: reroute, hold-at-location, reattempt.

### 1.2 Non-Functional Requirements

1. Availability:
	- Tracking API and state updates: 99.95% monthly.
	- Historical analytics: 99.9% monthly.
2. Latency (p95):
	- Track shipment API: < 180 ms.
	- Event ingestion API: < 120 ms.
	- Status propagation to customer timeline: < 3 sec.
3. Throughput:
	- Normal: 2k shipment events/sec.
	- Peak seasonal (festive sale): 25k events/sec.
4. Durability:
	- Event history and final delivery status must be durable across AZ failure.
5. Consistency:
	- Strong consistency for current shipment state per tracking number.
	- Eventual consistency acceptable for search indexes and dashboards.

## 2. Architecture Diagram (Textual)

Customer App / Merchant Portal / Ops Console / Courier Device
-> API Gateway
-> Auth Service
-> Routing Layer

Routing -> Shipment Service -> OLTP DB
Routing -> Tracking Ingest Service -> Event Bus
Event Bus -> State Processor -> OLTP DB + Cache
Event Bus -> Notification Service -> Queue -> Email/SMS/Push
Event Bus -> Analytics Pipeline -> Data Warehouse
Routing -> Tracking Query Service -> Cache + Read Replica

Shared:
1. Object store for PoD assets (photo/signature blobs).
2. Observability stack.
3. Background jobs for SLA breach detection and exception escalation.

## 3. Components and Responsibilities

1. Shipment Service
	- Shipment creation, label metadata, service-level policy.

2. Tracking Ingest Service
	- Accepts scan/device updates.
	- Validates schema, source identity, and event ordering hints.

3. State Processor
	- Applies transition rules.
	- Maintains canonical latest state and timeline records.

4. Tracking Query Service
	- Serves customer tracking timeline and current ETA.
	- Uses cache for hot tracking numbers.

5. Exception Management Service
	- Handles failed delivery, address issues, damage/loss flows.

6. Notification Service
	- Sends milestone notifications and failure alerts.

## 4. Data Design

### 4.1 Storage Choices

1. OLTP DB (PostgreSQL/MySQL): shipments, current state, operational actions.
2. Event store (Kafka + persisted sink): immutable event timeline.
3. Redis cache: hot tracking lookups and short-lived ETA responses.
4. Time-series/warehouse: fleet and SLA analytics.
5. Object storage: proof-of-delivery artifacts.

### 4.2 Core Entities

1. shipment(shipment_id, tracking_no, merchant_id, sender_id, receiver_id, service_level, created_at)
2. shipment_address(address_id, shipment_id, type, line1, city, state, postal_code, geo_lat, geo_lon)
3. shipment_state(shipment_id, current_state, sub_state, updated_at, version)
4. shipment_event(event_id, shipment_id, event_type, source_type, source_id, occurred_at, ingested_at, payload)
5. courier(courier_id, name, phone, hub_id, status)
6. handoff(handoff_id, shipment_id, from_entity, to_entity, hub_id, occurred_at)
7. delivery_attempt(attempt_id, shipment_id, courier_id, status, reason_code, occurred_at)
8. pod_record(pod_id, shipment_id, otp_verified, signature_uri, photo_uri, recipient_name, delivered_at)
9. notification_log(notification_id, shipment_id, channel, template, status, sent_at)

### 4.3 Indexes and Constraints

1. Unique(tracking_no).
2. Index shipment_state(current_state, updated_at) for ops queues.
3. Index shipment_event(shipment_id, occurred_at desc).
4. Version check on shipment_state for optimistic concurrency.

### 4.4 Race Condition Prevention

1. State transition uses compare-and-set on shipment_state.version.
2. Invalid transitions rejected by finite state machine rules.
3. Duplicate device scans handled via event idempotency key.
4. Exactly one canonical current state row per shipment.

## 5. API Contracts

### 5.1 Shipment Creation and Labeling

1. POST /v1/shipments
	- Request: { merchantId, sender, receiver, package, serviceLevel, idempotencyKey }
	- Response: { shipmentId, trackingNo, initialState }

2. GET /v1/shipments/{shipmentId}/label
	- Returns label metadata or signed URL.

### 5.2 Tracking Updates

1. POST /v1/tracking/events
	- Request: { trackingNo, eventType, occurredAt, location, sourceId, payload, idempotencyKey }
	- Response: { accepted: true, eventId }

2. POST /v1/shipments/{shipmentId}/actions
	- Request: { actionType: REROUTE|HOLD|REATTEMPT, reason, actorId }

### 5.3 Customer Tracking

1. GET /v1/track/{trackingNo}
	- Response: { currentState, eta, timeline[], lastLocation }

2. GET /v1/shipments/{shipmentId}/timeline
	- Detailed internal timeline for support/ops.

### 5.4 Delivery Completion

1. POST /v1/shipments/{shipmentId}/deliver
	- Request: { otp, recipientName, signatureUri, photoUri, idempotencyKey }
	- Transition to DELIVERED if policy validations pass.

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Partition shipment data by region + shipment creation month.
2. Track API served via cache-first strategy for recent activity.
3. Event-driven architecture isolates ingest spikes from query traffic.
4. Asynchronous timeline compaction for faster reads.

### 6.2 Handling Uneven Access Patterns

1. Hot key mitigation for viral tracking numbers (short TTL cache + request coalescing).
2. Adaptive sampling on non-critical telemetry during surge.
3. Separate consumer groups for state updates vs analytics workloads.

### 6.3 Reliability Plan

1. Retries with backoff and dead-letter queues for failed consumers.
2. Idempotent writes for event ingest and shipment actions.
3. Multi-AZ primary DB with automatic failover.
4. Event bus replication factor >= 3.
5. DR:
	- Continuous backup and point-in-time restore.
	- Cross-region replicated backups.
	- Target RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. JWT/OAuth2-based auth and role authorization (merchant, courier, ops, customer).
2. Encryption at rest and TLS for all APIs.
3. Signed webhook/device payload verification.
4. PII minimization and configurable retention for address/contact fields.
5. Audit logs for manual state overrides and reroute actions.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, tracking_no, shipment_id, event_id.
2. Metrics:
	- event_ingest_rate
	- tracking_api_latency_ms (p50/p95/p99)
	- invalid_transition_reject_count
	- stale_shipment_state_count
	- notification_delivery_rate
3. Traces:
	- end-to-end from event ingest -> state update -> customer query.
4. SLOs:
	- 99.95% successful event ingestion.
	- p95 track API latency < 180 ms.
	- 99% of valid events reflected in customer timeline within 3 seconds.

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Strict state machine validation improves integrity but can reject noisy field updates.
2. Event sourcing increases storage usage but improves auditability and replay.
3. Rich timeline detail improves support experience but increases query payload size.

### 8.2 Bottlenecks

1. Burst event ingest from large hub scans.
2. Hot tracking numbers after social/merchant campaigns.
3. Downstream notification provider throttling.

### 8.3 Future Extensions

1. ML-based ETA prediction using weather/traffic/hub load.
2. Geofenced anomaly alerts for theft/tamper risk.
3. Customer reschedule/self-pickup orchestration.
4. Cross-border customs state integration.
5. Carbon-footprint reporting per shipment.

## Folder Structure

1. prompt.md
2. README.md
3. src/
