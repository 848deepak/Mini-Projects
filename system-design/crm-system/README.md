# CRM System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Manage leads from multiple channels (web, import, ads, referrals).
2. Deduplicate and enrich leads before qualification.
3. Convert leads to accounts, contacts, and opportunities.
4. Manage sales pipeline stages with customizable workflows.
5. Record interactions (calls, emails, meetings, notes, tasks).
6. Assign ownership with territory/round-robin rules.
7. Forecast revenue by stage, probability, and close date.
8. Provide activity timeline and next best action reminders.
9. Role-based reporting and dashboard views for reps and managers.

### 1.2 Non-Functional Requirements

1. Availability:
	- Core CRUD and pipeline APIs: 99.95% monthly.
	- Reporting APIs: 99.9% monthly.
2. Latency (p95):
	- Lead/account/opportunity reads: < 180 ms.
	- Stage transition writes: < 250 ms.
	- Dashboard aggregate reads: < 400 ms.
3. Throughput:
	- Normal: 2k RPS mixed workload.
	- Peak campaign/import windows: 12k RPS + batch imports.
4. Durability:
	- CRM records and audit history must be durable with PITR support.
5. Consistency:
	- Strong consistency for ownership and stage transitions.
	- Eventual consistency for analytics/search indexes.

## 2. Architecture Diagram (Textual)

Web App / Mobile CRM / Integrations
-> API Gateway
-> AuthN/AuthZ Service
-> CRM Service Layer

CRM Service Layer -> Lead Service -> OLTP DB + Cache
CRM Service Layer -> Account/Contact Service -> OLTP DB
CRM Service Layer -> Opportunity Service -> OLTP DB
CRM Service Layer -> Activity Service -> OLTP DB + Search Index
CRM Service Layer -> Workflow Service -> Rules Engine + Queue
CRM Service Layer -> Reporting Service -> Read Replica + Warehouse

Shared:
1. Event Bus for lead conversion, stage changes, activity events.
2. ETL/stream jobs for analytics and forecasting features.
3. Observability stack and audit log pipeline.

## 3. Components and Responsibilities

1. Lead Service
	- Intake, deduplication, scoring, qualification workflows.

2. Account and Contact Service
	- Canonical customer master data and relationships.

3. Opportunity Service
	- Pipeline stage model, deal values, probability, close plans.

4. Activity Service
	- Calls/emails/meetings/tasks timeline and reminders.

5. Workflow and Assignment Service
	- SLA timers, routing logic, escalation, automation rules.

6. Reporting and Forecast Service
	- Rep performance, funnel conversion, forecast rollups.

## 4. Data Design

### 4.1 Storage Choices

1. Primary OLTP DB: PostgreSQL for transactional CRM records.
2. Redis cache: hot lookups for account summaries and pipeline cards.
3. Search index: OpenSearch/Elastic for full-text activity and global search.
4. Data warehouse: historical reporting and forecasting.

### 4.2 Core Entities

1. lead(lead_id, org_id, source, status, score, owner_user_id, created_at)
2. lead_identity(identity_id, lead_id, email, phone, external_ref)
3. account(account_id, org_id, name, industry, size, owner_user_id)
4. contact(contact_id, account_id, first_name, last_name, email, phone, title)
5. opportunity(opportunity_id, account_id, name, stage, amount, currency, probability, expected_close_date, owner_user_id)
6. pipeline_stage(stage_id, org_id, name, order_no, is_closed)
7. interaction(interaction_id, entity_type, entity_id, channel, subject, notes, occurred_at, created_by)
8. task(task_id, entity_type, entity_id, due_at, priority, status, assignee_user_id)
9. audit_log(audit_id, entity_type, entity_id, action, actor_user_id, occurred_at, before_json, after_json)

### 4.3 Indexes and Constraints

1. Unique(org_id, normalized_email) for lead dedupe candidates.
2. Index opportunity(org_id, stage, expected_close_date).
3. Index interaction(entity_type, entity_id, occurred_at desc).
4. Version column on opportunity for optimistic locking on stage updates.

### 4.4 Concurrency and Race Prevention

1. Stage transition guarded by compare-and-set on opportunity version.
2. Assignment updates use transactional checks to avoid owner overwrite races.
3. Lead conversion enforces single conversion outcome via unique lead->account mapping.
4. Idempotency keys required for imports and external webhook writes.

## 5. API Contracts

### 5.1 Lead Management

1. POST /v1/leads
	- Request: { source, profile, ownerUserId, idempotencyKey }
	- Response: { leadId, status, score }

2. POST /v1/leads/{leadId}/qualify
	- Request: { qualificationNotes, decision }

3. POST /v1/leads/{leadId}/convert
	- Request: { accountData, contactData, opportunityData, idempotencyKey }
	- Response: { accountId, contactId, opportunityId }

### 5.2 Opportunity and Pipeline

1. GET /v1/opportunities?stage=...&owner=...&from=...&to=...
2. PATCH /v1/opportunities/{opportunityId}/stage
	- Request: { fromStage, toStage, reason, version, idempotencyKey }
3. PATCH /v1/opportunities/{opportunityId}
	- Update amount/probability/close date.

### 5.3 Activity and Tasks

1. POST /v1/interactions
	- Request: { entityType, entityId, channel, subject, notes, occurredAt }
2. POST /v1/tasks
	- Request: { entityType, entityId, dueAt, priority, assigneeUserId }
3. PATCH /v1/tasks/{taskId}/status

### 5.4 Reporting

1. GET /v1/reports/funnel?window=30d
2. GET /v1/reports/forecast?quarter=2026-Q2

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Tenant-aware partitioning by org_id for large multi-tenant scale.
2. Read replicas for reporting and heavy list views.
3. Async jobs for enrichment, scoring, and forecast recalculation.
4. Caching for dashboard cards and frequent filters.

### 6.2 Spikes and Uneven Patterns

1. Bulk import pipeline separated from interactive API path.
2. Queue-backed write smoothing for webhook bursts.
3. Adaptive throttling per tenant to preserve fair usage.

### 6.3 Reliability Plan

1. Retries with exponential backoff for transient dependency errors.
2. Idempotent mutation endpoints using idempotency keys.
3. Dead-letter queues for failed integration events.
4. Multi-AZ database with automated failover.
5. DR:
	- Point-in-time recovery and cross-region backup copy.
	- Target RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. Tenant isolation and row-level access enforcement.
2. RBAC for sales rep, manager, admin roles.
3. Field-level masking for sensitive fields (email/phone).
4. Encryption in transit and at rest.
5. Auditability for compliance-sensitive updates.
6. GDPR-like controls: consent flags, retention, and delete workflows.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, org_id, entity_type, entity_id, actor_id.
2. Metrics:
	- lead_conversion_rate
	- opportunity_stage_transition_latency_ms
	- task_overdue_count
	- import_error_rate
	- report_query_latency_ms
3. Traces:
	- lead intake -> qualification -> conversion.
4. SLOs:
	- 99.95% successful core CRM mutation requests.
	- p95 stage transition latency < 250 ms.
	- 99% dashboard reads < 400 ms.

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Rich, configurable workflows increase flexibility but add operational complexity.
2. Strong tenant isolation can reduce cross-tenant analytics simplicity.
3. Search indexing improves UX but introduces eventual consistency lag.

### 8.2 Bottlenecks

1. Large tenant imports and backfills.
2. Highly customized pipeline rules triggering expensive evaluations.
3. Broad wildcard search queries across interaction history.

### 8.3 Future Extensions

1. AI-assisted lead scoring and win-probability prediction.
2. Conversation intelligence integration from call transcripts.
3. Revenue attribution across multi-touch campaigns.
4. Territory optimization and quota planning.
5. Marketplace for third-party CRM plugins.

## Folder Structure

1. prompt.md
2. README.md
3. src/
