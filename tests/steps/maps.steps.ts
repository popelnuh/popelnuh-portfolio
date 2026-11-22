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

Then('the reset view control is available and works without browser errors', async ({ mapsPage }) => {
	await expect(mapsPage.resetViewControl).toBeVisible();
	await mapsPage.zoomInAndReset();
	expect(mapsPage.getErrors()).toEqual([]);
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
	await expect(mapsPage.popup).toContainText('(2024): 25.4%');
});

When('I select the UK', async ({ mapsPage }) => {
	await mapsPage.selectCountry('UK');
});

Then('the UK is shown without a reported renewable-energy value', async ({ mapsPage }) => {
	await expect(mapsPage.ukRegion).toBeVisible();
	await expect(mapsPage.ukRegion).toHaveAttribute('fill', '#e5e7eb');
});

Then('the popup reports that the UK has no data', async ({ mapsPage }) => {
	await expect(mapsPage.popup).toContainText('United Kingdom');
	await expect(mapsPage.popup).toContainText('no data');
});

When('I select Türkiye', async ({ mapsPage }) => {
	await mapsPage.selectCountry('TR');
});

Then('the popup reports that Türkiye has no data', async ({ mapsPage }) => {
	await expect(mapsPage.popup).toContainText('Türkiye');
	await expect(mapsPage.popup).toContainText('no data');
});

When('I switch to the Childcare Costs map', async ({ mapsPage }) => {
	await mapsPage.selectChildcareMap();
});

Then('the childcare heading, legend, and source are shown', async ({ mapsPage }) => {
	await expect(mapsPage.status).toHaveText('Map data loaded. Select a country for details.');
	await expect(mapsPage.childcareHeading).toBeVisible();
	await expect(mapsPage.childcareLegend).toBeVisible();
	await expect(mapsPage.childcareLegend).toContainText('15%+');
	await expect(mapsPage.childcareSwatch).toHaveCSS('width', '14px');
	await expect(mapsPage.childcareSwatch).toHaveCSS('height', '14px');
	await expect(mapsPage.childcareSource).toHaveAttribute('href', /data-explorer\.oecd\.org/);
});

Then('the childcare map renders without browser errors', async ({ mapsPage }) => {
	await expect(mapsPage.countryWithoutMetric).toBeVisible();
	await expect(mapsPage.countryWithoutMetric).toHaveAttribute('fill', '#e2e8f0');
	await expect(mapsPage.geoJsonRegions.first()).toBeVisible();
	expect(mapsPage.getErrors()).toEqual([]);
});

Then('the popup shows the UK childcare cost from OECD', async ({ mapsPage }) => {
	await expect(mapsPage.popup).toContainText('18.0% of disposable household income (2023)');
});

When('I select Greece', async ({ mapsPage }) => {
	await mapsPage.selectCountry('EL');
});

Then("the popup shows Greece's childcare cost from OECD", async ({ mapsPage }) => {
	await expect(mapsPage.popup).toContainText('Greece');
	await expect(mapsPage.popup).toContainText('7.0% of disposable household income (2023)');
});

When('I select Estonia', async ({ mapsPage }) => {
	await mapsPage.selectCountry('EE');
});

Then("the popup shows Estonia's childcare cost from OECD", async ({ mapsPage }) => {
	await expect(mapsPage.popup).toContainText('Estonia');
	await expect(mapsPage.popup).toContainText('3.0% of disposable household income (2023)');
});

When('I hover Türkiye', async ({ mapsPage }) => {
	await mapsPage.hoverCountryWithoutOECDData();
});

Then("Türkiye's tooltip explains that OECD data is unavailable", async ({ mapsPage }) => {
	await expect(mapsPage.tooltip).toContainText('Türkiye');
	await expect(mapsPage.tooltip).toContainText('No OECD data available');
	await expect(mapsPage.tooltip).not.toContainText(/undefined|NaN/);
});
