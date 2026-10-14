import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createPrismaClient, withTenant, withUserContext, type PrismaClient } from './index.js';

// RLS and grant rules for the identity tables (T-ACC-01, ADR-003, ADR-009).
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required for database integration tests');

describe('identity tables', () => {
  let prisma: PrismaClient;
  let tenantId: string;
  let ownerId: string;
  let strangerId: string;

  beforeAll(async () => {
    prisma = createPrismaClient(databaseUrl);
    tenantId = randomUUID();
    const suffix = tenantId.slice(0, 8);
    ownerId = (
      await prisma.userAccount.create({
        data: { username: `owner-${suffix}`, displayName: 'Owner', passwordHash: 'x' },
      })
    ).id;
    strangerId = (
      await prisma.userAccount.create({
        data: { username: `stranger-${suffix}`, displayName: 'Stranger', passwordHash: 'x' },
      })
    ).id;
    await withTenant(prisma, { tenantId }, async (tx) => {
      await tx.tenant.create({
        data: { id: tenantId, code: `test-${suffix}`, nameEn: 'Test Hospital' },
      });
      await tx.membership.create({ data: { tenantId, userId: ownerId } });
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('lets a user see their own memberships and hospital name before choosing a hospital', async () => {
    const rows = await withUserContext(prisma, ownerId, (tx) =>
      tx.membership.findMany({ include: { tenant: true } }),
    );
    expect(rows.map((row) => row.tenant.nameEn)).toEqual(['Test Hospital']);
  });

  it("hides other users' memberships and hospitals", async () => {
    const rows = await withUserContext(prisma, strangerId, (tx) => tx.membership.findMany());
    expect(rows).toEqual([]);
    const tenants = await withUserContext(prisma, strangerId, (tx) => tx.tenant.findMany());
    expect(tenants).toEqual([]);
  });

  it('rejects an upper-case username (usernames are stored lower-case)', async () => {
    await expect(
      prisma.userAccount.create({
        data: {
          username: `Upper-${randomUUID().slice(0, 8)}`,
          displayName: 'U',
          passwordHash: 'x',
        },
      }),
    ).rejects.toThrow(/user_account_username_lowercase/);
  });

  it('does not allow the app to update audit events (ADR-003 evidence 5)', async () => {
    const event = await withTenant(prisma, { tenantId }, (tx) =>
      tx.auditEvent.create({ data: { tenantId, action: 'test.event', outcome: 'SUCCEEDED' } }),
    );
    await expect(
      withTenant(prisma, { tenantId }, (tx) =>
        tx.auditEvent.update({ where: { id: event.id }, data: { reason: 'changed' } }),
      ),
    ).rejects.toThrow(/permission denied/);
  });

  it('does not allow the app to update auth events', async () => {
    const event = await prisma.authEvent.create({
      data: { action: 'auth.login.failed', outcome: 'FAILED', usernameAttempted: 'nobody' },
    });
    await expect(
      prisma.authEvent.update({ where: { id: event.id }, data: { reason: 'changed' } }),
    ).rejects.toThrow(/permission denied/);
  });
});
