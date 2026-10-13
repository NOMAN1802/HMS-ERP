import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module.js';

// Standalone composition root: BullMQ processors, outbox relay, adapters (D §5, ADR-006). No HTTP.
async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  app.enableShutdownHooks();
}

await bootstrap();
