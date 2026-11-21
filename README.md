# Zlata Popelnuh — Portfolio

[![Azure Static Web Apps CI/CD](https://github.com/popelnuh/popelnuh-portfolio/actions/workflows/azure-static-web-apps-salmon-water-0ad7f5510.yml/badge.svg?branch=main)](https://github.com/popelnuh/popelnuh-portfolio/actions/workflows/azure-static-web-apps-salmon-water-0ad7f5510.yml)

This repository contains my personal portfolio, built with Astro and hosted on Azure Static Web Apps. It is intended to include technical blog posts and interactive GIS visualizations, with a Leaflet map using Eurostat GISCO boundaries and renewable energy metrics.

Live site: [salmon-water-0ad7f5510.8.azurestaticapps.net](https://salmon-water-0ad7f5510.8.azurestaticapps.net/)

## Tech Stack

- Astro
- Leaflet
- TypeScript
- Playwright Test
- Azure Static Web Apps
- GitHub Actions

## Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── azure-static-web-apps-salmon-water-0ad7f5510.yml
├── public/
│   ├── data/
│   │   ├── europe-countries.geojson
│   │   └── renewable-energy.json
│   ├── favicon.ico
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
│   │   └── renewableEnergyAdapter.ts
│   └── pages/
│       ├── about.astro
│       ├── index.astro
│       └── maps.astro
├── tests/
│   ├── components/
│   │   └── NavBarComponent.ts
│   ├── fixtures/
│   │   └── test.ts
│   ├── pages/
│   │   ├── AboutPage.ts
│   │   ├── HomePage.ts
│   │   └── MapsPage.ts
│   └── pages.spec.ts
├── .mcp.json
├── astro.config.mjs
├── package.json
├── package-lock.json
├── playwright.config.ts
└── tsconfig.json
```

## Map Data

`public/data/europe-countries.geojson` contains European country geometries selected from the GISCO 2024 1:20 million dataset by `CNTR_ID`. `public/data/renewable-energy.json` stores 2023 Eurostat `nrg_ind_ren` (`REN`, `PC`) values keyed by `CNTR_ID`; the UK value is an estimate because Eurostat has no 2023 UK observation. The adapter joins the two files and assigns the neutral no-data color to countries without a metric. Boundary attribution is displayed on the map.

## Local Development

Requires Node.js `>=22.23.4`.

```sh
npm ci
npm run dev
```

Astro serves the site locally at `http://localhost:4321/`. To create and preview a production build:

```sh
npm run build
npm run preview
```

Check Astro and TypeScript diagnostics with:

```sh
npm run check
```

## Testing & CI/CD

Install the Playwright Chromium browser once, then run the end-to-end tests:

```sh
npx playwright install chromium
npm run test:e2e
```

### Playwright MCP

The workspace Playwright MCP server is configured in `.mcp.json`. Start the site with `npm run dev`, then use prompts like these in Copilot:

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
