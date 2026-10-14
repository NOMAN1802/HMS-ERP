// Login, hospital selection, session resolution and logout (UC-ACC-01, FR-ACC-001/002/005,
// ADR-004). Pre-hospital events go to auth_event; once a hospital is bound, the hospital's own
// audit trail also records the login (decision 1 of the T-ACC-01 plan).
import { Inject, Injectable } from '@nestjs/common';
import type { LoginRequest, MembershipSummary, SessionResponse } from '@hms/contracts';
import { withTenant, type PrismaClient } from '@hms/database';
import { DomainError, type Clock } from '@hms/domain-kernel';
import { appendAuditEvent, PRISMA } from '@hms/platform';
import { assertAccountCanLogin, normalizeUsername } from '../domain/account-policy.js';
import {
  isSessionExpired,
  newSessionTimes,
  shouldTouch,
  slideIdleExpiry,
} from '../domain/session-policy.js';
import { csrfTokenFor } from '../infrastructure/csrf-token.js';
import {
  appendAuthEvent,
  findSessionByTokenHash,
  findUserById,
  findUserByUsername,
  insertSession,
  listMembershipsForUser,
  recordFailedLogin,
  resetFailedLogins,
  revokeSession,
  touchSession,
  type MembershipRecord,
  type UserRecord,
} from '../infrastructure/identity.repository.js';
import { verifyAgainstDummy, verifyPassword } from '../infrastructure/password-hasher.js';
import { hashSessionToken, newSessionToken } from '../infrastructure/session-token.js';
import { AUTH_CONFIG, CLOCK, type AuthConfig } from './auth.config.js';

export interface AuthContext {
  userId: string;
  tenantId: string | null;
  membershipId: string | null;
  tokenHash: Uint8Array<ArrayBuffer>;
}

export interface RequestMeta {
  ipAddress?: string;
  correlationId?: string;
}

export interface IssuedSession {
  token: string;
  session: SessionResponse;
}

type Outcome = 'SUCCEEDED' | 'DENIED' | 'FAILED';

const INVALID = 'Invalid username or password';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  async login(input: LoginRequest, meta: RequestMeta): Promise<IssuedSession> {
    const username = normalizeUsername(input.username);
    const user = await findUserByUsername(this.prisma, username);
    if (!user) {
      await verifyAgainstDummy(input.password);
      await this.authEvent('auth.login.failed', 'FAILED', meta, {
        usernameAttempted: username,
        reason: 'UNKNOWN_USER',
      });
      throw new DomainError('INVALID_CREDENTIALS', INVALID);
    }

    try {
      assertAccountCanLogin(user, this.clock.now());
    } catch (error) {
      const reason = error instanceof DomainError ? error.code : 'ACCOUNT_CHECK_FAILED';
      await this.authEvent('auth.login.failed', 'DENIED', meta, { userId: user.id, reason });
      throw error;
    }

    if (!(await verifyPassword(user.passwordHash, input.password))) {
      await recordFailedLogin(this.prisma, user.id);
      await this.authEvent('auth.login.failed', 'FAILED', meta, {
        userId: user.id,
        reason: 'BAD_PASSWORD',
      });
      throw new DomainError('INVALID_CREDENTIALS', INVALID);
    }

    const memberships = await this.activeMemberships(user.id);
    if (memberships.length === 0) {
      await this.authEvent('auth.login.failed', 'DENIED', meta, {
        userId: user.id,
        reason: 'NO_ACTIVE_MEMBERSHIP',
      });
      throw new DomainError('MEMBERSHIP_NOT_ACTIVE', 'Access to this hospital is not active');
    }

    await resetFailedLogins(this.prisma, user.id);
    // FR-ACC-002: with exactly one hospital the choice is automatic (UC-ACC-01 A1).
    const bound = memberships.length === 1 ? (memberships[0] ?? null) : null;
    const issued = await this.startSession(user, memberships, bound, meta);
    await this.authEvent('auth.login.succeeded', 'SUCCEEDED', meta, { userId: user.id });
    return issued;
  }

  async selectMembership(
    ctx: AuthContext,
    membershipId: string,
    meta: RequestMeta,
  ): Promise<IssuedSession> {
    const user = await this.requireUser(ctx.userId);
    const memberships = await this.activeMemberships(user.id);
    const chosen = memberships.find((m) => m.id === membershipId);
    // Another user's or an inactive membership looks the same as a missing one (D section 8.3).
    if (!chosen) throw new DomainError('NOT_FOUND', 'Membership not found');

    // ADR-004: a new session ID on hospital switch; the old token stops working at once.
    await revokeSession(this.prisma, ctx.tokenHash, this.clock.now());
    return this.startSession(user, memberships, chosen, meta);
  }

  async resolveSession(token: string): Promise<AuthContext | null> {
    const tokenHash = hashSessionToken(token);
    const session = await findSessionByTokenHash(this.prisma, tokenHash);
    const now = this.clock.now();
    if (!session || isSessionExpired(session, now)) return null;

    if (shouldTouch(session.lastSeenAt, now)) {
      const idleExpiresAt = slideIdleExpiry(session, now, this.config.timeouts);
      await touchSession(this.prisma, tokenHash, now, idleExpiresAt);
    }
    return {
      userId: session.userId,
      tenantId: session.tenantId,
      membershipId: session.membershipId,
      tokenHash,
    };
  }

  async describeSession(ctx: AuthContext, token: string): Promise<SessionResponse> {
    const user = await this.requireUser(ctx.userId);
    const session = await findSessionByTokenHash(this.prisma, ctx.tokenHash);
    if (!session) throw new DomainError('UNAUTHENTICATED', 'Session ended');
    const memberships = await this.activeMemberships(user.id);
    return this.toResponse(user, memberships, ctx.membershipId, token, session);
  }

  async logout(ctx: AuthContext, meta: RequestMeta): Promise<void> {
    await revokeSession(this.prisma, ctx.tokenHash, this.clock.now());
    if (ctx.tenantId && ctx.membershipId) {
      await this.tenantAudit(ctx.tenantId, ctx.userId, ctx.membershipId, 'auth.logout', meta);
    }
    await this.authEvent('auth.logout', 'SUCCEEDED', meta, { userId: ctx.userId });
  }

  private async startSession(
    user: UserRecord,
    memberships: MembershipRecord[],
    bound: MembershipRecord | null,
    meta: RequestMeta,
  ): Promise<IssuedSession> {
    const token = newSessionToken();
    const now = this.clock.now();
    const times = newSessionTimes(now, this.config.timeouts);
    await insertSession(this.prisma, {
      tokenHash: hashSessionToken(token),
      userId: user.id,
      tenantId: bound?.tenantId ?? null,
      membershipId: bound?.id ?? null,
      createdAt: now,
      ...times,
    });
    if (bound) {
      await this.tenantAudit(bound.tenantId, user.id, bound.id, 'auth.login.succeeded', meta);
    }
    const session = this.toResponse(user, memberships, bound?.id ?? null, token, times);
    return { token, session };
  }

  private toResponse(
    user: UserRecord,
    memberships: MembershipRecord[],
    activeMembershipId: string | null,
    token: string,
    times: { idleExpiresAt: Date; absoluteExpiresAt: Date },
  ): SessionResponse {
    return {
      user: {
        id: user.id,
        displayName: user.displayName,
        preferredLang: user.preferredLang === 'bn_BD' ? 'bn-BD' : 'en',
      },
      memberships: memberships.map(toSummary),
      activeMembershipId,
      csrfToken: csrfTokenFor(token, this.config.csrfSecret),
      idleExpiresAt: times.idleExpiresAt.toISOString(),
      absoluteExpiresAt: times.absoluteExpiresAt.toISOString(),
    };
  }

  private async activeMemberships(userId: string): Promise<MembershipRecord[]> {
    const all = await listMembershipsForUser(this.prisma, userId);
    return all.filter((m) => m.status === 'ACTIVE');
  }

  private async requireUser(userId: string): Promise<UserRecord> {
    const user = await findUserById(this.prisma, userId);
    if (!user) throw new DomainError('UNAUTHENTICATED', 'Session ended');
    return user;
  }

  private tenantAudit(
    tenantId: string,
    userId: string,
    membershipId: string,
    action: string,
    meta: RequestMeta,
  ): Promise<void> {
    return withTenant(this.prisma, { tenantId, userId }, (tx) =>
      appendAuditEvent(tx, {
        tenantId,
        action,
        outcome: 'SUCCEEDED',
        actorUserId: userId,
        membershipId,
        ...(meta.correlationId ? { correlationId: meta.correlationId } : {}),
      }),
    );
  }

  private authEvent(
    action: string,
    outcome: Outcome,
    meta: RequestMeta,
    extra: { userId?: string; usernameAttempted?: string; reason?: string },
  ): Promise<void> {
    return appendAuthEvent(this.prisma, { action, outcome, ...meta, ...extra });
  }
}

function toSummary(m: MembershipRecord): MembershipSummary {
  return {
    id: m.id,
    tenantId: m.tenantId,
    tenantNameEn: m.tenantNameEn,
    tenantNameBn: m.tenantNameBn,
  };
}
