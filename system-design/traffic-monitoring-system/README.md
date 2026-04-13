# Traffic Monitoring System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Ingest traffic sensor and camera metadata streams.
2. Detect congestion, incidents, and anomalies.
3. Generate operator alerts and incident records.
4. Show live map views and historical traffic trends.
5. Support route-level and zone-level analytics.

### 1.2 Non-Functional Requirements

1. Availability: 99.95% ingest and incident APIs.
2. Latency (p95): sensor ingest < 100 ms, incident detection < 5 sec.
3. Throughput: baseline 20k events/sec, peak 150k/sec.
4. Durability: all sensor events and incidents durably stored.

## 2. Architecture Diagram (Textual)

Sensors/Cameras/Edge Gateways
-> Ingest API
-> Stream Bus

Stream Bus -> Stream Processing -> Incident Detection Service
Stream Processing -> Time-series Store
Incident Detection Service -> Alert Service -> Queue
Incident Detection Service -> Map Service -> Cache + Tile Store
Incident Detection Service -> Analytics Warehouse

## 3. Components and Responsibilities

1. Ingest Service: validate and normalize sensor data.
2. Stream Processing: aggregates, thresholds, rolling windows.
3. Incident Detection: congestion and anomaly generation.
4. Map Service: live map APIs and route status.
5. Alert Service: operator notifications.

## 4. Data Design

1. sensor(sensor_id, type, location, status)
2. traffic_event(event_id, sensor_id, speed, volume, occupancy, occurred_at)
3. incident(incident_id, zone_id, type, severity, status, created_at)
4. alert(alert_id, incident_id, channel, status, created_at)
5. zone(zone_id, name, geo_polygon_json)

Use OLTP DB for incidents, time-series store for sensor events, cache for live tiles.

## 5. API Contracts

1. POST /v1/events
2. GET /v1/incidents?zone=...
3. GET /v1/map/live?zone=...
4. POST /v1/incidents/{incidentId}/ack

## 6. Scalability and Reliability

1. Partition by zone and sensor_id.
2. Stream processing separate from alerting path.
3. Retry alert fan-out and make ingestion idempotent.
4. RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

1. Device auth, signed ingestion, and operator RBAC.
2. Metrics: ingest lag, incident detection latency, alert delivery success, sensor health.
3. SLOs: 99.95% ingest availability, incident detection within 5 seconds.

## 8. Trade-offs and Extensions

1. Faster detection can increase false positives.
2. Rich telemetry improves analytics but raises storage cost.
3. Future: ML incident prediction and citywide optimization.

