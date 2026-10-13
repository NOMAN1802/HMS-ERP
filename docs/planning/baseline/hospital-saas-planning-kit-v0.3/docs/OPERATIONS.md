# Deployment, support and recovery
Purpose: define how the software is operated and recovered after implementation.
Status: PROPOSED process; provider, service objectives and recovery thresholds OPEN.

## Environments and releases
Use development, staging and production with separated credentials/data. Synthetic staging data is the default. Record code/schema/config/adapter versions. Build reviewed artifacts through CI and run migration/health verification before traffic change.
Use expand/contract migration patterns when application versions overlap. Application rollback does not automatically undo posted payments, stock movements or a migration. Describe forward-fix/reconciliation limits per change.

## Backups and restore
Database backups, required files and configuration must be recoverable together. Agree retention, tolerated loss (RPO) and restore time (RTO). Perform restore exercises before production readiness. In shared storage, define how a single customer's recovered snapshot is reconciled with later provider payments and events; avoid re-sending external effects blindly.

## Hospital outages
Discuss internet/power/service downtime, paper/minimum workflows, record reconciliation and staff communication. Offline synchronization is a separate design commitment and remains OPEN. Whole-hospital service includes overnight operations; decide support and escalation hours explicitly.

## Migration
Inventory source tables/exports and access rights. Map identifiers, services, units, balances, open admissions, stock batches and released records. Dry-run using permitted data; reconcile counts, totals and representative records. Assign cutover owner, legacy-access policy and recovery route. Do not treat a CSV import as adequate migration evidence.

## Observability
Monitor API latency/error, stuck worklists, job backlog, integration failures, tenant resource contention, account-lock causes and audit pipeline. Correlation IDs support diagnosis. Redact patient content from ordinary logs and limit support access.

## Acceptance
A restored synthetic tenant can resume the core workflow with consistent invoices/files; repeated jobs do not create duplicate money or stock. Staff know the response to a printer/provider outage. Deployment runbooks name actual scripts and contacts only after those exist.
