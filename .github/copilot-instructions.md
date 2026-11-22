# Copilot Instructions

## Engineering boundaries

- Preserve the Adapter and Strategy patterns in `src/lib/` and the Page Object Model (POM) in
  `tests/`.
- Put all new UI locators and browser interactions in Page Object classes under `tests/pages/` or
  `tests/components/`. Gherkin steps should call page-object methods and assert outcomes; do not
  add selectors or interactions directly to generated or handwritten spec files.
- Prefer semantic Playwright locators (`getByRole`, `getByLabel`, and `getByText`). Use
  `getByTestId` with `data-testid` only when a semantic locator is not practical.
- Never use `data-track` for tests; it is reserved for analytics. Avoid CSS-class selectors and
  XPath.

## Test boundaries

- Put pure adapter/data logic, JSON schema and data-integrity checks, and map strategy color or
  tooltip behavior in `src/lib/**/*.test.ts` using Vitest.
- Use Playwright for rendered UI flows, map rendering and interaction, and accessibility or
  navigation integration.
- Assert user-observable behavior; do not duplicate unit-test coverage in browser tests.

## Forbidden shortcuts

- Never add `page.waitForTimeout()`, `test.skip()`, `.only`, or weaker assertions or timeouts to
  make a failing test pass. Diagnose and fix the underlying behavior instead.
- Do not modify `playwright.config.ts`, `vitest.config.ts`, or files under `.github/workflows/`
  without explicit human approval.
- Do not claim tests or checks passed unless they were run and passed.
