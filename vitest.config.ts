import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	test: {
		environment: 'node',
		include: ['src/lib/**/*.test.ts'],
		clearMocks: true,
		restoreMocks: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'json-summary'],
			reportsDirectory: './coverage',
			exclude: [
				'node_modules/',
				'**/*.test.{js,ts}',
				'**/*.spec.{js,ts}',
				'**/*config.{js,ts,mjs,cjs}',
			],
		},
	},
});
