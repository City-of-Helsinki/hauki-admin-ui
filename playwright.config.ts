// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, devices } from '@playwright/test';
import { e2eTestUrl } from './e2e/constants';

export default defineConfig({
  testDir: './e2e/tests',

  /* Run tests in files in parallel */
  fullyParallel: false,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* The maximum number of retry attempts given to failed tests */
  retries: process.env.CI ? 1 : undefined,

  // Timeout for each test in milliseconds
  timeout: 60 * 1000,

  workers: 1,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['junit', { outputFile: 'report/e2e-junit-results.xml' }],
    ['html', { open: 'never', outputFolder: 'report/html' }],
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: e2eTestUrl,

    ignoreHTTPSErrors: true,

    screenshot: {
      fullPage: true,
      mode: 'only-on-failure',
    },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    // https://playwright.dev/docs/videos
    video: 'on-first-retry',

    contextOptions: {
      recordVideo: {
        dir: './report/videos/',
      },
    },
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
  ],
  globalTeardown: require.resolve('./e2e/tests/global.teardown.ts'),
});
