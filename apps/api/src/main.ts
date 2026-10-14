import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { configureApp } from './http/configure-app.js';

// Local development reads the repository .env; real environments set variables directly,
// and those always win over the file.
config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)), quiet: true });

async function bootstrap(): Promise<void> {
  // Imported after .env is loaded, because AppModule reads the environment when it loads.
  const { AppModule } = await import('./app.module.js');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configureApp(app, process.env.CORS_ORIGINS);
  app.enableShutdownHooks();
  await app.listen(Number(process.env.API_PORT ?? 4100));
}

await bootstrap();
