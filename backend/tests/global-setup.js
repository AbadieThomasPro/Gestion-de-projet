// Applies the migrations on the test database once, before all the tests
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

export default function setup() {
  execSync('npx prisma migrate deploy', {
    cwd: fileURLToPath(new URL('..', import.meta.url)),
    env: {
      ...process.env,
      DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgres://localloop:localloop@localhost:5432/localloop_test',
    },
    stdio: 'pipe',
  });
}
