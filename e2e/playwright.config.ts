import { defineConfig, devices } from '@playwright/test'

import fireconfig from '../firebase.json' assert { type: 'json' }

const host = `127.0.0.1`
process.env.FIRESTORE_EMULATOR_HOST = `${host}:${fireconfig.emulators.firestore.port}`
process.env.FIREBASE_AUTH_EMULATOR_HOST = `${host}:${fireconfig.emulators.auth.port}`
const ci = !!process.env.CI

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 2 : 0,
  workers: ci ? 1 : undefined,
  reporter: 'html',
  webServer: [
    {
      command: 'cd ../examples/nosense && pnpm emulate',
      url: `http://${host}:4000/auth`,
      timeout: 120 * 1000,
      reuseExistingServer: !ci,
    },
    {
      command: `cd ../examples/nosense && env FIRE_EMULATE=TRUE pnpm ${ci ? 'preview' : 'dev'} --host`,
      url: `http://${host}:3001`,
      timeout: 120 * 1000,
      reuseExistingServer: !ci,
    },
  ],
  use: {
    baseURL: `http://${host}:3001`,
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

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
})
