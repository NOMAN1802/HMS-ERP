# Product context
Status: confirmed product direction with proposed technical definitions | Updated: 2026-10-10
Purpose: give a new developer or coding agent enough background to interpret a task correctly.

## Product and customers
Build a configurable whole-hospital ERP, sold as SaaS to multiple independent customer hospitals. Bangladesh is the first market. The seven supplied documents describe one hospital, Sondhany Medical; its workflows inform our product but do not set every customer's policy. One maintained product with customer configuration is the proposed model; customer-specific code branches are not the default design.

Whole-hospital scope includes patient registration, OPD, IPD, emergency, LIS, radiology, nursing, prescription, pharmacy, inventory/procurement, OT, billing/payments, finance, HR/attendance/payroll, dashboards, reports and a patient portal. Source documents also introduce Daycare, reagents, B2B laboratory clients, referrals and newborn-related records; their detailed adoption remains SOURCE/OPEN.

## Confirmed workflow
Patient registration -> visit creation (appointment check-in, walk-in OPD or direct diagnostics) -> service orders -> billing -> payment -> service delivery -> prescription/result/report -> next visit or follow-up.
An appointment reserves a slot; check-in creates/links the actual visit. A direct diagnostic visit does not require a consultation. Hospital test configuration controls which tests reception may order directly.

One combined service invoice per outpatient visit, with the doctor's visit fee issued separately and collected by the cashier. Invoices have independent balances. Support full payment and partial/deposit payment before service starts, according to hospital/service policy. IPD has a running account, interim payments and a final bill. Emergency exceptions and discharge-with-dues policy remain OPEN.

A prescription may be filled at the hospital or outside. Hospital dispensing affects stock and billing; a prescription alone does not. Admission can come from OPD, emergency or a planned/direct IPD route. Admission can wait for a bed. Staff initiate bed transfers; after discharge, the vacated bed needs cleaning before reuse.

## Proposed organizational definitions
Tenant = customer hospital organization; facility = care location; department = operational unit; legal entity = accounting entity. A hospital group may have several facilities. Patient identity is scoped to the customer organization; exact facility numbering rules are OPEN. A staff user may have validated memberships in several organizations, but each request runs within one selected, authorized tenant.

## Development model and stack
AI coding agents assist with planning, implementation, tests and reviews. They do not decide clinical treatment or financial policy. The supplied stack is NestJS, Next.js, PostgreSQL and Turborepo, with Prisma, Zod, Jest/E2E, SonarQube, Docker and CI/CD. Exact versions and supporting libraries remain proposed; see STACK.

## Current planning boundary
Government-specific rules are deferred at the owner's request. This pack makes no claim about current law. Continue planning ordinary permissions, data isolation, audit, exact billing and recovery. First-release scope and pilot hospital profile have not yet been approved. No calendar estimates are included.
