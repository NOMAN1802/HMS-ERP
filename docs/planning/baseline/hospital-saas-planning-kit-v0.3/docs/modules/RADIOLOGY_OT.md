# Radiology and operating theatre
Purpose: provide domain context for requirements, system design and scoped coding tasks.
Status: SOURCE operational workflows; detailed clinical/resource rules OPEN | Owners: business/domain and technical reviewers to assign.

## Workflow and scope
Radiology configures modalities/schedules, appointments, exams/image references and prepared/verified/final reports. Required PACS/DICOM integration must be scoped with actual partner; full archive implementation is not assumed.

OT route from sources: requisition -> confirmation -> reception/anesthesia -> execution -> post-operative -> clearance. Record patient/team/resources and billable effects. OT billing must post reliably once to the main patient/admission account. Permitted Daycare access is source-requested.

## Records and ownership
Modality schedule, radiology examination/report references, OT booking/stage/procedure/clearance records; billing/stock owned elsewhere.
All hospital-owned records retain validated tenant/facility context. Cross-module effects use declared application interfaces rather than arbitrary writes.

## Commands, permissions and consistency
Schedule/cancel/reschedule, record exam/procedure, review/release report, clear stages. Validate identity, resources and source-posting idempotency.
Record actor, time, source/version and reasons for sensitive corrections. Read access and exports also require scope checks; hiding an action in the UI is insufficient.

## Acceptance examples
Radiology report references correct order and reviewed version. Duplicate OT execution event does not duplicate patient charges. Unauthorized user cannot finalize report; cancellation respects downstream performed work.
Use synthetic data; add denial, retry, stale-state and relevant concurrency/failure cases to ready tasks. Link actual tests through TRACEABILITY.

## Open questions before detailed implementation
Device/PACS interfaces, team/room scheduling, consent/checklists, anesthesia records, stage authority and package pricing.
Resolve the questions affecting the selected task or explicitly exclude that behavior. See DECISIONS, SOURCE_REQUIREMENTS, WORKFLOWS, DATA and ACCESS_CONTROL for shared context.
