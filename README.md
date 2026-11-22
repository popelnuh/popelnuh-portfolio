# Zlata Popelnuh — Portfolio

[![Azure Static Web Apps CI/CD](https://github.com/popelnuh/popelnuh-portfolio/actions/workflows/azure-static-web-apps-salmon-water-0ad7f5510.yml/badge.svg?branch=main)](https://github.com/popelnuh/popelnuh-portfolio/actions/workflows/azure-static-web-apps-salmon-water-0ad7f5510.yml)

This repository contains my personal portfolio, built with Astro and hosted on Azure Static Web Apps. It is intended to include technical blog posts and interactive GIS visualizations, with a Leaflet map using Eurostat GISCO boundaries and renewable energy metrics.

Live site: [salmon-water-0ad7f5510.8.azurestaticapps.net](https://salmon-water-0ad7f5510.8.azurestaticapps.net/)

## Tech Stack

- Astro and TypeScript for a statically generated portfolio
- Leaflet for interactive map rendering
- Vitest for fast tests of data and map logic
- Playwright Test for browser integration and end-to-end coverage
- Azure Static Web Apps and GitHub Actions for deployment

## Project Structure

```text
.
├── .github/
│   └── workflows/
│       ├── azure-static-web-apps-salmon-water-0ad7f5510.yml
│       └── unit-tests.yml
├── public/
│   ├── data/
│   │   ├── europe-countries.geojson
│   │   ├── europe-school-uniforms.json
│   │   ├── oecd-childcare-costs.json
│   │   └── renewable-energy.json
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components/
│   │   ├── LeafletMap.astro
│   │   └── Welcome.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   ├── adapters/
│   │   │   ├── oecdToGiscoAdapter.ts
│   │   │   └── schoolUniformsAdapter.ts
│   │   ├── README.md
│   │   ├── mapRepository.ts
│   │   ├── mapStrategies.ts
│   │   ├── mapTypes.ts
│   │   ├── renewableEnergyAdapter.ts
│   │   └── *.test.ts
│   └── pages/
│       ├── about.astro
│       ├── index.astro
│       └── maps.astro
├── tests/
│   ├── README.md
│   ├── components/
│   │   └── NavBarComponent.ts
│   ├── features/
│   │   ├── about.feature
│   │   ├── home.feature
│   │   └── maps.feature
│   ├── fixtures/
│   │   └── test.ts
│   ├── pages/
│   │   ├── AboutPage.ts
│   │   ├── HomePage.ts
│   │   └── MapsPage.ts
│   ├── steps/
│   │   ├── maps.steps.ts
│   │   └── site.steps.ts
├── .mcp.json
├── astro.config.mjs
├── package.json
├── package-lock.json
├── playwright.config.ts
├── vitest.config.ts
└── tsconfig.json
```

## Map Data

`public/data/europe-countries.geojson` contains European country geometries selected from the GISCO 2024 1:20 million dataset by `CNTR_ID`. The maps page switches among 2024 Eurostat renewable-energy data, OECD net childcare costs, and a curated qualitative school-uniform policy dataset. The uniform map describes prevailing de facto practice in state schools, with per-country notes and source links in popups. Adapters normalize the source records and the repository caches fetched data for the lifetime of the page.

## Local Development

Requires Node.js `>=22.23.4`.

```sh
npm ci
npm run dev
```

Astro serves the site locally at `http://localhost:4321/`. Common validation commands:

```sh
npm run check
npm run test:unit
npm run test:unit:watch
npm run test:e2e
npm run build
```

To preview a production build:

```sh
npm run preview
```

## Testing & CI/CD

### Testing strategy

The test pyramid keeps fast, deterministic logic checks below a smaller set of real-browser
checks:

- **Vitest unit tests** cover adapters, validation, map color thresholds, and tooltip formatting
  without starting Astro or Leaflet.
- **Playwright POM tests** cover rendered pages, map interactions, and data-loading behavior in a
  browser. Gherkin features describe user flows and step definitions use shared page objects.

Run the unit suite directly with `npm run test:unit`. Install the Playwright Chromium browser once,
then run the Gherkin-generated end-to-end suite:

```sh
npx playwright install chromium
npm run test:e2e
```

GitHub Actions runs Vitest before installing the browser and running Playwright. The deployment
job runs only after the test job passes.

### Playwright MCP

The workspace Playwright MCP server is configured in the root [`.mcp.json`](./.mcp.json):

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "tools": ["*"]
    }
  }
}
```

The config file also contains commented examples for stdio, HTTP, and SSE server options. Start
the site with `npm run dev`, then use prompts like these in Copilot:

- “Open `http://localhost:4321/maps`. Inspect the map, legend, navigation, and attribution. Report usability issues without changing files.”
- “On `/maps`, click Spain, the UK, and Türkiye. Report each popup value and whether the no-data country is styled as expected.”
- “Inspect `/maps` at desktop size and at a 390 × 844 viewport. Check for overflow, cramped controls, and hard-to-tap countries; report findings without editing files.”
- “Check `/maps` for browser-console errors and failed network requests. Summarize any failures without changing files.”
- “Review keyboard access on `/maps`: tab through navigation and map controls, and check whether country regions can be focused and activated.”

### Playwright CLI commands

```sh
npx playwright test                         # Run all tests headlessly
npx playwright test --headed                # Run all tests in a visible browser
npx playwright test tests/pages.spec.ts     # Run a single spec
npx playwright test --ui                    # Open Playwright UI mode
npx playwright test --debug                 # Debug with the Playwright Inspector
npm run test:e2e -- --reporter=html         # Generate an HTML report
npx playwright show-report                  # View the latest HTML report
```

The GitHub Actions workflow runs the Playwright tests on pushes to `main` and active pull requests. A passing test job gates the Azure Static Web Apps build and deployment; pushes to `main` deploy the site, and pull requests use preview deployments.

## Roadmap

- [ ] Configure the custom domain `popelnuh.com`.
- [ ] Expand the map metrics with additional Eurostat and OECD datasets.
- [ ] Expand Playwright coverage with accessibility and visual regression checks.
