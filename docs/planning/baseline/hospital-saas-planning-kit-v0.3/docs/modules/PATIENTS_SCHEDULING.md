# Patients, practitioners and scheduling
Purpose: provide domain context for requirements, system design and scoped coding tasks.
Status: CONFIRMED identity/attendance direction; SOURCE scheduling details | Owners: business/domain and technical reviewers to assign.

## Workflow and scope
Own patient identity/identifiers, practitioner directory, schedules, appointments and check-in. Reception searches first, then registers if needed. NID is optional; similarity prompts review and never auto-merge. Temporary emergency identity supports later authorized reconciliation. Phone normalization is a source requirement.

Appointments reserve slots; visit attendance starts at check-in. Walk-ins and diagnostic-only visits need no existing appointment. Scope MRNs to the confirmed hospital/customer boundary; exact group/facility numbering is OPEN. Practitioner name alone must not be used as a unique identity.

## Records and ownership
Patient, PatientIdentifier, Practitioner, Schedule, Appointment; creation/link of Visit through agreed clinical interface.
All hospital-owned records retain validated tenant/facility context. Cross-module effects use declared application interfaces rather than arbitrary writes.

## Commands, permissions and consistency
Lookup, register, update permitted demographics, book/reschedule/cancel and check in. Guard duplicate submits, configured slot capacity and tenant/facility scope.
Record actor, time, source/version and reasons for sensitive corrections. Read access and exports also require scope checks; hiding an action in the UI is insufficient.

## Acceptance examples
Synthetic case: patient registers without NID, books Tuesday appointment, then checks in; one patient and one attended visit exist. Diagnostic walk-in creates a visit without a consultation. Same name/MRN in another tenant remains inaccessible. Search phone with spaces/hyphens resolves consistently.
Use synthetic data; add denial, retry, stale-state and relevant concurrency/failure cases to ready tasks. Link actual tests through TRACEABILITY.

## Open questions before detailed implementation
MRN issuer/sequence, required demographics, temporary identity correction/merge process, slot capacity and who may edit identity.
Resolve the questions affecting the selected task or explicitly exclude that behavior. See DECISIONS, SOURCE_REQUIREMENTS, WORKFLOWS, DATA and ACCESS_CONTROL for shared context.
