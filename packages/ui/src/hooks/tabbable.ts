// Finds the elements a keyboard user can reach with Tab inside a container.
// Implements: T-UI-01, ADR-022 section 8 (focus handling is ours, not the browser's).
const TABBABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

function isReachable(element: HTMLElement): boolean {
  if (element.closest('[hidden], [inert], [aria-hidden="true"]')) return false;
  return element.getAttribute('tabindex') !== '-1' && element.style.display !== 'none';
}

export function getTabbable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter(isReachable);
}
