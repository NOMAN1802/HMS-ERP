// Tracks which open overlay is on top, so Escape and outside presses only close the top-most
// one (a combobox list inside a dialog closes before the dialog does).
// Implements: T-UI-01, F section 7.3 (dialogs return focus, one thing at a time).
const stack: symbol[] = [];

export interface OverlayHandle {
  isTop: () => boolean;
  unregister: () => void;
}

export function registerOverlay(): OverlayHandle {
  const id = Symbol('overlay');
  stack.push(id);
  return {
    isTop: () => stack[stack.length - 1] === id,
    unregister: () => {
      const index = stack.indexOf(id);
      if (index >= 0) stack.splice(index, 1);
    },
  };
}
