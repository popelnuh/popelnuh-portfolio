import type { Locator, Page } from '@playwright/test';
import { NavBarComponent } from '../components/NavBarComponent';

export class AboutPage {
	readonly nav: NavBarComponent;
	readonly heading: Locator;
	readonly linkedInLink: Locator;
	readonly githubLink: Locator;
	readonly emailLink: Locator;
	readonly bioCard: Locator;
	readonly aboutGrid: Locator;
	readonly glanceHeading: Locator;
	readonly location: Locator;
	readonly coreStack: Locator;
	readonly footer: Locator;

	constructor(private readonly page: Page) {
		this.nav = new NavBarComponent(page);
		this.heading = page.getByRole('heading', { name: 'Zlata Popelnuh', exact: true });
		this.linkedInLink = page.getByRole('link', { name: 'LinkedIn', exact: true });
		this.githubLink = page.getByRole('link', { name: 'GitHub', exact: true });
		this.emailLink = page.getByRole('link', { name: 'popelnuh@gmail.com', exact: true });
		this.bioCard = page.locator('.bio-card');
		this.aboutGrid = page.locator('.about-grid');
		this.glanceHeading = page.getByRole('heading', { name: 'At a Glance', exact: true });
		this.location = page.getByText('55.86° N, 4.25° W · Scotland, UK', { exact: true });
		this.coreStack = page.getByRole('list', { name: 'Core technologies' });
		this.footer = page.getByRole('contentinfo');
	}

	async goto(): Promise<void> {
		await this.page.goto('/about');
	}
}
