# T-FND-01/02/03: monorepo scaffold

- **Date:** 2026-10-13
- **Commit:** 8fd521a, with the CI fix in 83a957b
- **Implements:** T-FND-01 (stack spike and pins), T-FND-02 (skeleton and boundaries), T-FND-03 (CI baseline, partial); ADR-001, ADR-018, ADR-019, ADR-020; P-021

## What was built

A Turborepo + pnpm monorepo with the staff web app (Next.js), the API and the worker (NestJS), and the shared packages from D §5. Local Postgres 17 and Valkey 9 run in Docker. Prisma 7 is wired to the `hms` schema with a first migration (`tenant`). Vitest, Playwright, ESLint with SonarJS rules, Prettier and dependency-cruiser are configured, and GitHub Actions runs them on every push.

## Files

| File                                                         | Purpose                                                                                             |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| package.json, pnpm-workspace.yaml, turbo.json                | Workspace, scripts, task graph; install scripts allowed only for prisma, @prisma/engines, @swc/core |
| packages/config-typescript/*.json                            | Shared tsconfig: base, library, nestjs, nextjs                                                      |
| apps/api, apps/worker, apps/web                              | NestJS API (port 4100), NestJS worker, Next.js web (port 3100)                                      |
| packages/contracts                                           | Zod schemas; first one is the health response                                                       |
| packages/database                                            | Prisma schema, migrations, `createPrismaClient()`                                                   |
| docker/compose.dev.yaml, docker/postgres/initdb/10-roles.sql | Local Postgres 17 + Valkey 9; roles hms_migrator and hms_app                                        |
| docker/postgres/supabase/10-roles.sql                        | Same roles on Supabase, passwords passed as psql variables                                          |
| eslint.config.js, .dependency-cruiser.cjs, .prettierrc.json  | Lint, package boundaries, formatting                                                                |
| .github/workflows/ci.yml                                     | CI: install, roles, migrate, format, build, lint, typecheck, boundaries, tests, e2e                 |
| docs/STACK_VERSIONS.md                                       | Pinned versions and the commands run                                                                |

## Decisions applied

- Exact version pins; pnpm `minimumReleaseAge` stays on, so releases under one day old were replaced by the previous release (NestJS 12.1.2, zod 4.6.6, typescript-eslint 8.71.1).
- TypeScript 6.0.3, not 7 (NestJS CLI and typescript-eslint need < 7).
- Ports 3100/4100 because 3000/4000 are used by another local project.
- `prisma.config.ts` makes the datasource URL optional so `prisma generate` works without a database (Turborepo hides undeclared env vars).

## Verification

| Command                                    | Result                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| `pnpm turbo run build lint typecheck test` | All tasks successful                                                   |
| `pnpm boundaries:check`                    | No violations; a probe import of `@hms/database` from web was rejected |
| `pnpm --filter @hms/web test:e2e`          | 1 passed (home page + axe)                                             |
| GitHub Actions `ci` on main                | checks and e2e passed                                                  |

## Known limitations

- Next.js is 16.4.0; upgrade to the 2026-10-14 security release before any deploy.
- The api image would be large (Prisma CLI pulled in as an optional peer); fix by moving the CLI to a tools package when Docker images are built.
- SonarQube server not set up (C-048).

## How to debug

- Install fails with `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`: a dependency is under one day old; pin the previous release instead of adding exclusions.
- `Cannot find name 'process'`: TypeScript 6 no longer auto-loads Node types; `types: ["node"]` is in `base.json`.
- `PrismaConfigEnvError` in CI: an env var was hidden by Turborepo; declare it in `turbo.json` `passThroughEnv` for the task that needs it.
- Boundary check reports `no-unresolvable`: the importing package does not list the workspace dependency in its package.json.
