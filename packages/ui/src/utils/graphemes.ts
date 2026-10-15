// Counts user-perceived characters (grapheme clusters), not code units. A Bangla letter with
// a vowel sign is one character to the person typing it. Implements: T-UI-01, F section 9
// (minimum query length counts grapheme clusters).
const segmenter =
  typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

export function countGraphemes(text: string): number {
  if (!segmenter) return Array.from(text).length;
  return Array.from(segmenter.segment(text)).length;
}
