# Hospital SaaS ERP: planning and coding-agent context
Version: 0.3 | Updated: 2026-10-10 | Status: evolving product specification

## What this pack is
This pack describes the hospital ERP discussed with the product owner. It expands the earlier 32-file starter pack with confirmed workflow decisions, requirements extracted from seven supplied hospital documents, concrete examples, module specifications and instructions for coding agents. Each document explains its purpose and what remains unfinished.

The product serves multiple customer hospitals, initially in Bangladesh, and covers the whole hospital. AI agents will help develop the software. Operational or clinical AI features have not been requested. This pack contains documentation; application source, a runnable scaffold, a Prisma schema and completed API contracts are subsequent work.

## How to read it
1. Start with [the plain-language guide](START_HERE.md).
2. Read [CONTEXT.md](CONTEXT.md), [decisions](docs/DECISIONS.md), [open questions](docs/OPEN_QUESTIONS.md) and [workflows](docs/WORKFLOWS.md).
3. Use [requirements](docs/FUNCTIONAL_REQUIREMENTS.md) and the linked module specs to discuss expected behavior.
4. Review [architecture](docs/ARCHITECTURE.md), [stack](docs/STACK.md), [system design](docs/SYSTEM_DESIGN_TEMPLATE.md) and [database design](docs/DATABASE_DESIGN_TEMPLATE.md) before writing implementation tasks.
5. Coding agents begin with [AGENTS.md](AGENTS.md) and receive a scoped task from [the task template](docs/templates/TASK.md).
6. [The index](docs/INDEX.md) lists every file and explains when to use it.

## How certainty works
- CONFIRMED: the product owner's existing decisions. Change only after an explicit product-owner decision.
- SOURCE: a requirement or issue in a supplied hospital document. Preserve its provenance; validate before adopting a hospital-specific rule across all customers.
- PROPOSED: an engineering recommendation or suggested release order, awaiting agreement.
- OPEN: an unanswered question. An agent must not silently choose a clinical, financial or commercial rule.
- DEFERRED: deliberately parked for later discussion. Government-specific rules are deferred at the owner's request.

These labels keep suggested architecture and legacy behavior from accidentally becoming approved requirements. See [source requirements](docs/SOURCE_REQUIREMENTS.md) for the attachment-derived backlog and [traceability](docs/TRACEABILITY.md) for implementation evidence.

## Next practical step
Review the open questions in priority order. Then complete the first workflow's roles, state transitions, field list and acceptance examples. The first production release is still OPEN; suggested stages are documented rather than treated as agreed scope.
