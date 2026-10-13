# Decision register
Purpose: preserve what the owner has settled and prevent proposals from overwriting it.
Updated: 2026-10-10 | Source of confirmed entries: supplied conversation

## Confirmed product and workflow decisions
| ID | Decision | Implication |
| --- | --- | --- |
| C-001 | Whole-hospital ERP offered as SaaS to multiple customers | Separate customer data and configuration |
| C-002 | Bangladesh initial market | Capture local operational conventions; government discussion is deferred |
| C-003 | NestJS + Next.js + PostgreSQL + Turborepo stack direction | Use backend API ownership and monorepo boundaries |
| C-004 | AI agents drive software development | Tasks need explicit specifications and evidence |
| C-005 | Registration -> visit -> service order -> bill -> payment -> delivery -> outcome -> next visit | Preserve this workflow while modeling distinct lifecycles |
| C-006 | Appointment, walk-in and direct diagnostic visit options | Diagnostic visit need not include a doctor consultation |
| C-007 | Appointment booking and actual visit are distinct | Check-in creates/links a visit |
| C-008 | One combined outpatient service bill; doctor visit fee issued separately | Independent invoices, balances and receipts |
| C-009 | Cashier collects doctor fee | Doctor worklist does not grant cashier authority |
| C-010 | Support cash, card, mobile payment and bank transfer | Preserve actual method in each payment |
| C-011 | Payment before service; both full and permitted partial/deposit options | Configure service eligibility; OPEN emergency exceptions |
| C-012 | Patient can use hospital or outside pharmacy | External fulfillment never changes hospital stock |
| C-013 | OPD referral, emergency referral and planned/direct admission supported | Preserve source and linked visit |
| C-014 | Admission may wait for a bed | Admission status and bed occupancy are separate |
| C-015 | Staff-controlled bed transfer with history | Software records movement and does not select clinical need |
| C-016 | After discharge, the vacated bed requires cleaning before available | Cleaning completion is an authorized operation |
| C-017 | IPD running account, deposits/partial payments, final billing | Final settlement policy remains OPEN |
| C-018 | Next appointment may be called next visit | UI glossary should distinguish booking from attended visit |
| C-019 | Lab processing includes review/release and rejection/recollection tracking | Exact reviewer authority is OPEN |
| C-020 | Existing decisions take precedence over supplied documents | Flag conflicts and seek explicit amendments |
| C-021 | Government-specific rules deferred for this discussion | Do not convert prior legal notes into current requirements |

## Carried-forward identity/workflow agreements
Patient search precedes new registration; possible duplicates produce a warning and never an automatic merge. MRN generation belongs to the hospital/customer scope; exact multi-facility numbering is OPEN. NID is optional. Unknown emergency patients can have a temporary identity and later authorized reconciliation. Direct diagnostic ordering is configured per test. Emergency priority is assigned by staff; software records who and when. These agreements need field-level specifications before implementation.

## Supplied foundation, not finalized dependencies
Prisma, Zod, Jest/E2E, SonarQube, Docker and CI/CD are part of the supplied foundation direction. Exact versions, the browser test tool and supporting libraries need a stack decision. The attachments do not select these dependencies.

## Proposed engineering decisions
| ID | Proposal | Needed before treating it as final |
| --- | --- | --- |
| P-001 | Modular monolith with API and workers | Architecture review and scaffold task |
| P-002 | Tenant organization with facilities beneath it | Confirm customer/group model |
| P-003 | Shared PostgreSQL tables with tenant scoping and RLS for standard tier | Prove pool behavior and isolation; approve hosting topology |
| P-004 | One product codebase with versioned customer configuration | Confirm configurable policy catalogue |
| P-005 | Stage delivery around complete patient journeys | Owner approves first-release boundary |
| P-006 | Supporting client/query, queue, storage and observability choices | Record selections in STACK and an ADR |

## Amendment procedure
Keep stable IDs. An owner-approved change records date, reason, replaced decision, affected workflows/data/contracts/tests and migration implications. Do not silently edit an old decision to make it look like it was always agreed. Architectural ADRs should retain alternatives and consequences.
