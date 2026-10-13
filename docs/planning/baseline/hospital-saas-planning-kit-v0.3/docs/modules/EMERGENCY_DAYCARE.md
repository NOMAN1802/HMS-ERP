# Emergency and Daycare
Purpose: provide domain context for requirements, system design and scoped coding tasks.
Status: CONFIRMED emergency/admission options; SOURCE Daycare breadth | Owners: business/domain and technical reviewers to assign.

## Workflow and scope
Emergency supports known or temporary unidentified patients, staff-assigned priority and ordered care. Record priority actor/time; software does not choose triage. Transfer to IPD preserves source and patient context. Payment exceptions remain OPEN despite general payment-first rule.

Daycare sources describe admission, beds, medicines/services, billing and discharge requests. Nursing and OT need the applicable access. Occupancy must not present an IPD-occupied bed as available Daycare stock.

## Records and ownership
Emergency visit/priority history and Daycare stay/workflow records; share identity, bed and billing through owned interfaces.
All hospital-owned records retain validated tenant/facility context. Cross-module effects use declared application interfaces rather than arbitrary writes.

## Commands, permissions and consistency
Register/check in, record permitted priority, order services, refer/admit and carry out approved Daycare discharge workflow. No invented triage thresholds.
Record actor, time, source/version and reasons for sensitive corrections. Read access and exports also require scope checks; hiding an action in the UI is insufficient.

## Acceptance examples
Unknown emergency patient receives temporary identity then later authorized correction without losing care record. IPD referral preserves originating visit. Daycare list displays committed state and consistent occupancy.
Use synthetic data; add denial, retry, stale-state and relevant concurrency/failure cases to ready tasks. Link actual tests through TRACEABILITY.

## Open questions before detailed implementation
Triage categories/escalation, emergency payment, full clinical scope, Daycare definition/resources and discharge duties.
Resolve the questions affecting the selected task or explicitly exclude that behavior. See DECISIONS, SOURCE_REQUIREMENTS, WORKFLOWS, DATA and ACCESS_CONTROL for shared context.
