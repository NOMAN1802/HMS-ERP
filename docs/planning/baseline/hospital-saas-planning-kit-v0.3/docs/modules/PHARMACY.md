# Hospital pharmacy and dispensing
Purpose: provide domain context for requirements, system design and scoped coding tasks.
Status: CONFIRMED internal/external choice; SOURCE stock/return operations | Owners: business/domain and technical reviewers to assign.

## Workflow and scope
Patient may use hospital or outside pharmacy. Internal dispensing records actual medicines/batches/quantities, affects inventory and posts bill/account effects through owned interfaces. External option retains prescription and never deducts hospital stock.

Support source medicine/generic/manufacturer/supplier masters, POS, IPD issue, returns, credit collections and batch/expiry traceability. Prescription is distinct from dispensed quantities; substitutions and partial dispensing need approved policy.

## Records and ownership
Medicine catalogue, dispensing/lines, return acceptance and pharmacy worklists; stock movement ownership agreed with inventory.
All hospital-owned records retain validated tenant/facility context. Cross-module effects use declared application interfaces rather than arbitrary writes.

## Commands, permissions and consistency
Review request, select batch/quantity, issue, accept permitted return and reconcile financial effect. Guard stock races, expiry policy and duplicate submissions.
Record actor, time, source/version and reasons for sensitive corrections. Read access and exports also require scope checks; hiding an action in the UI is insufficient.

## Acceptance examples
One prescription fulfilled outside creates no hospital movement. Internal issue of two lines produces linked movements/charges once. Accepted return does not exceed eligible issued quantity; post-discharge adjustment retains history.
Use synthetic data; add denial, retry, stale-state and relevant concurrency/failure cases to ready tasks. Link actual tests through TRACEABILITY.

## Open questions before detailed implementation
Units/pack conversion, batch selection, expiry rules, substitution, payment gate, partial issue and post-discharge return acceptance.
Resolve the questions affecting the selected task or explicitly exclude that behavior. See DECISIONS, SOURCE_REQUIREMENTS, WORKFLOWS, DATA and ACCESS_CONTROL for shared context.
