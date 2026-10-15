// Type-to-find for lists and menus. Pure functions, so the rules are easy to test.
// Implements: T-UI-01, F section 7.2 (keyboard first).

export interface Typeahead {
  /** Adds a typed character and returns the current search text. */
  push: (character: string) => string;
  reset: () => void;
}

export function createTypeahead(timeoutMs = 600, now: () => number = Date.now): Typeahead {
  let buffer = '';
  let lastTyped = 0;
  return {
    push(character) {
      const time = now();
      if (time - lastTyped > timeoutMs) buffer = '';
      lastTyped = time;
      buffer += character.toLowerCase();
      return buffer;
    },
    reset() {
      buffer = '';
    },
  };
}

function isRepeatedCharacter(text: string): boolean {
  return text.length > 1 && [...text].every((character) => character === text[0]);
}

/**
 * Index of the next label matching `query`, or -1. A repeated single character
 * ("aaa") cycles through items starting with it; longer text matches from the current item.
 */
export function findTypeaheadIndex(
  labels: readonly string[],
  query: string,
  currentIndex: number,
  isDisabled: (index: number) => boolean = () => false,
): number {
  if (labels.length === 0 || query === '') return -1;
  const needle = isRepeatedCharacter(query) ? (query[0] as string) : query;
  const startOffset = needle.length === 1 ? 1 : 0;
  for (let step = 0; step < labels.length; step += 1) {
    const index = (currentIndex + startOffset + step + labels.length) % labels.length;
    const label = labels[index] as string;
    if (!isDisabled(index) && label.toLowerCase().startsWith(needle)) return index;
  }
  return -1;
}
