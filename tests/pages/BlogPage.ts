import type { Locator, Page } from '@playwright/test';
import { NavBarComponent } from '../components/NavBarComponent';

export class BlogPage {
	readonly nav: NavBarComponent;
	readonly heading: Locator;
	readonly publishedEssays: Locator;
	readonly essayCards: Locator;
	readonly starterEssayLink: Locator;
	readonly essayHeading: Locator;
	readonly readingTime: Locator;
	readonly essayArticle: Locator;
	readonly relatedMapLink: Locator;
	private readonly browserErrors: string[] = [];

	constructor(private readonly page: Page) {
		this.nav = new NavBarComponent(page);
		this.heading = page.getByTestId('blog-heading');
		this.publishedEssays = page.getByTestId('blog-published-essays');
		this.essayCards = page.getByTestId('blog-post-card');
		this.starterEssayLink = page
			.getByTestId('blog-post-entry-european-school-differences')
			.getByTestId('blog-post-card');
		this.essayHeading = page.getByTestId('blog-essay-title');
		this.readingTime = page.getByTestId('blog-reading-time');
		this.essayArticle = page.getByTestId('blog-essay-content');
		this.relatedMapLink = page.getByTestId('blog-related-map-link');

		page.on('pageerror', (error) => this.browserErrors.push(error.message));
		page.on('console', (message) => {
			if (message.type() === 'error') this.browserErrors.push(message.text());
		});
	}

	async goto(): Promise<void> {
		await this.page.goto('/blog');
	}

	async openBlogFromNavigation(): Promise<void> {
		await this.nav.blogLink.click();
	}

	async openStarterEssay(): Promise<void> {
		await this.starterEssayLink.click();
	}

	async followRelatedMapLink(): Promise<void> {
		await this.relatedMapLink.click();
	}

	getCurrentUrl(): string {
		return this.page.url();
	}

	getErrors(): string[] {
		return [...this.browserErrors];
	}
}
