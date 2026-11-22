import type { Locator, Page } from '@playwright/test';
import { NavBarComponent } from '../components/NavBarComponent';

export class HomePage {
	readonly nav: NavBarComponent;
	readonly heading: Locator;
	readonly intro: Locator;
	readonly aboutLink: Locator;
	readonly exploreMapsLink: Locator;
	readonly focusAreas: Locator;

	constructor(private readonly page: Page) {
		this.nav = new NavBarComponent(page);
		this.heading = page.getByRole('heading', { level: 1 });
		this.intro = page.locator('.intro');
		this.aboutLink = page.getByRole('link', { name: 'Learn more about me', exact: true });
		this.exploreMapsLink = page.getByRole('link', { name: 'Explore Maps' });
		this.focusAreas = page.getByRole('region', { name: 'Focus Areas' });
	}

	async goto(): Promise<void> {
		await this.page.goto('/');
	}

	async openAbout(): Promise<void> {
		await this.aboutLink.click();
	}
}
