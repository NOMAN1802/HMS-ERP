'use client';
// Keeps keyboard focus inside a modal surface and gives it back on close (F section 7.3).
// Implements: T-UI-01, NFR-ACC-001, ADR-022 section 8.
import { type RefObject, useEffect } from 'react';
import { getTabbable } from './tabbable.js';

export interface FocusTrapOptions {
  active: boolean;
  /** Element to focus on open. Defaults to the first tabbable element, then the container. */
  initialFocusRef?: RefObject<HTMLElement | null>;
}

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  { active, initialFocusRef }: FocusTrapOptions,
): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const first = initialFocusRef?.current ?? getTabbable(container)[0] ?? container;
    first.focus();

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'Tab' || !container) return;
      const tabbable = getTabbable(container);
      if (tabbable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const firstItem = tabbable[0] as HTMLElement;
      const lastItem = tabbable[tabbable.length - 1] as HTMLElement;
      const current = document.activeElement;
      if (event.shiftKey && (current === firstItem || current === container)) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && current === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    // A click or script that moves focus outside the dialog is pulled back in.
    function onFocusIn(event: FocusEvent): void {
      if (!container || container.contains(event.target as Node)) return;
      (getTabbable(container)[0] ?? container).focus();
    }

    container.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      container.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [active, containerRef, initialFocusRef]);
}
