import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
	adaptTeacherQualificationsDataset,
	isSafeHttpsUrl,
	TEACHER_QUALIFICATIONS_CATEGORIES,
} from '@/lib/adapters/schoolUniformsAdapter';

const dataset = JSON.parse(
	readFileSync(
		new URL('../../public/data/europe-teacher-qualifications.json', import.meta.url),
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
const records = adaptTeacherQualificationsDataset(dataset);

describe('teacher qualifications dataset integrity', () => {
	it('contains valid, unique GISCO records with notes and HTTPS sources', () => {
		const values = Object.values(records);

		expect(values).toHaveLength(31);
		expect(new Set(values.map(({ giscoId }) => giscoId)).size).toBe(values.length);

		for (const record of values) {
			expect(record.giscoId).toMatch(/^[A-Z]{2}$/);
			expect(giscoIds.has(record.giscoId)).toBe(true);
			expect(record.country.trim()).not.toBe('');
			expect(TEACHER_QUALIFICATIONS_CATEGORIES).toContain(record.category);
			expect(record.note.trim()).not.toBe('');
			expect(record.sourceLabel.trim()).not.toBe('');
			expect(isSafeHttpsUrl(record.sourceUrl)).toBe(true);
		}
	});

	it('preserves the requested qualification categories', () => {
		const groups = {
			masters_all: [
				'FI', 'EE', 'FR', 'DE', 'IT', 'PL', 'CZ', 'SK',
				'PT', 'HR', 'SI', 'NO', 'IS', 'AT', 'LU',
			],
			masters_secondary_only: [
				'ES', 'SE', 'NL', 'BE', 'HU', 'RO', 'BG', 'LT',
				'LV', 'IE', 'MT', 'CH',
			],
			bachelors_all: ['UK', 'DK', 'EL', 'CY'],
		} as const;

		for (const [category, ids] of Object.entries(groups)) {
			for (const giscoId of ids) {
				expect(records[giscoId]?.category).toBe(category);
			}
		}
	});
});
