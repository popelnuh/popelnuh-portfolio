# `src/lib` Architecture

This layer keeps source-specific data and map behavior out of the Astro pages and Leaflet renderer.

## Adapter pattern

OECD and Eurostat publish different identifiers and record shapes. Adapters validate those inputs
and translate them to the shared `MapMetricRecord`/boundary contracts before rendering. For example,
the OECD adapter maps ISO-3 codes to GISCO IDs, including `GBR` → `UK` and `GRC` → `EL`.

The trade-off is an explicit mapping and validation boundary to maintain when a source changes.
That cost is preferable to spreading source-specific conditionals through the map component, and it
makes malformed input and exceptional identifiers directly testable without a browser.

## Strategy pattern

`mapStrategies` supplies each metric's colors, legend, tooltip formatting, and source metadata to the
shared Leaflet component. The component owns map lifecycle and interaction; strategies own metric
presentation. Adding a metric therefore avoids duplicating map setup.

The strategy contract is intentionally small and can grow as new metrics need distinct behavior.
Because color scales and tooltip formatters are pure functions, Vitest can verify thresholds,
missing-data fallbacks, and output formatting independently of Leaflet.
