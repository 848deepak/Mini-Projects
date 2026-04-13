# Smart Notification System

Category: system-design

## Implementation Status

This folder now includes a working static MVP for notification routing and delivery simulation.

## Files

1. `index.html` - main dashboard.
2. `style.css` - dark glassmorphism UI.
3. `data.js` - demo users, templates, and channels.
4. `app.js` - routing, preferences, retries, analytics, and localStorage persistence.

## How to Use

1. Open `index.html` in a browser.
2. Pick a recipient and template.
3. Choose channels, priority, and an idempotency key.
4. Send the notification to simulate routing, retries, and delivery.
5. Adjust user preferences and quiet hours to see routing changes.

## Notes

- Delivery success is simulated with randomized provider reliability.
- Preference and history state are saved locally in the browser.
# Smart Notification System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Accept notification requests from product services.
2. Route notifications across email, SMS, push, in-app, and webhooks.
3. Respect per-user preferences, quiet hours, and channel opt-out rules.
4. Retry failed sends with policy-based backoff.
5. Deduplicate and ensure idempotent delivery attempts.
6. Provide templates and localization support.
7. Expose delivery analytics and bounce/failure reasons.
8. Support campaign and transactional notifications.

### 1.2 Non-Functional Requirements

1. Availability: 99.95% ingestion, 99.9% analytics.
2. Latency (p95): enqueue < 80 ms, first delivery attempt < 500 ms for transactional alerts.
3. Throughput: baseline 10k notifications/sec, peak 100k/sec.
4. Durability: queued notifications must survive AZ failure.
5. Consistency: strong for user preferences; eventual for analytics.

## 2. Architecture Diagram (Textual)

Client Services / Admin Console
-> API Gateway
-> Notification Ingest Service

Notification Ingest Service -> Template Service -> Cache + DB
Notification Ingest Service -> Preference Service -> OLTP DB + Cache
Notification Ingest Service -> Orchestration Service -> Queue
Orchestration Service -> Channel Workers -> Email/SMS/Push/Webhook Providers
Orchestration Service -> Delivery Tracker -> Event Store

## 3. Components and Responsibilities

1. Ingest Service: validate requests, assign dedupe keys, persist jobs.
2. Preference Service: user preferences, quiet hours, localization.
3. Template Service: render templates and manage variants.
4. Orchestration Service: channel selection, retries, failover.
5. Delivery Tracker: delivery receipts, bounces, analytics.

## 4. Data Design

1. notification(notification_id, user_id, campaign_id, type, status, priority, idempotency_key)
2. notification_attempt(attempt_id, notification_id, channel, provider, status, error_code, created_at)
3. user_preference(user_id, channel, enabled, quiet_hours_json, locale)
4. template(template_id, name, channel, locale, body, variables_json, version)
5. delivery_event(event_id, notification_id, provider_message_id, status, occurred_at, payload_json)

Indexes: unique idempotency_key, status/priority, notification_id/time.

## 5. API Contracts

1. POST /v1/notifications
2. GET /v1/notifications/{notificationId}
3. POST /v1/templates
4. POST /v1/preferences
5. GET /v1/deliveries?campaignId=...

## 6. Scalability and Reliability

1. Partition queues by tenant/campaign and priority.
2. Retry with exponential backoff and dead-letter queues.
3. Use provider-specific circuit breakers.
4. RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

1. Signed webhooks, tenant isolation, PII redaction in logs.
2. Metrics: enqueue latency, delivery success rate, bounce rate, retry count.
3. SLOs: 99.95% enqueue availability, p95 transactional delivery start < 500 ms.

## 8. Trade-offs and Extensions

1. Multi-channel failover improves delivery but complicates dedupe.
2. Rich preference rules improve UX but add evaluation cost.
3. Future: smart send-time optimization and per-user delivery scoring.

