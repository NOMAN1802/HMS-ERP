// CSRF token bound to the session: HMAC-SHA256(secret, session token) (decision 2 of the
// T-ACC-01 plan, ADR-021). Mandatory because every *.bytespate.com site is "same-site".
import { createHmac, timingSafeEqual } from 'node:crypto';

export function csrfTokenFor(sessionToken: string, secret: string): string {
  return createHmac('sha256', secret).update(sessionToken).digest('base64url');
}

export function isValidCsrfToken(sessionToken: string, candidate: string, secret: string): boolean {
  const expected = Buffer.from(csrfTokenFor(sessionToken, secret));
  const actual = Buffer.from(candidate);
  // timingSafeEqual needs equal lengths; a length mismatch is simply invalid.
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
