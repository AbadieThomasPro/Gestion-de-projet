import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const DEFAULT_URL = 'postgres://localloop:localloop@localhost:5432/localloop';

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL || DEFAULT_URL });
  return new PrismaClient({ adapter });
}

// One client per process, kept between hot reloads in development
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
