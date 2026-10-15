'use client';
// Modal dialog. Implements: T-UI-01, ADR-022 section 8, F section 7.3, NFR-ACC-001.
// Contract: role=dialog with aria-modal, labelled by its title; focus moves in, Tab cycles inside,
// Escape or a press on the backdrop asks to close, focus returns to the opener, the page behind
// is inert and does not scroll. Closing is always a request (onOpenChange(false)): a screen with
// unsaved input can keep it open and ask first (F section 3 rule 2).
import { type ReactNode, type RefObject, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDismiss } from '../hooks/use-dismiss.js';
import { useFocusTrap } from '../hooks/use-focus-trap.js';
import { useScrollLock } from '../hooks/use-scroll-lock.js';
import { cx } from '../utils/cx.js';
import { IconButton } from './Button.js';

export type DialogSize = 'sm' | 'md' | 'lg';

const SIZES: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Accessible name of the close button, already translated. */
  closeLabel: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: DialogSize;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

/** Makes everything else on the page inert while the dialog is open. */
function useInertOutside(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    const changed: Element[] = [];
    for (const child of Array.from(document.body.children)) {
      const keepActive =
        child === root ||
        child.hasAttribute('data-hms-keep-active') ||
        child.hasAttribute('aria-live');
      if (!keepActive && !child.hasAttribute('inert')) {
        child.setAttribute('inert', '');
        changed.push(child);
      }
    }
    return () => {
      for (const element of changed) element.removeAttribute('inert');
    };
  }, [rootRef]);
}

function DialogSurface({
  onOpenChange,
  title,
  description,
  closeLabel,
  children,
  footer,
  size = 'md',
  initialFocusRef,
}: DialogProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Declared first: effect cleanups run in declaration order, so the page is no longer inert
  // when the focus trap hands focus back to the opener (browsers refuse focus() on inert nodes).
  useInertOutside(rootRef);
  useFocusTrap(panelRef, { active: true, initialFocusRef });
  useScrollLock(true);
  useDismiss({
    enabled: true,
    onDismiss: () => onOpenChange(false),
    insideRefs: [panelRef],
  });

  return createPortal(
    <div ref={rootRef} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div aria-hidden="true" className="motion-fade absolute inset-0 bg-heading/40" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cx(
          'motion-pop relative flex max-h-[85dvh] w-full flex-col rounded-panel border border-border bg-surface text-text shadow-overlay',
          SIZES[size],
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="font-heading text-xl font-semibold text-heading">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <IconButton icon="close" label={closeLabel} onClick={() => onOpenChange(false)} />
        </header>
        {children ? <div className="overflow-y-auto px-5 py-4">{children}</div> : null}
        {footer ? (
          <footer className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-3">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

export function Dialog(props: DialogProps) {
  if (!props.open || typeof document === 'undefined') return null;
  return <DialogSurface {...props} />;
}
