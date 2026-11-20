// Applies the migrations on the E2E database and empties it
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { sql } from 'drizzle-orm';
import pg from 'pg';

export default async function setup() {
  const pool = new pg.Pool({
    connectionString:
      process.env.E2E_DATABASE_URL || 'postgres://localloop:localloop@localhost:5432/localloop_e2e',
  });
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: 'backend/db/migrations' });
  await db.execute(
    sql`truncate table notifications, likes, comments, friend_requests, posts, users restart identity cascade`
  );
  await pool.end();
}
