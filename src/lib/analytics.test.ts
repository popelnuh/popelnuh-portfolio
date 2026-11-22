import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackEvent } from './analytics';

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllEnvs();
});

describe('trackEvent', () => {
	it('handles events without properties', () => {
		vi.stubEnv('DEV', true);
		const debug = vi.spyOn(console, 'debug').mockImplementation(() => {});

		expect(() => trackEvent('nav-home')).not.toThrow();
		expect(debug).toHaveBeenCalledWith('[analytics]', 'nav-home', undefined);
	});

	it('handles events with string properties', () => {
		vi.stubEnv('DEV', true);
		const debug = vi.spyOn(console, 'debug').mockImplementation(() => {});
		const properties = { dataset: 'school-uniforms' };

		expect(() => trackEvent('map-tab-switch', properties)).not.toThrow();
		expect(debug).toHaveBeenCalledWith('[analytics]', 'map-tab-switch', properties);
	});
});
