// Shared jsdom setup for component tests: automatic cleanup and the browser APIs jsdom lacks.
// Tests that opt into the node environment (token tests) skip the DOM parts.
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

if (typeof window !== 'undefined') {
  globalThis.ResizeObserver ??= ResizeObserverStub;
  Element.prototype.scrollIntoView ??= function scrollIntoView(): void {};
}

afterEach(() => {
  if (typeof document !== 'undefined') cleanup();
});
