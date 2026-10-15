// Placeholder while the session is being read or a redirect is under way. It is a landmark with
// a live status so a screen reader user is told what is happening (F section 8, loading state).
// Implements: T-UI-02.
import type { ReactNode } from 'react';

export function FullScreenStatus({ children }: { children: ReactNode }) {
  return (
    <main
      id="main-content"
      className="grid min-h-dvh place-items-center bg-bg px-4 text-center text-text-muted"
    >
      <p role="status">{children}</p>
    </main>
  );
}
