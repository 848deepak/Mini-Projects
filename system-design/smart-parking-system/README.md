# Smart Parking System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Discover available parking slots by location, vehicle type, and duration.
2. Reserve slots and confirm entry on arrival.
3. Support dynamic pricing and occupancy-aware rates.
4. Track active sessions, exits, and overstay penalties.
5. Provide operator dashboard for lots, slots, gates, and revenue.

### 1.2 Non-Functional Requirements

1. Availability: 99.95% booking/control APIs.
2. Latency (p95): slot availability < 150 ms, reservation < 200 ms.
3. Throughput: baseline 2k RPS, peak 15k RPS.
4. Durability: reservations and payment events durable across AZ failure.

## 2. Architecture Diagram (Textual)

Driver App / Operator App / Gate Devices
-> API Gateway
-> Parking Core

Parking Core -> Slot Service -> OLTP DB + Cache
Parking Core -> Reservation Service -> OLTP DB
Parking Core -> Pricing Service -> Rules Engine
Parking Core -> Entry/Exit Service -> Gate Integration
Parking Core -> Billing Service -> Payment Gateway

## 3. Components and Responsibilities

1. Slot Service: slot inventory and availability.
2. Reservation Service: hold/confirm/cancel slot reservations.
3. Pricing Service: dynamic pricing and occupancy-based adjustments.
4. Entry/Exit Service: gate validation and session lifecycle.
5. Billing Service: overstay and payment collection.

## 4. Data Design

1. parking_lot(lot_id, name, geo, operator_id, status)
2. parking_slot(slot_id, lot_id, slot_type, status, sensor_id)
3. reservation(reservation_id, user_id, slot_id, start_at, end_at, status, expires_at)
4. parking_session(session_id, reservation_id, entry_at, exit_at, status)
5. price_rule(rule_id, lot_id, rule_json, version)

Use OLTP DB, Redis for hot availability, and time-series for sensor telemetry.

## 5. API Contracts

1. GET /v1/lots?near=...
2. GET /v1/lots/{lotId}/availability
3. POST /v1/reservations
4. POST /v1/sessions/{sessionId}/entry
5. POST /v1/sessions/{sessionId}/exit

## 6. Scalability and Reliability

1. Partition by lot_id and region.
2. Sensor telemetry isolated from booking path.
3. Retry gate callbacks with idempotency keys.
4. RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

1. Role-based access for drivers, operators, admins.
2. Metrics: occupancy, reservation success, gate validation latency, revenue per lot.

## 8. Trade-offs and Extensions

1. Real-time sensor integration improves accuracy but increases device complexity.
2. Dynamic pricing improves utilization but can reduce perceived fairness.
3. Future: EV charging slot coordination and license plate recognition.

