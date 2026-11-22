import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { Given, When, Then } = createBdd(test);

Given('I open the Maps page', async ({ mapsPage }) => {
	await mapsPage.goto();
});

Then('the map is visible', async ({ mapsPage }) => {
	await expect(mapsPage.heading).toBeVisible();
	await expect(mapsPage.map).toBeVisible();
	await expect(mapsPage.leafletContainer).toBeVisible();
});

Then('Spain is available on the map', async ({ mapsPage }) => {
	await expect(mapsPage.spainRegion).toBeVisible();
});

Then('countries without a metric are styled as no data', async ({ mapsPage }) => {
	await expect(mapsPage.countryWithoutMetric).toHaveAttribute('fill', '#e5e7eb');
});

Then('the map credits the administrative boundaries', async ({ mapsPage }) => {
	await expect(mapsPage.attribution).toContainText(
		'EuroGeographics for the administrative boundaries',
	);
});

When('I select Spain', async ({ mapsPage }) => {
	await mapsPage.selectCountry('ES');
});

Then("the popup shows Spain's renewable energy share", async ({ mapsPage }) => {
	await expect(mapsPage.popup).toBeVisible();
	await expect(mapsPage.popup).toContainText('Spain');
	await expect(mapsPage.popup).toContainText('25.0%');
});

When('I select the UK', async ({ mapsPage }) => {
	await mapsPage.selectCountry('UK');
});

Then('the popup identifies the UK value as an estimate', async ({ mapsPage }) => {
	await expect(mapsPage.ukRegion).toBeVisible();
	await expect(mapsPage.popup).toContainText('14.5% (estimate)');
});

When('I select Türkiye', async ({ mapsPage }) => {
	await mapsPage.selectCountry('TR');
});

Then('the popup reports that Türkiye has no data', async ({ mapsPage }) => {
	await expect(mapsPage.popup).toContainText('Türkiye');
	await expect(mapsPage.popup).toContainText('no data');
});
