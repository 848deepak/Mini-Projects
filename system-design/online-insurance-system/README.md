# Online Insurance System

This repository now contains a full-stack implementation of the insurance platform described in `prompt.md`.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Shared contracts: Zod schemas and TypeScript types in a workspace package
- Storage: JSON-backed persistence layer with serialized writes for local development

## Project Structure

```text
.
|- apps/
|  |- api/               # Express API
|  |  |- src/
|  |  |- tests/
|  |  |- data/db.json
|  |- web/               # React frontend
|     |- src/
|- packages/
|  |- shared/            # API schemas and domain types
|- prompt.md
|- README.md
```

## Features Implemented

- Quote generation with risk-based pricing
- Policy issuance from quote binding
- Claims submission and guarded state transitions
- Renewal quote generation and policy renewal
- Invoice payment with idempotency
- Audit events stored for all critical mutations

## Robustness and Industry Practices

- Input validation through shared Zod schemas
- Security middleware: Helmet, CORS controls, rate limiting
- Structured request logging via Pino
- Idempotency support for write APIs
- Guarded claim state transitions to prevent invalid workflow updates
- Serialized mutation queue to prevent concurrent write races in local storage mode
- Atomic file writes to reduce data corruption risk

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

### 3. Run backend and frontend

```bash
npm run dev
```

- API: `http://localhost:4000`
- Web: `http://localhost:5173`

## Build and Validate

```bash
npm run build
npm run test
npm run lint
```

## API Surface

- `POST /v1/quotes`
- `POST /v1/policies`
- `GET /v1/policies/:policyId`
- `POST /v1/claims`
- `POST /v1/claims/:claimId/triage`
- `POST /v1/claims/:claimId/settle`
- `POST /v1/claims/:claimId/reject`
- `GET /v1/policies/:policyId/renewal-quote`
- `POST /v1/policies/:policyId/renew`
- `POST /v1/invoices/:invoiceId/pay`

## Notes for Production Hardening

The current implementation is designed to be robust for local and interview-grade usage. For production, replace JSON persistence with PostgreSQL + Redis, add authentication/RBAC, move audit events to append-only storage, add OpenTelemetry tracing, and deploy behind API gateway/WAF.
