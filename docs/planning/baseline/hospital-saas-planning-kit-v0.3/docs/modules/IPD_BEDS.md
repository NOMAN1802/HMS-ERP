# Admissions, beds and discharge
Purpose: provide domain context for requirements, system design and scoped coding tasks.
Status: CONFIRMED admission/transfer/cleaning; source billing cutoffs OPEN | Owners: business/domain and technical reviewers to assign.

## Workflow and scope
Admission may originate in OPD, emergency or planned/direct route and may await a bed. Staff allocate or transfer beds; preserve original patient/admission identity and occupancy history. After discharge, the vacated bed requires cleaning before availability. Applying cleaning to transfer vacancies is a proposed operational policy to confirm. Source details include floor/department views, extra-bed tags, Daycare separation and certificates.

Care/service charges post to an admission running account through billing. Discharge request, medical discharge, financial clearance and departure need explicit policy rather than one ambiguous status. Do not implement noon/6 p.m. charges until examples are approved.

## Records and ownership
Admission, Bed, BedAllocation, TransferEvent, cleaning/status events, admission remarks and discharge document links.
All hospital-owned records retain validated tenant/facility context. Cross-module effects use declared application interfaces rather than arbitrary writes.

## Commands, permissions and consistency
Admit, allocate, transfer, request discharge, complete permitted clearance and record cleaning. Enforce active occupancy and retain source/destination/time/actor.
Record actor, time, source/version and reasons for sensitive corrections. Read access and exports also require scope checks; hiding an action in the UI is insufficient.

## Acceptance examples
Create admission awaiting bed. Two users race for one available bed: one allocation succeeds. Staff transfers patient; ID/MRN stays the same. After discharge, the vacated bed cannot reallocate until cleaning completion. Discharge screen reflects committed state.
Use synthetic data; add denial, retry, stale-state and relevant concurrency/failure cases to ready tasks. Link actual tests through TRACEABILITY.

## Open questions before detailed implementation
Occupancy intervals/extra bed policy, charge rules, clearance responsibilities, unpaid balance, transfer backdating and Daycare boundaries.
Resolve the questions affecting the selected task or explicitly exclude that behavior. See DECISIONS, SOURCE_REQUIREMENTS, WORKFLOWS, DATA and ACCESS_CONTROL for shared context.
