import type { Locator, Page } from '@playwright/test';
import { NavBarComponent } from '../components/NavBarComponent';

export class HomePage {
	readonly nav: NavBarComponent;
	readonly heading: Locator;
	readonly intro: Locator;
	readonly aboutLink: Locator;
	readonly exploreMapsLink: Locator;
	readonly focusAreas: Locator;
	readonly svgFavicon: Locator;
	readonly faviconLinks: Locator;
	readonly descriptionMeta: Locator;
	readonly ogTitleMeta: Locator;
	readonly ogDescriptionMeta: Locator;
	readonly ogTypeMeta: Locator;
	readonly twitterCardMeta: Locator;

	constructor(private readonly page: Page) {
		this.nav = new NavBarComponent(page);
		this.heading = page.getByRole('heading', { level: 1 });
		this.intro = page.locator('.intro');
		this.aboutLink = page.getByRole('link', { name: 'Learn more about me', exact: true });
		this.exploreMapsLink = page.getByRole('link', { name: 'Explore Maps' });
		this.focusAreas = page.getByRole('region', { name: 'Focus Areas' });
		this.svgFavicon = page.locator('link[rel="icon"][type="image/svg+xml"]');
		this.faviconLinks = page.locator('link[rel="icon"]');
		this.descriptionMeta = page.locator('meta[name="description"]');
		this.ogTitleMeta = page.locator('meta[property="og:title"]');
		this.ogDescriptionMeta = page.locator('meta[property="og:description"]');
		this.ogTypeMeta = page.locator('meta[property="og:type"]');
		this.twitterCardMeta = page.locator('meta[name="twitter:card"]');
	}

	async goto(): Promise<void> {
		await this.page.goto('/');
	}

	async openAbout(): Promise<void> {
		await this.aboutLink.click();
	}
}
