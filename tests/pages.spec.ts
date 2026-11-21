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

test('maps page renders an interactive choropleth', async ({ page }) => {
	await page.goto('/maps');

	const map = page.getByTestId('leaflet-map');
	const polygon = page.locator('.leaflet-overlay-pane path').first();

	await expect(map).toBeVisible();
	await expect(page.locator('.leaflet-container')).toBeVisible();
	await expect(polygon).toBeVisible();
	await polygon.click();
	await expect(page.locator('.leaflet-popup')).toBeVisible();
	await expect(page.locator('.leaflet-popup-content')).toContainText('Spain');
});
