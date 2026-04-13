# Mini Projects Repository

Professional multi-domain project portfolio for structured learning, hands-on implementation, and portfolio-ready delivery.

This repository includes **87 projects** across **System Design**, **Full Stack**, **Cloud Computing**, and **AI/ML**, each intended to be independently understandable and executable from its own folder.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Executive Summary](#executive-summary)
3. [Portfolio Matrix](#portfolio-matrix)
4. [Role-Based Entry Points](#role-based-entry-points)
5. [Learning Paths](#learning-paths)
6. [Prerequisites and Environment](#prerequisites-and-environment)
7. [Project Catalog](#project-catalog)
8. [Documentation Standard](#documentation-standard)
9. [Quality Gates](#quality-gates)
10. [Community and Governance](#community-and-governance)
11. [Repository Policies](#repository-policies)

## Quick Start

1. Choose a domain based on your goal:
   - System Design: architecture and scalability
   - Full Stack: product implementation end to end
   - Cloud Computing: deployment and infrastructure
   - AI/ML: analytics and recommendation workflows
2. Open the selected project folder and read its `README.md` first.
3. If available, follow `prompt.md` for phased implementation guidance.
4. Build in three phases:
   - Phase 1: scope, architecture, baseline setup
   - Phase 2: core feature implementation
   - Phase 3: test coverage, hardening, documentation polish
5. Track completion against the local README checklist before marking work complete.

## Executive Summary

- Total project folders: 87
- Project README coverage: 87/87
- Prompt specifications available: 24
- Source directories present: 22
- Planning document: [mini-projects-complete-repo-plan.md](mini-projects-complete-repo-plan.md)

## Portfolio Matrix

| Domain | Folder | Projects | README Coverage | Core Focus |
|---|---|---:|---:|---|
| System Design | `system-design/` | 24 | 24/24 | Architecture, scaling, system trade-offs |
| Full Stack | `full-stack/` | 36 | 36/36 | End-to-end product engineering |
| Cloud Computing | `cloud-computing/` | 25 | 25/25 | AWS services and infrastructure patterns |
| AI/ML | `ai-ml/` | 2 | 2/2 | Applied machine learning and analytics |
| **Total** | - | **87** | **87/87** | Multi-track capability building |

## Role-Based Entry Points

Use these starting points if you are targeting a specific role profile.

| Role Goal | Recommended Domain First | Suggested Starter Projects |
|---|---|---|
| Backend / Platform Engineer | System Design | [url-shortener](system-design/url-shortener), [event-booking-system](system-design/event-booking-system), [subscription-billing-system](system-design/subscription-billing-system) |
| Full-Stack Engineer | Full Stack | [online-food-ordering](full-stack/online-food-ordering), [learning-management-system](full-stack/learning-management-system), [task-project-collaboration](full-stack/task-project-collaboration) |
| Cloud / DevOps Engineer | Cloud Computing | [static-site-cloudfront](cloud-computing/static-site-cloudfront), [load-balanced-webapp](cloud-computing/load-balanced-webapp), [multi-region-backup](cloud-computing/multi-region-backup) |
| Data / ML Engineer | AI/ML + Full Stack | [recommendation-system](ai-ml/recommendation-system), [sports-analytics-dashboard](ai-ml/sports-analytics-dashboard), [sports-analytics-dashboard](full-stack/sports-analytics-dashboard) |

## Learning Paths

### Path A: Architecture-First

1. [url-shortener](system-design/url-shortener)
2. [real-time-chat-app](system-design/real-time-chat-app)
3. [ride-booking-system](system-design/ride-booking-system)
4. [social-media-feed](system-design/social-media-feed)

### Path B: Product Delivery (Full Stack)

1. [online-quiz-platform](full-stack/online-quiz-platform)
2. [online-examination-system](full-stack/online-examination-system)
3. [learning-management-system](full-stack/learning-management-system)
4. [multi-vendor-ecommerce](full-stack/multi-vendor-ecommerce)

### Path C: Cloud Operations and Reliability

1. [portfolio-on-ec2](cloud-computing/portfolio-on-ec2)
2. [load-balanced-webapp](cloud-computing/load-balanced-webapp)
3. [auto-scaling-webapp](cloud-computing/auto-scaling-webapp)
4. [cross-region-replication](cloud-computing/cross-region-replication)

### Path D: Applied Intelligence

1. [recommendation-system](ai-ml/recommendation-system)
2. [sports-analytics-dashboard](ai-ml/sports-analytics-dashboard)
3. [sports-analytics-dashboard](full-stack/sports-analytics-dashboard)

## Prerequisites and Environment

Baseline expectations before starting any project:

- Git and a modern editor (VS Code recommended)
- Language/runtime and toolchain based on project README instructions
- Cloud projects: AWS account, configured IAM credentials, and service access
- Ability to run local build/test commands and basic troubleshooting

Recommended workflow:

1. Read the project README end to end before coding.
2. Create a local branch for project work.
3. Execute setup and dependency installation exactly as documented.
4. Validate a minimal run path before implementing feature changes.

## Project Catalog

Status legend used in this index:

- `Ready`: Folder and README are available and can be started now.
- `In Progress`: Active implementation/refactor in your local branch.
- `Completed`: Your local implementation has passed your quality checklist.

Difficulty legend:

- `Beginner`: Introductory implementation and smaller scope
- `Intermediate`: Moderate system/component complexity
- `Advanced`: Higher architecture or scaling complexity

### System Design (24)

| Project | Difficulty | Est. Effort | Status |
|---|---|---|---|
| [cab-fleet-management](system-design/cab-fleet-management) | Advanced | 8-14 hours | Ready |
| [courier-tracking-system](system-design/courier-tracking-system) | Intermediate | 6-10 hours | Ready |
| [crm-system](system-design/crm-system) | Intermediate | 6-10 hours | Ready |
| [digital-wallet](system-design/digital-wallet) | Advanced | 8-14 hours | Ready |
| [ecommerce-order-management](system-design/ecommerce-order-management) | Intermediate | 6-10 hours | Ready |
| [event-booking-system](system-design/event-booking-system) | Intermediate | 6-10 hours | Ready |
| [file-storage-drive-mini](system-design/file-storage-drive-mini) | Intermediate | 6-10 hours | Ready |
| [food-delivery-system](system-design/food-delivery-system) | Advanced | 8-14 hours | Ready |
| [hospital-management](system-design/hospital-management) | Advanced | 8-14 hours | Ready |
| [hotel-booking-system](system-design/hotel-booking-system) | Intermediate | 6-10 hours | Ready |
| [movie-ticket-booking](system-design/movie-ticket-booking) | Beginner | 4-8 hours | Ready |
| [online-auction-system](system-design/online-auction-system) | Intermediate | 6-10 hours | Ready |
| [online-banking-system](system-design/online-banking-system) | Advanced | 8-14 hours | Ready |
| [online-insurance-system](system-design/online-insurance-system) | Advanced | 8-14 hours | Ready |
| [real-time-chat-app](system-design/real-time-chat-app) | Advanced | 8-14 hours | Ready |
| [ride-booking-system](system-design/ride-booking-system) | Advanced | 8-14 hours | Ready |
| [smart-home-automation](system-design/smart-home-automation) | Intermediate | 6-10 hours | Ready |
| [smart-notification-system](system-design/smart-notification-system) | Intermediate | 6-10 hours | Ready |
| [smart-parking-system](system-design/smart-parking-system) | Intermediate | 6-10 hours | Ready |
| [social-media-feed](system-design/social-media-feed) | Advanced | 8-14 hours | Ready |
| [stock-trading-simulator](system-design/stock-trading-simulator) | Advanced | 8-14 hours | Ready |
| [subscription-billing-system](system-design/subscription-billing-system) | Advanced | 8-14 hours | Ready |
| [traffic-monitoring-system](system-design/traffic-monitoring-system) | Intermediate | 6-10 hours | Ready |
| [url-shortener](system-design/url-shortener) | Beginner | 4-8 hours | Ready |

### Full Stack (36)

| Project | Difficulty | Est. Effort | Status |
|---|---|---|---|
| [asset-resource-management](full-stack/asset-resource-management) | Intermediate | 8-16 hours | Ready |
| [cicd-fullstack-app](full-stack/cicd-fullstack-app) | Advanced | 10-18 hours | Ready |
| [college-management-portal](full-stack/college-management-portal) | Intermediate | 8-16 hours | Ready |
| [complaint-grievance-system](full-stack/complaint-grievance-system) | Intermediate | 8-16 hours | Ready |
| [course-certification-platform](full-stack/course-certification-platform) | Intermediate | 8-16 hours | Ready |
| [customer-support-ticketing](full-stack/customer-support-ticketing) | Intermediate | 8-16 hours | Ready |
| [digital-expense-tracker](full-stack/digital-expense-tracker) | Beginner | 6-12 hours | Ready |
| [elearning-doubt-resolution](full-stack/elearning-doubt-resolution) | Intermediate | 8-16 hours | Ready |
| [employee-attendance-payroll](full-stack/employee-attendance-payroll) | Advanced | 10-18 hours | Ready |
| [freelancer-marketplace](full-stack/freelancer-marketplace) | Advanced | 10-18 hours | Ready |
| [hospital-appointment-system](full-stack/hospital-appointment-system) | Intermediate | 8-16 hours | Ready |
| [hr-recruitment-scheduling](full-stack/hr-recruitment-scheduling) | Intermediate | 8-16 hours | Ready |
| [inventory-stock-management](full-stack/inventory-stock-management) | Intermediate | 8-16 hours | Ready |
| [job-portal](full-stack/job-portal) | Intermediate | 8-16 hours | Ready |
| [learning-management-system](full-stack/learning-management-system) | Advanced | 10-18 hours | Ready |
| [library-management-system](full-stack/library-management-system) | Intermediate | 8-16 hours | Ready |
| [multi-vendor-ecommerce](full-stack/multi-vendor-ecommerce) | Advanced | 10-18 hours | Ready |
| [online-doctor-consultation](full-stack/online-doctor-consultation) | Intermediate | 8-16 hours | Ready |
| [online-event-registration](full-stack/online-event-registration) | Intermediate | 8-16 hours | Ready |
| [online-examination-system](full-stack/online-examination-system) | Intermediate | 8-16 hours | Ready |
| [online-food-ordering](full-stack/online-food-ordering) | Intermediate | 8-16 hours | Ready |
| [online-quiz-platform](full-stack/online-quiz-platform) | Beginner | 6-12 hours | Ready |
| [online-voting-system](full-stack/online-voting-system) | Intermediate | 8-16 hours | Ready |
| [product-review-rating](full-stack/product-review-rating) | Beginner | 6-12 hours | Ready |
| [real-time-notification-system](full-stack/real-time-notification-system) | Advanced | 10-18 hours | Ready |
| [restaurant-table-reservation](full-stack/restaurant-table-reservation) | Intermediate | 8-16 hours | Ready |
| [secure-file-sharing](full-stack/secure-file-sharing) | Advanced | 10-18 hours | Ready |
| [smart-banking-system](full-stack/smart-banking-system) | Advanced | 10-18 hours | Ready |
| [smart-city-issue-reporting](full-stack/smart-city-issue-reporting) | Intermediate | 8-16 hours | Ready |
| [sports-analytics-dashboard](full-stack/sports-analytics-dashboard) | Intermediate | 8-16 hours | Ready |
| [student-feedback-rating](full-stack/student-feedback-rating) | Beginner | 6-12 hours | Ready |
| [subscription-content-platform](full-stack/subscription-content-platform) | Advanced | 10-18 hours | Ready |
| [task-project-collaboration](full-stack/task-project-collaboration) | Advanced | 10-18 hours | Ready |
| [travel-booking-itinerary](full-stack/travel-booking-itinerary) | Intermediate | 8-16 hours | Ready |
| [vehicle-service-booking](full-stack/vehicle-service-booking) | Intermediate | 8-16 hours | Ready |
| [warehouse-logistics](full-stack/warehouse-logistics) | Advanced | 10-18 hours | Ready |

### Cloud Computing (25)

| Project | Difficulty | Est. Effort | Status |
|---|---|---|---|
| [auto-scaling-webapp](cloud-computing/auto-scaling-webapp) | Advanced | 8-14 hours | Ready |
| [containerized-blog](cloud-computing/containerized-blog) | Intermediate | 6-12 hours | Ready |
| [containerized-wordpress](cloud-computing/containerized-wordpress) | Intermediate | 6-12 hours | Ready |
| [cross-region-replication](cloud-computing/cross-region-replication) | Advanced | 8-14 hours | Ready |
| [ec2-auto-stop-scheduler](cloud-computing/ec2-auto-stop-scheduler) | Beginner | 4-8 hours | Ready |
| [ec2-health-dashboard](cloud-computing/ec2-health-dashboard) | Intermediate | 6-12 hours | Ready |
| [ec2-scheduled-backup](cloud-computing/ec2-scheduled-backup) | Intermediate | 6-12 hours | Ready |
| [file-versioning-system](cloud-computing/file-versioning-system) | Beginner | 4-8 hours | Ready |
| [iam-user-management](cloud-computing/iam-user-management) | Intermediate | 6-12 hours | Ready |
| [lambda-calculator-api](cloud-computing/lambda-calculator-api) | Beginner | 4-8 hours | Ready |
| [lambda-function-scheduler](cloud-computing/lambda-function-scheduler) | Beginner | 4-8 hours | Ready |
| [load-balanced-webapp](cloud-computing/load-balanced-webapp) | Intermediate | 6-12 hours | Ready |
| [multi-az-database](cloud-computing/multi-az-database) | Advanced | 8-14 hours | Ready |
| [multi-region-backup](cloud-computing/multi-region-backup) | Advanced | 8-14 hours | Ready |
| [photo-gallery-s3](cloud-computing/photo-gallery-s3) | Beginner | 4-8 hours | Ready |
| [portfolio-on-ec2](cloud-computing/portfolio-on-ec2) | Beginner | 4-8 hours | Ready |
| [s3-bucket-policy-manager](cloud-computing/s3-bucket-policy-manager) | Intermediate | 6-12 hours | Ready |
| [s3-event-notifications](cloud-computing/s3-event-notifications) | Intermediate | 6-12 hours | Ready |
| [s3-lifecycle-optimizer](cloud-computing/s3-lifecycle-optimizer) | Intermediate | 6-12 hours | Ready |
| [secure-file-upload-portal](cloud-computing/secure-file-upload-portal) | Advanced | 8-14 hours | Ready |
| [serverless-contact-form](cloud-computing/serverless-contact-form) | Intermediate | 6-12 hours | Ready |
| [serverless-image-resizer](cloud-computing/serverless-image-resizer) | Intermediate | 6-12 hours | Ready |
| [serverless-todo-api](cloud-computing/serverless-todo-api) | Intermediate | 6-12 hours | Ready |
| [static-site-cloudfront](cloud-computing/static-site-cloudfront) | Beginner | 4-8 hours | Ready |
| [vpc-public-private-arch](cloud-computing/vpc-public-private-arch) | Advanced | 8-14 hours | Ready |

### AI/ML (2)

| Project | Difficulty | Est. Effort | Status |
|---|---|---|---|
| [recommendation-system](ai-ml/recommendation-system) | Intermediate | 8-14 hours | Ready |
| [sports-analytics-dashboard](ai-ml/sports-analytics-dashboard) | Intermediate | 8-14 hours | Ready |

Note: `sports-analytics-dashboard` intentionally appears in two domains due to different implementation contexts:

- [full-stack/sports-analytics-dashboard](full-stack/sports-analytics-dashboard)
- [ai-ml/sports-analytics-dashboard](ai-ml/sports-analytics-dashboard)

## Documentation Standard

Every project README should include these minimum sections:

1. Problem statement and business goal
2. Users and primary workflows
3. Functional and non-functional requirements
4. Architecture and proposed stack
5. Setup, run, and test instructions
6. Validation checklist and future enhancements

Recommended folder pattern:

```text
project-name/
├── README.md
├── prompt.md            # optional, recommended
├── src/
├── docs/                # optional
└── tests/               # optional
```

For contribution workflow and quality expectations, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Quality Gates

Before treating a project as complete, confirm:

- Setup, build, and run steps are reproducible
- Core happy path and important edge cases pass
- Validation, error handling, and access control are addressed
- README instructions are current, accurate, and actionable

## Community and Governance

- License: [LICENSE](LICENSE)
- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Support guide: [SUPPORT.md](SUPPORT.md)

## Repository Policies

- Folder naming: kebab-case
- Isolation: each project should be runnable independently
- Scope ownership: dependencies remain local to each project
- Documentation-first updates: README must be updated when behavior changes
- Cross-domain duplication is allowed when implementation goals differ
