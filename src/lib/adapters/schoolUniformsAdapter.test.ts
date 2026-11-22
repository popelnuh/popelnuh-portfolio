import { describe, expect, it } from 'vitest';
import {
	adaptSchoolUniformsDataset,
	isSafeHttpsUrl,
} from '@/lib/adapters/schoolUniformsAdapter';

function makeRecord(overrides: Record<string, unknown> = {}) {
	return {
		giscoId: 'UK',
		country: 'United Kingdom',
		category: 'standard',
		note: 'Uniform use is set by individual schools.',
		sourceLabel: 'UK Department for Education',
		sourceUrl: 'https://www.gov.uk/example',
		...overrides,
	};
}

function makeDataset(values: unknown[] = [makeRecord()]) {
	return {
		dataset: 'School Uniform Policies Across Europe',
		referencePeriod: '2024–2026',
		values,
	};
}

describe('adaptSchoolUniformsDataset', () => {
	it('indexes valid records by GISCO ID', () => {
		const records = adaptSchoolUniformsDataset(makeDataset());

		expect(records.UK).toEqual(makeRecord());
	});

	it.each([
		['invalid GISCO ID', makeRecord({ giscoId: 'GBR' }), 'Invalid GISCO ID'],
		['unknown category', makeRecord({ category: 'sometimes' }), 'Invalid school uniform category'],
		['empty policy note', makeRecord({ note: ' ' }), 'Invalid note'],
		['non-HTTPS source', makeRecord({ sourceUrl: 'http://example.test/source' }), 'Invalid HTTPS source URL'],
	])('rejects %s', (_case, record, message) => {
		expect(() => adaptSchoolUniformsDataset(makeDataset([record]))).toThrow(message);
	});

	it('rejects duplicate GISCO IDs', () => {
		expect(() =>
			adaptSchoolUniformsDataset(makeDataset([makeRecord(), makeRecord()])),
		).toThrow('Duplicate GISCO ID UK');
	});

	it('accepts only well-formed HTTPS URLs', () => {
		expect(isSafeHttpsUrl('https://example.test/source')).toBe(true);
		expect(isSafeHttpsUrl('https://')).toBe(false);
		expect(isSafeHttpsUrl('/relative/source')).toBe(false);
		expect(isSafeHttpsUrl('http://example.test/source')).toBe(false);
		expect(isSafeHttpsUrl('javascript:alert(1)')).toBe(false);
	});
});
