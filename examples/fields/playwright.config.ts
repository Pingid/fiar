import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

const baseURL = 'http://localhost:5173'
const CI = process.env.CI
const reporter = process.env.TEST_REPORTER ?? 'list'
const reuseExistingServer = !!process.env.PLAYWRIGHT_DEV

// console.log(devices.)
// https://playwright.dev/docs/test-configuration.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true /* Run tests in files in parallel */,
  forbidOnly: !!CI /* Fail the build on CI if you accidentally left test.only in the source code. */,
  // retries: CI ? 2 : 0 /* Retry on CI only */,
  reporter /* Reporter to use. See https://playwright.dev/docs/test-reporters */,
  use: {
    baseURL /* Base URL to use in actions like `await page.goto('/')`. */,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    // { name: 'chromium', use: { channel: 'chrome' } },
    ...(!CI
      ? []
      : [
          // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
          // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
          // /* Test against mobile viewports. */
          // { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
          // { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
          // /* Test against branded browsers. */
          // { name: 'Microsoft Edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
          // { name: 'Google Chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
        ]),
  ],

  /* Run your local dev server before starting the tests */
  webServer: [{ stdout: 'pipe', stderr: 'pipe', command: 'pnpm run dev', url: baseURL, reuseExistingServer }],
})
