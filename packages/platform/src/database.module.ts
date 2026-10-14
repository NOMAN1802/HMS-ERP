// Provides one PrismaClient (hms_app connection) to the whole Nest app, closed on shutdown.
import {
  Global,
  Inject,
  Module,
  type DynamicModule,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { createPrismaClient, type PrismaClient } from '@hms/database';

export const PRISMA = Symbol('PRISMA');

@Global()
@Module({})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  static forRoot(databaseUrl: string): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [{ provide: PRISMA, useFactory: () => createPrismaClient(databaseUrl) }],
      exports: [PRISMA],
    };
  }

  async onApplicationShutdown(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
