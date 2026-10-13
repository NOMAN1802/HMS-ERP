# Plain-language guide to the pack
Purpose: explain the documents before asking anyone to use them.

Think of the planning work as answering five questions:
1. What are we building? CONTEXT, PRD and DECISIONS answer this.
2. What should staff be able to do? WORKFLOWS, FUNCTIONAL_REQUIREMENTS and module specs answer this.
3. How will the software work? ARCHITECTURE, STACK, SYSTEM_DESIGN and DATABASE_DESIGN answer this.
4. How will we know it works? Acceptance examples, TESTING_CI, NFR and TRACEABILITY answer this.
5. How should coding agents work? AGENTS, AGENT_DEVELOPMENT and TASK answer this.

## Important files in simple terms
| File | Meaning | Example |
| --- | --- | --- |
| CONTEXT.md | The background an agent needs | Multiple hospitals buy the same SaaS product |
| DECISIONS.md | Things we have already settled | Doctor fee has a separate invoice |
| OPEN_QUESTIONS.md | Decisions we still need | What happens when an IPD patient has a balance at discharge? |
| WORKFLOWS.md | Who does what, in what order | Cashier records payment before a permitted service starts |
| FUNCTIONAL_REQUIREMENTS.md | Behavior we can check | Paying the doctor invoice leaves the service invoice's balance unchanged |
| DESIGN.md | How staff see and use the software | Patient banner and separate invoice statuses |
| ARCHITECTURE.md | Responsibilities of software components | NestJS checks permission and changes records |
| DATABASE_DESIGN_TEMPLATE.md | Plan for stored records and relationships | Patient has many visits; visit can have multiple invoices |
| AGENTS.md | Instructions for the coding assistant | Read the relevant spec and never invent a billing rule |
| CLAUDE.md | Entry point for a particular coding client | Points to shared instructions |
| templates/TASK.md | One piece of work an agent can finish | Register a patient with an audited tenant-scoped MRN |

## Our planning order
Record decisions -> describe workflows -> write requirements and permissions -> design screens and data -> agree architecture -> create bounded coding tasks -> implement and test -> review with hospital users.

We can draft the whole hospital's scope while designing detailed implementation tasks only for the next slice. A short module document establishes ownership; it does not mean the module is ready to code in full.

## What is ready and what is unfinished
The confirmed patient/billing decisions and broad hospital scope are recorded. Source feedback is organized. Proposed system boundaries and a logical data model are included. Exact forms, all field constraints, final permissions, bed-charge formulas, performance targets, physical tables, provider protocols and first-release boundaries still require work.
