import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { Given, When, Then } = createBdd(test);

When('I open Blog from the header navigation', async ({ blogPage }) => {
	await blogPage.openBlogFromNavigation();
});

Given('I open the Blog page', async ({ blogPage }) => {
	await blogPage.goto();
});

When('I open the starter essay', async ({ blogPage }) => {
	await blogPage.openStarterEssay();
});

Then('the Blog index lists published essays without browser errors', async ({ blogPage }) => {
	await expect(blogPage.heading).toBeVisible();
	await expect(blogPage.publishedEssays).toBeVisible();
	await expect(blogPage.essayCards).toHaveCount(1);
	await expect(blogPage.starterEssayLink).toBeVisible();
	expect(blogPage.getErrors()).toEqual([]);
});

Then('the starter essay shows its title, reading time, and prose', async ({ blogPage }) => {
	await expect(blogPage.essayHeading).toBeVisible();
	await expect(blogPage.readingTime).toBeVisible();
	await expect(blogPage.essayArticle).toContainText(
		'School feels familiar almost everywhere',
	);
	expect(blogPage.getErrors()).toEqual([]);
});

Then('the related map link targets the Summer Holidays dataset', async ({ blogPage }) => {
	await expect(blogPage.relatedMapLink).toHaveAttribute(
		'href',
		'/maps?dataset=summer-holidays',
	);
});

When('I follow the related map link', async ({ blogPage }) => {
	await blogPage.followRelatedMapLink();
});

Then('the Summer Holidays dataset is active', async ({ blogPage, mapsPage }) => {
	await expect(mapsPage.summerHolidaysTab).toHaveAttribute('aria-selected', 'true');
	await expect(mapsPage.summerHolidaysHeading).toBeVisible();
	expect(new URL(blogPage.getCurrentUrl()).searchParams.get('dataset')).toBe('summer-holidays');
	expect(blogPage.getErrors()).toEqual([]);
});
