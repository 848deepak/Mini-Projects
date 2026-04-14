# System Design Projects

Architecture and scalability projects that model real-world, high-traffic systems. Each project focuses on component design, data flow, trade-off analysis, and back-of-the-envelope capacity planning.

## Overview

| Metric | Value |
|---|---|
| Total Projects | 24 |
| Difficulty Range | Beginner → Advanced |
| Estimated Effort | 4–14 hours per project |
| Output Format | Architecture diagrams, HLD/LLD documents, implementation blueprints |

## Domain Focus

These projects develop the skills asked in system design interviews and platform engineering roles:

- **Scalability Patterns** — horizontal/vertical scaling, sharding, partitioning
- **Distributed Systems** — CAP theorem trade-offs, eventual consistency, leader election
- **Data Modeling** — entity relationship design, indexing strategies, caching layers
- **Messaging & Events** — event-driven architecture, queues, pub/sub
- **Real-time Systems** — WebSocket, push notifications, live feeds
- **Domain-Specific Design** — ride booking, digital wallets, insurance, social feeds

## Project Index

| Project | Difficulty | Est. Effort | Key Focus Areas | Status |
|---|---|---|---|---|
| [cab-fleet-management](cab-fleet-management) | Advanced | 8–14 hours | Location tracking, fleet dispatch, real-time matching | Ready |
| [courier-tracking-system](courier-tracking-system) | Intermediate | 6–10 hours | Package lifecycle, geo-tracking, status updates | Ready |
| [crm-system](crm-system) | Intermediate | 6–10 hours | Lead management, pipeline stages, activity logging | Ready |
| [digital-wallet](digital-wallet) | Advanced | 8–14 hours | Ledger design, idempotency, fraud detection hooks | Ready |
| [ecommerce-order-management](ecommerce-order-management) | Intermediate | 6–10 hours | Order lifecycle, inventory sync, payment integration | Ready |
| [event-booking-system](event-booking-system) | Intermediate | 6–10 hours | Seat reservation, concurrency, ticketing flows | Ready |
| [file-storage-drive-mini](file-storage-drive-mini) | Intermediate | 6–10 hours | Chunked uploads, deduplication, access control | Ready |
| [food-delivery-system](food-delivery-system) | Advanced | 8–14 hours | Multi-party coordination, delivery ETA, geo-routing | Ready |
| [hospital-management](hospital-management) | Advanced | 8–14 hours | Patient records, scheduling, billing, HIPAA considerations | Ready |
| [hotel-booking-system](hotel-booking-system) | Intermediate | 6–10 hours | Availability calendar, rate management, booking flows | Ready |
| [movie-ticket-booking](movie-ticket-booking) | Beginner | 4–8 hours | Show scheduling, seat locking, payment | Ready |
| [online-auction-system](online-auction-system) | Intermediate | 6–10 hours | Bid processing, time-based events, fraud prevention | Ready |
| [online-banking-system](online-banking-system) | Advanced | 8–14 hours | Account management, transaction integrity, audit logs | Ready |
| [online-insurance-system](online-insurance-system) | Advanced | 8–14 hours | Policy lifecycle, claims processing, underwriting rules | Ready |
| [real-time-chat-app](real-time-chat-app) | Advanced | 8–14 hours | WebSocket scaling, message ordering, presence | Ready |
| [ride-booking-system](ride-booking-system) | Advanced | 8–14 hours | Driver matching, surge pricing, trip lifecycle | Ready |
| [smart-home-automation](smart-home-automation) | Intermediate | 6–10 hours | IoT command routing, device state, event triggers | Ready |
| [smart-notification-system](smart-notification-system) | Intermediate | 6–10 hours | Multi-channel delivery, rate limiting, retry logic | Ready |
| [smart-parking-system](smart-parking-system) | Intermediate | 6–10 hours | Space allocation, sensor integration, payment | Ready |
| [social-media-feed](social-media-feed) | Advanced | 8–14 hours | Fan-out strategies, ranking algorithms, caching | Ready |
| [stock-trading-simulator](stock-trading-simulator) | Advanced | 8–14 hours | Order book, matching engine, market data streaming | Ready |
| [subscription-billing-system](subscription-billing-system) | Advanced | 8–14 hours | Plan lifecycle, metered billing, dunning flows | Ready |
| [traffic-monitoring-system](traffic-monitoring-system) | Intermediate | 6–10 hours | Sensor data ingestion, aggregation, alerting | Ready |
| [url-shortener](url-shortener) | Beginner | 4–8 hours | Hash generation, redirect, analytics tracking | Ready |

## Difficulty Guide

| Level | Profile |
|---|---|
| **Beginner** | Single-service design with clear data model and basic trade-offs |
| **Intermediate** | Multi-service coordination, caching considerations, moderate concurrency |
| **Advanced** | Distributed systems complexity, high-throughput processing, fault tolerance |

## Recommended Learning Paths

### Path 1: Interview Foundations
1. [url-shortener](url-shortener) — hashing, redirection, counters
2. [movie-ticket-booking](movie-ticket-booking) — seat locking, concurrency
3. [event-booking-system](event-booking-system) — distributed reservation
4. [real-time-chat-app](real-time-chat-app) — WebSocket, message queues

### Path 2: Marketplace & Transactions
1. [ecommerce-order-management](ecommerce-order-management)
2. [digital-wallet](digital-wallet)
3. [subscription-billing-system](subscription-billing-system)
4. [online-banking-system](online-banking-system)

### Path 3: Location & Real-time Systems
1. [courier-tracking-system](courier-tracking-system)
2. [ride-booking-system](ride-booking-system)
3. [cab-fleet-management](cab-fleet-management)
4. [food-delivery-system](food-delivery-system)

### Path 4: Data & Feed Systems
1. [social-media-feed](social-media-feed)
2. [stock-trading-simulator](stock-trading-simulator)
3. [traffic-monitoring-system](traffic-monitoring-system)
4. [smart-notification-system](smart-notification-system)

## How to Approach Each Project

Every project folder contains a `README.md` with:

1. **Problem Statement** — business goal and scale targets
2. **Functional Requirements** — core use cases
3. **Non-Functional Requirements** — latency, throughput, availability targets
4. **High-Level Design (HLD)** — architecture diagram and component overview
5. **Low-Level Design (LLD)** — data models, API schemas, key algorithms
6. **Trade-off Analysis** — CAP, consistency vs. availability, sync vs. async
7. **Scaling Strategy** — sharding, replication, CDN, caching layers

Recommended workflow:

1. Read the problem statement and requirements.
2. Fork the design before reading the proposed solution.
3. Compare your approach with the documented HLD/LLD.
4. Implement a simplified prototype or write a critique of the trade-offs.

## Common Patterns Across Projects

| Pattern | Appears In |
|---|---|
| Redis caching | social-media-feed, url-shortener, ride-booking-system |
| Message queues (Kafka / SQS) | smart-notification-system, food-delivery-system, stock-trading-simulator |
| Database sharding | online-banking-system, digital-wallet, social-media-feed |
| WebSocket / SSE | real-time-chat-app, cab-fleet-management, stock-trading-simulator |
| Leader election | online-auction-system, subscription-billing-system |

## Related Domains

- For implementations of these designs, see [`full-stack/`](../full-stack).
- For cloud infrastructure that hosts these systems, see [`cloud-computing/`](../cloud-computing).
- For analytics layers on top of these systems, see [`ai-ml/`](../ai-ml).

---

Back to [Repository Root](../README.md)
