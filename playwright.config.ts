import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const bddTestDir = defineBddConfig({
	features: 'tests/features/**/*.feature',
	steps: ['tests/steps/**/*.ts', 'tests/fixtures/**/*.ts'],
});

export default defineConfig({
	testDir: './tests',
	projects: [
		{
			name: 'e2e',
			testMatch: '**/*.spec.ts',
		},
		{
			name: 'bdd',
			testDir: bddTestDir,
		},
	],
	use: {
		baseURL: 'http://localhost:4321',
	},
	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:4321',
		reuseExistingServer: !process.env.CI,
	},
});
