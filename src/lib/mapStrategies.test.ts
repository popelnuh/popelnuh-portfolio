import { describe, expect, it } from 'vitest';
import {
	CHILDCARE_NO_DATA_COLOR,
	getChildcareCostColor,
	mapStrategies,
} from '@/lib/mapStrategies';

describe('childcare map strategy', () => {
	it.each([
		[null, CHILDCARE_NO_DATA_COLOR],
		[Number.NaN, CHILDCARE_NO_DATA_COLOR],
		[0, '#ffeda0'],
		[4.99, '#ffeda0'],
		[5, '#feb24c'],
		[9.99, '#feb24c'],
		[10, '#f03b20'],
		[14.99, '#f03b20'],
		[15, '#bd0026'],
	])('uses the expected color for value %s', (value, color) => {
		expect(getChildcareCostColor(value)).toBe(color);
		expect(mapStrategies.childcare.colorScale(value)).toBe(color);
	});

	it('keeps legend swatches aligned with the color thresholds', () => {
		const colors = mapStrategies.childcare.legendIntervals.map(({ color }) => color);

		expect(colors).toEqual([
			CHILDCARE_NO_DATA_COLOR,
			getChildcareCostColor(0),
			getChildcareCostColor(5),
			getChildcareCostColor(10),
			getChildcareCostColor(15),
		]);
	});

	it('formats a childcare tooltip with the value, unit, and year', () => {
		expect(
			mapStrategies.childcare.formatTooltip({
				value: 9.25,
				year: 2023,
				estimated: false,
				indicator: 'Net childcare cost',
				unit: '% of disposable household income',
			}),
		).toBe('9.3% of disposable household income (2023)');
	});

	it('formats missing childcare data without undefined values', () => {
		expect(
			mapStrategies.childcare.formatTooltip({
				value: null,
				year: 2023,
				estimated: false,
				indicator: 'Net childcare cost',
				unit: '% of disposable household income',
			}),
		).toBe('No OECD data available');
	});
});

describe('renewable map strategy', () => {
	it('formats a renewable tooltip and marks estimated values', () => {
		expect(
			mapStrategies.renewable.formatTooltip({
				value: 24.56,
				year: 2024,
				estimated: true,
				indicator: 'Renewable energy share',
				unit: '%',
			}),
		).toBe('Renewable energy share (2024): 24.6% (estimate)');
	});

	it('formats missing renewable data', () => {
		expect(
			mapStrategies.renewable.formatTooltip({
				value: null,
				year: 2024,
				estimated: false,
				indicator: 'Renewable energy share',
				unit: '%',
			}),
		).toBe('Renewable energy share: no data');
	});
});
