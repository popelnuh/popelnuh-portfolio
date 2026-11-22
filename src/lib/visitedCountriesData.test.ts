import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { resolveWorldFeatureIso3 } from './worldMapAdapter';

const dataset = JSON.parse(
	readFileSync(new URL('../../public/data/visited-countries.json', import.meta.url), 'utf8'),
) as { countries: Array<{ iso3: string; name: string }> };

describe('visited countries dataset', () => {
	it('contains 38 unique ISO-3 entries with names', () => {
		expect(dataset.countries).toHaveLength(38);

		const codes = dataset.countries.map(({ iso3 }) => iso3);
		expect(new Set(codes).size).toBe(38);
		for (const country of dataset.countries) {
			expect(country.iso3).toMatch(/^[A-Z]{3}$/);
			expect(country.name.trim()).not.toBe('');
		}
	});

	it('maps every visited country except Vatican City to a Natural Earth polygon', () => {
		const world = JSON.parse(
			readFileSync(
				new URL('../../public/data/world-countries-110m.geojson', import.meta.url),
				'utf8',
			),
		) as { features: Array<{ properties: unknown }> };
		const worldCodes = new Set(
			world.features
				.map(({ properties }) => resolveWorldFeatureIso3(properties))
				.filter((code): code is string => code !== null),
		);

		for (const { iso3 } of dataset.countries) {
			if (iso3 === 'VAT') continue;
			expect(worldCodes.has(iso3), `${iso3} should resolve to a Natural Earth feature`).toBe(true);
		}
	});
});
