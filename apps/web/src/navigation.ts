// The navigation model of the staff app (F section 2.1). Each entry names the permission code
// it needs; entries are filtered before they reach the shell, so a user never sees a link to
// something the server would refuse (FR-ACC-006). Permission codes arrive with T-ACC-02; until
// then the session carries none and only entries without a requirement are shown.
// Implements: T-UI-02.
import type { IconName } from '@hms/ui';

// Full catalog keys, so the unused-key check can see them as literals.
export type NavLabelKey = 'nav.home';

export interface NavDefinition {
  id: string;
  labelKey: NavLabelKey;
  href: string;
  icon: IconName;
  /** Permission code from the contracts catalog; omitted when every signed-in user may see it. */
  requires?: string;
}

export const NAVIGATION: readonly NavDefinition[] = [
  { id: 'home', labelKey: 'nav.home', href: '/', icon: 'home' },
];

export function visibleNavigation(
  definitions: readonly NavDefinition[],
  granted: ReadonlySet<string>,
): NavDefinition[] {
  return definitions.filter((item) => item.requires === undefined || granted.has(item.requires));
}

/** The item whose route contains the current path; the home route only matches exactly. */
export function activeNavigationId(
  definitions: readonly NavDefinition[],
  pathname: string,
): string | undefined {
  const match = definitions
    .filter((item) => (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.id;
}
