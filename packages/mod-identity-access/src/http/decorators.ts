// Route markers read by the global guards. Routes are protected by default; these opt out.
import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'hms:public';
export const ALLOW_WITHOUT_TENANT_KEY = 'hms:allow-without-tenant';

/** No session needed (login, health). Also skips CSRF and the hospital check. */
export const Public = () => SetMetadata(PUBLIC_KEY, true);

/** Session needed, but no hospital yet (session info, hospital selection, logout). */
export const AllowWithoutTenant = () => SetMetadata(ALLOW_WITHOUT_TENANT_KEY, true);
