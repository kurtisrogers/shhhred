import { defineConfig, devices } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

const testDir = defineBddConfig({
  featuresRoot: './features',
})

const previewBaseUrl = 'http://127.0.0.1:4173/shhhred/'

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: previewBaseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command:
      'GITHUB_PAGES=true npm run build && GITHUB_PAGES=true npm run preview -- --host 127.0.0.1 --port 4173',
    url: previewBaseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
