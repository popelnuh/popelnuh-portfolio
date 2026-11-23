import { describe, expect, it } from 'vitest';
import { buildDatasetUrl, resolveDatasetFromSearch } from './urlState';

describe('resolveDatasetFromSearch', () => {
	const validKeys = ['childcare', 'school-uniforms'];

	it('returns a valid dataset key from the query string', () => {
		expect(resolveDatasetFromSearch('?dataset=school-uniforms', validKeys, 'childcare')).toBe(
			'school-uniforms',
		);
	});

	it('falls back for an unknown dataset key', () => {
		expect(resolveDatasetFromSearch('?dataset=unknown', validKeys, 'childcare')).toBe(
			'childcare',
		);
	});

	it('falls back when the query string is empty', () => {
		expect(resolveDatasetFromSearch('', validKeys, 'childcare')).toBe('childcare');
	});

	it('falls back when the dataset query is malformed', () => {
		expect(resolveDatasetFromSearch('?dataset=%E0%A4%A', validKeys, 'childcare')).toBe(
			'childcare',
		);
	});
});

describe('buildDatasetUrl', () => {
	it('adds a dataset query parameter to a clean URL', () => {
		expect(buildDatasetUrl('https://example.com/maps', 'school-uniforms')).toBe(
			'https://example.com/maps?dataset=school-uniforms',
		);
	});

	it('replaces an existing dataset parameter and preserves other parameters', () => {
		expect(
			buildDatasetUrl(
				'https://example.com/maps?dataset=childcare&source=blog',
				'school-uniforms',
			),
		).toBe('https://example.com/maps?dataset=school-uniforms&source=blog');
	});

	it('preserves the URL hash', () => {
		expect(
			buildDatasetUrl('https://example.com/maps#european-maps', 'school-uniforms'),
		).toBe('https://example.com/maps?dataset=school-uniforms#european-maps');
	});
});
