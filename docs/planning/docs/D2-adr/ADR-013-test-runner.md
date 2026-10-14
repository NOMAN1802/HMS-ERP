# ADR-013 — Keep Jest on Node ≥ 24.9 with ESM

- **Status:** SUPERSEDED by [ADR-018](ADR-018-vitest.md) on 2026-10-13 (P-017). Q-054 resolved with Vitest.
- **Date:** 2026-10-12
- **Approver:** Tech lead

## Context

- Jest is the supplied foundation.
- NestJS 12 ships ESM. Its CLI defaults new ESM projects to Vitest. Jest can load ESM-only v12 packages only on Node ≥ 24.9 (NestJS v12 migration guide).
- Prisma 7 requires ESM.
- `ts-jest` supports TypeScript < 7 (CX-011, CX-018).

## Decision

- Keep **Jest 30** for unit, integration and API tests.
- Run Node 24 LTS or newer.
- Transform TypeScript with `ts-jest` (ESM preset) or `@swc/jest`, whichever passes the spike. Pin TypeScript 6.0.x.
- **Spike T-FND-01:** run a Nest 12 module test, a Prisma 7 repository test against PostgreSQL, and a React component test under Jest ESM.

If any are unstable, raise an ADR amendment proposing **Vitest** for the affected packages. Never mix runners within one package.

## Alternatives

- **Vitest everywhere.** ESM-native, fast, NestJS 12's default for ESM. Preferable if the Jest ESM spike fails or becomes the main source of CI flakiness.
- **CommonJS application build.** Possible for Nest (CJS still supported), but Prisma 7 expects ESM. Not recommended.

## Consequences

Test configuration lives in `packages/config-jest`. Agents must not change the runner within a task.

## Evidence required

Spike results recorded in the task handoff, with actual commands and outputs.
