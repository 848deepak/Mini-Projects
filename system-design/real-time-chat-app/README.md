# Real-Time Chat App

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. 1:1 chats and group chats with message delivery.
2. Presence indicators (online, away, typing, last seen).
3. Delivery/read receipts and message retry handling.
4. File and media attachments.
5. Push notifications for offline recipients.
6. Message history sync across devices.
7. Searchable conversation history.
8. Basic moderation/reporting controls.

### 1.2 Non-Functional Requirements

1. Availability:
	- Messaging APIs: 99.95% monthly.
	- Presence APIs: 99.9% monthly.
2. Latency (p95):
	- Send message: < 80 ms ack.
	- Message fan-out: < 200 ms to connected clients.
3. Throughput:
	- Baseline: 10k msg/sec.
	- Peak chat spikes: 100k msg/sec.
4. Durability:
	- Messages must be durably stored before ack.
5. Consistency:
	- Strong ordering per conversation.
	- Eventual consistency acceptable for search and analytics.

## 2. Architecture Diagram (Textual)

Web/Mobile/Desktop Clients
-> API Gateway
-> Auth Service
-> Chat Gateway (WebSocket/SSE)

Chat Gateway -> Messaging Service -> OLTP DB
Chat Gateway -> Presence Service -> Redis + Ephemeral Store
Messaging Service -> Fan-out Service -> Message Bus -> Connected Clients
Messaging Service -> Attachment Service -> Object Storage
Messaging Service -> Notification Service -> Queue -> Push Providers
Messaging Service -> Search Indexer -> Search Store

Shared:
1. Event bus for message_created, delivered, read events.
2. Observability and abuse detection.

## 3. Components and Responsibilities

1. Chat Gateway
	- Persistent connections, auth handshakes, backpressure.

2. Messaging Service
	- Message write path, ordering, receipts, retries.

3. Presence Service
	- Online status, typing indicators, heartbeat expiry.

4. Fan-out Service
	- Delivers messages to online members and enqueues offline notifications.

5. Attachment Service
	- Upload session, virus scan, media transcoding metadata.

6. Search Service
	- Conversation and message search indexing.

## 4. Data Design

### 4.1 Storage Choices

1. OLTP DB (PostgreSQL/Cassandra-like model): conversation metadata and message log.
2. Redis: presence, typing, connection/session routing.
3. Object storage: attachments and media.
4. Event stream: delivery/read receipts and async fan-out.
5. Search index: full-text message search.

### 4.2 Core Entities

1. user(user_id, display_name, status, created_at)
2. conversation(conversation_id, type, created_at, last_message_at, version)
3. conversation_member(conversation_id, user_id, role, joined_at, muted_until)
4. message(message_id, conversation_id, sender_id, body, message_type, client_seq, server_seq, created_at, status)
5. receipt(receipt_id, message_id, user_id, receipt_type, occurred_at)
6. presence(user_id, state, last_seen_at, device_id, connection_id)
7. attachment(attachment_id, message_id, object_uri, mime_type, size_bytes, scan_status)

### 4.3 Indexes and Constraints

1. Unique(conversation_id, server_seq) for ordering.
2. Index message(conversation_id, server_seq desc).
3. Index presence(state, last_seen_at).
4. Unique(client_seq, sender_id, conversation_id) for dedupe.

### 4.4 Concurrency and Race Prevention

1. Message server_seq assigned in conversation partition order.
2. Client_seq idempotency prevents duplicate sends after reconnect.
3. Membership updates guarded by version checks.
4. Presence heartbeats expire automatically with TTL.

## 5. API Contracts

### 5.1 Messaging

1. POST /v1/conversations
2. POST /v1/conversations/{conversationId}/messages
	- Request: { clientSeq, body, messageType, attachments?, idempotencyKey }
	- Response: { messageId, serverSeq, status }
3. GET /v1/conversations/{conversationId}/messages?cursor=...

### 5.2 Presence and Receipts

1. POST /v1/presence/heartbeat
2. POST /v1/messages/{messageId}/receipts
3. GET /v1/users/{userId}/presence

### 5.3 Attachments

1. POST /v1/attachments/init
2. POST /v1/attachments/complete

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Partition conversations by conversation_id hash.
2. Keep presence in Redis and route via connection registry.
3. Use push-based fan-out to active sockets; queue offline delivery.
4. Separate search indexing from real-time message path.

### 6.2 Spike Handling

1. Bulkhead isolation for large group chats.
2. Rate limiting and anti-spam throttling.
3. Backpressure on connections exceeding receive buffers.

### 6.3 Reliability Plan

1. Acknowledge messages only after durable write.
2. Idempotent message send with clientSeq.
3. Retry delivery fan-out and push notifications with jitter.
4. Multi-AZ DB, replicated cache, and queued offline delivery.
5. DR:
	- PITR and cross-region backups.
	- RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. E2E-ready message encryption strategy hooks.
2. JWT auth and conversation membership checks.
3. Attachment scanning and content policy controls.
4. Abuse moderation and rate limit per user/device.
5. Privacy controls for last-seen and presence visibility.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, conversation_id, message_id, user_id.
2. Metrics:
	- message_send_latency_ms
	- fanout_success_rate
	- presence_update_latency_ms
	- reconnect_rate
	- spam_block_rate
3. Traces:
	- send message -> durable write -> fan-out -> receipt ack.
4. SLOs:
	- 99.95% successful message sends.
	- p95 send ack < 80 ms.
	- 99% live delivery fan-out < 200 ms.

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Strict ordering per conversation adds partition hot spots.
2. Presence freshness consumes memory and network bandwidth.
3. Durable ack before fan-out protects data integrity but increases perceived send latency.

### 8.2 Bottlenecks

1. Large group chats.
2. Media upload/transcoding load.
3. Presence heartbeat storms.

### 8.3 Future Extensions

1. End-to-end encrypted messaging.
2. Voice/video calling signaling.
3. Message reactions and threads.
4. Bot integrations and business chat APIs.
5. Offline-first sync and message editing history.

## Folder Structure

1. prompt.md
2. README.md
3. src/
