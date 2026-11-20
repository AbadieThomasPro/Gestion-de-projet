// Applies the pending migrations of db/migrations (used in development, CI and in the container)
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { fileURLToPath } from 'url';
import { db, pool } from './index.js';

await migrate(db, { migrationsFolder: fileURLToPath(new URL('./migrations', import.meta.url)) });
console.log('Migrations applied');
await pool.end();
