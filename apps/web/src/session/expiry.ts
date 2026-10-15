// When to warn that the session is about to end (F section 8, SP-11, C-032). The server decides
// the real times (idle timeout slides with activity; the absolute limit does not); this only
// turns them into what the screen shows. Pure, so the boundaries are easy to test.
// Implements: T-UI-02.
export const WARNING_SECONDS = 120;

export interface SessionTimes {
  idleExpiresAt: string;
  absoluteExpiresAt: string;
}

export type ExpiryMode = 'warning' | 'expired' | null;

export interface ExpiryState {
  mode: ExpiryMode;
  secondsLeft: number;
}

export function expiryState(
  times: SessionTimes,
  nowMs: number,
  warningSeconds = WARNING_SECONDS,
): ExpiryState {
  const endsAt = Math.min(Date.parse(times.idleExpiresAt), Date.parse(times.absoluteExpiresAt));
  const secondsLeft = Math.max(0, Math.ceil((endsAt - nowMs) / 1000));
  if (secondsLeft === 0) return { mode: 'expired', secondsLeft };
  if (secondsLeft <= warningSeconds) return { mode: 'warning', secondsLeft };
  return { mode: null, secondsLeft };
}

/** Whole minutes to show, never zero while the session is still valid. */
export function minutesLeft(secondsLeft: number): number {
  return Math.max(1, Math.ceil(secondsLeft / 60));
}
