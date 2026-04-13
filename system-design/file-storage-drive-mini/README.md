# File Storage Drive Mini System

Category: system-design

## 1. Requirements

### 1.1 Functional Requirements

1. User authentication and personal drive namespace.
2. Upload files (single and multipart for large files).
3. Download and preview file metadata.
4. Folder hierarchy and move/rename operations.
5. File sharing via link and user-to-user permissions.
6. File versioning with rollback to prior version.
7. Quota control per user/plan with usage metering.
8. Soft delete (trash) and restore within retention window.
9. Virus/malware scan status tracking before share/public access.

### 1.2 Non-Functional Requirements

1. Availability:
	- Upload/download metadata APIs: 99.95% monthly.
	- Object retrieval path: 99.9% monthly.
2. Latency (p95):
	- Metadata reads: < 150 ms.
	- Upload initiation (pre-signed URL issue): < 120 ms.
	- Permission check: < 100 ms.
3. Throughput:
	- Baseline: 2k metadata RPS, 1k upload initiations RPS.
	- Peak: 12k metadata RPS, 6k upload initiations RPS.
4. Durability:
	- Stored files must survive AZ failures using replicated object storage.
5. Consistency:
	- Strong consistency for metadata and permission updates.
	- Eventual consistency acceptable for search indexing and analytics.

## 2. Architecture Diagram (Textual)

Web/Mobile/Desktop Client
-> API Gateway
-> Auth Service
-> Drive API

Drive API -> Metadata Service -> OLTP DB
Drive API -> Upload Service -> Object Storage (multipart)
Drive API -> Sharing Service -> OLTP DB + Cache
Drive API -> Version Service -> OLTP DB + Object Storage
Drive API -> Quota Service -> OLTP DB + Cache
Drive API -> Scan Orchestrator -> Queue -> Scanner Workers

Shared:
1. Event bus for file_uploaded, version_created, share_changed events.
2. Search indexing pipeline.
3. Observability and audit logging.

## 3. Components and Responsibilities

1. Metadata Service
	- File/folder hierarchy, ownership, file attributes.

2. Upload Service
	- Issues pre-signed URLs and completes multipart upload registration.

3. Sharing Service
	- ACLs, link tokens, expiration rules, permission checks.

4. Version Service
	- Tracks file revisions and rollback operations.

5. Quota Service
	- Enforces storage limits and computes usage snapshots.

6. Scan Service
	- Malware scan status and quarantine controls.

## 4. Data Design

### 4.1 Storage Choices

1. OLTP DB (PostgreSQL): metadata, ACLs, versions, quota usage.
2. Object storage (S3-compatible): file blobs and version objects.
3. Redis cache: permission and quota hot lookups.
4. Queue/bus: scan jobs and async indexing.

### 4.2 Core Entities

1. drive_user(user_id, plan_id, status, created_at)
2. node(node_id, user_id, parent_node_id, type, name, status, created_at)
3. file_object(file_id, node_id, current_version_id, mime_type, size_bytes, checksum, scan_status)
4. file_version(version_id, file_id, object_key, size_bytes, checksum, created_at, created_by)
5. share_acl(acl_id, node_id, subject_type, subject_id, permission, expires_at)
6. share_link(link_id, node_id, token_hash, permission, expires_at, password_hash)
7. quota_usage(user_id, used_bytes, soft_limit_bytes, hard_limit_bytes, updated_at)
8. upload_session(session_id, user_id, file_name, multipart, status, created_at)

### 4.3 Indexes and Constraints

1. Unique(user_id, parent_node_id, name, status != DELETED) for path consistency.
2. Unique(share_link.token_hash).
3. Index file_version(file_id, created_at desc).
4. Index share_acl(node_id, subject_type, subject_id).

### 4.4 Concurrency and Race Prevention

1. Atomic rename/move operations in transaction with optimistic version checks.
2. Quota enforcement in same transaction as metadata commit.
3. Idempotency key for upload complete and version-create endpoints.
4. Last-write-wins avoided for collaborative scenarios by explicit version precondition.

## 5. API Contracts

### 5.1 Upload and Metadata

1. POST /v1/files/upload/init
	- Request: { parentNodeId, fileName, sizeBytes, mimeType, multipart, idempotencyKey }
	- Response: { uploadSessionId, uploadUrls[], expiresAt }

2. POST /v1/files/upload/complete
	- Request: { uploadSessionId, parts?, checksum, idempotencyKey }
	- Response: { fileId, versionId, scanStatus }

3. GET /v1/nodes/{nodeId}
4. GET /v1/nodes/{nodeId}/children?cursor=...

### 5.2 Sharing and Permissions

1. POST /v1/shares
	- Request: { nodeId, subjectType, subjectId, permission, expiresAt }

2. POST /v1/share-links
	- Request: { nodeId, permission, expiresAt, password? }
	- Response: { shareUrl }

3. DELETE /v1/shares/{aclId}

### 5.3 Versioning and Quota

1. GET /v1/files/{fileId}/versions
2. POST /v1/files/{fileId}/versions/{versionId}/restore
3. GET /v1/quota

## 6. Scalability and Reliability

### 6.1 Scaling Strategy

1. Separate metadata and blob planes for independent scaling.
2. Partition metadata by user_id hash.
3. CDN for download acceleration and reduced origin load.
4. Async scanning and indexing to keep upload path fast.

### 6.2 Handling Spikes

1. Rate-limit upload initiations per user/IP.
2. Queue-based smoothing for scan workers.
3. Adaptive TTL cache for share permission checks.

### 6.3 Reliability Plan

1. Retries with backoff for storage transient errors.
2. Idempotent upload completion and version registration.
3. Multi-AZ DB and object store replication.
4. Background reconciliation between metadata and object store.
5. DR:
	- Cross-region object replication + DB backups.
	- RPO <= 5 minutes (metadata), near-zero for replicated blobs.
	- RTO <= 30 minutes.

## 7. Security and Observability

### 7.1 Security and Compliance

1. Strong auth and per-node ACL enforcement.
2. Encryption at rest for blobs and metadata, TLS in transit.
3. Signed URL expiry and scope binding.
4. Malware scanning and quarantine before broad sharing.
5. Audit trails for sharing/permission changes.
6. Data retention and legal hold support hooks.

### 7.2 Observability

1. Logs:
	- structured logs with trace_id, user_id, node_id, file_id, version_id.
2. Metrics:
	- upload_init_latency_ms
	- upload_complete_success_rate
	- quota_exceeded_rate
	- share_check_latency_ms
	- scan_backlog_depth
3. Traces:
	- upload init -> object upload -> complete -> scan.
4. SLOs:
	- 99.95% successful metadata API operations.
	- p95 upload-init latency < 120 ms.
	- 99% scan completion within 2 minutes for files <= 100 MB.

## 8. Trade-offs and Extensions

### 8.1 Trade-offs

1. Strict ACL checks increase security but add read-path latency.
2. Version retention improves recovery but increases storage cost.
3. Deep folder hierarchy support can complicate move operations at scale.

### 8.2 Bottlenecks

1. Large file multipart completion spikes.
2. Hot shared links with sudden traffic bursts.
3. Scan worker backlog under heavy upload volume.

### 8.3 Future Extensions

1. Block-level deduplication and compression.
2. Collaborative editing metadata hooks.
3. External app integrations via scoped tokens.
4. Lifecycle policies for cold tier archival.
5. E2E encryption with client-side keys.

## Folder Structure

1. prompt.md
2. README.md
3. src/
