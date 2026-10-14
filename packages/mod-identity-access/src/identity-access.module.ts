// Wires authentication into the API: the service, the /auth controller and three global
// guards. Every route is protected unless marked @Public or @AllowWithoutTenant.
import { Module, type DynamicModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { systemClock, type Clock } from '@hms/domain-kernel';
import { AUTH_CONFIG, CLOCK, type AuthConfig } from './application/auth.config.js';
import { AuthService } from './application/auth.service.js';
import { AuthController } from './http/auth.controller.js';
import { ALLOWED_ORIGINS, CsrfGuard, SessionGuard, TenantGuard } from './http/guards.js';

export interface IdentityAccessOptions {
  /** Exact web origins allowed to send writes (same list as CORS_ORIGINS). */
  allowedOrigins?: readonly string[];
}

@Module({})
export class IdentityAccessModule {
  static forRoot(
    config: AuthConfig,
    clock: Clock = systemClock,
    options: IdentityAccessOptions = {},
  ): DynamicModule {
    const allowedOrigins = new Set(options.allowedOrigins ?? ['http://localhost:3100']);
    return {
      module: IdentityAccessModule,
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: AUTH_CONFIG, useValue: config },
        { provide: CLOCK, useValue: clock },
        { provide: ALLOWED_ORIGINS, useValue: allowedOrigins },
        // Order matters: session first, then CSRF (needs the session token), then tenant.
        { provide: APP_GUARD, useClass: SessionGuard },
        { provide: APP_GUARD, useClass: CsrfGuard },
        { provide: APP_GUARD, useClass: TenantGuard },
      ],
      exports: [AuthService],
    };
  }
}
