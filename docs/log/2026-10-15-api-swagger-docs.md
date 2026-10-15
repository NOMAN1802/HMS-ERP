# API status route and Swagger docs

- **Date:** 2026-10-15
- **Commit:** this commit
- **Implements:** no task/requirement ID (local tooling fix + developer-facing API docs, not a planning item)

## What was built

Fixed a local pnpm/turbo PATH conflict so `pnpm install`, `pnpm dev`, and `turbo run dev`
work from a fresh shell. Added a status route to `@hms/api` that reports the port the
server is bound to (served at `/api/v1` once rebased onto `dev`'s global API prefix),
and wired up Swagger (OpenAPI) documentation for the API, served at `/docs` with the raw
spec at `/docs-json`.

## Files

| File                                       | Purpose                                                |
| ------------------------------------------ | ------------------------------------------------------ |
| `apps/api/src/app.controller.ts`           | New status route reporting the bound port              |
| `apps/api/src/app.module.ts`               | Registers `AppController` alongside `HealthController` |
| `apps/api/src/main.ts`                     | Builds and mounts the Swagger document at `/docs`      |
| `apps/api/src/health/health.controller.ts` | Added `@ApiTags`/`@ApiOperation` for Swagger grouping  |
| `apps/api/package.json`                    | Added `@nestjs/swagger` dependency                     |
| `pnpm-workspace.yaml`                      | Denied the `@scarf/scarf` telemetry postinstall script |

## Decisions applied

- `@nestjs/swagger@12.0.2` was chosen because its peer dependency range
  (`@nestjs/core ^12.0.0`, `@nestjs/common ^12.0.0`) matches the pinned Nest 12.1.2 used
  across the API app; `class-validator`/`class-transformer` peers are optional and were
  skipped since this codebase validates with zod (`@hms/contracts`).
- `swagger-ui-dist` (a transitive dependency of `@nestjs/swagger`) pulls in
  `@scarf/scarf`, a telemetry-ping postinstall script. Per the existing `allowBuilds`
  allowlist convention in `pnpm-workspace.yaml`, it was explicitly denied (`false`)
  rather than approved, consistent with the repo's default-deny posture for install
  scripts.
- Local shell issue (unrelated to the codebase): the npm-global `pnpm` on PATH was
  shadowing the official standalone pnpm install because nvm's npm-global bin directory
  came first on PATH in the already-open shell. Fixed by removing the npm-global copy
  (`npm uninstall -g pnpm`) and relying on the standalone install's PATH entry in
  `~/.zshrc`; `turbo` was then installed globally the same way (`pnpm add -g turbo`) so
  `turbo run dev` works directly.

## Verification

| Command                                                            | Result                                                     |
| ------------------------------------------------------------------ | ---------------------------------------------------------- |
| `pnpm install`                                                     | Lockfile passes supply-chain policy, no errors             |
| `pnpm --filter @hms/api typecheck`                                 | 0 errors                                                   |
| `pnpm --filter @hms/api dev` + `curl http://localhost:4100/api/v1` | `{"message":"NEST server is running on port 4100"}`        |
| `curl -I http://localhost:4100/docs`                               | HTTP 200                                                   |
| `curl http://localhost:4100/docs-json`                             | Valid OpenAPI 3.0 document listing `/api/v1` and `/health` |

## Known limitations

- Swagger decorators are minimal (`@ApiTags`/`@ApiOperation` only); request/response DTOs
  are not yet annotated with `@ApiProperty`, since the API has no non-health business
  routes yet. Revisit once real endpoints exist.
- No auth is placed in front of `/docs`; acceptable for local development only. Must be
  gated or disabled before any shared/staging deployment.

## How to debug

- If `/docs` 404s, check that `SwaggerModule.setup('docs', app, swaggerDocument)` runs
  before `app.listen()` in `apps/api/src/main.ts`.
- If `pnpm install` fails with `ERR_PNPM_IGNORED_BUILDS`, check
  `pnpm-workspace.yaml`'s `allowBuilds` map — any new transitive package with a postinstall
  script must be explicitly allowed (`true`) or denied (`false`) there.
- If `turbo`/`pnpm` commands are "command not found" in a terminal, the shell session
  predates the PATH fix; run `source ~/.zshrc` or open a new terminal tab.
