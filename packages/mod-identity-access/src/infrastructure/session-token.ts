// Opaque session tokens (ADR-004). The cookie carries 32 random bytes; the database stores
// only their SHA-256, so a database leak does not expose usable sessions.
import { createHash, randomBytes } from 'node:crypto';

export function newSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashSessionToken(token: string): Uint8Array<ArrayBuffer> {
  return new Uint8Array(createHash('sha256').update(token).digest());
}
