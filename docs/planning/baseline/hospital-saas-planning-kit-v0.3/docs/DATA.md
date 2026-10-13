# Data semantics and lifecycle
Purpose: explain record meaning before selecting tables or ORM fields.
Status: PROPOSED logical model supporting confirmed workflows.

## Core distinctions
Patient persists across visits. Appointment is a booking. Visit records actual attendance. Admission is a stay and may lack a bed initially. Bed allocation is a time interval and changes without changing patient/admission identity.
Service order requests work; a delivered service or result records work done. Prescription requests medicine use; dispensing records physical issue. Charge records amount due; invoice groups charges; payment records money received; allocation links money to an invoice/account. These lifecycles must not be collapsed into one status.

## Authoritative sources
Patients own demographic identity. Practitioners own professional identity/contact. Billing owns exact posted amounts. Stock movements own quantity history. LIS owns result versions and release history. Printable records either reference the reviewed version or retain a snapshot necessary to reproduce historical output.

## Identifiers and uncertainty
Use stable internal IDs plus business identifiers such as MRN, invoice number and sample number with documented scope. Phone/NID are not permanent unique patient keys. Retain optional/unknown demographics and temporary emergency identity. Patient reconciliation requires authorization, provenance and reversible/correctable history.

## Money, time and units
Use PostgreSQL exact numeric or explicitly defined minor units for money; browser floating-point totals cannot be authoritative. Currency scale and rounding rules are explicit. Store timestamps as instants and display Asia/Dhaka for Bangladesh facilities unless configured otherwise. Bed charging uses approved business windows, not a server's accidental timezone.
Store medicine/reagent quantities with units and approved conversions. Lab values retain unit, method, analyzer source and reference-range version. No clinical conversion/rounding rule is guessed.

## Concurrency and correction
Guard transitions with record versions and transactions. Enforce active-bed occupancy, slot capacity, stock availability and number uniqueness under concurrent requests. Idempotency scope includes tenant, actor/operation and request fingerprint as designed.
Signed/released records and posted financial entries need controlled amendment/reversal. Cancellation retains history; generic deletion cannot erase the evidence. Audit references the action and affected version without copying unnecessary patient payloads into ordinary logs.

## Remaining work
Complete data dictionary, cardinalities, sensitive-field access, physical constraints, indexes, RLS and migration plan for the first slice. See DATABASE_DESIGN_TEMPLATE and DATA_DICTIONARY.
