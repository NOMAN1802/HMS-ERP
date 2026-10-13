import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller.js';

// HTTP composition root: imports mod-* modules through their public index only (D §5).
@Module({
  controllers: [HealthController],
})
export class AppModule {}
