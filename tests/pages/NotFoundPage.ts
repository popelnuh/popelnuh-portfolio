import type { Locator, Page } from '@playwright/test';

export class NotFoundPage {
	readonly heading: Locator;
	readonly homeLink: Locator;
	readonly oxImage: Locator;
	private responseStatus: number | null = null;

	constructor(private readonly page: Page) {
		this.heading = page.getByRole('heading', { name: 'Lost in the Highlands?', exact: true });
		this.homeLink = page.getByRole('link', { name: 'Take me back home', exact: true });
		this.oxImage = page.getByRole('img', {
			name: /brown Highland cow.*404 Page Not Found/i,
		});
	}

	async visitMissingRoute(): Promise<void> {
		const response = await this.page.goto('/does-not-exist');
		this.responseStatus = response?.status() ?? null;
	}

	getResponseStatus(): number | null {
		return this.responseStatus;
	}
}
