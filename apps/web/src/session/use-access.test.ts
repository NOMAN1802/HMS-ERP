import type { SessionResponse } from '@hms/contracts';
import { describe, expect, it } from 'vitest';
import { redirectTarget } from './use-access';

function session(activeMembershipId: string | null): SessionResponse {
  return {
    user: { id: '0199e0a0-0000-7000-8000-000000000001', displayName: 'A', preferredLang: 'en' },
    memberships: [],
    activeMembershipId,
    csrfToken: 't',
    idleExpiresAt: '2026-10-15T10:00:00.000Z',
    absoluteExpiresAt: '2026-10-15T20:00:00.000Z',
  };
}

const HOSPITAL = '0199e0a0-0000-7000-8000-0000000000aa';

describe('redirectTarget', () => {
  it('sends a signed-out visitor from protected screens to login', () => {
    expect(redirectTarget('hospital', null)).toBe('/login');
    expect(redirectTarget('account', null)).toBe('/login');
    expect(redirectTarget('anonymous', null)).toBeNull();
  });

  it('keeps a signed-in user off the login screen', () => {
    expect(redirectTarget('anonymous', session(HOSPITAL))).toBe('/');
    expect(redirectTarget('anonymous', session(null))).toBe('/choose-hospital');
  });

  it('requires a chosen hospital for the shell', () => {
    expect(redirectTarget('hospital', session(null))).toBe('/choose-hospital');
    expect(redirectTarget('hospital', session(HOSPITAL))).toBeNull();
    expect(redirectTarget('account', session(null))).toBeNull();
  });
});
