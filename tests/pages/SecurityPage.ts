import { expect, type Page } from '@playwright/test';

export class SecurityPage {
	private readonly browserErrors: string[] = [];
	private readonly policyViolations: string[] = [];

	constructor(private readonly page: Page) {
		page.on('pageerror', (error) => this.browserErrors.push(error.message));
		page.on('console', (message) => {
			if (message.type() === 'error') this.browserErrors.push(message.text());
		});
	}

	async visitPublicRoutesWithPolicy(policy: string): Promise<void> {
		await this.page.addInitScript(() => {
			type WindowWithViolations = Window & { __cspViolations?: string[] };
			const browserWindow = window as WindowWithViolations;
			browserWindow.__cspViolations = [];
			document.addEventListener('securitypolicyviolation', (event) => {
				browserWindow.__cspViolations?.push(
					`${event.violatedDirective} blocked ${event.blockedURI}`,
				);
			});
		});

		await this.page.route('**/*', async (route) => {
			if (route.request().resourceType() !== 'document') {
				await route.continue();
				return;
			}

			const response = await route.fetch();
			await route.fulfill({
				response,
				headers: {
					...response.headers(),
					'content-security-policy': policy,
				},
			});
		});

		for (const path of ['/', '/about', '/blog', '/maps', '/quality']) {
			await this.page.goto(path);
			if (path === '/maps') {
				await expect(
					this.page.getByTestId('map-shell').first().getByRole('status'),
				).toHaveText('Map data loaded. Select a country for details.');
				await expect(
					this.page.getByTestId('world-map-shell').getByRole('status'),
				).toHaveText('World map loaded. Hover over a country to see visit status.');
			}
			const violations = await this.page.evaluate(() => {
				type WindowWithViolations = Window & { __cspViolations?: string[] };
				return (window as WindowWithViolations).__cspViolations ?? [];
			});
			this.policyViolations.push(...violations);
		}
	}

	getErrors(): string[] {
		return [...this.browserErrors];
	}

	getPolicyViolations(): string[] {
		return [...this.policyViolations];
	}
}
