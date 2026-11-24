import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface StaticWebAppConfig {
	globalHeaders: Record<string, string>;
	responseOverrides?: Record<string, { rewrite: string; statusCode: number }>;
}

const config = JSON.parse(
	readFileSync(new URL('../../public/staticwebapp.config.json', import.meta.url), 'utf8'),
) as StaticWebAppConfig;

describe('Azure Static Web Apps configuration', () => {
	it('defines the required security headers and runtime CSP sources', () => {
		expect(config.globalHeaders).toMatchObject({
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'DENY',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
			'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
			'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
		});

		const policy = config.globalHeaders['Content-Security-Policy'];
		expect(policy).toBeDefined();
		for (const directive of [
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline'",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data: https://img.shields.io",
			"connect-src 'self'",
			"frame-ancestors 'none'",
			"base-uri 'self'",
			"form-action 'self'",
		]) {
			expect(policy).toContain(directive);
		}
	});

	it('rewrites not-found responses to the custom page without changing the status', () => {
		expect(config.responseOverrides?.['404']).toEqual({
			rewrite: '/404',
			statusCode: 404,
		});
	});
});
