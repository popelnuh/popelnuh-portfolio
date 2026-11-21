import { expect, test } from '@playwright/test';

test('home page links to the about page', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
	await page.getByRole('link', { name: 'Learn more about me' }).click();

	await expect(page).toHaveURL(/\/about\/?$/);
	await expect(page.getByRole('heading', { name: 'Zlata Popelnuh' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
		'href',
		'https://linkedin.com/in/zlata-popelnuh',
	);
	await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
		'href',
		'https://github.com/popelnuh',
	);
});
