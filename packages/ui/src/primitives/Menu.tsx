'use client';
// Action menu (menu button pattern). Implements: T-UI-01, ADR-022 section 8, F section 7.2.
// Contract: the trigger has aria-haspopup=menu and aria-expanded; Enter, Space or a click opens
// on the first item; ArrowDown opens on the first, ArrowUp on the last; arrows, Home and End move;
// typing jumps to a matching item; Escape closes and returns focus to the trigger; Tab closes;
// disabled items are skipped. Position comes from Floating UI (positioning only, ADR-022).
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom';
import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { useDismiss } from '../hooks/use-dismiss.js';
import { type MoveIntent, moveIndex } from '../hooks/navigation.js';
import { createTypeahead, findTypeaheadIndex } from '../hooks/typeahead.js';
import { cx } from '../utils/cx.js';

export interface MenuItem {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  tone?: 'default' | 'danger';
}

export interface MenuTriggerProps {
  ref: (element: HTMLElement | null) => void;
  id: string;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-controls': string | undefined;
  onClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

export interface MenuProps {
  items: readonly MenuItem[];
  /** Accessible name of the menu, already translated. */
  menuLabel: string;
  /** Renders the trigger (usually a Button) from the props this menu needs on it. */
  trigger: (props: MenuTriggerProps) => ReactNode;
}

const KEY_INTENTS: Record<string, MoveIntent> = {
  ArrowDown: 'next',
  ArrowUp: 'previous',
  Home: 'first',
  End: 'last',
};

export function Menu({ items, menuLabel, trigger }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const menuId = useId();
  const triggerId = useId();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const typeahead = useRef(createTypeahead()).current;

  const { refs, floatingStyles } = useFloating({
    open,
    placement: 'bottom-start',
    strategy: 'fixed',
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const isDisabled = (index: number): boolean => Boolean(items[index]?.disabled);

  function close(returnFocus: boolean): void {
    setOpen(false);
    setActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  }

  function openAt(intent: 'first' | 'last'): void {
    setOpen(true);
    setActiveIndex(moveIndex({ current: -1, count: items.length, intent, isDisabled }));
  }

  useEffect(() => {
    if (open && activeIndex >= 0) itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  useDismiss({
    enabled: open,
    onDismiss: () => close(true),
    insideRefs: [menuRef, triggerRef],
  });

  function onTriggerKeyDown(event: KeyboardEvent<HTMLElement>): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openAt('first');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openAt('last');
    }
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const intent = KEY_INTENTS[event.key];
    if (intent) {
      event.preventDefault();
      setActiveIndex((current) => moveIndex({ current, count: items.length, intent, isDisabled }));
      return;
    }
    if (event.key === 'Tab') {
      close(false);
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const found = findTypeaheadIndex(
        items.map((item) => item.label),
        typeahead.push(event.key),
        activeIndex,
        isDisabled,
      );
      if (found >= 0) setActiveIndex(found);
    }
  }

  function select(item: MenuItem): void {
    if (item.disabled) return;
    close(true);
    item.onSelect();
  }

  return (
    <>
      {trigger({
        ref: (element) => {
          triggerRef.current = element;
          refs.setReference(element);
        },
        id: triggerId,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
        onClick: () => (open ? close(false) : openAt('first')),
        onKeyDown: onTriggerKeyDown,
      })}
      {open ? (
        <div
          ref={(element) => {
            menuRef.current = element;
            refs.setFloating(element);
          }}
          id={menuId}
          role="menu"
          aria-label={menuLabel}
          aria-labelledby={undefined}
          style={floatingStyles}
          onKeyDown={onMenuKeyDown}
          className="motion-pop z-40 min-w-48 rounded-panel border border-border bg-surface p-1 shadow-overlay"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              type="button"
              role="menuitem"
              tabIndex={-1}
              aria-disabled={item.disabled || undefined}
              onClick={() => select(item)}
              onPointerMove={() => !item.disabled && setActiveIndex(index)}
              className={cx(
                'flex h-10 w-full items-center rounded-control px-3 text-start font-ui',
                item.tone === 'danger' ? 'text-status-problem-text' : 'text-text',
                item.disabled
                  ? 'cursor-not-allowed text-text-muted'
                  : 'hover:bg-surface-hover focus-visible:bg-surface-hover',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
