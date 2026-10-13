# Tenant isolation design
Purpose: make multiple independent hospitals safe to operate in one SaaS product.
Status: customer separation CONFIRMED; exact storage topology PROPOSED/OPEN.

## Boundary
Tenant represents the customer organization, with facilities beneath it if adopted. Patients and hospital transactions are not shared across unrelated tenants. Every request resolves authenticated user membership and permitted facility scope; a subdomain, browser header or globally unique ID is not authorization.

## Topology choices
| Option | Benefits | Tradeoffs |
| --- | --- | --- |
| Shared DB/shared tables | Efficient upgrades and resource pooling | Strict row scoping; per-tenant restore/export more complex |
| Database per tenant | Clearer physical separation and tenant recovery | More migrations, connections and monitoring |
| Dedicated deployment | Strong operational separation/custom placement | Greater provisioning and upgrade effort |

Proposed standard tier: shared PostgreSQL with application scoping plus row-level security (RLS). This remains P-003. Do not build all placement models before selecting the first.

## Shared-table implementation obligations
Tenant-owned records carry tenant_id. Business number uniqueness is scoped to tenant/issuer as appropriate. Foreign keys must prevent tenant A's child from referencing tenant B's parent; RLS alone does not replace relational design.
Use separate application/migration roles. The application role must not bypass row security or rely on superuser privileges. Apply read/write policies and evaluate FORCE RLS. Set tenant context transaction-locally on the same pooled connection as scoped queries; prove this with the selected Prisma/pool integration. A leaked session variable creates cross-request risk.

## Non-database surfaces
Cache keys, file authorization, job payloads, exports, search indexes, WebSockets and report queries retain validated tenant context. Delayed sensitive jobs recheck applicable authority. Vendor admin jobs use a separately reviewed access path and auditable purpose.

## Acceptance tests
Use two tenants with identical names, MRNs and invoice numbers. Attempt cross-tenant IDs in reads/writes, parent references, files, reports, background jobs and exports. Test missing context, revoked membership, connection reuse after failure and concurrent requests using the real application database role. Define tenant export and restore behavior before a production launch.
