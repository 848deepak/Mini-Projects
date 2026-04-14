# Ecommerce Order Management App

Production-style full-stack implementation with:

- Backend: Java 17 + Spring Boot 3 (REST APIs)
- Frontend: Production-ready vanilla JavaScript UI served by Spring Boot static assets
- Architecture: Layered backend (controller/service/domain) with idempotency and status transition rules

## Features Implemented

1. Order placement with pricing snapshot and idempotency key.
2. Order lifecycle transitions with guardrails:
   - CREATED
   - PAYMENT_PENDING
   - PAID
   - PACKING
   - SHIPPED
   - DELIVERED
   - CANCELED
   - RETURN_REQUESTED
   - RETURNED
   - REFUNDED
3. Payment status update endpoint.
4. Shipment creation and delivery update.
5. Return request and refund processing.
6. Customer order history fetch.
7. Production-style dashboard UI:
   - Login-first experience
   - Sidebar layout
   - Dense tables for operational view
   - Create order and return flows

## Run Locally

Prerequisite: Java 17+ and Maven 3.9+

```bash
mvn spring-boot:run
```

Application URLs:

- Frontend UI: http://localhost:8080
- Health: http://localhost:8080/api/health

## API Overview

Base path: `/api/v1`

1. `POST /orders`
2. `GET /orders/{orderId}`
3. `GET /orders?customerId={customerId}`
4. `POST /orders/{orderId}/payment`
5. `POST /orders/{orderId}/cancel`
6. `POST /orders/{orderId}/shipments`
7. `POST /orders/{orderId}/deliver`
8. `POST /returns`
9. `POST /returns/{returnId}/refund`

## Project Structure

1. `src/main/java/com/ecommerce/oms`
2. `src/main/resources/static`
3. `src/main/resources/application.properties`
4. `pom.xml`
