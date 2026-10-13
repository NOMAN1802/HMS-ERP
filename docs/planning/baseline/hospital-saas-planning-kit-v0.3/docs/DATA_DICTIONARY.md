# Data dictionary: starting fields
Purpose: define field meanings so generated code does not invent incompatible shapes.
Status: PROPOSED starter dictionary; not exhaustive or physically finalized.

| Entity.field | Meaning and rule | Owner / remaining decision |
| --- | --- | --- |
| Patient.id | Stable internal identity | Patients; cannot change on transfer |
| Patient.tenant_id | Customer owning the record | SaaS/patients; validated context |
| Patient.mrn | Hospital-issued number | Issuer/numbering scope OPEN |
| Patient.name | Recorded name, may be unknown initially | Exact component fields/language OPEN |
| Patient.birth_date / reported_age | Known date or age estimate with provenance | Avoid fake dates for unknown age |
| Patient.phone_normalized | Searchable normalized contact | Phone may be shared; not unique identity |
| Patient.nid | Optional identifier | Restricted visibility/masking policy OPEN |
| Visit.kind | OPD/diagnostic/emergency or agreed code | Exact code catalogue OPEN |
| Visit.appointment_id | Optional originating booking | Scheduling/check-in |
| ServiceOrder.requester_id | Actual permitted requester | Never trust arbitrary browser signer |
| ServiceOrder.direct_order_policy_version | Policy used for direct ordering | Orders |
| Invoice.type | Doctor fee or service/other agreed invoice type | Billing; separate amounts |
| Invoice.currency | Explicit currency code | Initial currency configuration OPEN |
| Payment.method | Cash/card/mobile/bank transfer subtype | Actual stored method; gateway details OPEN |
| Allocation.amount | Exact money applied to invoice/account | Billing; deposit/overpayment Q-004 |
| BedAllocation.start_at / end_at | Actual occupancy interval | IPD; include source event/actor |
| Bed.status | Operational availability such as needs cleaning | Do not infer only from discharge |
| ResultVersion.range_version_id | Applicable approved reference range | LIS; retain historical association |
| ResultVersion.released_by / released_at | Authorized release evidence | Reviewer roles OPEN |
| StockMovement.quantity / unit | Quantity effect in approved unit | Conversions and rounding OPEN |
| Return.accepted_by / accepted_at | Pharmacy/store acceptance where adopted | Nursing return policy OPEN |
| AuditEvent.actor / tenant / record_version | Who did what within which context | Audit; redaction policy required |

## Extension format
For every additional field include type, units/scale, required/unknown behavior, source, validation, visibility, index/query need, correction and retention. Distinguish not collected, unknown and not applicable where meaningful. Retention durations and source enumerations are not supplied and must not be fabricated.

## Review examples
No NID must not block normal registration. A bed change cannot change MRN. A corrected lab method must not rewrite previously released report values. A payment recorded as card must remain card in collection reports after invoice export.
