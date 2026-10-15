import { describe, expect, it } from 'vitest';
import { activeNavigationId, type NavDefinition, visibleNavigation } from './navigation';

const DEFINITIONS: NavDefinition[] = [
  { id: 'home', labelKey: 'nav.home', href: '/', icon: 'home' },
  {
    id: 'billing',
    labelKey: 'nav.home',
    href: '/billing',
    icon: 'home',
    requires: 'billing.invoice.view',
  },
  {
    id: 'billing-sessions',
    labelKey: 'nav.home',
    href: '/billing/sessions',
    icon: 'home',
    requires: 'billing.session.view',
  },
];

describe('visibleNavigation', () => {
  it('hides entries whose permission is not granted', () => {
    const visible = visibleNavigation(DEFINITIONS, new Set(['billing.invoice.view']));
    expect(visible.map((item) => item.id)).toEqual(['home', 'billing']);
  });

  it('shows only entries without a requirement when nothing is granted', () => {
    expect(visibleNavigation(DEFINITIONS, new Set()).map((item) => item.id)).toEqual(['home']);
  });
});

describe('activeNavigationId', () => {
  it('matches the home route only exactly', () => {
    expect(activeNavigationId(DEFINITIONS, '/')).toBe('home');
    expect(activeNavigationId(DEFINITIONS, '/unknown')).toBeUndefined();
  });

  it('picks the most specific matching route', () => {
    expect(activeNavigationId(DEFINITIONS, '/billing/sessions/42')).toBe('billing-sessions');
    expect(activeNavigationId(DEFINITIONS, '/billing/invoices')).toBe('billing');
  });
});
