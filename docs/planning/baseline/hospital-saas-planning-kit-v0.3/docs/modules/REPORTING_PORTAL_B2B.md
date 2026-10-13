# Reports, patient portal, B2B and referrals
Purpose: provide domain context for requirements, system design and scoped coding tasks.
Status: CONFIRMED reporting/portal direction; SOURCE B2B/referral candidates | Owners: business/domain and technical reviewers to assign.

## Workflow and scope
Operational/collection/sales/consumption reports use authorized data, appropriate filters and consistent totals. Print output preserves patient/bed/room/version data and A4/A5 layout. Export is a separate permission.

Portal offers verified patient/proxy access, online booking and permitted released reports. B2B sources include client setup, staged order checks, lab dispatch and bill/payment history. Referral/working-share/MPO configuration is named; formulas and adoption remain OPEN.

## Records and ownership
Authorized read models, report templates/delivery/export history, portal identity links, B2B client/order policy and referral configuration if adopted.
All hospital-owned records retain validated tenant/facility context. Cross-module effects use declared application interfaces rather than arbitrary writes.

## Commands, permissions and consistency
View/filter/print/export, verify portal linkage, book, dispatch client report and reconcile client bills. Never infer portal ownership from phone alone.
Record actor, time, source/version and reasons for sensitive corrections. Read access and exports also require scope checks; hiding an action in the UI is insufficient.

## Acceptance examples
Valid consumption filter returns data; summary equals underlying posted detail. Patient A cannot read patient B report. B2B staff see only permitted client orders. Report print retains release state and correct bed/room.
Use synthetic data; add denial, retry, stale-state and relevant concurrency/failure cases to ready tasks. Link actual tests through TRACEABILITY.

## Open questions before detailed implementation
Portal/proxy verification, report delivery with dues, B2B price/credit policies, working shares/referrals and approved templates.
Resolve the questions affecting the selected task or explicitly exclude that behavior. See DECISIONS, SOURCE_REQUIREMENTS, WORKFLOWS, DATA and ACCESS_CONTROL for shared context.
