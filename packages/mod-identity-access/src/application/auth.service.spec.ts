import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createPrismaClient, withTenant, type PrismaClient } from '@hms/database';
import { DomainError, fixedClock, type FixedClock } from '@hms/domain-kernel';
import { seedMembership, seedTenant, seedUser } from '@hms/testkit';
import { hashPassword } from '../infrastructure/password-hasher.js';
import { AuthService } from './auth.service.js';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required');

const config = { timeouts: { idleMinutes: 60, absoluteHours: 12 }, csrfSecret: 'x'.repeat(32) };
const meta = { ipAddress: '127.0.0.1' };
const PASSWORD = 'correct horse battery';

async function expectCode(promise: Promise<unknown>, code: string): Promise<void> {
  await expect(promise).rejects.toSatisfy(
    (error) => error instanceof DomainError && error.code === code,
  );
}

describe('AuthService', () => {
  let prisma: PrismaClient;
  let clock: FixedClock;
  let service: AuthService;
  let passwordHash: string;

  beforeAll(async () => {
    prisma = createPrismaClient(databaseUrl);
    clock = fixedClock(new Date('2026-10-14T08:00:00.000Z'));
    service = new AuthService(prisma, config, clock);
    passwordHash = await hashPassword(PASSWORD);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  async function userWithHospitals(count: number) {
    const user = await seedUser(prisma, { passwordHash });
    const memberships: string[] = [];
    for (let i = 0; i < count; i += 1) {
      memberships.push(await seedMembership(prisma, await seedTenant(prisma), user.id));
    }
    return { ...user, memberships };
  }

  function login(username: string, password = PASSWORD) {
    return service.login({ username, password }, meta);
  }

  it('binds the only hospital at login and writes audit events', async () => {
    const user = await userWithHospitals(1);
    const { token, session } = await login(user.username);
    expect(session.activeMembershipId).toBe(user.memberships[0]);
    expect(session.csrfToken.length).toBeGreaterThan(20);
    const ctx = await service.resolveSession(token);
    expect(ctx?.membershipId).toBe(user.memberships[0]);
    const events = await prisma.authEvent.findMany({ where: { userId: user.id } });
    expect(events.map((e) => `${e.action}:${e.outcome}`)).toContain(
      'auth.login.succeeded:SUCCEEDED',
    );
  });

  it('logs in regardless of username case and spaces', async () => {
    const user = await userWithHospitals(1);
    const { session } = await login(`  ${user.username.toUpperCase()} `);
    expect(session.user.id).toBe(user.id);
  });

  it('leaves the hospital unselected when the user has several', async () => {
    const user = await userWithHospitals(2);
    const { session } = await login(user.username);
    expect(session.activeMembershipId).toBeNull();
    expect(session.memberships).toHaveLength(2);
  });

  it('rejects a wrong password generically and counts the failure', async () => {
    const user = await userWithHospitals(1);
    await expectCode(login(user.username, 'wrong'), 'INVALID_CREDENTIALS');
    const stored = await prisma.userAccount.findUnique({ where: { id: user.id } });
    expect(stored?.failedAttempts).toBe(1);
  });

  it('gives the same answer for an unknown username', async () => {
    await expectCode(login('no-such-user', 'x'), 'INVALID_CREDENTIALS');
  });

  it('respects an existing temporary lock', async () => {
    const user = await seedUser(prisma, {
      passwordHash,
      status: 'LOCKED_TEMPORARY',
      lockedUntil: new Date(clock.now().getTime() + 15 * 60_000),
    });
    await expectCode(login(user.username), 'ACCOUNT_LOCKED');
  });

  it('refuses a user with no active hospital', async () => {
    const user = await seedUser(prisma, { passwordHash });
    await seedMembership(prisma, await seedTenant(prisma), user.id, 'SUSPENDED');
    await expectCode(login(user.username), 'MEMBERSHIP_NOT_ACTIVE');
  });

  it('old token is rejected after selectMembership (rotation)', async () => {
    const user = await userWithHospitals(2);
    const first = await login(user.username);
    const ctx = await service.resolveSession(first.token);
    const second = await service.selectMembership(ctx!, user.memberships[1]!, meta);
    expect(second.session.activeMembershipId).toBe(user.memberships[1]);
    expect(await service.resolveSession(first.token)).toBeNull();
    expect((await service.resolveSession(second.token))?.membershipId).toBe(user.memberships[1]);
  });

  it("selecting another user's membership is NOT_FOUND", async () => {
    const user = await userWithHospitals(2);
    const other = await userWithHospitals(1);
    const { token } = await login(user.username);
    const ctx = await service.resolveSession(token);
    await expectCode(service.selectMembership(ctx!, other.memberships[0]!, meta), 'NOT_FOUND');
  });

  it('expires after 60 idle minutes and allows a fresh login (FR-ACC-005)', async () => {
    const user = await userWithHospitals(1);
    const { token } = await login(user.username);
    clock.advanceBy(61 * 60_000);
    expect(await service.resolveSession(token)).toBeNull();
    const again = await login(user.username);
    expect(await service.resolveSession(again.token)).not.toBeNull();
  });

  it('absolute expiry ends an active session', async () => {
    const user = await userWithHospitals(1);
    const { token } = await login(user.username);
    for (let hour = 0; hour < 12; hour += 1) {
      clock.advanceBy(50 * 60_000);
      await service.resolveSession(token);
      clock.advanceBy(10 * 60_000);
    }
    expect(await service.resolveSession(token)).toBeNull();
  });

  it('ends an active session when the account is disabled (FR-ACC-010)', async () => {
    const user = await userWithHospitals(1);
    const { token } = await login(user.username);
    await prisma.userAccount.update({ where: { id: user.id }, data: { status: 'DISABLED' } });
    expect(await service.resolveSession(token)).toBeNull();
  });

  it('ends an active session when the membership is suspended (FR-ACC-010)', async () => {
    const user = await userWithHospitals(1);
    const { token } = await login(user.username);
    const tenantId = (await service.resolveSession(token))?.tenantId ?? '';
    await withTenant(prisma, { tenantId }, (tx) =>
      tx.membership.update({
        where: { id: user.memberships[0] ?? '' },
        data: { status: 'SUSPENDED' },
      }),
    );
    expect(await service.resolveSession(token)).toBeNull();
  });

  it('keeps the original absolute expiry when switching hospital', async () => {
    const user = await userWithHospitals(2);
    const first = await login(user.username);
    clock.advanceBy(30 * 60_000);
    const ctx = await service.resolveSession(first.token);
    const second = await service.selectMembership(ctx!, user.memberships[1]!, meta);
    expect(second.session.absoluteExpiresAt).toBe(first.session.absoluteExpiresAt);
  });

  it('does not reveal a lock or disabled state without the right password', async () => {
    const locked = await seedUser(prisma, { passwordHash, status: 'LOCKED_ADMIN' });
    await expectCode(login(locked.username, 'wrong'), 'INVALID_CREDENTIALS');
    const disabled = await seedUser(prisma, { passwordHash, status: 'DISABLED' });
    await expectCode(login(disabled.username), 'INVALID_CREDENTIALS');
  });

  it('does not store a password-like username in the auth event', async () => {
    // A unique marker keeps this test independent of rows from earlier runs (the table is
    // append-only, so old rows cannot be cleaned up).
    const marker = randomUUID();
    await expectCode(login(`My Secret ${marker} With Spaces!`, 'x'), 'INVALID_CREDENTIALS');
    const stored = await prisma.authEvent.findMany({
      where: { usernameAttempted: { contains: marker } },
    });
    expect(stored).toEqual([]);
  });

  it('logout revokes the session', async () => {
    const user = await userWithHospitals(1);
    const { token } = await login(user.username);
    const ctx = await service.resolveSession(token);
    await service.logout(ctx!, meta);
    expect(await service.resolveSession(token)).toBeNull();
  });
});
