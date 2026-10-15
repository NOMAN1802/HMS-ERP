import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Internal component gallery: not for search engines (T-UI-01, ADR-022).
export const metadata: Metadata = {
  title: 'UI gallery',
  robots: { index: false, follow: false },
};

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return children;
}
