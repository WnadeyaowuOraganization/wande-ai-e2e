import { defineConfig, devices } from '@playwright/test';

/**
 * 万德AI平台 Playwright 配置
 *
 * 环境变量：
 *   BASE_URL_API    — 后端API地址（默认 http://localhost:6040）
 *   BASE_URL_FRONT  — 管理前端地址（默认 http://localhost:8083）
 *   TEST_ENV        — 环境标识: dev / prod（默认 dev）
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/reports/results.json' }],
    ['list'],
  ],
  use: {
    /* 后端API默认指向G7e dev环境 */
    baseURL: process.env.BASE_URL_FRONT || 'http://localhost:8083',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'api-tests',
      testMatch: /tests\/api\/.*\.spec\.ts/,
      use: {
        baseURL: process.env.BASE_URL_API || 'http://localhost:6040',
      },
    },
    {
      name: 'smoke-tests',
      testMatch: /tests\/smoke\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'e2e-tests',
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['api-tests'],
    },
  ],
  /* dev环境的webServer配置（如果需要本地启动） */
  // webServer: {
  //   command: 'docker compose -f docker-compose-dev.yaml up -d',
  //   url: 'http://localhost:8083',
  //   reuseExistingServer: true,
  // },
});
