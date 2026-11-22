import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
	adaptSummerHolidayDataset,
} from '@/lib/adapters/summerHolidaysAdapter';
import { isSafeHttpsUrl } from '@/lib/adapters/schoolUniformsAdapter';

const dataset = JSON.parse(
	readFileSync(
		new URL('../../public/data/europe-summer-holidays.json', import.meta.url),
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
const records = adaptSummerHolidayDataset(dataset);

describe('summer holidays dataset integrity', () => {
	it('contains valid and unique GISCO records with positive durations and HTTPS sources', () => {
		const values = Object.values(records);

		expect(values).toHaveLength(33);
		expect(new Set(values.map(({ giscoId }) => giscoId)).size).toBe(values.length);

		for (const record of values) {
			expect(record.giscoId).toMatch(/^[A-Z]{2}$/);
			expect(giscoIds.has(record.giscoId)).toBe(true);
			expect(record.weeks).toBeGreaterThan(0);
			expect(Number.isFinite(record.weeks)).toBe(true);
			expect(record.note.trim()).not.toBe('');
			expect(record.sourceLabel.trim()).not.toBe('');
			expect(isSafeHttpsUrl(record.sourceUrl)).toBe(true);
		}
	});

	it('keeps the supplied representative summer break durations', () => {
		const expectedWeeks: Record<string, number> = {
			DE: 6,
			NL: 6,
			UK: 6,
			DK: 6,
			CH: 6,
			FR: 8,
			LI: 6,
			BE: 8.5,
			AT: 9,
			CZ: 9,
			SK: 9,
			PL: 9.5,
			NO: 8.5,
			SE: 9.5,
			IE: 9,
			LU: 8.5,
			SI: 10,
			FI: 10.5,
			ES: 11,
			HR: 11,
			HU: 11,
			RO: 11.5,
			BG: 12,
			CY: 11.5,
			EE: 12,
			IS: 11,
			IT: 13,
			LV: 13,
			LT: 12.5,
			MT: 12.5,
			EL: 12.5,
			PT: 12.5,
			AL: 13,
		};

		for (const [giscoId, weeks] of Object.entries(expectedWeeks)) {
			expect(records[giscoId]?.weeks).toBe(weeks);
		}
	});
});
