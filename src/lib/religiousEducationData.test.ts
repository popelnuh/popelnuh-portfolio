import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
	adaptReligiousEducationDataset,
	isSafeHttpsUrl,
	RELIGIOUS_EDUCATION_CATEGORIES,
} from '@/lib/adapters/schoolUniformsAdapter';

const dataset = JSON.parse(
	readFileSync(
		new URL('../../public/data/europe-religious-education.json', import.meta.url),
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
const records = adaptReligiousEducationDataset(dataset);

describe('religious education dataset integrity', () => {
	it('contains valid, unique GISCO records with policy notes and HTTPS sources', () => {
		const values = Object.values(records);

		expect(values).toHaveLength(32);
		expect(new Set(values.map(({ giscoId }) => giscoId)).size).toBe(values.length);

		for (const record of values) {
			expect(record.giscoId).toMatch(/^[A-Z]{2}$/);
			expect(giscoIds.has(record.giscoId)).toBe(true);
			expect(record.country.trim()).not.toBe('');
			expect(RELIGIOUS_EDUCATION_CATEGORIES).toContain(record.category);
			expect(record.note.trim()).not.toBe('');
			expect(record.sourceLabel.trim()).not.toBe('');
			expect(isSafeHttpsUrl(record.sourceUrl)).toBe(true);
		}
	});

	it('preserves the requested country categories', () => {
		const groups = {
			secular: ['FR', 'SI', 'AL'],
			non_confessional: ['SE', 'NO', 'DK', 'EE', 'IS', 'NL', 'CH'],
			confessional_opt_out: [
				'DE', 'AT', 'PL', 'IT', 'ES', 'PT', 'EL', 'BE', 'FI', 'CZ',
				'SK', 'HU', 'HR', 'RO', 'BG', 'LT', 'LV', 'MT', 'CY', 'LU',
			],
			statutory_worship_or_patron: ['UK', 'IE'],
		} as const;

		for (const [category, ids] of Object.entries(groups)) {
			for (const giscoId of ids) {
				expect(records[giscoId]?.category).toBe(category);
			}
		}
	});
});
