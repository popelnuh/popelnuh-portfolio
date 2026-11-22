import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { adaptSchoolStartingAgeDataset } from '@/lib/adapters/schoolStartingAgeAdapter';
import { isSafeHttpsUrl } from '@/lib/adapters/schoolUniformsAdapter';

const dataset = JSON.parse(
	readFileSync(
		new URL('../../public/data/europe-school-starting-age.json', import.meta.url),
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
const records = adaptSchoolStartingAgeDataset(dataset);

describe('school starting age dataset integrity', () => {
	it('contains valid and unique GISCO records with realistic ages and HTTPS sources', () => {
		const values = Object.values(records);

		expect(values).toHaveLength(31);
		expect(new Set(values.map(({ giscoId }) => giscoId)).size).toBe(values.length);

		for (const record of values) {
			expect(record.giscoId).toMatch(/^[A-Z]{2}$/);
			expect(giscoIds.has(record.giscoId)).toBe(true);
			expect(record.age).toBeGreaterThanOrEqual(3);
			expect(record.age).toBeLessThanOrEqual(8);
			expect(Number.isFinite(record.age)).toBe(true);
			expect(record.note.trim()).not.toBe('');
			expect(record.sourceLabel.trim()).not.toBe('');
			expect(isSafeHttpsUrl(record.sourceUrl)).toBe(true);
		}
	});

	it('preserves the specified compulsory starting ages', () => {
		const expectedAges: Record<string, number> = {
			FR: 3,
			HU: 3,
			LU: 4,
			CH: 4,
			EL: 4,
			CY: 4.5,
			UK: 5,
			NL: 5,
			BE: 5,
			MT: 5,
			AT: 5,
			CZ: 5,
			SK: 5,
			LV: 5,
			BG: 5,
			DE: 6,
			ES: 6,
			IT: 6,
			PT: 6,
			IE: 6,
			PL: 6,
			NO: 6,
			SE: 6,
			FI: 6,
			DK: 6,
			IS: 6,
			SI: 6,
			HR: 6,
			RO: 6,
			LT: 6,
			EE: 7,
		};

		for (const [giscoId, age] of Object.entries(expectedAges)) {
			expect(records[giscoId]?.age).toBe(age);
		}
	});
});
