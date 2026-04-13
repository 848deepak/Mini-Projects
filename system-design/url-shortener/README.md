# URL Shortener

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Shorten long URLs into compact aliases.
2. Support custom aliases and expiration.
3. Redirect quickly with low latency.
4. Provide click analytics and referrer breakdown.
5. Detect abuse, spam, and malicious destinations.

### 1.2 Non-Functional Requirements

1. Availability: 99.99% redirect API, 99.9% analytics.
2. Latency (p95): redirect < 50 ms, create short URL < 120 ms.
3. Throughput: baseline 20k redirects/sec, peak 200k/sec.
4. Durability: mappings and analytics events must persist.

## 2. Architecture Diagram (Textual)

Clients
-> API Gateway
-> Shorten API / Redirect API

Shorten API -> Mapping Service -> OLTP DB
Redirect API -> Lookup Cache -> OLTP DB
Redirect API -> Analytics Pipeline -> Stream Bus
Redirect API -> Abuse Detection Service

## 3. Components and Responsibilities

1. Mapping Service: create, validate, and store short links.
2. Redirect Service: resolve short code and issue 301/302 redirect.
3. Analytics Service: click aggregation and reports.
4. Abuse Detection: malicious URL scanning and rate limiting.

## 4. Data Design

1. url_mapping(code, long_url, custom_alias, owner_id, expires_at, created_at, status)
2. click_event(event_id, code, referrer, user_agent, ip_hash, occurred_at)
3. abuse_flag(flag_id, code, reason, status, created_at)

Indexes: unique(code), unique(custom_alias), index expires_at, code.

## 5. API Contracts

1. POST /v1/shorten
2. GET /{code}
3. GET /v1/links/{code}/analytics
4. POST /v1/links/{code}/disable

## 6. Scalability and Reliability

1. Cache hot redirects at edge/CDN and Redis.
2. Partition mappings by code hash.
3. Use idempotency keys for create operations.
4. RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

1. Rate limiting, malware scanning, blocklists, and admin auth.
2. Metrics: redirect latency, cache hit rate, create success, abuse blocks.
3. SLOs: 99.99% redirect availability, p95 redirect < 50 ms.

## 8. Trade-offs and Extensions

1. Edge caching improves speed but complicates revocation.
2. Analytics introduces write amplification on the redirect path.
3. Future: branded domains, QR codes, and deep-link routing.

