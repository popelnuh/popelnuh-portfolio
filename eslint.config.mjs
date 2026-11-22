import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

const playwrightRecommended = playwright.configs['flat/recommended'];

export default defineConfig(
	{
		ignores: ['dist/**', '.astro/**', 'playwright-report/**', 'test-results/**'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['tests/**/*.ts'],
		...playwrightRecommended,
		rules: {
			...playwrightRecommended.rules,
			'playwright/no-wait-for-timeout': 'error',
			'playwright/no-skipped-test': 'error',
			'playwright/no-focused-test': 'error',
			'playwright/prefer-web-first-assertions': 'error',
			'playwright/prefer-native-locators': 'error',
			'playwright/no-raw-locators': 'warn',
		},
	},
	{
		files: ['tests/steps/**/*.ts'],
		rules: {
			'playwright/no-standalone-expect': 'off',
		},
	},
);
