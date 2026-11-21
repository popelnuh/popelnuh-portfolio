import { expect, test as base } from '@playwright/test';
import { AboutPage } from '../pages/AboutPage';
import { HomePage } from '../pages/HomePage';
import { MapsPage } from '../pages/MapsPage';

type PageFixtures = {
	aboutPage: AboutPage;
	homePage: HomePage;
	mapsPage: MapsPage;
};

export const test = base.extend<PageFixtures>({
	aboutPage: async ({ page }, use) => {
		await use(new AboutPage(page));
	},
	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},
	mapsPage: async ({ page }, use) => {
		await use(new MapsPage(page));
	},
});

export { expect };
