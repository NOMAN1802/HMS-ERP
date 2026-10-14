// Session timing rules (C-032: 60 minutes idle, 12 hours absolute; FR-ACC-003, FR-ACC-005).
// Pure functions: the caller passes "now", so tests control time.

export interface SessionTimeouts {
  idleMinutes: number;
  absoluteHours: number;
}

export interface SessionTimes {
  idleExpiresAt: Date;
  absoluteExpiresAt: Date;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
// Writing last_seen_at on every request would turn reads into writes; once a minute is enough
// for a 60-minute idle timeout.
const TOUCH_INTERVAL = MINUTE;

export function newSessionTimes(now: Date, timeouts: SessionTimeouts): SessionTimes {
  return {
    idleExpiresAt: new Date(now.getTime() + timeouts.idleMinutes * MINUTE),
    absoluteExpiresAt: new Date(now.getTime() + timeouts.absoluteHours * HOUR),
  };
}

export function isSessionExpired(
  session: SessionTimes & { revokedAt: Date | null },
  now: Date,
): boolean {
  return (
    session.revokedAt !== null ||
    now.getTime() >= session.idleExpiresAt.getTime() ||
    now.getTime() >= session.absoluteExpiresAt.getTime()
  );
}

/** New idle expiry after activity; never later than the absolute expiry. */
export function slideIdleExpiry(session: SessionTimes, now: Date, timeouts: SessionTimeouts): Date {
  const slid = now.getTime() + timeouts.idleMinutes * MINUTE;
  return new Date(Math.min(slid, session.absoluteExpiresAt.getTime()));
}

export function shouldTouch(lastSeenAt: Date, now: Date): boolean {
  return now.getTime() - lastSeenAt.getTime() > TOUCH_INTERVAL;
}
