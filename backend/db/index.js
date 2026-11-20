import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

const DEFAULT_URL = 'postgres://localloop:localloop@localhost:5432/localloop';

// One pool per process, kept between hot reloads in development
const globalForDb = globalThis;
const pool =
  globalForDb.pgPool ?? new pg.Pool({ connectionString: process.env.DATABASE_URL || DEFAULT_URL });
if (process.env.NODE_ENV !== 'production') globalForDb.pgPool = pool;

export const db = drizzle(pool, { schema });
export { pool };
export * from './schema.js';
