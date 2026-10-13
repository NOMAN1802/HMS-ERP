import type { Prisma, PrismaClient } from './generated/prisma/client.js';

export interface TenantContext {
  tenantId: string;
  userId?: string;
}

export type TenantTx = Prisma.TransactionClient;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Runs `fn` in a transaction whose RLS tenant context is `ctx` (ADR-003, E §6.2).
 *
 * The context is set with transaction-local `set_config(..., true)`, so it ends with the
 * transaction (commit or rollback) and never leaks to the next user of a pooled connection.
 * Every tenant-data query must run inside this; outside it, RLS returns no rows.
 */
export async function withTenant<T>(
  prisma: PrismaClient,
  ctx: TenantContext,
  fn: (tx: TenantTx) => Promise<T>,
): Promise<T> {
  if (!UUID.test(ctx.tenantId)) throw new Error('withTenant: tenantId must be a UUID');
  if (ctx.userId !== undefined && !UUID.test(ctx.userId)) {
    throw new Error('withTenant: userId must be a UUID');
  }

  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.tenant_id', ${ctx.tenantId}, true),
                                  set_config('app.user_id', ${ctx.userId ?? ''}, true)`;
      return fn(tx);
    },
    // maxWait: how long to wait for a free pooled connection (Prisma's default is 2 s).
    // timeout: how long the transaction itself may run.
    { maxWait: 5_000, timeout: 5_000, isolationLevel: 'ReadCommitted' },
  );
}
