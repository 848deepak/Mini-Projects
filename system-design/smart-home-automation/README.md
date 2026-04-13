# Smart Home Automation System

Category: system-design

## Implementation Status

This folder now includes a working static MVP for smart home control and automation.

## Files

1. `index.html` - dashboard shell.
2. `style.css` - responsive UI and glassmorphism theme.
3. `data.js` - initial home, devices, scenes, and rules.
4. `app.js` - local state, device controls, rule engine, event simulation.

## How to Use

1. Open `index.html` in a browser.
2. Use the role selector to switch between owner, family, and guest.
3. Apply scenes or control devices manually.
4. Create automation rules and simulate sensor events from the event lab.
5. Activity history and rule state are saved in localStorage.

## Notes

- No backend is required.
- The rule engine and event triggers run entirely in the browser.
# Smart Home Automation System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Register and manage home devices such as lights, thermostats, locks, and cameras.
2. Control devices manually from mobile/web apps.
3. Define automation rules based on time, sensor events, and device state.
4. Support scenes such as Away, Sleep, and Movie mode.
5. Ingest sensor events and trigger actions with low latency.
6. Track device health, battery, and connectivity status.
7. Support guest access and household roles.
8. Provide audit history for automations and device actions.

### 1.2 Non-Functional Requirements

1. Availability: 99.95% for control APIs, 99.9% for reporting.
2. Latency (p95): device command ack < 100 ms, event-triggered rule evaluation < 200 ms.
3. Throughput: baseline 5k events/sec, peak 50k events/sec.
4. Durability: commands and automation history must survive AZ failure.
5. Consistency: strong consistency for device state and rule changes.

## 2. Architecture Diagram (Textual)

Mobile/Web App / Voice Assistant / IoT Devices
-> API Gateway
-> Auth and Household Service
-> Device Control Plane

Device Control Plane -> Device Registry Service -> OLTP DB
Device Control Plane -> Command Service -> Message Broker / Device Gateway
Device Control Plane -> Rules Engine -> Stream Processor
Device Control Plane -> Telemetry Ingest -> Time-series Store
Device Control Plane -> Notification Service -> Queue

Shared:
1. Event bus for telemetry and automation events.
2. Observability and audit log pipeline.

## 3. Components and Responsibilities

1. Device Registry Service: device metadata, capabilities, household membership.
2. Command Service: send commands, track delivery status, retry policy.
3. Rules Engine: evaluate triggers and execute scenes.
4. Telemetry Service: ingest sensor data and device heartbeats.
5. Notification Service: push alerts and automation outcomes.

## 4. Data Design

### 4.1 Storage Choices

1. OLTP DB (PostgreSQL): devices, homes, users, rules, command history.
2. Redis: active device state cache and rule hot lookups.
3. Time-series store: sensor readings and heartbeats.
4. Message broker: device command delivery and async rule execution.

### 4.2 Core Entities

1. home(home_id, owner_user_id, name, timezone)
2. device(device_id, home_id, type, name, capabilities_json, status, last_seen_at)
3. room(room_id, home_id, name)
4. device_assignment(device_id, room_id, assigned_at)
5. automation_rule(rule_id, home_id, name, trigger_json, condition_json, action_json, status, version)
6. scene(scene_id, home_id, name, action_json)
7. device_command(command_id, device_id, command_type, payload_json, status, created_at)
8. telemetry_event(event_id, device_id, event_type, payload_json, occurred_at)

### 4.3 Indexes and Constraints

1. Unique(device_id, home_id).
2. Index automation_rule(home_id, status).
3. Index telemetry_event(device_id, occurred_at desc).
4. Version field for rule updates.

### 4.4 Concurrency Controls

1. Rule execution is idempotent per event_id.
2. Command state transitions use compare-and-set on status.
3. Device online state derived from latest heartbeat with TTL.

## 5. API Contracts

1. POST /v1/homes
2. POST /v1/devices
3. POST /v1/devices/{deviceId}/commands
4. POST /v1/rules
5. POST /v1/telemetry/events
6. GET /v1/homes/{homeId}/state

## 6. Scalability and Reliability

1. Partition by home_id for control-plane data.
2. Separate telemetry ingest from control commands.
3. Retry command delivery with backoff and bounded attempts.
4. Use outbox pattern for rule-trigger side effects.
5. RPO <= 5 minutes, RTO <= 30 minutes with cross-region backups.

## 7. Security and Observability

1. MFA and role-based access for owners, family, guests.
2. Mutual TLS or signed device credentials for IoT devices.
3. Encrypt sensitive home and camera data at rest and in transit.
4. Logs, metrics, and traces for command latency, offline devices, rule executions.
5. SLOs: 99.95% command acceptance, p95 rule evaluation < 200 ms.

## 8. Trade-offs and Extensions

1. Local edge execution lowers latency but increases sync complexity.
2. Frequent telemetry improves automation quality but raises ingest cost.
3. Future: energy optimization, camera analytics, and offline edge clusters.

