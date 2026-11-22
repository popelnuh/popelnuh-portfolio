import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
	adaptFreeSchoolMealsDataset,
	FREE_SCHOOL_MEALS_CATEGORIES,
	isSafeHttpsUrl,
} from '@/lib/adapters/schoolUniformsAdapter';

const dataset = JSON.parse(
	readFileSync(
		new URL('../../public/data/europe-free-school-meals.json', import.meta.url),
		'utf8',
	),
) as unknown;
const giscoIds = new Set(
	(
		JSON.parse(
			readFileSync(new URL('../../public/data/europe-countries.geojson', import.meta.url), 'utf8'),
		) as { features: Array<{ properties: { CNTR_ID: string } }> }
	).features.map(({ properties }) => properties.CNTR_ID),
);
const records = adaptFreeSchoolMealsDataset(dataset);

describe('free school meals dataset integrity', () => {
	it('contains valid, unique GISCO records with policy notes and HTTPS sources', () => {
		const values = Object.values(records);

		expect(values).toHaveLength(31);
		expect(new Set(values.map(({ giscoId }) => giscoId)).size).toBe(values.length);

		for (const record of values) {
			expect(record.giscoId).toMatch(/^[A-Z]{2}$/);
			expect(giscoIds.has(record.giscoId)).toBe(true);
			expect(record.country.trim()).not.toBe('');
			expect(FREE_SCHOOL_MEALS_CATEGORIES).toContain(record.category);
			expect(record.note.trim()).not.toBe('');
			expect(record.sourceLabel.trim()).not.toBe('');
			expect(isSafeHttpsUrl(record.sourceUrl)).toBe(true);
		}
	});

	it('preserves the requested policy classifications', () => {
		const groups = {
			universal: ['FI', 'SE', 'EE', 'UA'],
			partial_universal: ['UK', 'IE', 'LV', 'LT', 'SI', 'SK'],
			targeted: [
				'FR',
				'DE',
				'IT',
				'ES',
				'PT',
				'PL',
				'CZ',
				'HU',
				'BE',
				'AT',
				'EL',
				'MT',
				'CY',
				'HR',
				'RO',
				'BG',
				'LU',
			],
			none: ['NO', 'NL', 'CH', 'DK'],
		} as const;

		for (const [category, ids] of Object.entries(groups)) {
			for (const giscoId of ids) {
				expect(records[giscoId]?.category).toBe(category);
			}
		}
	});
});
