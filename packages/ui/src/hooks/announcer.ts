// Screen-reader announcements through one persistent live region per politeness level.
// The region must exist before the text changes, so it is created on first use and reused.
// Implements: T-UI-01, F section 7.3 (status changes announced), NFR-ACC-001.
export type Politeness = 'polite' | 'assertive';

const regions = new Map<Politeness, HTMLElement>();
const timers = new Map<Politeness, number>();

function regionFor(politeness: Politeness): HTMLElement {
  const existing = regions.get(politeness);
  if (existing?.isConnected) return existing;
  const region = document.createElement('div');
  region.setAttribute('aria-live', politeness);
  region.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  document.body.append(region);
  regions.set(politeness, region);
  return region;
}

/** Makes sure the live regions exist before anything needs to be announced. */
export function ensureAnnouncer(): void {
  regionFor('polite');
  regionFor('assertive');
}

export function announce(message: string, politeness: Politeness = 'polite'): void {
  const region = regionFor(politeness);
  window.clearTimeout(timers.get(politeness));
  // Clearing first makes a repeated message announce again.
  region.textContent = '';
  timers.set(
    politeness,
    window.setTimeout(() => {
      region.textContent = message;
    }, 50),
  );
}
