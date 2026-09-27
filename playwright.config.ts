import { defineConfig, devices } from '@playwright/test';

try {
  require('dotenv').config();
} catch {
  // dotenv is optional; environment variables may be provided externally.
}

export const BASE_URL = process.env.BASE_URL ?? 'https://practicesoftwaretesting.com';
export const API_URL = process.env.API_URL ?? 'https://api.practicesoftwaretesting.com';

export const CUSTOMER_STATE = '.auth/customer.json';
export const ADMIN_STATE = '.auth/admin.json';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // The public instance is shared with the whole internet. Stay polite.
  workers: process.env.CI ? 4 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['github'], ['list']]
    : [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: BASE_URL,
    // The app annotates every meaningful element with data-test.
    // This makes getByTestId('add-to-cart') resolve to [data-test="add-to-cart"].
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  projects: [
    // 1. Auth state is minted once, then reused by every browser project.
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    // 2. API tests need no browser and no storage state.
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_URL },
    },

    // 3. Guest journeys: registration, first-visit catalog browsing, guest checkout.
    {
      name: 'chromium-guest',
      testDir: './tests/e2e',
      grep: /@guest/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },

    // 4. Logged-in journeys.
    {
      name: 'chromium-customer',
      testDir: './tests/e2e',
      grepInvert: /@guest|@admin/,
      use: { ...devices['Desktop Chrome'], storageState: CUSTOMER_STATE },
      dependencies: ['setup'],
    },

    // 5. Admin tests only make sense against a disposable local container.
    {
      name: 'admin',
      testDir: './tests/e2e',
      grep: /@admin/,
      use: { ...devices['Desktop Chrome'], storageState: ADMIN_STATE },
      dependencies: ['setup'],
    },

    // 6. Smoke coverage on a small viewport.
    {
      name: 'mobile',
      testDir: './tests/e2e',
      grep: /@smoke/,
      grepInvert: /@admin/,
      use: { ...devices['Pixel 7'], storageState: CUSTOMER_STATE },
      dependencies: ['setup'],
    },
  ],
});