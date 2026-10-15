import { describe, expect, it } from 'vitest';
import { isImeKeyEvent } from './composition.js';

describe('isImeKeyEvent', () => {
  it('recognizes composition by the isComposing flag', () => {
    expect(isImeKeyEvent({ isComposing: true, keyCode: 27 })).toBe(true);
  });

  it('recognizes browsers that report composition only as keyCode 229', () => {
    expect(isImeKeyEvent({ isComposing: false, keyCode: 229 })).toBe(true);
  });

  it('lets an ordinary key through', () => {
    expect(isImeKeyEvent({ isComposing: false, keyCode: 27 })).toBe(false);
  });
});
