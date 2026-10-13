# ADR-012 — CI quality gates with SonarQube Community Build (main branch only)

- **Status:** PROPOSED (P-016). The CI host (C-022) and Sonar edition (C-023) are CONFIRMED.
- **Date:** 2026-10-12
- **Approver:** Tech lead

## Context

- SonarQube Community Build analyzes only the main branch. Branch and PR analysis start in Developer Edition (CX-013).
- The brief requires pull-request checks and quality gates.
- GitHub environment required reviewers are unavailable for private repos below Enterprise (CX-014).

## Decision

**PR required checks** (branch protection on `main`):
- format and lint (ESLint 10 + typescript-eslint + **eslint-plugin-sonarjs**)
- typecheck
- unit tests with coverage thresholds per domain package (NFR-MAINT-002)
- PostgreSQL integration and API tests
- build
- affected E2E
- migration checks
- contract drift
- dependency audit
- gitleaks
- hadolint
- image build and scan

**On push to `main`:**
1. SonarQube Community analysis with LCOV coverage.
2. Quality gate wait.
3. Release candidate images built and tagged by commit SHA.
4. Images promoted to staging automatically **only if the Sonar gate passed**.

A failed main gate blocks promotion until fixed by a follow-up PR.

**Production:** a manual `workflow_dispatch` deploy restricted to maintainers, deploying an image digest that has passed staging verification. Signed tags. Full SHA pinning of all third-party actions.

## Alternatives

| Alternative | When preferable |
| --- | --- |
| SonarQube Developer Edition | PR decoration in the PR is mandatory |
| SonarQube Cloud | Hosting the server is undesirable |
| Community branch plugin (unofficial) | Not recommended: unsupported, and breaks on upgrades |

## Consequences

- Sonar findings surface after merge. ESLint SonarJS rules catch many of the same issues before merge.
- **Quality gates do not prove domain correctness** ([L §9](../L-cicd-sonarqube.md#9-what-quality-gates-do-not-prove)).

## Evidence required

- Pipeline runs on the scaffold repository.
- A deliberate failing rule shows the PR blocked.
- A failing Sonar gate on `main` blocks staging promotion.
