# Browser Test Architecture

Playwright tests use a Page Object Model: classes in `pages/` and `components/` own locators and
user-facing actions, while Gherkin features in `features/` describe outcomes. Step definitions call
those page objects rather than duplicating selectors. The shared fixture in `fixtures/test.ts`
constructs the page objects and provides them to steps.

Choose the smallest test layer that proves the behavior:

- Use **Vitest** for deterministic logic such as schema conversion, validation, color boundaries,
  and tooltip formatting. These tests should not start a browser or depend on the network.
- Use **Playwright** when the behavior depends on rendered HTML, browser events, Leaflet layers,
  navigation, or the integration of multiple modules. Assert observable outcomes rather than
  implementation details.

Run `npm run lint:tests` to enforce Playwright-specific rules, `npm run test:unit` for Vitest, and
`npm run test:e2e` for browser tests. The E2E command generates specs from the Gherkin files before
starting Playwright.
