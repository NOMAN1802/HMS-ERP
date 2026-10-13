# ADR-014 — Object storage through the S3 API; MinIO CE not adopted

- **Status:** PROPOSED (P-018)
- **Date:** 2026-10-12
- **Approver:** DevOps lead

## Context

- Generated PDFs, exports, uploads and backup repositories should not live only on the application VPS disk.
- v0.3 proposed S3-compatible storage.
- MinIO Community Edition stopped publishing binaries and images (October 2025) and was archived in 2026 (secondary source V-13; re-confirm).

## Decision

- The application uses an S3-API client with path-style or virtual-host addressing configurable, server-side encryption where available, and presigned URLs (≤ 5 minutes) issued after authorization.
- **Preferred:** the VPS provider's object storage, in a different failure domain from the VPS.
- **Self-hosted alternative:** SeaweedFS (Apache 2.0) or Garage, on separate storage.
- **Dev/test:** a local S3-compatible container or a filesystem adapter behind the same interface.
- Backups (pgBackRest repository) use a **separate bucket and credentials**, ideally a different provider or region.

## Alternatives

- **Files in PostgreSQL (bytea).** Simple, but bloats backups and the WAL. Acceptable only for tiny assets (logos).
- **Local disk volume only.** Single point of loss. Rejected for production.

## Consequences

Provider choice (Q-044) determines endpoints and costs. Storage outage handling is in D §15.

## Evidence required

- Upload/download/presign tests against the chosen implementation.
- A restore drill includes object storage.
