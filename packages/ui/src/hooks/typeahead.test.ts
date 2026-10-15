import { describe, expect, it } from 'vitest';
import { createTypeahead, findTypeaheadIndex } from './typeahead.js';

const labels = ['Alpha', 'Beta', 'Bravo', 'Charlie'];

describe('createTypeahead', () => {
  it('accumulates characters and forgets them after the timeout', () => {
    let time = 0;
    const typeahead = createTypeahead(500, () => time);
    expect(typeahead.push('B')).toBe('b');
    time = 200;
    expect(typeahead.push('r')).toBe('br');
    time = 1000;
    expect(typeahead.push('c')).toBe('c');
  });
});

describe('findTypeaheadIndex', () => {
  it('matches the typed prefix', () => {
    expect(findTypeaheadIndex(labels, 'br', 0)).toBe(2);
  });

  it('cycles items that share a first letter when the same key repeats', () => {
    expect(findTypeaheadIndex(labels, 'b', 0)).toBe(1);
    expect(findTypeaheadIndex(labels, 'b', 1)).toBe(2);
    expect(findTypeaheadIndex(labels, 'bb', 2)).toBe(1);
  });

  it('skips disabled items and reports no match', () => {
    expect(findTypeaheadIndex(labels, 'b', 0, (i) => i === 1)).toBe(2);
    expect(findTypeaheadIndex(labels, 'z', 0)).toBe(-1);
  });

  it('matches Bangla text by its first character', () => {
    expect(
      findTypeaheadIndex(['\u0995\u09B0\u09BF\u09AE', '\u09B0\u09B9\u09BF\u09AE'], '\u09B0', 0),
    ).toBe(1);
  });
});
