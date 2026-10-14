// Account rules checked at login (UC-ACC-01 D1/D2). Setting locks after repeated failures is
// T-ACC-03; this only respects a lock that already exists.
import { DomainError } from '@hms/domain-kernel';

export type AccountStatus = 'ACTIVE' | 'LOCKED_TEMPORARY' | 'LOCKED_ADMIN' | 'DISABLED';

/** Usernames are stored lower-case and compared that way ("Admin " logs in as "admin"). */
export function normalizeUsername(raw: string): string {
  return raw.normalize('NFKC').trim().toLowerCase();
}

export function assertAccountCanLogin(
  account: { status: AccountStatus; lockedUntil: Date | null },
  now: Date,
): void {
  switch (account.status) {
    case 'ACTIVE':
      return;
    case 'LOCKED_TEMPORARY':
      if (account.lockedUntil !== null && account.lockedUntil.getTime() > now.getTime()) {
        throw new DomainError('ACCOUNT_LOCKED', 'Account is locked', {
          lockedUntil: account.lockedUntil.toISOString(),
        });
      }
      return;
    case 'LOCKED_ADMIN':
      throw new DomainError('ACCOUNT_LOCKED', 'Account is locked by an administrator');
    case 'DISABLED':
      // Same answer as a wrong password, so a disabled account cannot be told apart.
      throw new DomainError('INVALID_CREDENTIALS', 'Invalid username or password');
  }
}
