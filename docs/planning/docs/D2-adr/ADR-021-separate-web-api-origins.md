# ADR-021 — Separate web and API origins

- **Status:** ACCEPTED by the product owner on 2026-10-14.
- **Date:** 2026-10-14
- **Amends:** D §4 and J §6 (single domain with `/api/*` routed by the proxy), ADR-004 (cookie scope), ADR-002 (server-side prefetch with the user's cookie)

## Context

- The design routed `app.<domain>/api/*` to the API so the staff app and API share one origin.
- The product owner chose separate hostnames: the staff UI on `healthcare.bytespate.com` and the API on `healthcareapi.bytespate.com` (staging). Production names follow the same pattern.
- `bytespate.com` also hosts an unrelated ecommerce site. Every `*.bytespate.com` host is the **same site** for browsers (same registrable domain), but a **different origin**.

## Decision

1. **Two origins.** The web container serves `healthcare.…`; the API container serves `healthcareapi.…`. nginx has one server block per host.
2. **CORS on the API**, allow-list only: origins come from `CORS_ORIGINS` (exact match, no wildcards), `credentials: true`, allowed headers `Content-Type`, `X-CSRF-Token`, `Idempotency-Key`, `X-Request-Id`. Preflight results are cached with `Access-Control-Max-Age: 7200`.
3. **Session cookie is host-only on the API host.** It is set without a `Domain` attribute, so it is sent only to `healthcareapi.…`. It must **never** use `Domain=bytespate.com`: that would send staff sessions to the ecommerce site and every other subdomain. Attributes stay `httpOnly; Secure; SameSite=Lax` (ADR-004).
4. **CSRF tokens are mandatory on every state-changing request.** `SameSite=Lax` does not stop requests from other `*.bytespate.com` sites, because they are same-site. CORS stops other origins from *reading* responses, not from *sending* requests.
5. **The browser calls the API directly** with `fetch(..., { credentials: 'include' })`. The API base URL is a build-time setting of the web app (`NEXT_PUBLIC_API_URL`).
6. **No server-side prefetch with the user's session.** The Next.js server never sees the API cookie, so ADR-002 point 2's server prefetch is dropped. Screens fetch on the client. The server renders only the shell.
7. **API paths** keep the `/api/v1/{module}/…` base from D §8, now on the API host. `/health` stays at the root for the proxy and deploy checks.

## Alternatives

| Option | When preferable |
| --- | --- |
| One origin, `/api` routed by the proxy (original design) | Simplest cookie/CSRF model, no preflights. Still a valid fallback: the API code is the same, only nginx and `NEXT_PUBLIC_API_URL` change |
| A separate registrable domain for HMS (e.g. its own `.com`) | Removes the shared-site exposure to the ecommerce site. Recommended before production |

## Consequences

- Positive: hosts can get separate Cloudflare rules, caching and firewalling; the API host can later serve mobile, portal and device clients.
- Negative: a CORS preflight before most commands (cached up to 2 h in Chromium); CORS and cookie settings become security-critical configuration; CSRF must be implemented with T-ACC-01, not later.

## Evidence required

- AT-ACC tests (T-ACC-01) must cover: cookie has no `Domain` attribute; a request without a valid CSRF token is rejected; a disallowed `Origin` gets no `Access-Control-Allow-Origin`.
- Staging check: the web origin receives CORS headers, any other origin does not.
