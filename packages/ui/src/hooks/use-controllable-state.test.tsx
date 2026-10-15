import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useControllableState } from './use-controllable-state.js';

describe('useControllableState', () => {
  it('keeps its own state when uncontrolled and reports changes', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 'a', onChange }));
    act(() => result.current[1]('b'));
    expect(result.current[0]).toBe('b');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('follows the value when controlled and only reports the request', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: 'fixed', defaultValue: 'a', onChange }),
    );
    act(() => result.current[1]('b'));
    expect(result.current[0]).toBe('fixed');
    expect(onChange).toHaveBeenCalledWith('b');
  });
});
