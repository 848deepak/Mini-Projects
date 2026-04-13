# Online Auction System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Seller can create auctions with item details, reserve price, and bid rules.
2. Buyers can place bids in real time and see current winning price.
3. Anti-sniping support: extend auction end time when last-second bids arrive.
4. Support proxy/auto-bid up to bidder-defined max.
5. Support bid history and immutable auction audit trail.
6. Close auction and settle winner with payment capture flow.
7. Support buy-now and reserve price rules where applicable.
8. Provide seller/buyer notifications for key auction events.
9. Handle disputes, cancellation policy, and item moderation.

### 1.2 Non-Functional Requirements

1. Availability:
	- Bidding and auction state APIs: 99.95% monthly.
	- Search/listing APIs: 99.9% monthly.
2. Latency (p95):
	- Bid placement: < 100 ms.
	- Bid fan-out update: < 200 ms.
	- Auction page load: < 150 ms.
3. Throughput:
	- Baseline: 3k bid writes/sec.
	- Peak live auction: 30k bid writes/sec.
4. Durability:
	- Bid history and auction outcomes must be durably stored.
5. Consistency:
	- Strong consistency for bid ordering and winner selection.
	- Eventual consistency acceptable for search/indexing.

## 2. Architecture Diagram (Textual)

Buyer/Seller Web or Mobile App
-> API Gateway
-> Auth Service
-> Auction Platform Services

Auction Platform Services -> Catalog Service -> OLTP DB + Search Index
Auction Platform Services -> Bidding Service -> OLTP DB + Redis/Stream
Auction Platform Services -> Auction Timer Service -> Delayed Queue/Jobs
Auction Platform Services -> Settlement Service -> Payment Gateway
Auction Platform Services -> Notification Service -> Queue -> Email/SMS/WebSocket

Shared:
1. Event bus for bid_created, auction_extended, auction_closed events.
2. Observability and audit logs.
3. Stream-based fan-out for live bid updates.

## 3. Components and Responsibilities

1. Catalog Service
	- Auction listings, item metadata, categories, moderation status.

2. Bidding Service
	- Accept bids, maintain current highest bid, enforce ordering rules.

3. Auction Timer Service
	- Detect end-time, apply anti-sniping extensions, close auctions.

4. Settlement Service
	- Winner payment capture, seller payout, post-close workflow.

5. Notification Service
	- Real-time updates, email/SMS notifications, watcher alerts.

6. Moderation Service
	- Listing review, fraud flags, prohibited item checks.

## 4. Data Design

### 4.1 Storage Choices

1. OLTP DB (PostgreSQL): auctions, bids, winners, settlement.
2. Redis: hot auction state, current highest bid, pub/sub fan-out.
3. Search index: auction discovery and filtering.
4. Event log/stream: immutable bid event pipeline and audit replay.

### 4.2 Core Entities

1. auction(auction_id, seller_id, title, description, start_at, end_at, status, reserve_price, buy_now_price, anti_snipe_sec, created_at)
2. auction_item(item_id, auction_id, category, attributes_json, condition, image_refs)
3. bid(bid_id, auction_id, bidder_id, amount, placed_at, is_proxy, proxy_max_amount, status)
4. auction_state(auction_id, current_highest_bid, current_winner_bidder_id, last_bid_at, version)
5. auction_extension(extension_id, auction_id, reason, old_end_at, new_end_at, created_at)
6. settlement(settlement_id, auction_id, winner_id, amount, status, payment_ref)
7. watchlist(watch_id, auction_id, user_id, created_at)

### 4.3 Indexes and Constraints

1. Unique(bid_id) and index bid(auction_id, placed_at desc).
2. Index auction(status, end_at).
3. Unique active settlement per auction.
4. Version column on auction_state for optimistic concurrency.

### 4.4 Concurrency and Race Prevention

1. Bids are serialized per auction_id partition to maintain total order.
2. Highest bid update uses compare-and-set on auction_state.version.
3. Proxy bidding rules evaluated inside the same transactional boundary.
4. Idempotency keys for bid placement and settlement capture.

## 5. API Contracts

### 5.1 Auction Management

1. POST /v1/auctions
	- Request: { sellerId, title, reservePrice, buyNowPrice, startAt, endAt, antiSnipeSec, idempotencyKey }

2. GET /v1/auctions/{auctionId}
3. GET /v1/auctions?query=...&category=...

### 5.2 Bidding

1. POST /v1/auctions/{auctionId}/bids
	- Request: { bidderId, amount, proxyMaxAmount?, idempotencyKey }
	- Response: { bidId, status, currentHighestBid, endAt }

2. GET /v1/auctions/{auctionId}/bids
3. GET /v1/auctions/{auctionId}/state

### 5.3 Settlement

1. POST /v1/auctions/{auctionId}/close
2. POST /v1/settlements/{settlementId}/capture
3. POST /v1/settlements/{settlementId}/refund

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Partition by auction_id for bid write path.
2. Use Redis for hot auction state and live watchers.
3. WebSocket/SSE fan-out for bid updates.
4. Separate read APIs from write-heavy bid submission.

### 6.2 Spike Handling

1. Per-auction rate limiting and anti-bot controls.
2. Auction sharding to isolate hot listings.
3. Backpressure on notification fan-out and search refresh.

### 6.3 Reliability Plan

1. Retries with jitter for non-critical downstream calls only.
2. Idempotency for bid and settlement operations.
3. Outbox pattern for auction events.
4. Multi-AZ database and replicated cache/stream infrastructure.
5. DR:
	- PITR backups and cross-region event log replication.
	- RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. AuthN/AuthZ for seller, bidder, moderator, admin roles.
2. Fraud checks for shill bidding and abnormal bid patterns.
3. Encryption at rest/in transit.
4. Signed webhook/payment notifications.
5. Audit trail for bid edits, auction extension, and moderation.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, auction_id, bid_id, bidder_id.
2. Metrics:
	- bid_accept_latency_ms
	- bid_reject_rate
	- auction_extension_count
	- settlement_capture_success_rate
	- websocket_fanout_latency_ms
3. Traces:
	- bid -> state update -> fan-out -> watcher notification.
4. SLOs:
	- 99.95% successful bid submissions.
	- p95 bid placement latency < 100 ms.
	- 99% bid updates visible to watchers within 200 ms.

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Strict per-auction serialization guarantees correctness but reduces parallelism.
2. Anti-sniping improves fairness but increases auction duration uncertainty.
3. Live fan-out improves UX but increases infrastructure cost.

### 8.2 Bottlenecks

1. Celebrity/hot-item auctions with extreme write concentration.
2. Settlement/payment provider delays after auction close.
3. Watcher fan-out storms during final auction seconds.

### 8.3 Future Extensions

1. Auction formats like Dutch or sealed-bid auctions.
2. Escrow and escrow dispute workflows.
3. ML-based fraud scoring and shill detection.
4. Cross-border tax and currency handling.
5. Mobile push-only live bidding mode.

## Folder Structure

1. prompt.md
2. README.md
3. src/
