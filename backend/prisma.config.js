import { defineConfig, env } from 'prisma/config';

process.env.DATABASE_URL ||= 'postgres://localloop:localloop@localhost:5432/localloop';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.js',
  },
  datasource: { url: env('DATABASE_URL') },
});
