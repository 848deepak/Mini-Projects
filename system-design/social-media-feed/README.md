# Social Media Feed System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Create and display personalized feeds.
2. Support follow graph, likes, comments, shares, and reposts.
3. Rank feed items using recency, affinity, and engagement.
4. Support moderation, spam detection, and content hiding.
5. Handle media posts and multi-device synchronization.

### 1.2 Non-Functional Requirements

1. Availability: 99.95% feed read/write APIs.
2. Latency (p95): feed load < 150 ms, post publish ack < 120 ms.
3. Throughput: baseline 20k reads/sec, 5k writes/sec; peak 200k reads/sec.
4. Durability: posts and interactions must be durable and replayable.

## 2. Architecture Diagram (Textual)

Client Apps
-> API Gateway
-> Feed Platform

Feed Platform -> Post Service -> OLTP DB + Media Store
Feed Platform -> Graph Service -> Graph Store
Feed Platform -> Fanout Service -> Queue + Cache
Feed Platform -> Ranking Service -> Feature Store + Model Service
Feed Platform -> Moderation Service -> Rules + Human Review Queue

## 3. Components and Responsibilities

1. Post Service: create/read posts and metadata.
2. Graph Service: follows, blocks, relationships.
3. Fanout Service: push to timelines for follower feeds.
4. Ranking Service: score and order feed candidates.
5. Moderation Service: spam/toxicity filtering and takedowns.

## 4. Data Design

1. user(user_id, name, status)
2. post(post_id, author_id, body, media_refs, visibility, created_at)
3. follow_edge(follower_id, followee_id, created_at)
4. timeline_item(user_id, post_id, rank_score, created_at)
5. engagement(engagement_id, post_id, user_id, type, created_at)
6. moderation_action(action_id, post_id, action, reason, created_at)

Use OLTP DB for writes, graph store for social edges, cache for timelines, and search index for discovery.

## 5. API Contracts

1. POST /v1/posts
2. GET /v1/feed?cursor=...
3. POST /v1/follows
4. POST /v1/posts/{postId}/engagements
5. POST /v1/moderation/actions

## 6. Scalability and Reliability

1. Hybrid fan-out on write for normal users and fan-out on read for celebrities.
2. Partition by user_id and post_id.
3. Cache home feed pages with short TTL.
4. Use outbox pattern for async ranking updates.
5. RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

1. Privacy and content access controls, abuse and spam detection.
2. Metrics: feed latency, fanout lag, moderation queue depth, engagement rates.
3. SLOs: 99.95% feed availability, p95 home feed load < 150 ms.

## 8. Trade-offs and Extensions

1. Fan-out on write improves read latency but increases storage and write cost.
2. Ranking freshness versus compute cost is a core trade-off.
3. Future: stories, short-form video, and creator monetization.

