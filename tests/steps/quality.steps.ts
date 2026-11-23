import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { Given, When, Then } = createBdd(test);

Given('I open the homepage while monitoring the Quality flow', async ({ homePage, qualityPage }) => {
	await homePage.goto();
	expect(qualityPage.getErrors()).toEqual([]);
});

Given('I open the Quality page', async ({ qualityPage }) => {
	await qualityPage.goto();
});

When('I open Quality from the QUALITY focus card', async ({ homePage }) => {
	await homePage.openQualityFromFocusCard();
});

When('I view the Quality page on mobile', async ({ qualityPage }) => {
	await qualityPage.viewOnMobile();
});

Then('the Quality page exposes its status badges and engineering sections', async ({ qualityPage }) => {
	await expect(qualityPage.statusBadges).toHaveCount(3);
	await expect(qualityPage.testPyramidHeading).toBeVisible();
	await expect(qualityPage.monitoringHeading).toBeVisible();
	await expect(qualityPage.guardrailsHeading).toBeVisible();
	await expect(qualityPage.inspectCodeHeading).toBeVisible();
	expect(qualityPage.getErrors()).toEqual([]);
});

Then('the Quality page fits without horizontal scrolling', async ({ qualityPage }) => {
	await expect(qualityPage.heading).toBeVisible();
	expect(await qualityPage.hasHorizontalOverflow()).toBe(false);
	expect(qualityPage.getErrors()).toEqual([]);
});

Then('the workflow descriptions include spaces around their links', async ({ qualityPage }) => {
	await expect(qualityPage.unitPipelineCard).toContainText(
		'The unit tests workflow runs Vitest',
	);
	await expect(qualityPage.azurePipelineCard).toContainText(
		'The Azure deployment workflow builds',
	);
	await expect(qualityPage.livePipelineCard).toContainText(
		'The scheduled E2E workflow runs Playwright',
	);
	expect(qualityPage.getErrors()).toEqual([]);
});

Then(
	'the Quality page shows its live report and code links without browser errors',
	async ({ qualityPage }) => {
		expect(qualityPage.getCurrentUrl()).toMatch(/\/quality\/?$/);
		await expect(qualityPage.heading).toHaveText('How This Site Is Tested');
		await expect(qualityPage.statusStrip).toBeVisible();
		await expect(qualityPage.reportLink).toHaveAttribute(
			'href',
			'https://popelnuh.github.io/popelnuh-portfolio/',
		);
		await expect(qualityPage.reportLink).toHaveAttribute('target', '_blank');
		await expect(qualityPage.reportLink).toHaveAttribute('rel', 'noopener noreferrer');
		await expect(qualityPage.codeLinks.getByRole('link')).toHaveCount(5);
		await expect(qualityPage.agentsLink).toHaveAttribute(
			'href',
			'https://github.com/popelnuh/popelnuh-portfolio/blob/main/AGENTS.md',
		);
		await expect(qualityPage.playwrightConfigLink).toHaveAttribute(
			'href',
			'https://github.com/popelnuh/popelnuh-portfolio/blob/main/playwright.config.ts',
		);
		await expect(qualityPage.featuresLink).toHaveAttribute(
			'href',
			'https://github.com/popelnuh/popelnuh-portfolio/tree/main/tests/features',
		);
		await expect(qualityPage.pagesLink).toHaveAttribute(
			'href',
			'https://github.com/popelnuh/popelnuh-portfolio/tree/main/tests/pages',
		);
		await expect(qualityPage.workflowsLink).toHaveAttribute(
			'href',
			'https://github.com/popelnuh/popelnuh-portfolio/tree/main/.github/workflows',
		);
		await expect(qualityPage.footerQualityLink).toHaveAttribute('href', '/quality');
		expect(qualityPage.getErrors()).toEqual([]);
	},
);
