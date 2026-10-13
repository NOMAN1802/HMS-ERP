# Patient and department workflows
Purpose: describe ordered work and handoffs before specifying APIs or tables.
Status: confirmed main journey with proposed operational details and OPEN exceptions.

## Outpatient and diagnostic journey
| Step | Actor | Outcome | Planning notes |
| --- | --- | --- | --- |
| Search/register | Reception | Patient found or registered with MRN | Warn about duplicates; no automatic merge |
| Book/check in or walk in | Reception | Visit linked to patient | Appointment and attended visit remain distinct |
| Direct diagnostics | Permitted reception staff | Diagnostic visit and allowed orders | Per-test direct-order policy |
| Create orders | Authorized staff/doctor | Consultation/test/imaging/service orders | Record requester and source |
| Issue bills | Permitted billing staff | Combined service invoice plus separate doctor invoice | Issuing vs collecting permissions need review |
| Collect payment | Cashier | Payment, allocation, receipt and independent invoice balances | Full/deposit policy checked for each relevant service |
| Deliver service | Doctor/lab/radiology/other staff | Service starts and is completed | Check authorized payment eligibility server-side |
| Record outcome | Doctor or report authority | Prescription/result/report | Signing/release/correction rights need exact matrix |
| Arrange next visit | Permitted staff | Follow-up booking | Do not create an attended visit before arrival |

Payment is before each relevant service; service orders created after consultation can go through their own billing/payment gate. Do not force every future test order to exist before the consultation. The separate doctor-fee payment can unlock consultation while the diagnostic invoice remains unpaid, according to approved policy.

## IPD journey
OPD/emergency referral or planned/direct route -> admission record -> await bed or allocate -> care and services -> charges and deposits -> discharge request/clearance -> final bill and discharge -> vacated bed needs cleaning -> available after recorded cleaning.
Record source visit, treating team, admission time, occupancy intervals and staff actions. Do not make admission ID change when bed changes. The exact relationship between medical discharge, finance clearance and departure remains Q-006.

## Laboratory journey
Order/payment eligibility -> sample label/collection -> dispatch if needed -> receive or reject -> test/result entry -> review -> release -> report delivery.
A rejection retains reason and initiates a linked recollection instead of deleting the original sample. Opening or printing a report must not downgrade a released state. Exact prepared/verified/finalized actors remain OPEN. Report printing and report delivery are separate events.

## Pharmacy journey
Prescription -> hospital pharmacy request or external option. Hospital path: permitted review -> select batch/quantity -> payment/account eligibility -> dispense -> stock movement and bill posting -> possible return with pharmacy acceptance and reconciliation.
Outside option preserves the prescription and any authorized patient-reported fulfillment note; it never creates hospital dispensing or stock movement.

## Workflow specification checklist
For each handoff define actor, trigger, input, permission, state change, transaction, downstream effect and recovery. Include cancellation after payment, missing sample, failed printer, duplicate submit, stale tab, service outage and disputed medicine return. These are design cases, not automatically approved policies.
