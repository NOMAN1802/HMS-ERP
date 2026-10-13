# Interaction and screen design
Purpose: translate staff workflows into understandable screens and error feedback.
Status: PROPOSED design principles; screen mockups and exact field forms remain unfinished.

## Staff workspace
Use role-specific navigation: reception queue, doctor worklist, cashier desk, lab/sample queue, nurse station, pharmacy/store and administration. Keep a visible patient banner with MRN, approved identifying information, current visit/admission and facility. Switching patients should warn about unsaved work and refresh stale context.

## Billing example
Show Doctor Fee Invoice and Service Invoice separately, each with total, payments and balance. A green paid indicator for the doctor invoice cannot imply all services are paid. The cashier chooses the invoice/allocation explicitly and sees actual payment method. Deposit eligibility and unavailable services must be understandable before staff start work.

## Bed and nursing example
Admission list shows awaiting bed, active admission and discharge status. Bed view shows available, occupied and needs cleaning; additional maintenance/reservation states are PROPOSED. Transfer action shows source/destination and timestamp. Nurse medicine returns show submitted, pharmacy acceptance and reconciliation status where adopted, so staff do not rely on a missing-paper dispute.

## Clinical and diagnostic documents
Distinguish draft, signed/released, corrected and cancelled. Show author/signer/version when appropriate. Print and View are read/delivery actions; they must not downgrade release state. Report layout, units, ranges and medication fields require department review. Labels must make sample/patient matching practical at real workstations.

## Usability
Support keyboard flow for repetitive cashier/order entry, searchable lists, continuous scrolling or paging, accessible focus/error messages, stable fonts and minimal repeat typing. Display timestamps in the selected facility timezone with clear date-only fields. Bangla/English scope is OPEN.

## Errors and printing
Explain whether an action was saved, denied or has an uncertain outcome. A network timeout should offer status refresh rather than encourage a duplicate payment. Print previews use the same immutable record/version as output. Test A4/A5 with supported printers; browser CSS cannot guarantee every hardware setup.

## Next deliverable
Create the reception/check-in and cashier screen specifications first: visible fields, actions, errors, role checks and acceptance examples. Keep implementation details out of staff-facing labels.
