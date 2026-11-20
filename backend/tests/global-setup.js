// Applies the migrations on the test database once, before all the tests
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { fileURLToPath } from 'url';
import pg from 'pg';

export default async function setup() {
  const pool = new pg.Pool({
    connectionString:
      process.env.TEST_DATABASE_URL || 'postgres://localloop:localloop@localhost:5432/localloop_test',
  });
  await migrate(drizzle(pool), {
    migrationsFolder: fileURLToPath(new URL('../db/migrations', import.meta.url)),
  });
  await pool.end();
}
