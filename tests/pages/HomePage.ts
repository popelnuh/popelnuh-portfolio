import type { Locator, Page } from '@playwright/test';
import { NavBarComponent } from '../components/NavBarComponent';

export class HomePage {
	readonly nav: NavBarComponent;
	readonly heading: Locator;
	readonly intro: Locator;
	readonly aboutLink: Locator;
	readonly exploreMapsLink: Locator;
	readonly focusAreas: Locator;
	readonly qualityFocusLink: Locator;
	readonly architectureFocusLink: Locator;
	readonly geospatialFocusLink: Locator;
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
		this.intro = page.getByText('I’m Zlata Popelnuh', { exact: false });
		this.aboutLink = page.getByRole('link', { name: 'Learn more about me', exact: true });
		this.exploreMapsLink = page.getByRole('link', { name: 'Explore Maps' });
		this.focusAreas = page.getByRole('region', { name: 'Focus Areas' });
		this.qualityFocusLink = page.getByTestId('focus-quality-link');
		this.architectureFocusLink = page.getByTestId('focus-architecture-link');
		this.geospatialFocusLink = page.getByTestId('focus-geospatial-link');
		this.svgFavicon = page.getByTestId('favicon-link');
		this.faviconLinks = page.getByTestId('favicon-link');
		this.descriptionMeta = page.getByTestId('description-meta');
		this.ogTitleMeta = page.getByTestId('og-title-meta');
		this.ogDescriptionMeta = page.getByTestId('og-description-meta');
		this.ogTypeMeta = page.getByTestId('og-type-meta');
		this.twitterCardMeta = page.getByTestId('twitter-card-meta');
	}

	async goto(): Promise<void> {
		await this.page.goto('/');
	}

	async openAbout(): Promise<void> {
		await this.aboutLink.click();
	}

	async openQualityFromFocusCard(): Promise<void> {
		await this.qualityFocusLink.click();
	}
}
