'use client';
// The selected option and the text shown in a combobox, kept consistent in both directions:
// choosing or typing updates both, and a selection changed from outside (a form setting or
// clearing the patient) updates the shown text. Implements: T-UI-01, ADR-022 section 8.
// Split out of Combobox so each file keeps one job.
import { useEffect, useRef, useState } from 'react';
import { useControllableState } from '../hooks/use-controllable-state.js';

export interface ComboboxOption {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectionOptions {
  value?: ComboboxOption | null;
  defaultValue: ComboboxOption | null;
  onValueChange?: (option: ComboboxOption | null) => void;
  /** Text shown at first when nothing is selected. A selection's label wins over it. */
  initialQuery?: string;
}

export interface Selection {
  selected: ComboboxOption | null;
  selectedId: string | null;
  text: string;
  setText: (text: string) => void;
  /** Changes the selection from inside the component; the text is managed by the caller. */
  changeSelection: (next: ComboboxOption | null) => void;
}

export function useComboboxSelection({
  value,
  defaultValue,
  onValueChange,
  initialQuery,
}: SelectionOptions): Selection {
  const [selected, setSelected] = useControllableState<ComboboxOption | null>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const selectedId = selected?.id ?? null;
  const [text, setText] = useState(() => initialQuery ?? selected?.label ?? '');
  // The selection this component just made itself, so the text is not rewritten for it.
  const ownChange = useRef<{ id: string | null } | null>(null);
  const syncedId = useRef(selectedId);

  useEffect(() => {
    if (syncedId.current === selectedId) return;
    syncedId.current = selectedId;
    if (ownChange.current?.id === selectedId) {
      ownChange.current = null;
      return;
    }
    setText(selected?.label ?? '');
    // Only a changed selection id re-syncs the text, not every new object for the same option.
  }, [selectedId]);

  function changeSelection(next: ComboboxOption | null): void {
    ownChange.current = { id: next?.id ?? null };
    setSelected(next);
  }

  return { selected, selectedId, text, setText, changeSelection };
}
