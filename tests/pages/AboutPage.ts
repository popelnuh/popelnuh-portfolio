import type { Locator, Page } from '@playwright/test';
import { NavBarComponent } from '../components/NavBarComponent';

export class AboutPage {
	readonly nav: NavBarComponent;
	readonly heading: Locator;
	readonly linkedInLink: Locator;
	readonly githubLink: Locator;

	constructor(private readonly page: Page) {
		this.nav = new NavBarComponent(page);
		this.heading = page.getByRole('heading', { name: 'Zlata Popelnuh', exact: true });
		this.linkedInLink = page.getByRole('link', { name: 'LinkedIn', exact: true });
		this.githubLink = page.getByRole('link', { name: 'GitHub', exact: true });
	}

	async goto(): Promise<void> {
		await this.page.goto('/about');
	}
}
