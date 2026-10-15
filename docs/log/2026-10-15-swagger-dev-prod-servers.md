# Swagger: dev and production servers in one doc

- **Date:** 2026-10-15
- **Commit:** this commit
- **Implements:** no task/requirement ID (developer-facing API docs follow-up)

## What was built

The single Swagger document served at `/docs` now lists both the local development
server (`http://localhost:4100`) and the production API origin
(`https://healthcareapi.bytespate.com`, per ADR-021) in its "Servers" dropdown. Anyone
viewing `/docs` from either environment can switch which backend "Try it out" sends
requests to, with no duplicate docs page or separate deployment to maintain.

## Files

| File                     | Purpose                                                        |
| ------------------------- | ---------------------------------------------------------------- |
| `apps/api/src/main.ts`   | Adds `.addServer(...)` for dev and production to `DocumentBuilder`|
| `.env.example`           | Documents the optional `API_PUBLIC_URL` override for staging     |

## Decisions applied

- One OpenAPI document, not two: both environments render from the same `main.ts`
  logic, so there is no drift between a "dev doc" and a "prod doc." This follows the
  user's explicit choice over per-environment doc content or env-only single-server
  docs.
- Production server URL defaults to the ADR-021 API origin
  (`https://healthcareapi.bytespate.com`) but is overridable via `API_PUBLIC_URL`, so a
  staging deployment can point the dropdown at its own origin without a code change.
- The local server entry derives from `API_PORT` (already read for `app.listen`) rather
  than hardcoding `4100` twice.

## Verification

| Command                                                      | Result                                                      |
| --------------------------------------------------------------| -------------------------------------------------------------|
| `pnpm --filter @hms/api typecheck`                           | 0 errors                                                     |
| `pnpm --filter @hms/api dev` + `curl http://localhost:4100/docs-json` | `servers` array lists both `http://localhost:4100` and `https://healthcareapi.bytespate.com` |

## Known limitations

- The production entry only reflects reality once the API is actually deployed at that
  domain (ADR-021 / `docs/planning/docs/J-vps-deployment-operations.md`); this change
  only prepares the Swagger document, it does not deploy anything.
- No auth in front of `/docs` yet (carried over from the prior Swagger entry); still
  local-dev-only until that is addressed.

## How to debug

- If the "Servers" dropdown is missing an entry, check the two `.addServer(...)` calls
  in `apps/api/src/main.ts` and whether `API_PUBLIC_URL` is set to something unexpected
  in the environment.
- `curl http://localhost:4100/docs-json | grep -A6 '"servers"'` shows the raw list
  without opening a browser.
