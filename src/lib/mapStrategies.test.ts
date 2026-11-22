import { describe, expect, it } from 'vitest';
import {
	CHILDCARE_NO_DATA_COLOR,
	formatSchoolUniformPopup,
	getChildcareCostColor,
	getSchoolUniformColor,
	getSchoolUniformCategoryLabel,
	mapStrategies,
	schoolUniformsStrategy,
	SCHOOL_UNIFORMS_NO_DATA_COLOR,
} from '@/lib/mapStrategies';
import { isSafeHttpsUrl } from '@/lib/adapters/schoolUniformsAdapter';
import type { MapTooltipContext } from '@/lib/mapStrategies';

function schoolUniformContext(
	overrides: Partial<MapTooltipContext> = {},
): MapTooltipContext {
	return {
		country: 'United Kingdom',
		value: 'standard',
		estimated: false,
		indicator: 'School uniform policy',
		unit: 'policy category',
		...overrides,
	};
}

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
				country: 'France',
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
				country: 'Türkiye',
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
				country: 'Spain',
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
				country: 'United Kingdom',
				value: null,
				year: 2024,
				estimated: false,
				indicator: 'Renewable energy share',
				unit: '%',
			}),
		).toBe('Renewable energy share: no data');
	});
});

describe('school uniforms map strategy', () => {
	it.each([
		['standard', '#0f766e'],
		['optional_or_private', '#d4a373'],
		['not_used', '#cbd5e1'],
		[null, SCHOOL_UNIFORMS_NO_DATA_COLOR],
		['unknown', SCHOOL_UNIFORMS_NO_DATA_COLOR],
		['toString', SCHOOL_UNIFORMS_NO_DATA_COLOR],
	])('maps category %s to its qualitative color', (category, color) => {
		expect(getSchoolUniformColor(category)).toBe(color);
		expect(schoolUniformsStrategy.colorScale(category)).toBe(color);
	});

	it('uses the category label in the hover tooltip', () => {
		expect(
			mapStrategies['school-uniforms'].formatTooltip(
				schoolUniformContext({ value: 'optional_or_private' }),
			),
		).toBe('Mostly private / optional');
	});

	it('formats a selected-country detail with its note and safe source link', () => {
		expect(
			formatSchoolUniformPopup(
				schoolUniformContext({
					note: 'Uniform policy is set by individual schools.',
					sourceLabel: 'UK Department for Education',
					sourceUrl: 'https://www.gov.uk/example',
				}),
			),
		).toEqual({
			valueLabel: 'Standard in state schools',
			note: 'Uniform policy is set by individual schools.',
			sourceLabel: 'UK Department for Education',
			sourceUrl: 'https://www.gov.uk/example',
		});
	});

	it('omits empty notes and rejects non-HTTPS source links', () => {
		const details = formatSchoolUniformPopup(
			schoolUniformContext({
				note: '  ',
				sourceLabel: 'Unsafe reference',
				sourceUrl: 'javascript:alert(1)',
			}),
		);

		expect(details).toEqual({ valueLabel: 'Standard in state schools' });
		expect(isSafeHttpsUrl('https://example.test/source')).toBe(true);
		expect(isSafeHttpsUrl('http://example.test/source')).toBe(false);
		expect(isSafeHttpsUrl('javascript:alert(1)')).toBe(false);
	});

	it('provides a clear fallback when the country has no dataset entry', () => {
		expect(
			formatSchoolUniformPopup(schoolUniformContext({ value: null })),
		).toEqual({
			valueLabel: 'No policy data available',
			note: 'No curated school-uniform policy entry is available for this country.',
		});
		expect(getSchoolUniformCategoryLabel('unknown')).toBe('No policy data available');
	});
});
