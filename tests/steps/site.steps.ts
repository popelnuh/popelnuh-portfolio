import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { Given, When, Then } = createBdd(test);

Given('I open the home page', async ({ homePage }) => {
	await homePage.goto();
});

Then('the home page introduces the portfolio', async ({ homePage }) => {
	await expect(homePage.heading).toHaveText('Testing complex systems. Mapping data.');
	await expect(homePage.intro).toContainText('turn public datasets into interactive maps.');
});

Then('the home page exposes favicon and social metadata', async ({ homePage }) => {
	await expect(homePage.svgFavicon).toHaveAttribute('href', '/favicon.svg');
	await expect(homePage.descriptionMeta).toHaveAttribute(
		'content',
		'Senior Test Automation Engineer & GIS specialist. Interactive European data maps, clean architecture, and Playwright automation.',
	);
	await expect(homePage.ogTitleMeta).toHaveAttribute('content', 'Home | Zlata Popelnuh');
	await expect(homePage.ogDescriptionMeta).toHaveAttribute(
		'content',
		'Senior Test Automation Engineer & GIS specialist. Interactive European data maps, clean architecture, and Playwright automation.',
	);
	await expect(homePage.ogTypeMeta).toHaveAttribute('content', 'website');
	await expect(homePage.twitterCardMeta).toHaveAttribute('content', 'summary');
});

Then('the home page shows three focus areas', async ({ homePage }) => {
	const cards = homePage.focusAreas.getByRole('article');
	await expect(cards).toHaveCount(3);
	await expect(cards.nth(0).getByRole('heading', { name: 'Test Automation & Reliability' }))
		.toBeVisible();
	await expect(cards.nth(1).getByRole('heading', { name: 'Interactive European Maps' }))
		.toBeVisible();
	await expect(cards.nth(2).getByRole('heading', { name: 'Clean Patterns & AI Validation' }))
		.toBeVisible();
});

Then('the home page offers Maps and About links', async ({ homePage }) => {
	await expect(homePage.exploreMapsLink).toHaveAttribute('href', '/maps');
	await expect(homePage.aboutLink).toHaveAttribute('href', '/about');
});

Given('I open the About page', async ({ aboutPage }) => {
	await aboutPage.goto();
});

Then('the About page shows the profile and location', async ({ aboutPage }) => {
	await expect(aboutPage.heading).toBeVisible();
	await expect(aboutPage.bioCard).toBeVisible();
	await expect(aboutPage.glanceHeading).toBeVisible();
	await expect(aboutPage.location).toBeVisible();
});

Then('the About page lists its core stack', async ({ aboutPage }) => {
	await expect(aboutPage.coreStack.getByRole('listitem')).toHaveText([
		'Playwright',
		'TypeScript',
		'C#',
		'Python',
		'Azure DevOps',
		'GIS',
		'QGIS',
		'Astro',
	]);
});

Then('the About page provides LinkedIn, GitHub, and email links', async ({ aboutPage }) => {
	await expect(aboutPage.linkedInLink).toHaveAttribute(
		'href',
		'https://linkedin.com/in/zlata-popelnuh',
	);
	await expect(aboutPage.githubLink).toHaveAttribute('href', 'https://github.com/popelnuh');
	await expect(aboutPage.emailLink).toHaveAttribute('href', 'mailto:popelnuh@gmail.com');
});

When('I click the email link', async ({ aboutPage }) => {
	await aboutPage.clickEmailLink();
});

Then('the page confirms the email address was copied', async ({ aboutPage }) => {
	await expect(aboutPage.emailStatus).toHaveText(
		'Email address copied to clipboard: popelnuh@gmail.com.',
	);
});

Then('the About navigation link is active', async ({ aboutPage }) => {
	await expect(aboutPage.nav.aboutLink).toHaveAttribute('aria-current', 'page');
});

Then('the site footer is visible', async ({ aboutPage }) => {
	await expect(aboutPage.footer).toContainText(
		'© 2026 Zlata Popelnuh · Built with Astro & tested with Playwright',
	);
	const playwrightLink = aboutPage.footer.getByRole('link', { name: 'Playwright', exact: true });
	await expect(playwrightLink).toHaveAttribute(
		'href',
		'https://github.com/popelnuh/popelnuh-portfolio',
	);
	await expect(playwrightLink).toHaveAttribute('target', '_blank');
	await expect(playwrightLink).toHaveAttribute('rel', 'noopener noreferrer');
	const actionsBadge = aboutPage.footer.getByRole('link', {
		name: 'GitHub Actions workflow status',
	});
	await expect(actionsBadge).toHaveAttribute(
		'href',
		'https://github.com/popelnuh/popelnuh-portfolio/actions',
	);
	const badgeImage = actionsBadge.getByRole('img', { name: 'GitHub Actions status' });
	await expect(badgeImage).toHaveAttribute(
		'src',
		'https://github.com/popelnuh/popelnuh-portfolio/actions/workflows/azure-static-web-apps-salmon-water-0ad7f5510.yml/badge.svg',
	);
	await expect(badgeImage).not.toHaveAttribute('width');
	await expect(badgeImage).toHaveCSS('height', '20px');
	await expect(actionsBadge).toHaveCSS('flex-shrink', '0');
});

Then('the profile grid has two columns on desktop', async ({ aboutPage }) => {
	const columnCount = await aboutPage.aboutGrid.evaluate(
		(element) => getComputedStyle(element).gridTemplateColumns.split(/\s+/).length,
	);
	expect(columnCount).toBe(2);
});

When('I view the About page on mobile', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
});

Then('the profile grid stacks into one column', async ({ aboutPage }) => {
	const columnCount = await aboutPage.aboutGrid.evaluate(
		(element) => getComputedStyle(element).gridTemplateColumns.split(/\s+/).length,
	);
	expect(columnCount).toBe(1);
});
