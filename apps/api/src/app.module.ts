import { Module } from '@nestjs/common';
import { IdentityAccessModule, loadAuthConfig } from '@hms/mod-identity-access';
import { DatabaseModule } from '@hms/platform';
import { HealthController } from './health/health.controller.js';
import { parseCorsOrigins } from './http/cors.js';

// HTTP composition root: imports mod-* modules through their public index only (D §5).
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

@Module({
  imports: [
    DatabaseModule.forRoot(requireEnv('DATABASE_URL')),
    IdentityAccessModule.forRoot(loadAuthConfig(process.env), undefined, {
      allowedOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
