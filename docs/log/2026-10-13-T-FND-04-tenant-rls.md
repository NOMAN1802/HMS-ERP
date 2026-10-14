# T-FND-04: tenant isolation with RLS

- **Date:** 2026-10-13
- **Commit:** 6ef7bca
- **Implements:** T-FND-04, T-DB-02 (coverage check); ADR-003; NFR-ISO-001; E §6

## What was built

Row-level security for every tenant-owned table, plus `withTenant()`, the only way application code reads or writes tenant data. Each call opens a transaction and sets `app.tenant_id` transaction-locally, so the setting disappears at commit or rollback and never leaks to the next user of a pooled connection. Without a tenant context, queries return no rows and inserts are rejected.

## Files

| File                                                                        | Purpose                                                                 |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| packages/database/prisma/schema.prisma                                      | `facility` and `department` with composite tenant keys                  |
| packages/database/prisma/migrations/20261013112515_tenant_rls/migration.sql | Tables, `hms.current_tenant_id()`, ENABLE + FORCE RLS, policies         |
| packages/database/src/with-tenant.ts                                        | `withTenant(prisma, ctx, fn)`; validates UUIDs; 5 s maxWait and timeout |
| packages/database/src/with-tenant.int.test.ts                               | 8 integration tests (ADR-003 evidence 1-4 + coverage check)             |
| packages/database/vitest.config.ts                                          | Loads the root .env for local runs                                      |

## Decisions applied

- Policies use `tenant_id = hms.current_tenant_id()`; the `tenant` table uses `id = hms.current_tenant_id()`.
- FORCE RLS so the table owner (`hms_migrator`) is also restricted.
- `maxWait` raised from Prisma's 2 s default to 5 s: 40 queued transactions over the Bangladesh-Singapore link exceeded 2 s.

## Verification

| Command                                                           | Result                                          |
| ----------------------------------------------------------------- | ----------------------------------------------- |
| `pnpm --filter @hms/database exec vitest run` (local Postgres 17) | 8 passed                                        |
| Same, with `DATABASE_URL` = Supabase transaction pooler           | 8 passed (test tenants deleted afterwards)      |
| Probe table with `tenant_id` and no RLS                           | Coverage test failed as intended, probe dropped |
| GitHub Actions `ci`                                               | 8 passed                                        |

## Known limitations

- ADR-003 evidence item 5 (`hms_app` cannot UPDATE audit rows) waits for the audit table (T-PLT-02).
- Integration tests leave `test-*` tenants in the local database (hms_app has no DELETE). The testkit (T-DB-03) will add cleanup.

## How to debug

- Query returns nothing: check that it runs inside `withTenant()`; outside it RLS returns zero rows by design.
- `new row violates row-level security policy`: the row's `tenant_id` does not match the context tenant.
- `Unable to start a transaction in the given time`: the pool is exhausted or the database is slow to reach; check pool size and network, not RLS.
- Inspect the current context in a session: `SELECT current_setting('app.tenant_id', true);`
- List tables missing RLS: run the query in the coverage test against the database.
