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

// Unique constraint violated (ex: two accounts with the same email created at the same time)
export function isUniqueViolation(error) {
  return error?.code === 'P2002';
}

// Foreign key violated (ex: the author of a token was deleted in the meantime)
export function isForeignKeyViolation(error) {
  return error?.code === 'P2003';
}

// Record to update or delete not found
export function isNotFound(error) {
  return error?.code === 'P2025';
}
