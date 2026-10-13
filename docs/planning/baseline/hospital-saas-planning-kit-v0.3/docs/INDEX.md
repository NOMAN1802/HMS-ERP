# Complete documentation index
Purpose: select relevant context instead of loading the entire pack into every agent prompt.
Version: 0.3 | All links are relative to this file.

## Reading paths
Owner: START_HERE -> CONTEXT -> DECISIONS -> OPEN_QUESTIONS -> WORKFLOWS -> PRD.
Domain discussion: SOURCE_REQUIREMENTS -> applicable module -> FUNCTIONAL_REQUIREMENTS -> ACCESS_CONTROL -> acceptance examples.
Technical planning: ARCHITECTURE -> STACK -> TENANCY -> SYSTEM_DESIGN_TEMPLATE -> DATABASE_DESIGN_TEMPLATE -> API_CONTRACTS.
Coding agent: AGENTS -> assigned TASK -> selected module/decisions/contracts -> TESTING_CI -> handoff/TRACEABILITY.

## Files and roles
| File | Topic | Why it exists |
| --- | --- | --- |
| [AGENTS.md](../AGENTS.md) | Instructions for coding agents | Entry point / shared planning context |
| [CHANGELOG.md](../CHANGELOG.md) | Changes from the earlier hospital planning ZIP | Entry point / shared planning context |
| [CLAUDE.md](../CLAUDE.md) | Claude client entry point | expose the shared repository instructions to the selected coding client. |
| [CONTEXT.md](../CONTEXT.md) | Product context | give a new developer or coding agent enough background to interpret a task correctly. |
| [DESIGN.md](../DESIGN.md) | Interaction and screen design | translate staff workflows into understandable screens and error feedback. |
| [README.md](../README.md) | Hospital SaaS ERP: planning and coding-agent context | Entry point / shared planning context |
| [SOURCES.md](../SOURCES.md) | Sources, provenance and limits | show where requirements came from and how conflicts are resolved. |
| [START_HERE.md](../START_HERE.md) | Plain-language guide to the pack | explain the documents before asking anyone to use them. |
| [docs/ACCESS_CONTROL.md](ACCESS_CONTROL.md) | Permissions and audit | define who may perform each action and ensure the backend enforces it. |
| [docs/AGENT_DEVELOPMENT.md](AGENT_DEVELOPMENT.md) | Agent-driven development workflow | turn approved requirements into focused implementation work with reviewable results. |
| [docs/API_CONTRACTS.md](API_CONTRACTS.md) | API and event contracts | show the information each endpoint/command needs before agents independently implement UI and backend. |
| [docs/ARCHITECTURE.md](ARCHITECTURE.md) | Application architecture | define responsibilities so independently written code fits one coherent system. |
| [docs/BANGLADESH_LAUNCH_DISCOVERY.md](BANGLADESH_LAUNCH_DISCOVERY.md) | Bangladesh operational context and deferred government discovery | preserve the launch-country decision without reopening a discussion the owner has parked. |
| [docs/CLINICAL_SAFETY.md](CLINICAL_SAFETY.md) | Clinical workflow correctness | identify the hospital-specific rules agents must obtain from qualified users. |
| [docs/DATA.md](DATA.md) | Data semantics and lifecycle | explain record meaning before selecting tables or ORM fields. |
| [docs/DATABASE_DESIGN_TEMPLATE.md](DATABASE_DESIGN_TEMPLATE.md) | Database design: logical baseline and physical-design checklist | provide concrete starting entities and relationships, then guide physical PostgreSQL design. |
| [docs/DATA_DICTIONARY.md](DATA_DICTIONARY.md) | Data dictionary: starting fields | define field meanings so generated code does not invent incompatible shapes. |
| [docs/DECISIONS.md](DECISIONS.md) | Decision register | preserve what the owner has settled and prevent proposals from overwriting it. |
| [docs/FINANCIAL_RULES.md](FINANCIAL_RULES.md) | Financial and payment rules | protect confirmed billing behavior and identify formulas that need finance approval. |
| [docs/FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md) | Functional requirements register | give coding tasks stable behavior IDs; module specs contain the supporting detail. |
| [docs/GLOSSARY.md](GLOSSARY.md) | Domain glossary | keep conversation terms, screen labels and database concepts consistent. |
| [docs/INTEGRATIONS.md](INTEGRATIONS.md) | External integrations | capture real partner constraints and keep device/provider code outside core rules. |
| [docs/MODULES.md](MODULES.md) | Module ownership map | assign records and writes to a domain before creating packages or tables. |
| [docs/NFR.md](NFR.md) | Non-functional requirements | define measurable quality beyond feature behavior. |
| [docs/OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) | Open questions and next planning discussion | give the owner a manageable sequence of decisions and tell agents what remains unknown. |
| [docs/OPERATIONS.md](OPERATIONS.md) | Deployment, support and recovery | define how the software is operated and recovered after implementation. |
| [docs/PLANNING_PROCESS.md](PLANNING_PROCESS.md) | Planning process | turn discussion and hospital feedback into reviewable requirements and executable agent tasks. |
| [docs/PRD.md](PRD.md) | Product requirements and delivery scope | describe the intended product outcome, users and scope without pretending release boundaries are settled. |
| [docs/READINESS.md](READINESS.md) | Implementation readiness checklist | tell the owner and coding agents which planning outputs are still needed. |
| [docs/RISK_REGISTER.md](RISK_REGISTER.md) | Product and implementation risks | track concrete failure scenarios and how the selected slice will prevent/recover from them. |
| [docs/ROADMAP.md](ROADMAP.md) | Dependency roadmap and release decisions | order work by dependencies and demonstrated outcomes. |
| [docs/SAAS_PLATFORM.md](SAAS_PLATFORM.md) | SaaS customer platform | design the hospital-as-customer lifecycle separately from patient care and patient billing. |
| [docs/SOURCE_REQUIREMENTS.md](SOURCE_REQUIREMENTS.md) | Requirements extracted from the hospital documents | retain the useful source information without promoting it automatically to global SaaS policy. |
| [docs/STACK.md](STACK.md) | Technology stack and responsibilities | show what each tool does and avoid overlapping libraries or hidden infrastructure choices. |
| [docs/SYSTEM_DESIGN_TEMPLATE.md](SYSTEM_DESIGN_TEMPLATE.md) | System design review | expand architecture into a concrete runtime design for the selected workflow. |
| [docs/TENANCY.md](TENANCY.md) | Tenant isolation design | make multiple independent hospitals safe to operate in one SaaS product. |
| [docs/TESTING_CI.md](TESTING_CI.md) | Testing, CI and evidence | show how agent changes are checked against business outcomes. |
| [docs/TRACEABILITY.md](TRACEABILITY.md) | Requirements-to-implementation traceability | let reviewers follow a decision from requirement to code and evidence. |
| [docs/WORKFLOWS.md](WORKFLOWS.md) | Patient and department workflows | describe ordered work and handoffs before specifying APIs or tables. |
| [docs/modules/BILLING_PAYMENTS.md](modules/BILLING_PAYMENTS.md) | Patient billing and cashier payments | provide domain context for requirements, system design and scoped coding tasks. |
| [docs/modules/EMERGENCY_DAYCARE.md](modules/EMERGENCY_DAYCARE.md) | Emergency and Daycare | provide domain context for requirements, system design and scoped coding tasks. |
| [docs/modules/FINANCE_HR.md](modules/FINANCE_HR.md) | Finance, HR, attendance and payroll | provide domain context for requirements, system design and scoped coding tasks. |
| [docs/modules/INVENTORY_REAGENTS.md](modules/INVENTORY_REAGENTS.md) | Inventory, purchasing and reagents | provide domain context for requirements, system design and scoped coding tasks. |
| [docs/modules/IPD_BEDS.md](modules/IPD_BEDS.md) | Admissions, beds and discharge | provide domain context for requirements, system design and scoped coding tasks. |
| [docs/modules/LAB.md](modules/LAB.md) | LIS, specimens and result reports | provide domain context for requirements, system design and scoped coding tasks. |
| [docs/modules/NURSING.md](modules/NURSING.md) | Nurse station and medicine requests/returns | provide domain context for requirements, system design and scoped coding tasks. |
| [docs/modules/OPD_CLINICAL.md](modules/OPD_CLINICAL.md) | OPD, clinical records and prescriptions | provide domain context for requirements, system design and scoped coding tasks. |
| [docs/modules/PATIENTS_SCHEDULING.md](modules/PATIENTS_SCHEDULING.md) | Patients, practitioners and scheduling | provide domain context for requirements, system design and scoped coding tasks. |
| [docs/modules/PHARMACY.md](modules/PHARMACY.md) | Hospital pharmacy and dispensing | provide domain context for requirements, system design and scoped coding tasks. |
| [docs/modules/RADIOLOGY_OT.md](modules/RADIOLOGY_OT.md) | Radiology and operating theatre | provide domain context for requirements, system design and scoped coding tasks. |
| [docs/modules/REPORTING_PORTAL_B2B.md](modules/REPORTING_PORTAL_B2B.md) | Reports, patient portal, B2B and referrals | provide domain context for requirements, system design and scoped coding tasks. |
| [docs/templates/MODULE_SPEC.md](templates/MODULE_SPEC.md) | Module specification template | capture enough domain context before generating implementation tasks. |
| [docs/templates/TASK.md](templates/TASK.md) | Task template for a coding agent | copy this for a bounded implementation task after the relevant rules are settled. |

## Maintenance
Confirmed business rules live in DECISIONS and linked functional/module specs. Proposals are labeled; open questions live in one register. Update affected contracts/data/tests with approved changes. Give documents owners as work begins; do not mark draft assumptions approved merely because a file exists.
