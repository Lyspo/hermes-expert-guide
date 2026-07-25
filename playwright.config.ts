import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end gates, run against the exported `out/` rather than the dev server.
 *
 * That distinction is the whole point. The dev server renders through Next's runtime;
 * `out/` is the artefact that actually ships, with the real HTML, the real search
 * index, and the real absence of anything that only works in development. A suite
 * that passes against `next dev` and never sees the export is testing a build nobody
 * deploys.
 *
 * Two projects, because the third non-negotiable — nothing breaks without JavaScript —
 * is not a property you can assert from a single browser context. The `no-js` project
 * loads the same pages with scripting off and checks that the content is all there.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: 'http://127.0.0.1:4319',
    trace: 'retain-on-failure',
  },

  // The same static host `scripts/check-links.mjs` uses, on the same port, so the two
  // gates are looking at byte-identical output.
  webServer: {
    command: 'npx --yes serve out -l 4319',
    url: 'http://127.0.0.1:4319',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /no-js\.spec\.ts/,
    },
    {
      name: 'no-js',
      use: { ...devices['Desktop Chrome'], javaScriptEnabled: false },
      testMatch: /no-js\.spec\.ts/,
    },
  ],
})
