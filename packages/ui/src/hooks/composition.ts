// Whether a key event belongs to an input method (Bangla phonetic input, IME) rather than to
// the page. Browsers report this in two ways: the `isComposing` flag, and keyCode 229 on the
// event that ends or cancels a composition. Every handler that reacts to Escape, Enter or arrows
// must use this one check, so the input method always handles the key first.
// Implements: T-UI-01, ADR-022 section 8 (IME-safe search).
export interface KeyEventLike {
  isComposing?: boolean;
  keyCode?: number;
}

export function isImeKeyEvent(event: KeyEventLike): boolean {
  return event.isComposing === true || event.keyCode === 229;
}
