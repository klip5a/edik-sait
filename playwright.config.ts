import { defineConfig } from '@playwright/test'

const baseURL = 'http://127.0.0.1:4173'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { outputFolder: 'output/playwright/report', open: 'never' }]],
  outputDir: 'output/playwright/results',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_RSVP_ENDPOINT: `${baseURL}/apps-script`,
      VITE_SEATING_ENDPOINT: `${baseURL}/apps-script`,
    },
  },
  projects: [
    { name: 'mobile-small', use: { browserName: 'chromium', viewport: { width: 375, height: 667 }, hasTouch: true, isMobile: true } },
    { name: 'mobile', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
    { name: 'tablet', use: { browserName: 'chromium', viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } },
    { name: 'wide', use: { browserName: 'chromium', viewport: { width: 1920, height: 1080 } } },
  ],
})
