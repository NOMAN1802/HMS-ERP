// Writes one tenant audit event in the caller's transaction (FR-AUD-001), so the event and
// the business change commit or roll back together. Details must hold IDs and codes only.
import type { TenantTx } from '@hms/database';

export interface AuditEventInput {
  tenantId: string;
  action: string;
  outcome: 'SUCCEEDED' | 'DENIED' | 'FAILED';
  actorUserId?: string;
  membershipId?: string;
  targetType?: string;
  targetId?: string;
  reason?: string;
  correlationId?: string;
  details?: Record<string, string | number | boolean | null>;
}

export async function appendAuditEvent(tx: TenantTx, event: AuditEventInput): Promise<void> {
  await tx.auditEvent.create({ data: event });
}
