# K — Docker design

| Control | Value |
| --- | --- |
| Document | K Docker design (images, Compose layouts, runtime hardening, secrets, environment, versioning, migrations) |
| Version | 0.4.0-draft |
| Status | **PROPOSED.** Docker is part of the supplied foundation. **The template files were not built or executed.** The Compose files were only parsed as YAML. Placeholders appear as `<<…>>`. |
| Owner role | DevOps lead; integrator (build scripts) |
| Updated | 2026-10-12 |
| Templates | [`templates/docker/`](../templates/docker/) — `Dockerfile.nest`, `Dockerfile.web`, `Dockerfile.migrate`, `Dockerfile.postgres`, `compose.prod.yaml`, `compose.dev.yaml`, `env.example`, `redis.conf`, `initdb-10-roles.sh`; [`templates/caddy/Caddyfile`](../templates/caddy/Caddyfile) |

## 1. Goals

1. **Separate images per concern:** `web`, `api`, `worker`, `migrate`, `postgres` (with pgBackRest). Optionally a separate `pdf-renderer` image, maintained upstream.
2. **Reproducible builds** from the monorepo with `turbo prune --docker` and the frozen lockfile.
3. **The same image digest** in staging and production.
4. **Minimal, non-root runtime** with health checks and graceful shutdown.
5. **No secrets in images or build logs.** Secrets are runtime files.

## 2. Image catalogue

| Image | Source | Contents | Runs as | Ports | Health |
| --- | --- | --- | --- | --- | --- |
| `hms-web` | `Dockerfile.web` | Next.js standalone server + static assets + self-hosted fonts | `node` (uid 1000) | 3000 | `GET /api/health` |
| `hms-api` | `Dockerfile.nest` (`APP=api`) | Compiled NestJS API + production deps (`pnpm deploy --prod`) + generated Prisma client | `node` | 3001 | `GET /health/live`, `/health/ready` |
| `hms-worker` | `Dockerfile.nest` (`APP=worker`) | Compiled NestJS standalone worker | `node` | 9464 (health/metrics) | `GET /health` (heartbeat) |
| `hms-migrate` | `Dockerfile.migrate` | Prisma CLI (pinned 7.10.x), migrations incl. SQL, `migrate.sh`, `psql` client | `node` | — | one-off; exit code |
| `hms-postgres` | `Dockerfile.postgres` | Official `postgres:18` + pgBackRest | `postgres` | 5432 (internal only) | `pg_isready` |
| pdf-renderer | upstream image pinned by digest | Headless Chromium HTML→PDF service | image default (non-root if supported) | 3000 (internal) | service health endpoint |
| Caddy, Redis/Valkey | upstream images pinned by digest | — | image defaults | 80/443; 6379 internal | `redis-cli ping` |

## 3. Multi-stage build for the monorepo

Pattern, following the Turborepo Docker guide (D1 V-20):

```text
base     → node:24-bookworm-slim@sha256:<digest>, corepack enable (pnpm from "packageManager")
pruner   → turbo prune @hms/<app> --docker   → out/json (package.json files + pruned lockfile), out/full (sources)
deps     → copy out/json, pnpm install --frozen-lockfile  (cached unless dependencies change)
build    → copy out/full, turbo run build --filter=@hms/<app>...  (Prisma generate runs in @hms/database build)
           pnpm --filter @hms/<app> deploy --prod /out/app       (Nest apps)
runner   → fresh slim base, tini, copy only runtime files, USER node, HEALTHCHECK, CMD node …
```

**Why this fits:**
- Pruning means a change in `mod-lab` does not invalidate the web image's dependency layer.
- The frozen lockfile ensures the image contains exactly the reviewed versions (D1 §4).

**Notes:**
- **Base image:** Debian slim (glibc) rather than Alpine (musl). Native modules such as `argon2` and the Prisma tooling behave consistently on glibc. Pin by digest. Rebuild when a security update lands.
- **Prisma 7** generates the client to an explicit output path inside `packages/database`. The build stage must run generation before the app build. The runtime needs the generated client and `@prisma/adapter-pg` / `pg`, but not the Prisma CLI (except in `hms-migrate`).
- **`pnpm deploy`** flags differ across pnpm majors (e.g., workspace package injection). Confirm them in T-FND-05 for the pnpm version chosen in T-FND-01.
- **Remote Turborepo cache** may be used in CI builds by passing `TURBO_TEAM` and `TURBO_TOKEN` as build arguments to the build step only. They must not persist into the runtime layer ([L §6](L-cicd-sonarqube.md#6-turborepo-caching-policy)).
- **Next.js standalone** in a monorepo needs `outputFileTracingRoot` pointing at the repo root. The server file is then at `apps/web/server.js` inside the standalone folder. `public/` and `.next/static` are copied explicitly (Next.js docs).
- **Build cache mounts** (`--mount=type=cache`) speed pnpm installs without bloating layers.
- **Fonts** (Noto Sans Bengali/Noto Sans) are bundled in `packages/ui` and served by Next.js. The pdf-renderer gets the same fonts through the HTML (data URLs, or fonts installed in a derived image). Decide in T-PRN-01.

## 4. Separate API, web and worker concerns

| Concern | Decision |
| --- | --- |
| Scaling | `api` replicas scale independently (2 at T0). `worker` usually stays at 1 replica with per-queue concurrency, scaled only when queue metrics require it. BullMQ coordinates multiple workers safely, and the outbox relay uses `SKIP LOCKED`. |
| Failure isolation | A PDF/Chromium memory spike affects only `pdf-renderer` (memory-limited, internal network). Heavy reports run in `worker`, not `api`. |
| Deploy order | `migrate` → `api` → `worker` → `web` (J §9.1). `web` depends only on the API contract version it was built with. Contract changes are backward compatible within a release (H §7). |
| Networking | `edge` (Caddy ↔ web/api), `backend` (internal: api/worker ↔ postgres/redis), `render` (internal: worker ↔ pdf-renderer), `egress` (worker → object storage/partners). Only Caddy publishes host ports. |
| Privileges | `read_only: true` root filesystem with `tmpfs: /tmp` for web/api/worker; `cap_drop: [ALL]`; `no-new-privileges`. Caddy gets `NET_BIND_SERVICE`. |

## 5. Health checks, signals and shutdown

- **api**: liveness `/health/live` (no dependencies); readiness `/health/ready` checks the DB (`SELECT 1` with a 1 s timeout), Redis ping, and the expected migration version. Implement with `@nestjs/terminus` 12. The legacy `HealthIndicator` API was removed in v12 (D1 V-05).
- **worker**: a tiny HTTP server on `WORKER_HEALTH_PORT` (9464) exposing `/health` (heartbeat age < 60 s, Redis reachable) and `/metrics`.
- **web**: Route Handler `/api/health`, returning static OK with no backend calls (keeps Caddy routing simple).
- **Signals:** `tini` as PID 1 forwards SIGTERM. NestJS `enableShutdownHooks()`.
  - The API drains in-flight requests (`stop_grace_period: 30s`).
  - The worker calls `worker.close()` (`stop_grace_period: 60s`).
  - PostgreSQL gets 60 s for a clean shutdown.

## 6. Volumes, networks and secrets

| Volume | Service | Content | Backup |
| --- | --- | --- | --- |
| `pgdata` | postgres | Database cluster | pgBackRest (J §8) |
| `redisdata` | redis | AOF/RDB | Not backed up (rebuildable; outbox replay) |
| `caddy_data` | caddy | Certificates and ACME account | Optional (re-issuable) |
| `caddy_config` | caddy | Autosaved config | No |

Secrets are files referenced in Compose `secrets:` and mounted at `/run/secrets/<name>`. Apps read `*_FILE` variables and build connection strings in memory, which Prisma 7 needs through the adapter configuration. Secret files live in `/opt/hms/secrets/` (0400, root). Rotation: RB-12.

## 7. Environment variable inventory

Non-secret values go in `.env` ([`env.example`](../templates/docker/env.example)). Secret values are files.

| Variable | Service(s) | Secret? | Example / default | Purpose |
| --- | --- | --- | --- | --- |
| `APP_ENV` | all | no | `production` | Behavior switches (no debug endpoints in production) |
| `LOG_LEVEL` | all | no | `info` | Logging |
| `PUBLIC_APP_ORIGIN` | api, web | no | `https://app.example.invalid` | CSRF origin check, cookies, links |
| `DEFAULT_LOCALE` | web, api | no | `bn-BD` | Fallback language (C-025) |
| `DEFAULT_FACILITY_TIMEZONE` | api, worker | no | `Asia/Dhaka` | Provisioning default (AS-002) |
| `DB_HOST` / `DB_PORT` / `DB_NAME` | api, worker, migrate | no | `postgres` / `5432` / `hms` | DB location |
| `DB_USER` / `DB_PASSWORD_FILE` | api, worker | file | `hms_app` / `/run/secrets/db_app_password` | App role |
| `DB_RELAY_USER` / `DB_RELAY_PASSWORD_FILE` | worker | file | `hms_relay` | Outbox relay role |
| `DB_MIGRATOR_USER` / `DB_MIGRATOR_PASSWORD_FILE` | migrate | file | `hms_migrator` | Migration role |
| `DB_POOL_MAX` | api, worker | no | `10` | Pool size per process ([M §6](M-capacity-performance.md#6-api-worker-scaling-and-database-connection-budgeting)) |
| `DB_STATEMENT_TIMEOUT_MS` / `DB_TX_TIMEOUT_MS` | api, worker | no | `15000` / `5000` | Guards against runaway queries/transactions |
| `REDIS_URL` | api, worker | no (unless an ACL password is added → file) | `redis://redis:6379/0` | Queues, cache, rate limits |
| `QUEUE_PREFIX` | api, worker | no | `hms` | BullMQ key prefix |
| `SESSION_SECRET_FILE` | api | file | — | Session token derivation/signing material |
| `CSRF_SECRET_FILE` | api | file | — | CSRF token generation |
| `FIELD_ENCRYPTION_KEY_FILE` | api, worker | file | — | NID field encryption (E §5.2) |
| `SESSION_IDLE_TIMEOUT_MIN` / `SESSION_ABSOLUTE_TIMEOUT_H` | api | no | `30` / `12` (PROPOSED) | Platform defaults; tenant config overrides (CP-12) |
| `LOGIN_LOCKOUT_THRESHOLD` / `LOGIN_LOCKOUT_MINUTES` | api | no | `5` / `15` (PROPOSED) | Defaults (CP-12) |
| `COOKIE_DOMAIN` | api | no | `app.example.invalid` | Cookie scope |
| `S3_ENDPOINT` / `S3_REGION` / `S3_BUCKET` / `S3_FORCE_PATH_STYLE` | api, worker | no | provider values | Object storage |
| `S3_ACCESS_KEY_FILE` / `S3_SECRET_KEY_FILE` | api, worker | file | — | Object storage credentials (least-privilege bucket policy) |
| `PRESIGNED_URL_TTL_SECONDS` | api | no | `300` | Download link lifetime |
| `PDF_RENDERER_URL` | worker | no | `http://pdf-renderer:3000` | Internal renderer |
| `WORKER_CONCURRENCY_PDF` / `WORKER_CONCURRENCY_REPORTS` | worker | no | `2` / `1` | Queue concurrency (D §10) |
| `OUTBOX_RELAY_BATCH` / `OUTBOX_RELAY_INTERVAL_MS` | worker | no | `200` / `500` | Relay tuning |
| `WORKER_HEALTH_PORT` / `METRICS_PORT` | worker, api | no | `9464` | Health and metrics |
| `API_INTERNAL_URL` | web | no | `http://api:3001` | Server-side fetches from Next.js |
| `OTEL_EXPORTER_OTLP_ENDPOINT` / `OTEL_SERVICE_NAMESPACE` | all | no | tools VPS endpoint | Telemetry |
| `ERROR_TRACKING_DSN` | all | treat as secret if the provider requires | empty | Error tracking |
| `FEATURE_DEPOSITS` / `FEATURE_DISCOUNTS` / `FEATURE_REFUNDS` / `FEATURE_PAYMENT_GATEWAY` | api, web | no | `false` | Platform-level kill switches for OPEN features. Tenant policy still governs once enabled. |
| `POSTGRES_PASSWORD_FILE`, `POSTGRES_DB`, `POSTGRES_INITDB_ARGS` | postgres | file | `--data-checksums` | Official image settings |
| pgBackRest repository credentials and cipher pass | postgres | file | — | Backups (J §8) |
| `TURBO_TEAM` / `TURBO_TOKEN` | CI build only | CI secret | — | Remote cache (never in runtime images) |

## 8. Image versioning, publishing and migration execution

- **Tags:**
  - immutable `sha-<git-sha>` tags and **deploys by digest** (`image@sha256:…`)
  - human-friendly `vX.Y.Z` tags added at release
  - `latest` is never used in Compose files
- **Registry:** GHCR (`ghcr.io/<org>/hms-*`), private. The CI pushes with `GITHUB_TOKEN` package permissions. The production VPS pulls with a read-only token (environment secret).
- **Provenance:** build attestations and SBOM generation in CI (supported by Docker Buildx/GitHub; verify in L). The image scan runs before push and blocks critical vulnerabilities (L §5).
- **Migration execution:**
  1. The deploy script runs `docker compose --profile migrate run --rm migrate` with the **new** migrate image digest, before recreating app containers.
  2. `migrate.sh` applies Prisma migrations, which include the SQL for RLS/constraints/grants, then runs the RLS coverage check.
  3. A non-zero exit aborts the deploy with app containers unchanged.
  4. Migrations must be backward compatible with the running version (expand/contract, J §9.2).
- **Never** run migrations automatically at API container start. With multiple replicas, that causes races, and a failure leaves a half-started service.

## 9. Development Compose

[`compose.dev.yaml`](../templates/docker/compose.dev.yaml) runs PostgreSQL 18, Redis/Valkey, an S3-compatible dev store, an SMTP sink and the PDF renderer, bound to `127.0.0.1`. Developers and agents run `pnpm dev` for web/api/worker on the host. The init script creates the same database roles as production, with dev-only passwords, so RLS behavior matches. Test databases per agent are created from a migrated template (H §3).

## 10. What has and has not been checked

| Item | Checked? |
| --- | --- |
| Compose YAML syntax (`compose.prod.yaml`, `compose.dev.yaml`) | Parsed with a YAML parser |
| Dockerfiles build | **No** (no Docker daemon in the documentation workspace) |
| Containers run, health checks pass | **No** |
| Caddyfile validity | **No** (validate with `caddy validate` in T-OPS-01) |
| pgBackRest packaging in `Dockerfile.postgres` | **No** |
| Turborepo prune pattern | Matches the official guide (D1 V-20). Not executed. |

Task T-FND-05 builds and runs these templates, and replaces placeholders with pinned versions and digests.
