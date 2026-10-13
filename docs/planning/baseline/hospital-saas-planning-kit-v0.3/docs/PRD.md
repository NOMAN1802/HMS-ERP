# Product requirements and delivery scope
Purpose: describe the intended product outcome, users and scope without pretending release boundaries are settled.
Status: whole-hospital scope CONFIRMED; first release OPEN.

## Problem and outcome
Hospitals need a consistent patient record and connected departmental work. The supplied sources report slow screens, incorrect bill totals, duplicate postings, missing returns, inconsistent beds, unstable report statuses and printing problems. Our SaaS should let authorized staff complete hospital work with traceable records and customer-specific policies.

Success is demonstrated by complete staff journeys and reconciled records: a patient is found/registered, checked in, billed and paid correctly, served, and given the appropriate prescription or released report. Hospital users can resolve permitted errors without manual database edits.

## Users
Reception, cashiers, doctors, nurses, lab operators/verifiers, radiology staff, pharmacy/store staff, OT/emergency/Daycare staff, finance, HR, hospital administrators and management. SaaS vendor operators administer customers and product service; their work does not automatically grant patient access. Patient/proxy portal access is a separately designed surface.

## Whole product scope
The confirmed scope covers hospital care, departmental operations, billing, procurement/stock, finance/workforce and reporting. Source-derived breadth includes Daycare, reagent management, B2B diagnostics, referrals and certificates. See MODULES and SOURCE_REQUIREMENTS for detail and adoption status.

## Proposed delivery slices
A: tenant/access foundation plus registration, doctor directory, check-in, separate doctor invoice and cashier payment.
B: consultation/prescription, service orders, combined service invoice, payment gate and lab result journey.
C: admission/bed/nursing/IPD billing and essential pharmacy/stock.
D: richer emergency, radiology, OT, procurement/reagents, full finance/HR and portal.
These are proposals, not committed commercial releases. If the first customer needs IPD, radiology or dispensing on day one, the complete required workflow moves earlier. Registration-only support for a department must not be advertised as a complete department module.

## Acceptance example
A registered patient attends OPD, pays the separate doctor invoice through the cashier, receives consultation and a diagnostic order, pays the service invoice under configured policy, and receives an authorized released report. Paying one invoice does not settle the other. The same local patient number in another tenant never becomes accessible.

## Boundaries and dependencies
No clinical AI, all-analyzer promise, complete PACS or government-interface commitment has been approved. Exact permissions, payment allocation, correction policies and pilot acceptance need discussion. Track first-release choice as Q-001 rather than inferring it from an earlier assistant suggestion.
