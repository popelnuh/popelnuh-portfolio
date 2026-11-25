import { expect, type Page } from '@playwright/test';

function isBlockedLocalViteHmrError(message: string): boolean {
	const blockedLocalWebSocket =
		message.includes('ERR_BLOCKED_BY_LOCAL_NETWORK_ACCESS_CHECKS') &&
		/WebSocket connection to 'ws:\/\/localhost:\d+\//.test(message);
	const failedViteWebSocket =
		message.startsWith('[vite] failed to connect to websocket.') &&
		message.includes('(browser) localhost:');
	const viteHmrClientCascade =
		message.includes("[vite] TypeError: Cannot read properties of undefined (reading 'send')") &&
		message.includes('/@vite/client');

	return blockedLocalWebSocket || failedViteWebSocket || viteHmrClientCascade;
}

export class SecurityPage {
	private readonly browserErrors: string[] = [];
	private readonly policyViolations: string[] = [];

	constructor(private readonly page: Page) {
		page.on('pageerror', (error) => this.browserErrors.push(error.message));
		page.on('console', (message) => {
			if (message.type() !== 'error') return;

			const text = message.text();
			if (!isBlockedLocalViteHmrError(text)) this.browserErrors.push(text);
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
