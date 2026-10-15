# Docs: staging deployment and the development boundary

- **Date:** 2026-10-15
- **Commit:** this commit
- **Implements:** docs only. Relates to T-FND-03, T-FND-05, T-OPS-01, ADR-019, ADR-020, ADR-021, C-047

## What was built

A single page, `docs/DEPLOYMENT.md`, that records what the staging server runs today (taken from the deployment guide of 2026-10-15) and fixes the boundary between development and deployment. Agents and developers never deploy and never ask for server access. `main` is what staging runs, and merging to `main` deploys nothing by itself. Every PR and release PR states its "deploy impact".

## Files

| File                                              | Purpose                                                                                           |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| docs/DEPLOYMENT.md                                | New. Boundary rules, what runs where, how `main` reaches staging, deploy-impact table, known gaps |
| CLAUDE.md                                         | New "Deployment boundary" section with the four agent rules                                       |
| AGENTS.md                                         | One paragraph pointing to the boundary                                                            |
| docs/GIT_WORKFLOW.md                              | Section 5 steps 6 to 8: no deploy on merge, release PR deploy-impact list, migration safety rule  |
| README.md                                         | "Branches and deployment" section                                                                 |
| .env.example                                      | Comment: new variables go under "Deploy impact"                                                   |
| docs/planning/docs/J-vps-deployment-operations.md | Status row: a manual staging exists; the document remains the target design                       |
| docs/planning/docs/K-docker-design.md             | Status row: staging uses server-local Dockerfiles, not the templates                              |
| docs/planning/docs/L-cicd-sonarqube.md            | Current-state note at section 7: the pipeline is not built; staging is deployed by hand           |

## Decisions applied

- The deploy is a manual, server-side step owned by the project lead. Nothing in this repository performs or automates it (the user's instruction for this change).
- No server address, credentials or `.env` values are written down. The guide's hostnames are public DNS names and are kept.
- The target design in J, K and L is kept, not rewritten. Each gets a short current-state note so the two are never confused.

## Verification

| Command                     | Result                           |
| --------------------------- | -------------------------------- |
| `pnpm format:check` on docs | see the pull request (docs only) |
| `pnpm boundaries:check`     | not affected (no code changed)   |

## Known limitations

- The deployment guide itself is not in the repository, so this page is a summary and can go stale. The server's Dockerfiles, `compose.yaml` and `redeploy.sh` are still only on the server (follow-up in DEPLOYMENT.md section 8).
- The server clones `NOMAN1802/HMS-SaaS`, which is not one of the three configured remotes. How `main` reaches it is unconfirmed (DEPLOYMENT.md section 5).
- `main` has no login code. The first release containing T-ACC-01 needs `CSRF_SECRET` added to the server first, or the API will not start.

## How to debug

If a change behaves differently on staging than locally, start at DEPLOYMENT.md section 7, which maps each reported symptom to the file to check. A missing variable is the most likely cause. Collect the deployer's log lines instead of asking for server access.
