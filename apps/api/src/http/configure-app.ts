// HTTP settings shared by main.ts and the HTTP tests.
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ProblemDetailsFilter } from '@hms/platform';
import cookieParser from 'cookie-parser';
import { buildCorsOptions, parseCorsOrigins } from './cors.js';

export function configureApp(app: NestExpressApplication, corsOrigins: string | undefined): void {
  // Only the host nginx reaches the container (ports bind to 127.0.0.1), via loopback or the
  // Docker bridge. Trusting those hops makes req.ip the real visitor IP for audit and lockout.
  app.set('trust proxy', 'loopback, uniquelocal');
  app.disable('x-powered-by');
  app.use(cookieParser());
  app.enableCors(buildCorsOptions(parseCorsOrigins(corsOrigins)));
  app.useGlobalFilters(new ProblemDetailsFilter());
  // D section 8 base path; /health stays at the root for proxy and deploy checks (ADR-021).
  app.setGlobalPrefix('api/v1', { exclude: ['health'] });
}
