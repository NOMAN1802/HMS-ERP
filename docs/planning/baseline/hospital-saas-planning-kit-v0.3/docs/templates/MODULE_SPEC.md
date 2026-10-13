# Module specification template
Purpose: capture enough domain context before generating implementation tasks.
Copy this when adding a module; see docs/modules for populated starting specifications.

## Control
Name/version/status:
Business and technical owner; domain reviewer:
Confirmed decision IDs; adopted source requirements; open questions:
Related modules and release scope:

## Why this module exists
Staff problem, actors and intended outcome. Define included/excluded capability. A named module does not automatically include every possible hospital feature.

## Workflow and state
Trigger/preconditions, normal path, alternatives, denied operations, cancellation/correction, downtime and recovery. Give authorized transitions and record which actor made them. Separate business lifecycles such as invoice/payment/service status.

## Records and ownership
Owned entities and fields; read-only dependencies; tenant/facility scope; identifiers; provenance and history; units, money and time rules. State which module receives a request instead of permitting direct cross-module writes.

## Interfaces
Commands/queries, schemas/errors, events, adapters, transaction boundary, idempotency/concurrency, permissions and audit. Attach print/UI examples where relevant.

## Acceptance and readiness
At least one realistic synthetic positive example plus relevant denied, retry, stale and recovery cases. List domain questions blocking tasks, required department review and test links. Record migration, monitoring and release evidence.

## Example distinction
A pharmacy spec must describe how issue/return affects inventory and patient bill. Saying add POS and returns does not resolve batch selection, accepted-return quantities, post-discharge credit or concurrent stock. These must be decided or excluded from a ready task.
