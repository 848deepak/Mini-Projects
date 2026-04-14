# Full Stack Projects

End-to-end product engineering projects covering a broad spectrum of real-world application domains, built with modern web frameworks and backed by relational or document databases.

## Overview

| Metric | Value |
|---|---|
| Total Projects | 36 |
| Difficulty Range | Beginner → Advanced |
| Estimated Effort | 6–18 hours per project |
| Primary Stack | Next.js, Spring Boot, PostgreSQL / MySQL, REST / WebSocket |

## Domain Focus

These projects cover the full product delivery lifecycle:

- **Frontend** — React / Next.js UI with responsive layouts and state management
- **Backend** — REST APIs, authentication, role-based access control
- **Database** — relational schema design, migrations, ORM usage
- **Real-time** — WebSocket or SSE for live notifications, chats, and dashboards
- **DevOps Integration** — CI/CD pipeline wiring (see `cicd-fullstack-app`)

## Project Index

| Project | Difficulty | Est. Effort | Status |
|---|---|---|---|
| [asset-resource-management](asset-resource-management) | Intermediate | 8–16 hours | Ready |
| [cicd-fullstack-app](cicd-fullstack-app) | Advanced | 10–18 hours | Ready |
| [college-management-portal](college-management-portal) | Intermediate | 8–16 hours | Ready |
| [complaint-grievance-system](complaint-grievance-system) | Intermediate | 8–16 hours | Ready |
| [course-certification-platform](course-certification-platform) | Intermediate | 8–16 hours | Ready |
| [customer-support-ticketing](customer-support-ticketing) | Intermediate | 8–16 hours | Ready |
| [digital-expense-tracker](digital-expense-tracker) | Beginner | 6–12 hours | Ready |
| [elearning-doubt-resolution](elearning-doubt-resolution) | Intermediate | 8–16 hours | Ready |
| [employee-attendance-payroll](employee-attendance-payroll) | Advanced | 10–18 hours | Ready |
| [freelancer-marketplace](freelancer-marketplace) | Advanced | 10–18 hours | Ready |
| [hospital-appointment-system](hospital-appointment-system) | Intermediate | 8–16 hours | Ready |
| [hr-recruitment-scheduling](hr-recruitment-scheduling) | Intermediate | 8–16 hours | Ready |
| [inventory-stock-management](inventory-stock-management) | Intermediate | 8–16 hours | Ready |
| [job-portal](job-portal) | Intermediate | 8–16 hours | Ready |
| [learning-management-system](learning-management-system) | Advanced | 10–18 hours | Ready |
| [library-management-system](library-management-system) | Intermediate | 8–16 hours | Ready |
| [multi-vendor-ecommerce](multi-vendor-ecommerce) | Advanced | 10–18 hours | Ready |
| [online-doctor-consultation](online-doctor-consultation) | Intermediate | 8–16 hours | Ready |
| [online-event-registration](online-event-registration) | Intermediate | 8–16 hours | Ready |
| [online-examination-system](online-examination-system) | Intermediate | 8–16 hours | Ready |
| [online-food-ordering](online-food-ordering) | Intermediate | 8–16 hours | Ready |
| [online-quiz-platform](online-quiz-platform) | Beginner | 6–12 hours | Ready |
| [online-voting-system](online-voting-system) | Intermediate | 8–16 hours | Ready |
| [product-review-rating](product-review-rating) | Beginner | 6–12 hours | Ready |
| [real-time-notification-system](real-time-notification-system) | Advanced | 10–18 hours | Ready |
| [restaurant-table-reservation](restaurant-table-reservation) | Intermediate | 8–16 hours | Ready |
| [secure-file-sharing](secure-file-sharing) | Advanced | 10–18 hours | Ready |
| [smart-banking-system](smart-banking-system) | Advanced | 10–18 hours | Ready |
| [smart-city-issue-reporting](smart-city-issue-reporting) | Intermediate | 8–16 hours | Ready |
| [sports-analytics-dashboard](sports-analytics-dashboard) | Intermediate | 8–16 hours | Ready |
| [student-feedback-rating](student-feedback-rating) | Beginner | 6–12 hours | Ready |
| [subscription-content-platform](subscription-content-platform) | Advanced | 10–18 hours | Ready |
| [task-project-collaboration](task-project-collaboration) | Advanced | 10–18 hours | Ready |
| [travel-booking-itinerary](travel-booking-itinerary) | Intermediate | 8–16 hours | Ready |
| [vehicle-service-booking](vehicle-service-booking) | Intermediate | 8–16 hours | Ready |
| [warehouse-logistics](warehouse-logistics) | Advanced | 10–18 hours | Ready |

## Difficulty Guide

| Level | Profile |
|---|---|
| **Beginner** | Single-feature CRUD apps, simple auth, minimal state |
| **Intermediate** | Multi-role systems, relational schemas, moderate API complexity |
| **Advanced** | Real-time features, payment flows, multi-tenant architecture, CI/CD integration |

## Suggested Learning Paths

### Path 1: Core Product Skills (Beginner → Intermediate)
1. [digital-expense-tracker](digital-expense-tracker)
2. [online-quiz-platform](online-quiz-platform)
3. [job-portal](job-portal)
4. [hospital-appointment-system](hospital-appointment-system)

### Path 2: Scale and Complexity (Intermediate → Advanced)
1. [learning-management-system](learning-management-system)
2. [multi-vendor-ecommerce](multi-vendor-ecommerce)
3. [task-project-collaboration](task-project-collaboration)
4. [real-time-notification-system](real-time-notification-system)

### Path 3: Specialized Domains
1. [smart-banking-system](smart-banking-system) — fintech
2. [freelancer-marketplace](freelancer-marketplace) — marketplace dynamics
3. [subscription-content-platform](subscription-content-platform) — SaaS billing
4. [cicd-fullstack-app](cicd-fullstack-app) — DevOps integration

## Quick Start

1. Open the project folder and read its `README.md`.
2. Install dependencies based on the stack (Next.js or Spring Boot):

   **Next.js projects:**
   ```bash
   npm install
   npm run dev
   ```

   **Spring Boot projects:**
   ```bash
   ./mvnw spring-boot:run
   # or
   ./gradlew bootRun
   ```

3. Configure required environment variables (`.env.local` or `application.properties`).
4. Run database migrations if documented.

## Prerequisites

- Node.js 18+ and npm (for Next.js projects)
- Java 17+ and Maven or Gradle (for Spring Boot projects)
- PostgreSQL or MySQL running locally or via Docker
- Basic knowledge of REST APIs and relational databases

## Related Domains

- For cloud deployment of these apps, see [`cloud-computing/`](../cloud-computing).
- For architecture and low-level system design behind these systems, see [`system-design/`](../system-design).
- For the AI/analytics layer on top of some of these platforms, see [`ai-ml/`](../ai-ml).

---

Back to [Repository Root](../README.md)
