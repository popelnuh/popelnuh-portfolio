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
		this.heading = page.getByRole('heading', { name: 'Blog', exact: true });
		this.publishedEssays = page.getByRole('list', { name: 'Published essays' });
		this.essayCards = page.getByTestId('blog-post-card');
		this.starterEssayLink = page.getByRole('link', {
			name: /Comparing School Years Across Europe/,
		});
		this.essayHeading = page.getByRole('heading', {
			name: 'Comparing School Years Across Europe',
			level: 1,
		});
		this.readingTime = page.getByText(/^\d+ min read$/, { exact: true });
		this.essayArticle = page.getByRole('article');
		this.relatedMapLink = page.getByRole('link', { name: 'Explore the interactive map' });

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
