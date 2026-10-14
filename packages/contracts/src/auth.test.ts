import { describe, expect, it } from 'vitest';
import { loginRequestSchema, sessionResponseSchema } from './auth.js';

describe('loginRequestSchema', () => {
  it('trims the username', () => {
    expect(loginRequestSchema.parse({ username: '  admin ', password: 'x' }).username).toBe(
      'admin',
    );
  });

  it('rejects an empty username', () => {
    expect(loginRequestSchema.safeParse({ username: '   ', password: 'x' }).success).toBe(false);
  });

  it('rejects a password over 1024 characters', () => {
    const password = 'a'.repeat(1025);
    expect(loginRequestSchema.safeParse({ username: 'admin', password }).success).toBe(false);
  });
});

describe('sessionResponseSchema', () => {
  it('accepts a session without an active membership', () => {
    const parsed = sessionResponseSchema.parse({
      user: { id: '0199e0a0-0000-7000-8000-000000000001', displayName: 'A', preferredLang: 'en' },
      memberships: [],
      activeMembershipId: null,
      csrfToken: 'token',
      idleExpiresAt: '2026-10-14T10:00:00.000Z',
      absoluteExpiresAt: '2026-10-14T21:00:00.000Z',
    });
    expect(parsed.activeMembershipId).toBeNull();
  });
});
