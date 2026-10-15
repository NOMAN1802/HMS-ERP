'use client';
// Search combobox (ARIA 1.2 combobox with listbox popup). Implements: T-UI-01, ADR-022 sections 8,
// F section 4.1 (reception search), F section 9 (search rules), NFR-ACC-001.
// Contract:
//  - role=combobox with aria-expanded, aria-controls, aria-autocomplete=list, aria-activedescendant
//  - ArrowDown/ArrowUp open and move; Enter selects the active option; Escape closes, then clears
//  - Enter with no active option submits the typed text, so a barcode scanner that ends with Enter
//    works (F section 7.2)
//  - while an input method is composing (Bangla phonetic input), nothing is queried and Enter and
//    arrows are left to the input method
//  - the minimum query length counts grapheme clusters
//  - the number of results is announced to screen readers
// The component does not fetch: the owner passes `options` for the current query.
import { autoUpdate, flip, offset, shift, size, useFloating } from '@floating-ui/react-dom';
import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type Ref,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { announce, ensureAnnouncer } from '../hooks/announcer.js';
import { isImeKeyEvent } from '../hooks/composition.js';
import { moveIndex } from '../hooks/navigation.js';
import { useDismiss } from '../hooks/use-dismiss.js';
import { cx } from '../utils/cx.js';
import { countGraphemes } from '../utils/graphemes.js';
import { type ComboboxOption, useComboboxSelection } from './combobox-selection.js';

export type { ComboboxOption } from './combobox-selection.js';

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'role'
  | 'type'
  | 'aria-expanded'
  | 'aria-controls'
  | 'aria-activedescendant'
  | 'aria-autocomplete'
>;

export interface ComboboxProps extends NativeInputProps {
  options: readonly ComboboxOption[];
  /**
   * The selected option (controlled). The whole option is passed, not just its id, because the
   * field must be able to show its label even when it is not in the current results.
   */
  value?: ComboboxOption | null;
  defaultValue?: ComboboxOption | null;
  onValueChange?: (option: ComboboxOption | null) => void;
  /** Called with the typed text once it is final (after composition ends). */
  onQueryChange?: (query: string) => void;
  /** Called on Enter when no option is active (scanner input, free search). */
  onSubmitQuery?: (query: string) => void;
  /** Text shown at first when nothing is selected. A selection's label wins over it. */
  initialQuery?: string;
  /** Minimum number of characters (grapheme clusters) before the list opens. */
  minQueryLength?: number;
  loading?: boolean;
  invalid?: boolean;
  /** Texts, already translated. */
  listLabel: string;
  emptyLabel: string;
  loadingLabel: string;
  announceResults: (count: number) => string;
  ref?: Ref<HTMLInputElement>;
}

type KeyAction =
  | 'open-first'
  | 'open-last'
  | 'next'
  | 'previous'
  | 'select'
  | 'submit'
  | 'clear'
  | 'close'
  | 'none';

interface KeyContext {
  key: string;
  /** The popup is open (it may be showing only a loading or empty message). */
  open: boolean;
  /** The option list is on screen: open, has options and is not loading. */
  listVisible: boolean;
  hasActiveOption: boolean;
  hasText: boolean;
  canSubmit: boolean;
}

function arrowAction(direction: 'down' | 'up', { open, listVisible }: KeyContext): KeyAction {
  if (!open) return direction === 'down' ? 'open-first' : 'open-last';
  // Results hidden behind the loading state cannot be moved through.
  if (!listVisible) return 'none';
  return direction === 'down' ? 'next' : 'previous';
}

function enterAction({ listVisible, hasActiveOption, hasText, canSubmit }: KeyContext): KeyAction {
  // Never pick an option the user cannot see.
  if (listVisible && hasActiveOption) return 'select';
  return hasText && canSubmit ? 'submit' : 'none';
}

/** Which action a key press means in the current state. Pure, so the contract is easy to read. */
function keyAction(context: KeyContext): KeyAction {
  switch (context.key) {
    case 'ArrowDown':
      return arrowAction('down', context);
    case 'ArrowUp':
      return arrowAction('up', context);
    case 'Enter':
      return enterAction(context);
    case 'Escape':
      // While open, the dismiss handler closes the list; only a closed list clears the field.
      return !context.open && context.hasText ? 'clear' : 'none';
    case 'Tab':
      return 'close';
    default:
      return 'none';
  }
}

export function Combobox({
  options,
  value,
  defaultValue = null,
  onValueChange,
  onQueryChange,
  onSubmitQuery,
  initialQuery,
  minQueryLength = 1,
  loading = false,
  invalid = false,
  listLabel,
  emptyLabel,
  loadingLabel,
  announceResults,
  className,
  ref,
  onBlur,
  ...inputProps
}: ComboboxProps) {
  const listboxId = useId();
  const { selected, selectedId, text, setText, changeSelection } = useComboboxSelection({
    value,
    defaultValue,
    onValueChange,
    initialQuery,
  });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const composing = useRef(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

  const { refs, floatingStyles } = useFloating({
    open,
    placement: 'bottom-start',
    strategy: 'fixed',
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          elements.floating.style.minWidth = `${rects.reference.width}px`;
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const isDisabled = (index: number): boolean => Boolean(options[index]?.disabled);

  useEffect(() => {
    ensureAnnouncer();
  }, []);

  useEffect(() => {
    if (open && !loading) announce(announceResults(options.length));
    // The announcement depends on the count only, not on the formatter identity.
  }, [open, loading, options.length]);

  useEffect(() => {
    if (activeIndex >= 0) optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // A different result set (or a new search starting) never inherits the old active position.
  const optionsKey = options.map((option) => option.id).join('|');
  useEffect(() => {
    setActiveIndex(-1);
  }, [optionsKey, loading]);

  useDismiss({
    enabled: open,
    onDismiss: () => {
      setOpen(false);
      setActiveIndex(-1);
    },
    insideRefs: [wrapperRef, popupRef],
  });

  function handleQuery(query: string): void {
    onQueryChange?.(query);
    setActiveIndex(-1);
    setOpen(countGraphemes(query) >= minQueryLength);
  }

  function onChange(event: ChangeEvent<HTMLInputElement>): void {
    const next = event.target.value;
    setText(next);
    // Typing over a selection ends it: the field and the selection must never disagree.
    if (selected !== null) changeSelection(null);
    if (!composing.current) handleQuery(next);
  }

  function selectOption(option: ComboboxOption): void {
    if (option.disabled) return;
    changeSelection(option);
    setText(option.label);
    setOpen(false);
    setActiveIndex(-1);
  }

  const showList = open && options.length > 0 && !loading;
  const activeOption = showList ? options[activeIndex] : undefined;

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    // The input method owns these keys while composing.
    if (composing.current || isImeKeyEvent(event.nativeEvent)) return;
    const active = activeOption;
    const action = keyAction({
      key: event.key,
      open,
      listVisible: showList,
      hasActiveOption: Boolean(active),
      hasText: text !== '',
      canSubmit: Boolean(onSubmitQuery),
    });

    switch (action) {
      case 'open-first':
      case 'open-last':
        event.preventDefault();
        if (countGraphemes(text) >= minQueryLength || options.length > 0) setOpen(true);
        setActiveIndex(
          moveIndex({
            current: -1,
            count: options.length,
            intent: action === 'open-first' ? 'first' : 'last',
            isDisabled,
          }),
        );
        break;
      case 'next':
      case 'previous':
        event.preventDefault();
        setActiveIndex((current) =>
          moveIndex({ current, count: options.length, intent: action, isDisabled }),
        );
        break;
      case 'select':
        event.preventDefault();
        if (active) selectOption(active);
        break;
      case 'submit':
        event.preventDefault();
        onSubmitQuery?.(text);
        break;
      case 'clear':
        // Second Escape clears the field. Stop it here so a dialog around us stays open.
        event.stopPropagation();
        setText('');
        if (selected !== null) changeSelection(null);
        onQueryChange?.('');
        break;
      case 'close':
        setOpen(false);
        break;
      default:
        break;
    }
  }

  return (
    <div
      ref={(element) => {
        wrapperRef.current = element;
        refs.setReference(element);
      }}
      className="relative"
    >
      <input
        ref={ref}
        {...inputProps}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={open}
        aria-controls={showList ? listboxId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={activeOption ? `${listboxId}-${activeIndex}` : undefined}
        aria-invalid={invalid || undefined}
        value={text}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={(event) => {
          composing.current = false;
          handleQuery(event.currentTarget.value);
        }}
        onBlur={onBlur}
        className={cx(
          'h-10 w-full rounded-control border bg-surface px-3 font-ui text-text placeholder:text-text-muted disabled:cursor-not-allowed disabled:bg-bg',
          invalid ? 'border-danger' : 'border-border-strong',
          className,
        )}
      />
      {open ? (
        <div
          ref={(element) => {
            popupRef.current = element;
            refs.setFloating(element);
          }}
          style={floatingStyles}
          className="motion-pop z-40 max-h-72 overflow-y-auto rounded-panel border border-border bg-surface py-1 shadow-overlay"
        >
          {loading ? (
            <p role="status" className="px-3 py-2 text-text-muted">
              {loadingLabel}
            </p>
          ) : null}
          {!loading && options.length === 0 ? (
            <p role="status" className="px-3 py-2 text-text-muted">
              {emptyLabel}
            </p>
          ) : null}
          {showList ? (
            <ul id={listboxId} role="listbox" aria-label={listLabel}>
              {options.map((option, index) => (
                <li
                  key={option.id}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  id={`${listboxId}-${index}`}
                  role="option"
                  aria-selected={option.id === selectedId}
                  aria-disabled={option.disabled || undefined}
                  // Keeps focus in the input while the pointer picks an option.
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(option)}
                  className={cx(
                    'flex min-h-10 cursor-pointer flex-col justify-center px-3 py-1.5 font-ui',
                    index === activeIndex && 'bg-primary-soft',
                    option.disabled && 'cursor-not-allowed text-text-muted',
                  )}
                >
                  <span className="text-text">{option.label}</span>
                  {option.description ? (
                    <span className="text-sm text-text-muted">{option.description}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
