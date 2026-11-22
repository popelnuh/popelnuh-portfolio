import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
	adaptSchoolUniformsDataset,
	isSafeHttpsUrl,
	SCHOOL_UNIFORM_CATEGORIES,
} from '@/lib/adapters/schoolUniformsAdapter';

const dataset = JSON.parse(
	readFileSync(new URL('../../public/data/europe-school-uniforms.json', import.meta.url), 'utf8'),
) as unknown;
const boundaries = JSON.parse(
	readFileSync(new URL('../../public/data/europe-countries.geojson', import.meta.url), 'utf8'),
) as {
	features: Array<{ properties: { CNTR_ID: string } }>;
};
const records = adaptSchoolUniformsDataset(dataset);

describe('school uniforms dataset integrity', () => {
	it('covers each GISCO country with valid category, policy note, and HTTPS source', () => {
		const expectedIds = boundaries.features.map(({ properties }) => properties.CNTR_ID).sort();
		const recordsById = Object.values(records);

		expect(Object.keys(records).sort()).toEqual(expectedIds);

		for (const record of recordsById) {
			expect(record.giscoId).toMatch(/^[A-Z]{2}$/);
			expect(SCHOOL_UNIFORM_CATEGORIES).toContain(record.category);
			expect(record.note.trim()).not.toBe('');
			expect(record.sourceLabel.trim()).not.toBe('');
			expect(isSafeHttpsUrl(record.sourceUrl)).toBe(true);
		}
	});

	it('keeps the requested policy classifications for standout country groups', () => {
		for (const giscoId of ['UK', 'IE', 'MT', 'CY', 'TR']) {
			expect(records[giscoId]?.category).toBe('standard');
		}

		for (const giscoId of ['DK', 'FO', 'FI', 'IS', 'NO', 'SE', 'DE', 'AT', 'NL', 'CH']) {
			expect(records[giscoId]?.category).toBe('not_used');
		}
	});
});
