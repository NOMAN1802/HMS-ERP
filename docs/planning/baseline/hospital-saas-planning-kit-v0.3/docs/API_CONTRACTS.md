# API and event contracts
Purpose: show the information each endpoint/command needs before agents independently implement UI and backend.
Status: PROPOSED examples; paths and schemas are not frozen API commitments.

## Contract rules
Trusted actor, tenant and facility authority come from the server session. Client selections are validated. Commands specify permission, input/output, errors, expected record version, idempotency, state transition, audit and transaction effects. Queries also enforce scope; read endpoints are not public simply because they don't write.

## Example command catalogue
| Command | Input (illustrative) | Checks / output |
| --- | --- | --- |
| RegisterPatient | demographics, optional NID, operation key | Registration role; duplicate warning; stable patient/MRN |
| CheckInAppointment | appointment ID, expected version | Tenant/facility, valid booking; visit ID, no duplicate attendance |
| CreateDirectDiagnosticOrder | visit ID, test IDs | Reception permission and per-test direct-order policy |
| IssueVisitInvoices | visit ID, expected order version | Server prices; separate doctor/service invoice IDs |
| RecordPayment | invoice/account selection, amount, method, operation key | Cashier authority, exact amount, allocation policy; receipt/balances |
| StartService | order ID, expected version | Staff permission, valid order and configured payment eligibility |
| AllocateBed | admission ID, bed ID, effective time/version | Active admission, available clean bed, concurrency guard |
| ReleaseLabResult | result version ID, expected version | Reviewer authority, review prerequisites; immutable release event |
| SubmitMedicineReturn | issue ID, line quantities, reason | Eligible return quantities; stock/credit not assumed before acceptance |

## Error design
Use stable codes such as UNAUTHORIZED_SCOPE, PERMISSION_DENIED, INVALID_TRANSITION, STALE_RECORD, PAYMENT_NOT_ELIGIBLE, DUPLICATE_KEY_CONFLICT and BED_UNAVAILABLE. Exact HTTP mapping is to be selected. Avoid leaking another tenant's record existence in a denied response.

## Event design
Proposed events include PatientRegistered, PaymentRecorded, ServiceDelivered, SpecimenRejected, LabResultReleased, BedTransferred and MedicineReturnAccepted. Include event ID, tenant, source record/version, timestamp and schema version. Avoid unnecessary patient content. Consumers deduplicate; critical financial source events have unique posting references.

## Readiness boundary
Before parallel UI/API work, agree concrete schemas, pagination, error behavior and generated documentation. The table is a contract-writing guide; it does not authorize inventing unresolved deposit/refund or clinical approval policy.
