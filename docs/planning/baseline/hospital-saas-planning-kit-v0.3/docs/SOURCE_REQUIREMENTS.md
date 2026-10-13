# Requirements extracted from the hospital documents
Purpose: retain the useful source information without promoting it automatically to global SaaS policy.
Status: SOURCE candidates unless matched by a confirmed decision. Sources S1–S7 are defined in SOURCES.md.

## Identity, administration and OPD
- SRC-A01: user lifecycle, role/department/facility/workstation/module/action permissions and session/account-lock visibility (S1/S6/S7).
- SRC-A02: controlled settings for departments, services, packages, discount authorities and reporting/approval authorities (S1/S6/S7).
- SRC-P01: demographics/MRN, duplicate avoidance and consistent patient data across departments (S1/S4–S7).
- SRC-P02: phone search ignores spacing/hyphens; emergency entry must not fail because formatting differs (S6/S7).
- SRC-P03: doctor master includes degree/specialty/contact; same name alone is not a duplicate; newly saved doctors appear immediately (S6/S7).
- SRC-O01: schedules/slots, appointment cancellation/rescheduling, consultation and receipts (S1/S6/S7).
- SRC-O02: corrected service/test names/rates, continuous order-list navigation and expected result delivery from configured reporting time (S6/S7).
- SRC-O03: authorized test restoration to the same invoice, item-wise discounts, dues/refunds/cancellation; discount without patient selection is a source request requiring business clarification (S6/S7).

## Bed, admission, Daycare and discharge
- SRC-I01: floor-wise real/primary bed views, dummy-bed distinction, patient/name/age/gender/doctor display and department filters (S6/S7).
- SRC-I02: primary/extra bed history and chronological order; extra beds visibly tagged (S6/S7).
- SRC-I03: consistent occupancy across IPD, Daycare and nurse station; correct Daycare ward/cabin availability (S1/S3/S6/S7).
- SRC-I04: admission remarks/item history, discharge/death certificates, newborn registration, clearance and package merge/split (S1/S6/S7).
- SRC-I05: clear persisted discharge state and request/clearance flow; UI success must match saved transaction (S3/S6/S7).
- SRC-I06: capped configured rent, correct bed/cabin revenue head and timestamped transfer charges (S6/S7).
- SRC-I07: noon-to-noon convention, 6 p.m. posting and transfer/extra-bed boundary rules (S6/S7). Exact unified formula OPEN.

## Billing and finance
- SRC-B01: slow page/order entry, stale spinners, poor keyboard flow and missing required doctors/MOs must be corrected (S6/S7).
- SRC-B02: current running bill shown for discount; configured reasons; authorized doctor consultation reduction (S6/S7).
- SRC-B03: medicine/non-medicine independent subtotals/discounts; accepted returns reduce net charges (S6/S7).
- SRC-B04: store/report actual cash/card/bKash methods; authorized corrections retain history (S6/S7).
- SRC-B05: detail and summary order/totals agree; explicit fraction adjustments; single consistent service-charge calculation (S6/S7).
- SRC-B06: no duplicate EMR/IPD or OT charges; reliable cross-module synchronization (S6/S7).
- SRC-B07: daily transactions/finalization, bank reconciliation, transaction search and client bill/payment histories (S1/S6/S7).

## Laboratory: all explicit feedback groups
- SRC-L01: eosinophil count whole-number/rounding behavior; ambiguous final formula needs pathologist confirmation (S2/S6/S7).
- SRC-L02: PBF report format follows approved pathologist layout (S2/S6/S7).
- SRC-L03: repeated legitimate short forms such as RBCs accepted (S2/S6/S7).
- SRC-L04: Advice does not become automatically bold unless configured (S2/S6/S7).
- SRC-L05: workspace font/layout remains stable after save/function-key/print (S2/S6/S7).
- SRC-L06: biochemistry test sequence/serial numbers correct (S2/S6/S7).
- SRC-L07: EXL-200 Blood Urea result interface/mapping receives data reliably; technical details OPEN (S2/S6/S7).
- SRC-L08: immunology machine attribute updates mapped normal range and method (S2/S6/S7).
- SRC-L09: authorized group report reversal restores agreed prior state with history (S2/S6/S7).
- SRC-L10: lab copy includes room/cabin and bed when applicable (S2/S6/S7).
- SRC-L11: valid consumption-summary filters return data instead of blank output (S2/S6/S7).
- SRC-L12: opening/closing printed or customized report does not revert it to Pending (S2/S6/S7).
- SRC-L13: processing Pending report advances to its correct persisted status (S2/S6/S7).
- SRC-L14: Back from Printed retains the correct state (S2/S6/S7).
- SRC-L15: Back from Customize does not revert processed result to Pending (S2/S6/S7).
- SRC-L16: label/collection/recollection/dispatch/receive/reject and prepared/verified/finalized/release workflow; controlled step exceptions (S1/S4–S7).
- SRC-L17: sample types, analyzer/ranges/default values/positive-negative attributes/test condition and B2B distribution configuration (S1/S4–S7).

## Nursing: all explicit feedback groups
- SRC-N01: post-discharge medicine return saves/displays and follows an approved correction workflow (S3/S6/S7).
- SRC-N02: long sessions do not hang or prevent valid re-login; account locks diagnosable (S3/S6/S7).
- SRC-N03: Daycare patient list and details correctly visible (S3/S6/S7).
- SRC-N04: relevant lab reports accessible at nurse station under permission (S3/S6/S7).
- SRC-N05: bed changes preserve patient identity and tracking/history (S3/S6/S7).
- SRC-N06: discharged patient clearly identified (S3/S6/S7).
- SRC-N07: authorized cancellation of mistaken X-ray Chest A/P order; stages/financial reversal OPEN (S3/S6/S7).
- SRC-N08: batch medicine indent/return instead of one-by-one entry (S3/S6/S7).
- SRC-N09: quantity correction does not delete the complete indent (S3/S6/S7).
- SRC-N10: admin/support can inspect account-lock reasons (S3/S6/S7).
- SRC-N11: nursing/pharmacy can see return slip/history to settle disputes (S3/S6/S7).
- SRC-N12: bed number reliably prints on first attempt (S3/S6/S7).

## Pharmacy, procurement, reagents and other domains
- SRC-S01: medicine/generic/manufacturer/supplier masters, POS, IPD issue, credit collection, returns/refunds and batch/expiry traceability (S1/S6/S7).
- SRC-S02: opening stock, adjustment approval, indents, source/destination transfer/receive and returns (S1/S6/S7).
- SRC-S03: requisition -> PO -> approval -> GRN, purchase returns and controlled receipt without PO (S1/S6/S7).
- SRC-S04: reagent analyzer/UOM/mapping/stock/purchase/consumption and reports (S1/S6/S7).
- SRC-R01: radiology modality/schedules, appointments, images/exams and verify/finalize/report flow (S1/S4–S7).
- SRC-T01: OT requisition/confirmation/reception/anesthesia/execution/post-op/clearance and billing (S1/S6/S7).
- SRC-E01: emergency reliable patient entry/search and billing; Daycare admission/service/billing/discharge (S1/S6/S7). Clinical detail is limited.
- SRC-C01: portal appointments/released report worklists; B2B clients/staged orders/lab delivery; referrals/working shares/MPO; exact policies OPEN (S1/S6/S7).
- SRC-H01: employee personal/job/department records and employee/HR reports. Detailed payroll and accounting rules are missing (S1/S6/S7).
- SRC-Q01: configurable A4/A5 output, consistent fields/ordering, previews, correct fonts and bed/room labels (S1–S3/S6/S7).
- SRC-Q02: performance, scalability, permissions/audit, backup/restore, logs/metrics, localization and real-user UAT; exact measurable targets mostly OPEN (S4–S7).

## Adoption procedure
For a source candidate record adopt/configure/defer/reject, reviewer/date, related confirmed decisions and acceptance examples. Do not copy legacy dummy beds, opaque permission codes or broken navigation behavior merely to match an old UI. Retain the required operational outcome.
