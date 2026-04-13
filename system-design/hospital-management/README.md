# Hospital Management System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Patient registration and longitudinal profile management.
2. Appointment scheduling with doctors, departments, and slots.
3. Bed allocation and transfer workflows (ward/ICU).
4. Electronic medical record (EMR) notes, prescriptions, and diagnostics references.
5. Billing and payment management across services.
6. Insurance claim support and pre-authorization states.
7. Admission/discharge/transfer (ADT) lifecycle management.
8. Role-based access for doctors, nurses, billing, and admins.
9. Notifications for appointments, lab readiness, and discharge.

### 1.2 Non-Functional Requirements

1. Availability:
	- Clinical operations APIs: 99.99% monthly.
	- Reporting APIs: 99.9% monthly.
2. Latency (p95):
	- Patient lookup: < 150 ms.
	- Appointment booking: < 250 ms.
	- Bed assignment update: < 180 ms.
3. Throughput:
	- Baseline: 1k mixed RPS.
	- Peak emergency windows: 8k mixed RPS.
4. Durability:
	- Clinical records and billing ledgers require strong durability and auditability.
5. Consistency:
	- Strong consistency for appointments, bed occupancy, and billing entries.
	- Eventual consistency allowed for aggregate analytics.

## 2. Architecture Diagram (Textual)

Patient Portal / Staff Console / Kiosk / Integrations
-> API Gateway
-> IAM Service
-> Hospital Core Services

Hospital Core Services -> Patient Service -> OLTP DB
Hospital Core Services -> Scheduling Service -> OLTP DB + Cache
Hospital Core Services -> Bed Management Service -> OLTP DB
Hospital Core Services -> EMR Service -> OLTP DB + Document Store
Hospital Core Services -> Billing Service -> Ledger DB
Hospital Core Services -> Insurance Service -> External Payer APIs
Hospital Core Services -> Notification Service -> Queue

Shared:
1. Event bus for ADT, appointment, billing, and care events.
2. Audit log and compliance archive.
3. Observability stack.

## 3. Components and Responsibilities

1. Patient Service
	- Demographics, identity linking, consent state.

2. Scheduling Service
	- Doctor slots, appointment booking/reschedule/cancel.

3. Bed Management Service
	- Real-time occupancy and transfer operations.

4. EMR Service
	- Encounter notes, medication orders, diagnosis metadata references.

5. Billing Service
	- Charge capture, invoice generation, payment collection.

6. Insurance Service
	- Eligibility checks, pre-auth requests, claim status updates.

## 4. Data Design

### 4.1 Storage Choices

1. OLTP DB (PostgreSQL): patient master, appointments, beds, ADT events.
2. Document store: clinical notes and structured/unstructured encounter docs.
3. Ledger tables: billing transactions and payment records.
4. Redis cache: doctor schedules and frequent patient lookup snippets.
5. Event bus: integration with labs/pharmacy/reporting.

### 4.2 Core Entities

1. patient(patient_id, mrn, name, dob, gender, phone, address, consent_flags)
2. provider(provider_id, department_id, name, role, status)
3. appointment(appointment_id, patient_id, provider_id, slot_start, slot_end, status, reason)
4. ward_bed(bed_id, ward_id, bed_type, status)
5. bed_allocation(allocation_id, bed_id, patient_id, admitted_at, discharged_at, status)
6. encounter(encounter_id, patient_id, provider_id, type, started_at, ended_at)
7. clinical_note(note_id, encounter_id, author_id, note_type, payload_ref, created_at)
8. bill(bill_id, patient_id, encounter_id, total_amount, status, created_at)
9. bill_item(item_id, bill_id, service_code, description, quantity, amount)
10. insurance_claim(claim_id, bill_id, payer_id, preauth_ref, status, submitted_at)
11. payment(payment_id, bill_id, method, amount, status, provider_ref)

### 4.3 Indexes and Constraints

1. Unique(patient.mrn).
2. Unique provider slot constraint to prevent overlapping bookings.
3. Unique active bed allocation per bed_id.
4. Index appointment(provider_id, slot_start).
5. Index bill(patient_id, created_at desc).

### 4.4 Concurrency and Race Prevention

1. Appointment booking uses slot-level optimistic locking.
2. Bed allocation uses transactional lock on bed row to avoid dual assignment.
3. Billing status transitions guarded by finite-state checks.
4. Idempotency keys for appointment create, discharge, and payment actions.

## 5. API Contracts

### 5.1 Patient and Appointment

1. POST /v1/patients
2. GET /v1/patients/{patientId}
3. POST /v1/appointments
	- Request: { patientId, providerId, slotStart, reason, idempotencyKey }
	- Response: { appointmentId, status }
4. PATCH /v1/appointments/{appointmentId}

### 5.2 Admission and Bed Management

1. POST /v1/admissions
	- Request: { patientId, admissionType, wardPreference }
2. POST /v1/beds/{bedId}/assign
3. POST /v1/beds/{bedId}/transfer
4. POST /v1/discharges

### 5.3 Clinical and Billing

1. POST /v1/encounters/{encounterId}/notes
2. POST /v1/bills/generate
3. POST /v1/bills/{billId}/payments
4. POST /v1/insurance/claims

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Partition high-volume tables by hospital_id and time windows.
2. Read replicas for non-critical reads and reporting views.
3. Async processing for notifications, claims sync, and analytics.
4. Caching of schedule/bed snapshots with short TTL and event invalidation.

### 6.2 Handling Uneven Load

1. Prioritize emergency workflows over elective actions under saturation.
2. Queue insurance and report-heavy workloads.
3. Use backpressure at integration boundaries.

### 6.3 Reliability Plan

1. Retries with jitter for external payer and notification integrations.
2. Idempotent mutation APIs to avoid duplicate clinical/billing records.
3. Outbox pattern for reliable event publishing.
4. Multi-AZ deployment and automatic failover.
5. DR:
	- PITR backups and cross-region restore strategy.
	- Target RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. Fine-grained RBAC/ABAC for clinical data access.
2. Encryption at rest and in transit.
3. Full audit trail for record access and modifications.
4. Break-glass access with strict monitoring.
5. Compliance-ready retention and deletion policies.
6. Secrets management and periodic key rotation.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, patient_id hash, encounter_id, actor_role.
2. Metrics:
	- appointment_booking_latency_ms
	- bed_occupancy_rate
	- claim_submission_success_rate
	- billing_error_rate
	- system_uptime
3. Traces:
	- appointment -> encounter -> billing -> payment flow.
4. SLOs:
	- 99.99% successful critical clinical API operations.
	- p95 appointment booking latency < 250 ms.
	- 99% bed assignment operations < 180 ms.

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Strict access controls improve compliance but add workflow friction.
2. Rich EMR data model improves care continuity but increases schema complexity.
3. Strong consistency for bed and appointment operations limits horizontal flexibility.

### 8.2 Bottlenecks

1. Emergency surges creating scheduling and bed pressure.
2. External insurance API unreliability.
3. High write volume for clinical notes in peak hours.

### 8.3 Future Extensions

1. Interoperability adapters for health data exchange standards.
2. Predictive bed occupancy and staffing forecasts.
3. Clinical decision support and alerting.
4. Telemedicine-first appointment and e-prescription workflows.
5. Revenue cycle optimization with denial prediction.

## Folder Structure

1. prompt.md
2. README.md
3. src/
