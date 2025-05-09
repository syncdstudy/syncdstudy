// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, devices } from '@playwright/test';
// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';
import path from 'path';

// Load env vars for local and CI environments
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'john-tests',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'john-auth.json',
      },
      testMatch: '**/john-*.spec.ts',
    },
    {
      name: 'admin-tests',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'admin-auth.json',
      },
      testMatch: '**/admin-*.spec.ts',
    },
    {
      name: 'list-stuff-tests',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'john-auth.json',
      },
      testMatch: '**/list-stuff-*.spec.ts',
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
  },
});
