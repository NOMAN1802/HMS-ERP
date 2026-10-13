# Inventory, purchasing and reagents
Purpose: provide domain context for requirements, system design and scoped coding tasks.
Status: SOURCE workflows; concurrency/history design PROPOSED | Owners: business/domain and technical reviewers to assign.

## Workflow and scope
Stores maintain stock through movements: opening balance, approved adjustment, issue, return, receipt and transfer. Purchase route is requisition -> PO -> approval -> GRN -> stock, with controlled without-PO receipt if adopted. Internal indents and returns preserve source/destination.

Reagent configuration ties analyzer, UOM and test/consumption mapping to stock and purchase workflows. Exact usage/valuation formulas require review. Physical count reconciliation must produce an approved adjustment, not silently rewrite history.

## Records and ownership
Item/unit/batch/store, stock movements/reservations if adopted, supplier, requisition/PO/receipt, transfer and reagent mappings.
All hospital-owned records retain validated tenant/facility context. Cross-module effects use declared application interfaces rather than arbitrary writes.

## Commands, permissions and consistency
Request/approve/purchase/receive/transfer/adjust/consume. Validate same-tenant store/item/batch and exact units; coordinate atomic stock effects.
Record actor, time, source/version and reasons for sensitive corrections. Read access and exports also require scope checks; hiding an action in the UI is insufficient.

## Acceptance examples
Receive one PO delivery twice with same reference: stock increases once. Two issues compete for limited stock: approved availability policy is preserved. Transfer dispatch and receipt reconcile; adjustment retains count/reason/approver.
Use synthetic data; add denial, retry, stale-state and relevant concurrency/failure cases to ready tasks. Link actual tests through TRACEABILITY.

## Open questions before detailed implementation
Negative-stock policy, reservation, unit conversion, valuation, return acceptance, approval limits and reagent consumption rules.
Resolve the questions affecting the selected task or explicitly exclude that behavior. See DECISIONS, SOURCE_REQUIREMENTS, WORKFLOWS, DATA and ACCESS_CONTROL for shared context.
