// Synthetic identity fixtures for integration tests (AS-009). Every name carries a random
// suffix, so tests can run repeatedly against the same database.
import { randomUUID } from 'node:crypto';
import { withTenant, type PrismaClient } from '@hms/database';

export async function seedTenant(prisma: PrismaClient, nameEn = 'Test Hospital'): Promise<string> {
  const tenantId = randomUUID();
  await withTenant(prisma, { tenantId }, (tx) =>
    tx.tenant.create({ data: { id: tenantId, code: `test-${tenantId.slice(0, 8)}`, nameEn } }),
  );
  return tenantId;
}

export interface SeedUserInput {
  passwordHash: string;
  username?: string;
  status?: 'ACTIVE' | 'LOCKED_TEMPORARY' | 'LOCKED_ADMIN' | 'DISABLED';
  lockedUntil?: Date;
}

export async function seedUser(
  prisma: PrismaClient,
  input: SeedUserInput,
): Promise<{ id: string; username: string }> {
  const username = input.username ?? `user-${randomUUID().slice(0, 8)}`;
  const user = await prisma.userAccount.create({
    data: {
      username,
      displayName: 'Test User',
      passwordHash: input.passwordHash,
      status: input.status ?? 'ACTIVE',
      lockedUntil: input.lockedUntil ?? null,
    },
  });
  return { id: user.id, username };
}

export async function seedMembership(
  prisma: PrismaClient,
  tenantId: string,
  userId: string,
  status: 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED' = 'ACTIVE',
): Promise<string> {
  const membership = await withTenant(prisma, { tenantId }, (tx) =>
    tx.membership.create({ data: { tenantId, userId, status } }),
  );
  return membership.id;
}
