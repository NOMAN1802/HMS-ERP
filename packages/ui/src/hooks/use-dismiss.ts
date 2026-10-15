'use client';
// Closes an overlay on Escape or on a press outside it, top-most overlay only.
// Implements: T-UI-01, NFR-ACC-001.
import { type RefObject, useEffect, useRef } from 'react';
import { registerOverlay } from './overlay-stack.js';

export interface DismissOptions {
  enabled: boolean;
  onDismiss: () => void;
  /** Presses inside any of these elements do not dismiss (the surface and its trigger). */
  insideRefs: ReadonlyArray<RefObject<HTMLElement | null>>;
  closeOnEscape?: boolean;
  closeOnOutsidePress?: boolean;
}

export function useDismiss({
  enabled,
  onDismiss,
  insideRefs,
  closeOnEscape = true,
  closeOnOutsidePress = true,
}: DismissOptions): void {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const insideRefsRef = useRef(insideRefs);
  insideRefsRef.current = insideRefs;

  useEffect(() => {
    if (!enabled) return;
    const overlay = registerOverlay();

    function onKeyDown(event: KeyboardEvent): void {
      if (closeOnEscape && event.key === 'Escape' && overlay.isTop()) {
        event.stopPropagation();
        onDismissRef.current();
      }
    }

    function onPointerDown(event: PointerEvent): void {
      if (!closeOnOutsidePress || !overlay.isTop()) return;
      const target = event.target as Node;
      const inside = insideRefsRef.current.some((ref) => ref.current?.contains(target));
      if (!inside) onDismissRef.current();
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      overlay.unregister();
    };
  }, [enabled, closeOnEscape, closeOnOutsidePress]);
}
