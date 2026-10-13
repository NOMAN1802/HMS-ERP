# OPD, clinical records and prescriptions
Purpose: provide domain context for requirements, system design and scoped coding tasks.
Status: CONFIRMED journey/prescription distinction; detailed clinical content OPEN | Owners: business/domain and technical reviewers to assign.

## Workflow and scope
Doctor worklist starts from the checked-in visit and consultation-payment eligibility. Doctor records clinical notes, creates authorized prescriptions and further service orders. Reception may create configured direct diagnostics. Additional orders after consultation go through their own service invoice/payment gate.

Prescription may be filled internally or externally. It is not evidence of stock issue. Clinical document signing and correction should preserve reviewed versions; exact fields and signer permissions require hospital review.

## Records and ownership
Visit/encounter, clinical document versions, prescription/lines and clinician order request; billing and stock owned elsewhere.
All hospital-owned records retain validated tenant/facility context. Cross-module effects use declared application interfaces rather than arbitrary writes.

## Commands, permissions and consistency
Read worklist, record consultation, create order/prescription, sign/amend where approved. Cross-module charge/dispense through public interfaces.
Record actor, time, source/version and reasons for sensitive corrections. Read access and exports also require scope checks; hiding an action in the UI is insufficient.

## Acceptance examples
Synthetic case: cashier pays separate doctor bill, consultation starts, doctor orders two tests and prescription. Tests join service invoice; prescription alone leaves stock unchanged. A signed document amendment preserves previous reviewed version.
Use synthetic data; add denial, retry, stale-state and relevant concurrency/failure cases to ready tasks. Link actual tests through TRACEABILITY.

## Open questions before detailed implementation
Clinical forms, allergies/unknown states, prescription fields, allowed amendments, follow-up booking and order cancellation stages.
Resolve the questions affecting the selected task or explicitly exclude that behavior. See DECISIONS, SOURCE_REQUIREMENTS, WORKFLOWS, DATA and ACCESS_CONTROL for shared context.
