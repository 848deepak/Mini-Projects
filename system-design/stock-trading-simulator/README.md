# Stock Trading Simulator

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. Stream market data into the simulator.
2. Place simulated buy/sell orders and execute against a mock exchange.
3. Track portfolio, cash balance, holdings, and P&L.
4. Support limit/market orders and order status tracking.
5. Generate trade history and performance analytics.

### 1.2 Non-Functional Requirements

1. Availability: 99.95% for trading APIs.
2. Latency (p95): order submit < 100 ms, market data ingest < 150 ms.
3. Throughput: baseline 5k market events/sec, peak 50k/sec.
4. Durability: orders and portfolio state must be durable.

## 2. Architecture Diagram (Textual)

Client Apps
-> API Gateway
-> Auth Service
-> Trading Simulator Services

Trading Simulator Services -> Market Data Ingest -> Stream Bus
Trading Simulator Services -> Order Management -> OLTP DB
Trading Simulator Services -> Matching/Execution Engine -> In-memory Engine + DB
Trading Simulator Services -> Portfolio Service -> OLTP DB + Cache
Trading Simulator Services -> Analytics Service -> Warehouse

## 3. Components and Responsibilities

1. Market Data Ingest: normalize quote/tick events.
2. Order Management: validate, persist, and track orders.
3. Matching/Execution Engine: deterministic simulated fills.
4. Portfolio Service: cash/holdings/P&L updates.
5. Analytics Service: charts, returns, and trade metrics.

## 4. Data Design

1. asset(asset_id, symbol, exchange, status)
2. market_tick(tick_id, asset_id, price, volume, occurred_at)
3. order(order_id, user_id, asset_id, side, type, qty, limit_price, status, created_at)
4. fill(fill_id, order_id, price, qty, created_at)
5. portfolio(user_id, cash_balance, market_value, pnl, version)
6. holding(user_id, asset_id, qty, avg_cost)

Use OLTP DB for orders/portfolio and stream store for market data.

## 5. API Contracts

1. POST /v1/orders
2. GET /v1/orders/{orderId}
3. GET /v1/portfolio/{userId}
4. GET /v1/market/{symbol}/ticks

## 6. Scalability and Reliability

1. Partition market data by symbol.
2. Serialize order matching per symbol to keep deterministic fills.
3. Idempotency on order submission.
4. RPO <= 5 minutes, RTO <= 30 minutes.

## 7. Security and Observability

1. AuthZ for user portfolios and admin operations.
2. Metrics: order latency, fill rate, ingest lag, portfolio update lag.
3. SLOs: 99.95% order API availability, p95 submit < 100 ms.

## 8. Trade-offs and Extensions

1. Deterministic simulation is easier than realistic exchange modeling.
2. Future: strategy backtesting, paper trading, and alerts.

