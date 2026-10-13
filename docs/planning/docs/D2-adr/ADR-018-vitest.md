# ADR-018 — Vitest instead of Jest (supersedes ADR-013)

- **Status:** ACCEPTED by the product owner on 2026-10-13. Resolves Q-054.
- **Date:** 2026-10-13
- **Supersedes:** [ADR-013](ADR-013-test-runner.md)

## Context

- ADR-013 kept Jest and named Vitest as the fallback if the Jest ESM spike failed.
- NestJS 12 ships ESM and its CLI defaults new ESM projects to Vitest. Prisma 7 requires ESM.
- The product owner chose Vitest at scaffold time.

## Decision

- **Vitest 5** for unit, integration and API tests in every package. One runner for the whole repo.
- NestJS packages transform TypeScript with `unplugin-swc` so decorator metadata (needed by Nest dependency injection) is emitted.
- Playwright stays the end-to-end runner (browser journeys in `apps/web/e2e`).
- Coverage uses `@vitest/coverage-v8` and writes `coverage/lcov.info` per package for SonarQube.

## Consequences

- There is no `config-jest` package. Test config is a small `vitest.config.ts` per package.
- H (automated test plan) case IDs are unchanged. Only the runner differs.

## Evidence

On 2026-10-13, `pnpm test` passed: contracts (2 tests) and api (a NestJS `Test.createTestingModule` test, 1 test) under Node 24.15, TypeScript 6.0.3, Vitest 5.0.4.
