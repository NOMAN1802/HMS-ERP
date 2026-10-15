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

interface SelectionKey {
  id: string | null;
  label: string | null;
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
  // A selection's label always wins over the initial text, so the two never disagree.
  const [text, setText] = useState(() => selected?.label ?? initialQuery ?? '');
  const selectedLabel = selected?.label ?? null;
  // The selection this component just made itself, so the text is not rewritten for it.
  const ownChange = useRef<SelectionKey | null>(null);
  const synced = useRef<SelectionKey>({ id: selectedId, label: selectedLabel });

  // The id alone is not enough: the same patient with a corrected or translated name must show
  // the new name. A new object with the same id and label changes nothing.
  useEffect(() => {
    if (synced.current.id === selectedId && synced.current.label === selectedLabel) return;
    synced.current = { id: selectedId, label: selectedLabel };
    const own = ownChange.current;
    if (own?.id === selectedId && own.label === selectedLabel) {
      ownChange.current = null;
      return;
    }
    setText(selectedLabel ?? '');
  }, [selectedId, selectedLabel]);

  function changeSelection(next: ComboboxOption | null): void {
    ownChange.current = { id: next?.id ?? null, label: next?.label ?? null };
    setSelected(next);
  }

  return { selected, selectedId, text, setText, changeSelection };
}
