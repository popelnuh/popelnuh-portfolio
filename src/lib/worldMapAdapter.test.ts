import { describe, expect, it } from 'vitest';
import { resolveWorldFeatureIso3 } from './worldMapAdapter';

describe('resolveWorldFeatureIso3', () => {
	it('resolves standard Natural Earth ISO codes', () => {
		expect(resolveWorldFeatureIso3({ ISO_A3: 'EST' })).toBe('EST');
		expect(resolveWorldFeatureIso3({ 'ISO3166-1-Alpha-3': 'CAN' })).toBe('CAN');
	});

	it.each([
		['France', 'FRA'],
		['Norway', 'NOR'],
	])('falls back for the Natural Earth -99 code for %s', (name, expectedIso3) => {
		expect(
			resolveWorldFeatureIso3({
				ISO_A3: '-99',
				ISO_A3_EH: expectedIso3,
				ADMIN: name,
			}),
		).toBe(expectedIso3);
	});

	it('uses ADM0_A3 when the enhanced ISO code is unavailable', () => {
		expect(resolveWorldFeatureIso3({ ISO_A3: '-99', ADM0_A3: 'NOR' })).toBe('NOR');
	});

	it('falls back to known country names and rejects unknown codes', () => {
		expect(resolveWorldFeatureIso3({ ISO_A3: '-99', ADMIN: ' France ' })).toBe('FRA');
		expect(resolveWorldFeatureIso3({ ISO_A3: '-99', ADMIN: 'Unknownland' })).toBeNull();
		expect(resolveWorldFeatureIso3({ ISO_A3: '???' })).toBeNull();
		expect(resolveWorldFeatureIso3(null)).toBeNull();
	});
});
