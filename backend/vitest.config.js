import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';

const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'postgres://localloop:localloop@localhost:5432/localloop_test';

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['**/*.test.js'],
    exclude: ['node_modules', '.next'],
    env: { DATABASE_URL: TEST_DATABASE_URL, JWT_SECRET: 'test-secret' },
    globalSetup: ['./tests/global-setup.js'],
    // Integration tests share one database: files run one after the other
    fileParallelism: false,
    // The JSON logs of withErrorHandler are expected in the tests: do not print them
    onConsoleLog: (log) => !log.startsWith('{"time"'),
  },
});
