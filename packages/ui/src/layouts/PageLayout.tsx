import type { ReactNode } from 'react';

// Page frame inside the shell: title, optional description and actions, then the content.
// Content width is capped so wide screens do not stretch lines (ADR-022 section 6).
// Implements: T-UI-02.
export interface PageLayoutProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageLayout({ title, description, actions, children }: PageLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 2xl:max-w-screen-2xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description ? <p className="mt-1 text-text-muted">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
