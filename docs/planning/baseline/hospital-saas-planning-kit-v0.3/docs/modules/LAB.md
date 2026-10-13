# LIS, specimens and result reports
Purpose: provide domain context for requirements, system design and scoped coding tasks.
Status: CONFIRMED broad lifecycle; SOURCE feedback and exact reviewer rules OPEN | Owners: business/domain and technical reviewers to assign.

## Workflow and scope
Order and service-payment eligibility lead to label/collection, dispatch/receipt, rejection or testing, result entry, review/release and delivery. Preserve rejection reason and linked recollection. Prepared/verified/finalized stages in the sources need approved actor mapping.

Viewing, printing and Back never downgrade released status. Approved test/range/method/template versions remain associated with historical results. Capture all SRC-L01–L17 requests: PBF styling, repeated short forms, stable fonts, sequencing, room/bed, consumption and EXL-200 mapping.

## Records and ownership
Test definition versions, specimen/test links, result versions, review/release/amendment events and delivery history.
All hospital-owned records retain validated tenant/facility context. Cross-module effects use declared application interfaces rather than arbitrary writes.

## Commands, permissions and consistency
Collect/receive/reject/recollect, enter/review/release, controlled correction and report dispatch. Idempotent analyzer adapter quarantines unmatched messages.
Record actor, time, source/version and reasons for sensitive corrections. Read access and exports also require scope checks; hiding an action in the UI is insufficient.

## Acceptance examples
Release a permitted reviewed result, then View/Print/Back; status remains released. Reject a sample and collect a linked replacement. Replayed analyzer message creates one result. Unauthorized entry-only user cannot release.
Use synthetic data; add denial, retry, stale-state and relevant concurrency/failure cases to ready tasks. Link actual tests through TRACEABILITY.

## Open questions before detailed implementation
Eosinophil formula, reference ranges/methods, critical result follow-up, reviewer separation, templates and analyzer protocol.
Resolve the questions affecting the selected task or explicitly exclude that behavior. See DECISIONS, SOURCE_REQUIREMENTS, WORKFLOWS, DATA and ACCESS_CONTROL for shared context.
