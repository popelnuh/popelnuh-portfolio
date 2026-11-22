# `src/lib` Architecture

This layer keeps source-specific data and map behavior out of the Astro pages and Leaflet renderer.

## Adapter pattern

OECD, Eurostat, and education authorities publish different identifiers and record shapes.
Adapters validate those inputs and translate them to shared map contracts before rendering. For
example, the OECD adapter maps ISO-3 codes to GISCO IDs, including `GBR` → `UK` and `GRC` → `EL`;
the school-uniform adapter validates categorical records and country-specific HTTPS references.

The trade-off is an explicit mapping and validation boundary to maintain when a source changes.
That cost is preferable to spreading source-specific conditionals through the map component, and it
makes malformed input and exceptional identifiers directly testable without a browser.

## Strategy pattern

`mapStrategies` supplies numeric or categorical colors, legends, tooltip formatting, and popup
details to the shared Leaflet component. The European map tabs include renewable energy, childcare
costs, school-uniform policies, free-school-meal policies, summer school holidays, compulsory
school starting age, teacher qualification levels, and religious education and worship policies.
The component owns map lifecycle and
interaction; strategies own metric presentation. Adding a metric therefore avoids duplicating map
setup, while structured popup details allow selected countries to show notes and safe external
sources.

The strategy contract is intentionally small and can grow as new metrics need distinct behavior.
Because color scales and tooltip formatters are pure functions, Vitest can verify thresholds,
missing-data fallbacks, and output formatting independently of Leaflet. Teacher qualification
categories follow the mainstream Initial Teacher Education minimum requirement and distinguish
Master's-level qualification across school levels, Master's-level secondary routes, and Bachelor's
routes with teaching qualifications. Religious education categories summarize mainstream state
school models while noting selected regional exceptions and excluding private faith schools.
