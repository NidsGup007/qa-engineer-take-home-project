import './commands';

Cypress.on('uncaught:exception', () => {
  // The app does a full page reload on save/delete which can occasionally surface
  // ResizeObserver / hydration warnings that should not fail a test.
  return false;
});
