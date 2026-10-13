# Agent-driven development workflow
Purpose: turn approved requirements into focused implementation work with reviewable results.
Status: PROPOSED process; AI coding is the confirmed development direction.

## Task preparation
One task delivers one complete outcome with named files/packages, contracts and acceptance cases. A good first task might register a patient with tenant-scoped MRN, duplicate warning, permission check, persistence, audit and tested retry behavior. Build the supporting slice deliberately; do not ask for the entire patient department in one vague prompt.

## Context packet
Supply task, relevant decisions, module spec, workflow, access rules, data/API contracts, synthetic examples and actual check commands. AGENTS.md is the shared behavior guide; CLAUDE.md is a client entry point. CONTEXT describes the product; DESIGN describes interaction. Avoid embedding all modules in every task prompt.

## Execution cycle
Read -> identify required questions -> plan bounded change -> implement -> verify persisted behavior -> review -> update docs/contracts -> hand off evidence. Unaffected work may proceed while a blocking domain question remains explicit. Agents cannot silently turn SOURCE/OPEN items into fixed rules.

## Responsibilities
Planner decomposes work; implementer changes code; verifier tests the acceptance behavior; integrator coordinates schema/contracts; domain reviewer confirms hospital rules. These are responsibilities and do not require separate people or simultaneously running agents. Parallel work should be explicitly authorized and scoped.

## If parallel work is used
Use branches/worktrees and isolated test databases. Stabilize exchanged contracts first. Reserve shared files and appoint one owner for Prisma migrations, lockfile, public schemas and permission catalogue. Reconcile integration behavior after merging, not only each branch's unit tests.

## Context maintenance
Every task names decision IDs and source requirements. An owner-approved change updates linked docs and tests. Keep task status in one tracker; avoid several conflicting TODO lists. Document unresolved limits and experimental assumptions in the handoff.

## Done means
Behavior implemented, relevant checks actually run, denial/retry/concurrency evidence where relevant, docs updated, migration implications known and reviewer limitations stated. Markdown describes rules; server checks, database constraints and CI enforce them.
