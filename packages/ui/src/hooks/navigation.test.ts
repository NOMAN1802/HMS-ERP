import { describe, expect, it } from 'vitest';
import { moveIndex } from './navigation.js';

describe('moveIndex', () => {
  it('moves forward and backward and loops at the ends', () => {
    expect(moveIndex({ current: 0, count: 3, intent: 'next' })).toBe(1);
    expect(moveIndex({ current: 2, count: 3, intent: 'next' })).toBe(0);
    expect(moveIndex({ current: 0, count: 3, intent: 'previous' })).toBe(2);
  });

  it('stays at the ends when looping is off', () => {
    expect(moveIndex({ current: 2, count: 3, intent: 'next', loop: false })).toBe(2);
    expect(moveIndex({ current: 0, count: 3, intent: 'previous', loop: false })).toBe(0);
  });

  it('jumps to the first and last enabled item', () => {
    const isDisabled = (i: number) => i === 0 || i === 3;
    expect(moveIndex({ current: 2, count: 4, intent: 'first', isDisabled })).toBe(1);
    expect(moveIndex({ current: 1, count: 4, intent: 'last', isDisabled })).toBe(2);
  });

  it('skips disabled items', () => {
    expect(moveIndex({ current: 0, count: 4, intent: 'next', isDisabled: (i) => i === 1 })).toBe(2);
  });

  it('starts from the end on previous when nothing is active', () => {
    expect(moveIndex({ current: -1, count: 3, intent: 'previous' })).toBe(2);
    expect(moveIndex({ current: -1, count: 3, intent: 'next' })).toBe(0);
  });

  it('handles an empty list', () => {
    expect(moveIndex({ current: -1, count: 0, intent: 'next' })).toBe(-1);
  });
});
