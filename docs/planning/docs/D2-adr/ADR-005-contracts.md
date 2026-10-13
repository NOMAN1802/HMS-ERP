# ADR-005 — Zod-first canonical contracts and generated OpenAPI

- **Status:** PROPOSED (P-009)
- **Date:** 2026-10-12
- **Approver:** Tech lead

## Context

UI and API tasks will often be implemented by different agents in parallel (v0.3 API_CONTRACTS readiness boundary). Divergent shapes between frontend, backend and documentation are a common defect. Zod is part of the supplied foundation.

## Decision

1. `packages/contracts` holds Zod 4 schemas for every request, response, error code, permission code and event payload. It depends only on `zod`.
2. The API validates input and output with these schemas through a small in-house NestJS pipe and interceptor.
3. OpenAPI 3.1 is generated from the schemas at build. The generated file is committed, and CI fails on drift.
4. The web app uses the same schemas for form validation and response parsing.
5. Prisma models never leak into contracts.

The spike chooses between `@asteasolutions/zod-to-openapi` (peer `zod ^4`) and Zod 4's native JSON Schema output. `nestjs-zod` is not selected because its declared peers exclude NestJS 12 (CX-012).

## Alternatives

- **NestJS class-validator DTOs + `@nestjs/swagger` decorators.** Mature, but duplicates schemas for the frontend. Preferable if Zod tooling for NestJS 12 proves immature.
- **tRPC.** Excellent type sharing, but non-REST, and harder for external integrations and portal clients.

## Consequences

- **Positive:** one change updates validation, docs and UI types.
- **Negative:** `packages/contracts` becomes a hot shared file, so integrator review is needed (G §6).

## Evidence required

- The contract drift check runs in CI.
- An API test validates responses against the schemas.
- A breaking change to a published schema fails a compatibility check (H §7).
