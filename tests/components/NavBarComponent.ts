import type { Locator, Page } from '@playwright/test';

export class NavBarComponent {
	readonly homeLink: Locator;
	readonly aboutLink: Locator;
	readonly mapsLink: Locator;

	constructor(page: Page) {
		const navigation = page.getByRole('navigation', { name: 'Main navigation' });

		this.homeLink = navigation.getByRole('link', { name: 'Home', exact: true });
		this.aboutLink = navigation.getByRole('link', { name: 'About', exact: true });
		this.mapsLink = navigation.getByRole('link', { name: 'Maps', exact: true });
	}
}
