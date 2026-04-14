# Cloud Computing Projects

AWS-focused infrastructure and deployment projects covering serverless functions, containerized workloads, static hosting, storage management, networking, and operational automation.

## Overview

| Metric | Value |
|---|---|
| Total Projects | 25 |
| Difficulty Range | Beginner → Advanced |
| Estimated Effort | 4–14 hours per project |
| Primary Platform | Amazon Web Services (AWS) |
| IaC Tools Used | Serverless Framework, Terraform, AWS CLI |

## Domain Focus

These projects cover the core pillars of cloud engineering:

- **Compute** — EC2 instance management, health dashboards, backup automation
- **Serverless** — Lambda functions, API Gateway integrations, event-driven pipelines
- **Storage** — S3 bucket policies, lifecycle rules, versioning, event notifications
- **Containers** — Docker-based deployments via ECS (blog, WordPress)
- **Networking** — VPC design with public/private subnets, CloudFront CDN
- **Databases** — Multi-AZ RDS setup, cross-region replication
- **IAM & Security** — User management, secure upload portals, bucket policy management
- **Reliability** — Multi-region backup, auto-scaling, load balancing

## Project Index

| Project | Category | Difficulty | Est. Effort | Status |
|---|---|---|---|---|
| [auto-scaling-webapp](auto-scaling-webapp) | Compute / Scaling | Advanced | 8–14 hours | Ready |
| [containerized-blog](containerized-blog) | Containers | Intermediate | 6–12 hours | Ready |
| [containerized-wordpress](containerized-wordpress) | Containers | Intermediate | 6–12 hours | Ready |
| [cross-region-replication](cross-region-replication) | Storage / DR | Advanced | 8–14 hours | Ready |
| [ec2-auto-stop-scheduler](ec2-auto-stop-scheduler) | Cost Ops | Beginner | 4–8 hours | Ready |
| [ec2-health-dashboard](ec2-health-dashboard) | Monitoring | Intermediate | 6–12 hours | Ready |
| [ec2-scheduled-backup](ec2-scheduled-backup) | Backup | Intermediate | 6–12 hours | Ready |
| [file-versioning-system](file-versioning-system) | Storage | Beginner | 4–8 hours | Ready |
| [iam-user-management](iam-user-management) | Security / IAM | Intermediate | 6–12 hours | Ready |
| [lambda-calculator-api](lambda-calculator-api) | Serverless | Beginner | 4–8 hours | Ready |
| [lambda-function-scheduler](lambda-function-scheduler) | Serverless | Beginner | 4–8 hours | Ready |
| [load-balanced-webapp](load-balanced-webapp) | Networking | Intermediate | 6–12 hours | Ready |
| [multi-az-database](multi-az-database) | Database / HA | Advanced | 8–14 hours | Ready |
| [multi-region-backup](multi-region-backup) | Backup / DR | Advanced | 8–14 hours | Ready |
| [photo-gallery-s3](photo-gallery-s3) | Storage | Beginner | 4–8 hours | Ready |
| [portfolio-on-ec2](portfolio-on-ec2) | Compute | Beginner | 4–8 hours | Ready |
| [s3-bucket-policy-manager](s3-bucket-policy-manager) | Storage / Security | Intermediate | 6–12 hours | Ready |
| [s3-event-notifications](s3-event-notifications) | Storage / Events | Intermediate | 6–12 hours | Ready |
| [s3-lifecycle-optimizer](s3-lifecycle-optimizer) | Storage / Cost | Intermediate | 6–12 hours | Ready |
| [secure-file-upload-portal](secure-file-upload-portal) | Security / Storage | Advanced | 8–14 hours | Ready |
| [serverless-contact-form](serverless-contact-form) | Serverless | Intermediate | 6–12 hours | Ready |
| [serverless-image-resizer](serverless-image-resizer) | Serverless | Intermediate | 6–12 hours | Ready |
| [serverless-todo-api](serverless-todo-api) | Serverless | Intermediate | 6–12 hours | Ready |
| [static-site-cloudfront](static-site-cloudfront) | CDN / Hosting | Beginner | 4–8 hours | Ready |
| [vpc-public-private-arch](vpc-public-private-arch) | Networking | Advanced | 8–14 hours | Ready |

## Suggested Learning Paths

### Path 1: Cloud Foundations (Beginner)
1. [portfolio-on-ec2](portfolio-on-ec2) — deploy your first EC2 instance
2. [static-site-cloudfront](static-site-cloudfront) — S3 + CloudFront hosting
3. [photo-gallery-s3](photo-gallery-s3) — working with S3 objects
4. [lambda-calculator-api](lambda-calculator-api) — first serverless function

### Path 2: Serverless Specialist
1. [lambda-calculator-api](lambda-calculator-api)
2. [lambda-function-scheduler](lambda-function-scheduler)
3. [serverless-todo-api](serverless-todo-api)
4. [serverless-contact-form](serverless-contact-form)
5. [serverless-image-resizer](serverless-image-resizer)

### Path 3: Operations and Reliability (Intermediate → Advanced)
1. [ec2-auto-stop-scheduler](ec2-auto-stop-scheduler)
2. [ec2-scheduled-backup](ec2-scheduled-backup)
3. [load-balanced-webapp](load-balanced-webapp)
4. [auto-scaling-webapp](auto-scaling-webapp)
5. [multi-az-database](multi-az-database)
6. [multi-region-backup](multi-region-backup)

### Path 4: Security and Networking
1. [iam-user-management](iam-user-management)
2. [s3-bucket-policy-manager](s3-bucket-policy-manager)
3. [secure-file-upload-portal](secure-file-upload-portal)
4. [vpc-public-private-arch](vpc-public-private-arch)

## Quick Start

1. Open the project folder and read its `README.md`.
2. Ensure AWS credentials are configured:
   ```bash
   aws configure
   # or use environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
   ```
3. For Serverless Framework projects:
   ```bash
   npm install
   npx serverless deploy
   ```
4. For Terraform projects:
   ```bash
   terraform init && terraform plan && terraform apply
   ```
5. For manual AWS Console-based projects, follow the step-by-step guide in the project `README.md`.

## Prerequisites

- AWS account with appropriate IAM permissions
- AWS CLI v2 installed and configured
- Node.js 18+ and npm (for Serverless Framework projects)
- Terraform 1.5+ (for IaC projects)
- Docker (for containerized projects)

> **Cost Awareness:** Several projects provision billable AWS resources. Always run cleanup/teardown steps documented in each project README to avoid unexpected charges.

## IaC Approach by Project Type

| Project Type | Tooling |
|---|---|
| Serverless (Lambda, API GW) | Serverless Framework |
| EC2, VPC, RDS, S3 infrastructure | Terraform |
| AWS-console-only configurations | Step-by-step README guide |

## Related Domains

- For the applications deployed via these cloud patterns, see [`full-stack/`](../full-stack).
- For system-level architecture behind these services, see [`system-design/`](../system-design).

---

Back to [Repository Root](../README.md)
