import { describe, expect, it } from 'vitest';
import {
	getRenewableEnergyColor,
	joinRenewableEnergyData,
	NO_DATA_COLOR,
	type RenewableEnergyDataset,
} from '@/lib/renewableEnergyAdapter';
import type { CountryBoundaries } from '@/lib/mapTypes';

const boundaries: CountryBoundaries = {
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			geometry: { type: 'Point', coordinates: [0, 0] },
			properties: { CNTR_ID: 'ES', CNTR_NAME: 'Spain' },
		},
		{
			type: 'Feature',
			geometry: { type: 'Point', coordinates: [1, 1] },
			properties: { CNTR_ID: 'UK', CNTR_NAME: 'United Kingdom' },
		},
	],
};

const metrics: RenewableEnergyDataset = {
	dataset: 'Renewables',
	indicator: 'Share of renewables in gross final energy consumption',
	referenceYear: 2024,
	unit: '%',
	sourceUrl: 'https://example.test/eurostat',
	estimatedCNTR_IDs: ['ES'],
	valuesByCNTR_ID: { ES: 42.5 },
};

describe('getRenewableEnergyColor', () => {
	it.each([
		[null, NO_DATA_COLOR],
		[Number.NaN, NO_DATA_COLOR],
		[14.9, '#e6eceb'],
		[15, '#bfd4d8'],
		[25, '#92bac8'],
		[40, '#5f98b5'],
		[60, '#2f6f9f'],
	])('returns the correct color at value %s', (value, color) => {
		expect(getRenewableEnergyColor(value)).toBe(color);
	});
});

describe('joinRenewableEnergyData', () => {
	it('joins reported values and preserves estimate metadata', () => {
		const joined = joinRenewableEnergyData(boundaries, metrics);

		expect(joined.features[0].properties).toMatchObject({
			CNTR_ID: 'ES',
			metricValue: 42.5,
			renewable_energy_pct: 42.5,
			choropleth_color: '#5f98b5',
			estimated: true,
		});
	});

	it('marks countries without observations as no data', () => {
		const joined = joinRenewableEnergyData(boundaries, metrics);

		expect(joined.features[1].properties).toMatchObject({
			CNTR_ID: 'UK',
			metricValue: null,
			renewable_energy_pct: null,
			choropleth_color: NO_DATA_COLOR,
			estimated: false,
		});
	});

	it('rejects percentages outside the valid range', () => {
		const invalidMetrics = {
			...metrics,
			valuesByCNTR_ID: { ES: 101 },
		};

		expect(() => joinRenewableEnergyData(boundaries, invalidMetrics)).toThrow(
			'Invalid renewable energy percentage for ES',
		);
	});
});
