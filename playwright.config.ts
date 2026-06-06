import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  fullyParallel: false,
  workers: process.env.CI ? 1 : 1,
  retries: process.env.CI ? 2 : 0,
  expect: { timeout: 5000 },
  use: {
    headless: true,
    baseURL: 'http://localhost:3001',
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: 'npm run dev -- --port 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NEXT_PUBLIC_E2E: 'true',
    },
    stdout: "pipe",
    stderr: "pipe",
  },
});
