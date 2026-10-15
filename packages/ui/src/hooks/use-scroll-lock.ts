'use client';
// Stops the page behind a modal from scrolling. Reference counted so stacked overlays
// restore the page only when the last one closes. Implements: T-UI-01, F section 7.3.
import { useEffect } from 'react';

let lockCount = 0;
let restore: (() => void) | undefined;

export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    if (lockCount === 0) {
      const root = document.documentElement;
      const previousOverflow = root.style.overflow;
      const previousPadding = root.style.paddingRight;
      // Compensate for the scrollbar that disappears, so content does not jump sideways.
      const scrollbarWidth = window.innerWidth - root.clientWidth;
      root.style.overflow = 'hidden';
      if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;
      restore = () => {
        root.style.overflow = previousOverflow;
        root.style.paddingRight = previousPadding;
      };
    }
    lockCount += 1;
    return () => {
      lockCount -= 1;
      if (lockCount === 0) restore?.();
    };
  }, [active]);
}
