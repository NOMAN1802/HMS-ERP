# Nurse station and medicine requests/returns
Purpose: provide domain context for requirements, system design and scoped coding tasks.
Status: SOURCE detailed staff requirements; bed-history decisions CONFIRMED | Owners: business/domain and technical reviewers to assign.

## Workflow and scope
Nurse worklist shows assigned admitted and Daycare patients, current location and clear discharge status. Nurses view permitted released lab reports. Batch medicine indents/returns and safe quantity edits reduce repetitive work.

A return record visible to nursing and pharmacy should distinguish request/submission from pharmacy acceptance where adopted. Post-discharge returns need a controlled financial correction process. Mistaken X-ray cancellation depends on authorization and downstream progress, not destructive deletion of evidence.

## Records and ownership
Care observations/worklist references, indent/return requests, status/history and permitted report links. Pharmacy owns issue/acceptance; billing owns credit.
All hospital-owned records retain validated tenant/facility context. Cross-module effects use declared application interfaces rather than arbitrary writes.

## Commands, permissions and consistency
View patient/lab context, record approved observations, create/edit batch indent, submit return, cancel permitted order. Session/account-lock diagnostics go to access/support.
Record actor, time, source/version and reasons for sensitive corrections. Read access and exports also require scope checks; hiding an action in the UI is insufficient.

## Acceptance examples
Return two medicines in one request, edit quantity without removing other lines, and show a return slip. Pharmacy acceptance reconciles quantities and billing. Discharged patient remains clearly identified and appropriate bed/room prints correctly.
Use synthetic data; add denial, retry, stale-state and relevant concurrency/failure cases to ready tasks. Link actual tests through TRACEABILITY.

## Open questions before detailed implementation
Medication administration scope, ward assignments, report visibility, return acceptance/credit sequence and cancellation before/after service.
Resolve the questions affecting the selected task or explicitly exclude that behavior. See DECISIONS, SOURCE_REQUIREMENTS, WORKFLOWS, DATA and ACCESS_CONTROL for shared context.
