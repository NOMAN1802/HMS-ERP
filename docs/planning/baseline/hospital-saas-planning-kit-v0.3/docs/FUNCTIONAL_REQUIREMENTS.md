# Functional requirements register
Purpose: give coding tasks stable behavior IDs; module specs contain the supporting detail.
Status column identifies confirmed product rules versus attachment-derived candidates.

| ID | Status | Observable behavior | Acceptance example / link |
| --- | --- | --- | --- |
| FR-SAA-001 | CONFIRMED direction | Customer records and configuration are scoped to the authorized organization | Two customers share local identifiers without sharing records; SaaS spec |
| FR-PAT-001 | CONFIRMED | Staff search before registration; warn on possible duplicates without auto-merge | Similar name/phone returns candidates; patient spec |
| FR-PAT-002 | CONFIRMED | Create tenant-scoped MRN; NID optional | Save without NID; retry creates one patient |
| FR-PAT-003 | SOURCE | Normalize phone search across departments | Spaced/hyphenated phone matches same patient |
| FR-PAT-004 | CONFIRMED | Temporary emergency identity supports later authorized correction/link | Preserve original visit and correction history |
| FR-SCH-001 | CONFIRMED | Booking and attendance are distinct | Book appointment; no attended visit until check-in |
| FR-SCH-002 | SOURCE | Schedule, cancel and reschedule doctor slots | Cancel preserves history; prevent configured capacity collision |
| FR-VIS-001 | CONFIRMED | Support walk-in, appointment and direct diagnostic visit | Diagnostic visit succeeds without consultation |
| FR-ORD-001 | CONFIRMED | Only configured tests may be directly ordered by reception | Allowed test succeeds; restricted test denied |
| FR-BIL-001 | CONFIRMED | Outpatient services use combined service invoice; doctor fee separate | Different invoice IDs and independent balances |
| FR-BIL-002 | CONFIRMED | Cashier collects doctor fee | Authorized cashier succeeds; doctor-only user denied |
| FR-BIL-003 | CONFIRMED | Service starts only after full payment or permitted deposit eligibility | Insufficient payment denied; qualifying deposit allowed |
| FR-BIL-004 | CONFIRMED | Payment method retained distinctly | Card payment is reported as card |
| FR-BIL-005 | SOURCE | Discounts/refunds/corrections are authorized, auditable and reconcile | Summary equals detail after adjustment |
| FR-BIL-006 | SOURCE | No duplicate financial postings across modules | Retried source event creates one charge |
| FR-CLI-001 | CONFIRMED direction | Prescription and actual dispensing are distinct | Creating prescription leaves stock unchanged |
| FR-IPD-001 | CONFIRMED | Admission from OPD, emergency or planned/direct route may await bed | Admission exists without occupancy |
| FR-IPD-002 | CONFIRMED | Staff transfer bed with history; identity unchanged | Source bed/time and destination preserved |
| FR-IPD-003 | CONFIRMED | Vacated bed requires cleaning before available | Allocation blocked until cleaning completion |
| FR-IPD-004 | CONFIRMED | Running bill accepts deposits/partial payments and final billing | Deposits accounted for once in settlement |
| FR-NUR-001 | SOURCE | Nurse worklist shows admitted/Daycare/discharged patients and permitted lab reports | Correct current status and report scope |
| FR-NUR-002 | SOURCE | Batch indent/return, safe quantity edits and visible return slip | Two medicine returns retained and reconciled |
| FR-LAB-001 | CONFIRMED direction | Track orders, samples, rejection/recollection, results, review and release | Recollection preserves rejected specimen |
| FR-LAB-002 | SOURCE | Viewing/navigation never downgrades report status | Released report remains released after Back/Print |
| FR-LAB-003 | SOURCE | Approved templates/ranges/methods retained with result version | Configuration change does not rewrite historical report |
| FR-PHA-001 | CONFIRMED | Outside fulfillment never changes hospital inventory | External option produces no stock movement |
| FR-PHA-002 | SOURCE | Hospital issue/return retains batch, expiry, quantity and financial link | Issue reconciles stock and charge once |
| FR-INV-001 | SOURCE | Requisition, PO, approval, receipt, return and transfer workflows | Receive accepted quantity once; rejected transition denied |
| FR-RIS-001 | SOURCE | Modality scheduling, examination/image links and verified report workflow | Released report tied to correct visit/order |
| FR-OT-001 | SOURCE | OT stages and charges persist and synchronize | Retried OT event posts once to IPD account |
| FR-REP-001 | SOURCE | Filtered reports and A4/A5 printing use authoritative records | Detail/summary match; bed/room shown where required |

## Using the register
CONFIRMED direction means the capability was requested, but all clinical fields and authority rules are not necessarily settled. SOURCE rows require validation/adoption for the customer and release. Every row links to module context through docs/INDEX or TRACEABILITY. Expand each into Given/When/Then cases before issuing a ready task.

For example FR-BIL-001: given visit V with doctor fee 500 and tests 1,000 (synthetic amounts), when bills are issued, then doctor invoice D is 500 and service invoice S is 1,000. Paying D leaves S owing 1,000. These figures are test fixtures, not real prices.
