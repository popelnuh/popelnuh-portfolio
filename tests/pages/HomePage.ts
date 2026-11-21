import type { Locator, Page } from '@playwright/test';
import { NavBarComponent } from '../components/NavBarComponent';

export class HomePage {
	readonly nav: NavBarComponent;
	readonly heading: Locator;
	readonly aboutLink: Locator;

	constructor(private readonly page: Page) {
		this.nav = new NavBarComponent(page);
		this.heading = page.getByRole('heading', { name: 'Welcome' });
		this.aboutLink = page.getByRole('link', { name: 'Learn more about me' });
	}

	async goto(): Promise<void> {
		await this.page.goto('/');
	}

	async openAbout(): Promise<void> {
		await this.aboutLink.click();
	}
}
