'use client';
// Controlled or uncontrolled value in one hook, used by every stateful primitive so they all
// follow the same contract. Implements: T-UI-01, ADR-022 section 9 (behavior hooks).
import { useCallback, useRef, useState } from 'react';

export interface ControllableStateOptions<T> {
  /** When defined the component is controlled and this value always wins. */
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): readonly [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled],
  );

  return [isControlled ? value : internal, setValue] as const;
}
