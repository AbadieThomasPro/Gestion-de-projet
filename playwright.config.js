import { defineConfig, devices } from '@playwright/test';

// The E2E tests use their own database, emptied before each run
const E2E_DATABASE_URL =
  process.env.E2E_DATABASE_URL || 'postgres://localloop:localloop@localhost:5432/localloop_e2e';
const API_URL = 'http://localhost:3101/api';

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.js',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'off',
  },
  projects: [
    {
      // Gérard's screen (persona): every E2E test runs in 800x600
      name: 'chromium-800x600',
      use: { ...devices['Desktop Chrome'], viewport: { width: 800, height: 600 } },
    },
  ],
  webServer: [
    {
      command: 'npm run dev -w backend -- -p 3101',
      url: `${API_URL}/health`,
      reuseExistingServer: !process.env.CI,
      env: { DATABASE_URL: E2E_DATABASE_URL, JWT_SECRET: 'e2e-secret', FRONT_URL: 'http://localhost:5174' },
      timeout: 120_000,
    },
    {
      command: 'npm run dev -w frontend -- --port 5174 --strictPort',
      url: 'http://localhost:5174',
      reuseExistingServer: !process.env.CI,
      env: { VITE_API_URL: API_URL },
      timeout: 120_000,
    },
  ],
});
