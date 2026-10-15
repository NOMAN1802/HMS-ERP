import { describe, expect, it } from 'vitest';
import { countGraphemes } from './graphemes.js';

describe('countGraphemes', () => {
  it('counts ASCII by character', () => {
    expect(countGraphemes('abc')).toBe(3);
    expect(countGraphemes('')).toBe(0);
  });

  it('counts a Bangla letter with its vowel sign as one character', () => {
    // RA + I-KAR is two code points but one character to a reader.
    expect(countGraphemes('রি')).toBe(1);
    expect(countGraphemes('রিম')).toBe(2);
  });
});
