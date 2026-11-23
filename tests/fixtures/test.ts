import { expect } from '@playwright/test';
import { test as base } from 'playwright-bdd';
import { AboutPage } from '../pages/AboutPage';
import { BlogPage } from '../pages/BlogPage';
import { HomePage } from '../pages/HomePage';
import { MapsPage } from '../pages/MapsPage';

type PageFixtures = {
	aboutPage: AboutPage;
	blogPage: BlogPage;
	homePage: HomePage;
	mapsPage: MapsPage;
};

export const test = base.extend<PageFixtures>({
	aboutPage: async ({ page }, use) => {
		await use(new AboutPage(page));
	},
	blogPage: async ({ page }, use) => {
		await use(new BlogPage(page));
	},
	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},
	mapsPage: async ({ page }, use) => {
		await use(new MapsPage(page));
	},
});

export { expect };
