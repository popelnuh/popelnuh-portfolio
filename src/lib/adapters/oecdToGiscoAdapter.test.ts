import { describe, expect, it } from 'vitest';
import { adaptOecdToGisco } from '@/lib/adapters/oecdToGiscoAdapter';

const referenceYear = 2023;

function makeEntry(
	iso3 = 'DEU',
	netCostPctIncome: unknown = 12.5,
	overrides: Record<string, unknown> = {},
): Record<string, unknown> {
	return {
		iso3,
		country: 'Germany',
		netCostPctIncome,
		year: referenceYear,
		...overrides,
	};
}

function makeDataset(values: unknown = []): Record<string, unknown> {
	return {
		dataset: 'OECD Net Childcare Costs',
		indicator: 'Net childcare cost',
		referenceYear,
		unit: '% of disposable household income',
		sourceUrl: 'https://example.test/oecd',
		household: 'Couple, 2 children',
		childrenAges: [2, 3],
		earningsScenario: 'Reference person 100%, spouse 67%',
		values,
	};
}

describe('adaptOecdToGisco', () => {
	it.each([
		['DEU', 'DE', 'Germany'],
		['EST', 'EE', 'Estonia'],
		['FRA', 'FR', 'France'],
	])('maps OECD code %s to GISCO code %s', (iso3, giscoId, country) => {
		const records = adaptOecdToGisco(
			makeDataset([makeEntry(iso3, 12.5, { country })]),
		);

		expect(records[giscoId]).toEqual({
			country,
			value: 12.5,
			year: referenceYear,
			unit: '% of disposable household income',
		});
	});

	it.each([
		['GBR', 'UK', 'United Kingdom'],
		['GRC', 'EL', 'Greece'],
	])('handles Eurostat exception %s to %s', (iso3, giscoId, country) => {
		const records = adaptOecdToGisco(
			makeDataset([makeEntry(iso3, 12.5, { country })]),
		);

		expect(records[giscoId]).toMatchObject({ country, value: 12.5 });
	});

	it('rejects unknown country codes with a descriptive error', () => {
		expect(() => adaptOecdToGisco(makeDataset([makeEntry('ZZZ')]))).toThrow(
			'No GISCO country code configured for OECD ISO3 code ZZZ',
		);
	});

	it('omits missing and null metric values so they render as no data', () => {
		const missingValue = {
			iso3: 'DEU',
			country: 'Germany',
			year: referenceYear,
		};
		const nullValue = makeEntry('EST', null, { country: 'Estonia' });

		expect(adaptOecdToGisco(makeDataset([missingValue, nullValue]))).toEqual({});
	});

	it('preserves a zero-valued observation', () => {
		const records = adaptOecdToGisco(
			makeDataset([makeEntry('DEU', 0)]),
		);

		expect(records.DE.value).toBe(0);
	});

	it.each([
		['null input', null, 'expected an object'],
		['non-array values', makeDataset(null), 'values must be an array'],
		[
			'non-integer reference year',
			{ ...makeDataset(), referenceYear: '2023' },
			'referenceYear must be an integer',
		],
		['missing unit', { ...makeDataset(), unit: null }, 'unit must be a non-empty string'],
		[
			'null record',
			makeDataset([null]),
			'Invalid OECD childcare record at index 0: expected an object',
		],
		[
			'inherited object key as a country code',
			makeDataset([makeEntry('toString')]),
			'No GISCO country code configured for OECD ISO3 code toString',
		],
		[
			'missing country name',
			makeDataset([makeEntry('DEU', 12.5, { country: undefined })]),
			'Invalid country name for OECD ISO3 code DEU',
		],
		[
			'unexpected year',
			makeDataset([makeEntry('DEU', 12.5, { year: 2022 })]),
			'Unexpected childcare data year for DEU: 2022',
		],
	])('rejects malformed dataset input (%s) explicitly', (_case, input, message) => {
		expect(() => adaptOecdToGisco(input)).toThrow(message);
	});

	it.each([-0.1, 100.1, Number.NaN, Number.POSITIVE_INFINITY, '12.5'])(
		'rejects invalid metric value %s',
		(value) => {
			expect(() => adaptOecdToGisco(makeDataset([makeEntry('DEU', value)]))).toThrow(
				'Invalid net childcare cost percentage for DEU',
			);
		},
	);

	it('rejects duplicate GISCO codes', () => {
		expect(() =>
			adaptOecdToGisco(
				makeDataset([
					makeEntry('GBR', 10, { country: 'United Kingdom' }),
					makeEntry('GBR', 11, { country: 'United Kingdom' }),
				]),
			),
		).toThrow('Duplicate GISCO country code UK in OECD childcare data');
	});
});
