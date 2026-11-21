import { expect, test } from './fixtures/test';

test('home page links to the about page', async ({ homePage, aboutPage }) => {
	await homePage.goto();

	await expect(homePage.heading).toBeVisible();
	await expect(homePage.nav.mapsLink).toHaveAttribute('href', '/maps');
	await homePage.openAbout();

	await expect(aboutPage.heading).toBeVisible();
	await expect(aboutPage.linkedInLink).toHaveAttribute(
		'href',
		'https://linkedin.com/in/zlata-popelnuh',
	);
	await expect(aboutPage.githubLink).toHaveAttribute(
		'href',
		'https://github.com/popelnuh',
	);
});

test('maps page renders an interactive choropleth', async ({ mapsPage }) => {
	await mapsPage.goto();

	await expect(mapsPage.heading).toBeVisible();
	await expect(mapsPage.map).toBeVisible();
	await expect(mapsPage.leafletContainer).toBeVisible();
	await expect(mapsPage.spainRegion).toBeVisible();
	await expect(mapsPage.countryWithoutMetric).toHaveAttribute('fill', '#e5e7eb');
	await expect(mapsPage.attribution).toContainText(
		'EuroGeographics for the administrative boundaries',
	);
	await mapsPage.selectCountry('ES');
	await expect(mapsPage.popup).toBeVisible();
	await expect(mapsPage.popup).toContainText('Spain');
	await expect(mapsPage.popup).toContainText('25.0%');
});

test('map popups identify estimated and missing metric values', async ({ mapsPage }) => {
	await mapsPage.goto();

	await expect(mapsPage.ukRegion).toBeVisible();
	await mapsPage.selectCountry('UK');
	await expect(mapsPage.popup).toContainText('14.5% (estimate)');

	await mapsPage.selectCountry('TR');
	await expect(mapsPage.popup).toContainText('Türkiye');
	await expect(mapsPage.popup).toContainText('no data');
});
