import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { Given, Then } = createBdd(test);

Given('I visit a missing page', async ({ notFoundPage }) => {
	await notFoundPage.visitMissingRoute();
});

Then('the custom not-found page is shown with a 404 response', async ({ notFoundPage }) => {
	expect(notFoundPage.getResponseStatus()).toBe(404);
	await expect(notFoundPage.heading).toBeVisible();
	await expect(notFoundPage.oxImage).toBeVisible();
	await expect(notFoundPage.oxImage).toHaveAttribute('loading', 'eager');
	await expect(notFoundPage.homeLink).toHaveAttribute('href', '/');
});
