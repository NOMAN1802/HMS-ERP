# Technology stack and responsibilities
Purpose: show what each tool does and avoid overlapping libraries or hidden infrastructure choices.
Status: core direction supplied; supporting choices PROPOSED unless explicitly selected later.

| Area | Direction / candidate | Responsibility and decision status |
| --- | --- | --- |
| Language | TypeScript | Proposed consistent application/contracts language |
| Monorepo | Turborepo; pnpm proposed | Build graph/cache; package workspace and one lockfile |
| Staff frontend | Next.js + React | Confirmed framework direction; role-specific UI |
| Backend | NestJS | Confirmed; authenticated business commands, reads and authorization |
| Database | PostgreSQL | Confirmed; transactions, constraints and tenant isolation |
| Persistence | Prisma | Supplied foundation; migrations and explicit persistence adapters |
| Validation | Zod | Supplied foundation; shared public input/output schemas where chosen |
| Client server-state | TanStack Query | Candidate for interactive lists/mutations, retries and invalidation |
| Forms | React Hook Form + Zod integration | Candidate for complex forms and field feedback |
| Tables | TanStack Table | Candidate for worklists; backend pagination/filtering for large data |
| UI | Tailwind CSS + accessible component system | Proposed; exact library/theme OPEN |
| Unit/API tests | Jest | Supplied direction; money, state, permissions and contracts |
| Browser E2E | Playwright candidate | E2E required; tool selection still OPEN |
| Code quality | ESLint/typecheck + SonarQube | Supplied SonarQube direction; concrete gate OPEN |
| Jobs/cache | BullMQ + Redis candidate | Durable job execution/cache where needed; database outbox still required |
| Files | S3-compatible object storage candidate | Authorized reports, attachments and imaging references |
| API docs | OpenAPI generation | Proposed canonical schema-derived references |
| Logs/metrics | Structured logs, OpenTelemetry/error tracker candidates | Correlation and operational visibility without patient payload leakage |
| Deployment | Docker + CI/CD | Supplied direction; host/provider/environment design OPEN |

## Client behavior
Use TanStack Query for browser interactions that benefit from cached server state. Next.js server rendering may load initial views. Decide one ownership pattern per screen so duplicate requests and conflicting caches do not emerge. Form state stays in the form; patient/business records remain authoritative on the server. Invalidate relevant worklists and invoice balances after a committed mutation.

## Avoid premature infrastructure
The proposed modular monolith does not require an API gateway, service mesh, Kubernetes or microservices to begin. Add them only for a concrete deployment need. Queues, storage and analytics must carry tenant scope. Cache patient data only under reviewed session/tenant keys; never let a general page cache cross customers.

## Scaffold checklist
Select compatible versions from official documentation at implementation time, pin Node/package manager, commit lockfile, create actual scripts, validate Nest/Next/Prisma integration and document env variables. Exact current dependency versions are not asserted in this pack. Review RLS connection behavior with the selected Prisma/pool setup before finalizing shared tenancy.
