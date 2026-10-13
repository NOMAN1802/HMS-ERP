import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';

export { PrismaClient } from './generated/prisma/client.js';
export type * from './generated/prisma/client.js';

// Prisma 7 needs a driver adapter. pg has no default connection timeout, so set one (D1 §4).
export function createPrismaClient(connectionString: string): PrismaClient {
  const adapter = new PrismaPg({ connectionString, connectionTimeoutMillis: 5_000 });
  return new PrismaClient({ adapter });
}
