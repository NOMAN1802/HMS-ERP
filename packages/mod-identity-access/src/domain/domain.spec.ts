import { describe, expect, it } from 'vitest';
import { DomainError } from '@hms/domain-kernel';
import { assertAccountCanLogin, normalizeUsername } from './account-policy.js';
import {
  isSessionExpired,
  newSessionTimes,
  shouldTouch,
  slideIdleExpiry,
} from './session-policy.js';

const timeouts = { idleMinutes: 60, absoluteHours: 12 };
const t0 = new Date('2026-10-14T08:00:00.000Z');
const minutes = (n: number) => n * 60_000;

describe('session policy (C-032)', () => {
  it('starts with 60 minutes idle and 12 hours absolute', () => {
    const times = newSessionTimes(t0, timeouts);
    expect(times.idleExpiresAt.toISOString()).toBe('2026-10-14T09:00:00.000Z');
    expect(times.absoluteExpiresAt.toISOString()).toBe('2026-10-14T20:00:00.000Z');
  });

  it('is expired after idle expiry, absolute expiry or revocation', () => {
    const session = { ...newSessionTimes(t0, timeouts), revokedAt: null };
    expect(isSessionExpired(session, new Date(t0.getTime() + minutes(59)))).toBe(false);
    expect(isSessionExpired(session, new Date(t0.getTime() + minutes(60)))).toBe(true);
    expect(isSessionExpired({ ...session, revokedAt: t0 }, t0)).toBe(true);
  });

  it('slides idle expiry forward on activity', () => {
    const session = newSessionTimes(t0, timeouts);
    const now = new Date(t0.getTime() + minutes(30));
    expect(slideIdleExpiry(session, now, timeouts).toISOString()).toBe('2026-10-14T09:30:00.000Z');
  });

  it('never slides past the absolute expiry', () => {
    const session = newSessionTimes(t0, timeouts);
    const now = new Date(t0.getTime() + minutes(11 * 60 + 30));
    expect(slideIdleExpiry(session, now, timeouts).toISOString()).toBe('2026-10-14T20:00:00.000Z');
  });

  it('touches the session at most once a minute', () => {
    expect(shouldTouch(t0, new Date(t0.getTime() + 30_000))).toBe(false);
    expect(shouldTouch(t0, new Date(t0.getTime() + 61_000))).toBe(true);
  });
});

describe('account policy', () => {
  it('normalizes usernames to trimmed lower case', () => {
    expect(normalizeUsername('  Admin.User ')).toBe('admin.user');
  });

  it('allows an active account', () => {
    expect(() => assertAccountCanLogin({ status: 'ACTIVE', lockedUntil: null }, t0)).not.toThrow();
  });

  it('rejects a temporarily locked account with its unlock time', () => {
    const lockedUntil = new Date(t0.getTime() + minutes(15));
    let caught: unknown;
    try {
      assertAccountCanLogin({ status: 'LOCKED_TEMPORARY', lockedUntil }, t0);
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(DomainError);
    expect((caught as DomainError).code).toBe('ACCOUNT_LOCKED');
    expect((caught as DomainError).details).toEqual({ lockedUntil: lockedUntil.toISOString() });
  });

  it('allows a temporary lock that has already ended', () => {
    const lockedUntil = new Date(t0.getTime() - 1);
    expect(() =>
      assertAccountCanLogin({ status: 'LOCKED_TEMPORARY', lockedUntil }, t0),
    ).not.toThrow();
  });

  it('rejects an admin lock', () => {
    expect(() => assertAccountCanLogin({ status: 'LOCKED_ADMIN', lockedUntil: null }, t0)).toThrow(
      /locked/i,
    );
  });

  it('treats a disabled account as invalid credentials', () => {
    let caught: unknown;
    try {
      assertAccountCanLogin({ status: 'DISABLED', lockedUntil: null }, t0);
    } catch (error) {
      caught = error;
    }
    expect((caught as DomainError).code).toBe('INVALID_CREDENTIALS');
  });
});
