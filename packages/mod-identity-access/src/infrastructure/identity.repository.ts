// Prisma access for login and sessions. user_account and user_session are not tenant-scoped
// (looked up before a hospital is known); memberships are read with the user context (RLS).
import { withUserContext, type PrismaClient } from '@hms/database';

export interface UserRecord {
  id: string;
  username: string;
  displayName: string;
  passwordHash: string;
  status: 'ACTIVE' | 'LOCKED_TEMPORARY' | 'LOCKED_ADMIN' | 'DISABLED';
  lockedUntil: Date | null;
  failedAttempts: number;
  preferredLang: 'bn_BD' | 'en';
}

export interface MembershipRecord {
  id: string;
  tenantId: string;
  status: 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  tenantNameEn: string | null;
  tenantNameBn: string | null;
}

export interface SessionRecord {
  tokenHash: Uint8Array<ArrayBuffer>;
  userId: string;
  tenantId: string | null;
  membershipId: string | null;
  lastSeenAt: Date;
  idleExpiresAt: Date;
  absoluteExpiresAt: Date;
  revokedAt: Date | null;
}

export interface NewSession {
  tokenHash: Uint8Array<ArrayBuffer>;
  userId: string;
  tenantId: string | null;
  membershipId: string | null;
  createdAt: Date;
  idleExpiresAt: Date;
  absoluteExpiresAt: Date;
}

export interface AuthEventInput {
  action: string;
  outcome: 'SUCCEEDED' | 'DENIED' | 'FAILED';
  userId?: string;
  usernameAttempted?: string;
  reason?: string;
  ipAddress?: string;
  correlationId?: string;
}

export function findUserByUsername(
  prisma: PrismaClient,
  username: string,
): Promise<UserRecord | null> {
  return prisma.userAccount.findUnique({ where: { username } });
}

export function findUserById(prisma: PrismaClient, id: string): Promise<UserRecord | null> {
  return prisma.userAccount.findUnique({ where: { id } });
}

export async function recordFailedLogin(prisma: PrismaClient, userId: string): Promise<void> {
  await prisma.userAccount.update({
    where: { id: userId },
    data: { failedAttempts: { increment: 1 } },
  });
}

export async function resetFailedLogins(prisma: PrismaClient, userId: string): Promise<void> {
  await prisma.userAccount.update({ where: { id: userId }, data: { failedAttempts: 0 } });
}

export async function listMembershipsForUser(
  prisma: PrismaClient,
  userId: string,
): Promise<MembershipRecord[]> {
  const rows = await withUserContext(prisma, userId, (tx) =>
    tx.membership.findMany({
      where: { userId },
      include: { tenant: { select: { nameEn: true, nameBn: true } } },
      orderBy: { createdAt: 'asc' },
    }),
  );
  return rows.map((row) => ({
    id: row.id,
    tenantId: row.tenantId,
    status: row.status,
    tenantNameEn: row.tenant.nameEn,
    tenantNameBn: row.tenant.nameBn,
  }));
}

export async function insertSession(prisma: PrismaClient, session: NewSession): Promise<void> {
  await prisma.userSession.create({ data: { ...session, lastSeenAt: session.createdAt } });
}

export function findSessionByTokenHash(
  prisma: PrismaClient,
  tokenHash: Uint8Array<ArrayBuffer>,
): Promise<SessionRecord | null> {
  return prisma.userSession.findUnique({ where: { tokenHash } });
}

export async function touchSession(
  prisma: PrismaClient,
  tokenHash: Uint8Array<ArrayBuffer>,
  lastSeenAt: Date,
  idleExpiresAt: Date,
): Promise<void> {
  await prisma.userSession.update({ where: { tokenHash }, data: { lastSeenAt, idleExpiresAt } });
}

export async function revokeSession(
  prisma: PrismaClient,
  tokenHash: Uint8Array<ArrayBuffer>,
  at: Date,
): Promise<void> {
  await prisma.userSession.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: at },
  });
}

export async function appendAuthEvent(prisma: PrismaClient, event: AuthEventInput): Promise<void> {
  await prisma.authEvent.create({ data: event });
}
