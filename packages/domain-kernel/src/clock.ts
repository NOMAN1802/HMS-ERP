// Time source injected into domain logic, so tests control "now" (session expiry, C-032).
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = { now: () => new Date() };

export interface FixedClock extends Clock {
  advanceBy(milliseconds: number): void;
}

export function fixedClock(start: Date): FixedClock {
  let current = start.getTime();
  return {
    now: () => new Date(current),
    advanceBy: (milliseconds) => {
      current += milliseconds;
    },
  };
}
