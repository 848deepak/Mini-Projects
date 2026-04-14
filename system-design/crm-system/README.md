# CRM System (Spring Boot + JavaScript)

Runnable CRM starter built with a modern system-design stack:

- Java 21
- Spring Boot 3 REST APIs
- JPA + H2 (dev mode; PostgreSQL-ready design)
- JavaScript dashboard served from static assets

## Features Implemented

- Lead intake with idempotency and dedupe by email
- Lead qualification workflow (`QUALIFIED`, `REJECTED`)
- Lead conversion to account, contact, and opportunity
- Opportunity listing and stage transitions with optimistic version checks
- Interaction logging APIs
- Task creation and status updates
- Funnel and forecast reporting endpoints

## Run

```bash
cd /Users/deepakpandey/Coding/mini-projects/system-design/crm-system
mvn spring-boot:run
```

Open:

- App UI: http://localhost:8081/
- H2 Console: http://localhost:8081/h2-console

H2 JDBC URL:

```text
jdbc:h2:mem:crmdb
```

## API Snapshot

- `POST /api/v1/leads`
- `POST /api/v1/leads/{leadId}/qualify`
- `POST /api/v1/leads/{leadId}/convert`
- `GET /api/v1/opportunities`
- `PATCH /api/v1/opportunities/{opportunityId}/stage`
- `POST /api/v1/interactions`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/{taskId}/status`
- `GET /api/v1/reports/funnel`
- `GET /api/v1/reports/forecast?quarter=2026-Q2`
