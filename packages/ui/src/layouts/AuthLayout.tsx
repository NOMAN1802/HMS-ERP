import type { ReactNode } from 'react';

// Layout for signed-out screens (login, choose hospital): one calm card on the page background,
// a slot for the language switch, no photograph (ADR-022 section 7). Implements: T-UI-02.
export interface AuthLayoutProps {
  /** Tenant or product brand shown above the card. */
  brand: ReactNode;
  /** Usually the language switch. */
  topEnd?: ReactNode;
  children: ReactNode;
}

export function AuthLayout({ brand, topEnd, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-text">
      <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0">{brand}</div>
        {topEnd ? <div className="flex items-center gap-2">{topEnd}</div> : null}
      </header>
      <main
        id="main-content"
        className="flex flex-1 items-start justify-center px-4 pb-10 pt-6 sm:items-center"
      >
        <div className="w-full max-w-md rounded-panel border border-border bg-surface p-6 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
