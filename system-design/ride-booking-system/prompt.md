# Prompt: ride-booking-system

Design a ride booking platform matching riders with nearby drivers in real time.

## Deliverables
- Functional requirements and clear non-functional requirements (availability, latency, throughput, durability).
- High-level architecture with major services and data flow.
- Data model and storage choices with justification.
- API design for critical user journeys.
- Scaling strategy, caching, and partitioning approach.
- Reliability plan: retries, idempotency, failover, and disaster recovery.
- Security and compliance considerations.
- Observability: logs, metrics, traces, and SLOs.
- Trade-offs, bottlenecks, and future evolution plan.

## Constraints to Consider
- Handle traffic spikes and uneven access patterns.
- Prevent race conditions for concurrent writes.
- Keep costs reasonable while preserving user experience.
- Design for incremental rollout and backward compatibility.

## Suggested Output Structure
1. Requirements
2. Architecture Diagram (textual)
3. Components and Responsibilities
4. Data Design
5. API Contracts
6. Scalability and Reliability
7. Security and Observability
8. Trade-offs and Extensions
