// Moves an active index through a list for arrow-key navigation (menus, tabs, listboxes).
// Pure so the contract is tested once and shared. Implements: T-UI-01, F section 7.2.
export type MoveIntent = 'next' | 'previous' | 'first' | 'last';

export interface MoveOptions {
  current: number;
  count: number;
  intent: MoveIntent;
  loop?: boolean;
  isDisabled?: (index: number) => boolean;
}

function startIndex(current: number, count: number, intent: MoveIntent): number {
  if (intent === 'first') return -1;
  if (intent === 'last') return count;
  if (intent === 'previous' && current < 0) return count;
  return current;
}

/** Returns the new active index, or `current` when nothing else can be reached. */
export function moveIndex({
  current,
  count,
  intent,
  loop = true,
  isDisabled = () => false,
}: MoveOptions): number {
  if (count === 0) return -1;
  const direction = intent === 'next' || intent === 'first' ? 1 : -1;
  let index = startIndex(current, count, intent);

  for (let step = 0; step < count; step += 1) {
    index += direction;
    if (index < 0 || index >= count) {
      if (!loop) return current;
      index = (index + count) % count;
    }
    if (!isDisabled(index)) return index;
  }
  return current;
}
