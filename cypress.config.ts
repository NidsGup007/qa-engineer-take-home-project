import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 900,
  video: false,
  retries: { runMode: 2, openMode: 0 },
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    setupNodeEvents() {
      // node event listeners can go here
    },
  },
  env: {
    apiUrl: 'http://localhost:5173/api',
  },
});
