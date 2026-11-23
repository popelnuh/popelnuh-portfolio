import type { Locator, Page } from '@playwright/test';

export class QualityPage {
	readonly heading: Locator;
	readonly statusStrip: Locator;
	readonly statusBadges: Locator;
	readonly reportLink: Locator;
	readonly codeLinks: Locator;
	readonly unitPipelineCard: Locator;
	readonly azurePipelineCard: Locator;
	readonly livePipelineCard: Locator;
	readonly testPyramidHeading: Locator;
	readonly monitoringHeading: Locator;
	readonly guardrailsHeading: Locator;
	readonly inspectCodeHeading: Locator;
	readonly agentsLink: Locator;
	readonly playwrightConfigLink: Locator;
	readonly featuresLink: Locator;
	readonly pagesLink: Locator;
	readonly workflowsLink: Locator;
	readonly footerQualityLink: Locator;
	private readonly browserErrors: string[] = [];

	constructor(private readonly page: Page) {
		this.heading = page.getByTestId('quality-heading');
		this.statusStrip = page.getByTestId('quality-status');
		this.statusBadges = this.statusStrip.getByRole('img');
		this.reportLink = page.getByTestId('quality-report-link');
		this.codeLinks = page.getByTestId('quality-code-links');
		this.unitPipelineCard = page.getByTestId('quality-unit-pipeline');
		this.azurePipelineCard = page.getByTestId('quality-azure-pipeline');
		this.livePipelineCard = page.getByTestId('quality-live-pipeline');
		this.testPyramidHeading = page.getByRole('heading', { name: 'The Test Pyramid', exact: true });
		this.monitoringHeading = page.getByRole('heading', {
			name: 'CI/CD & Synthetic Monitoring',
			exact: true,
		});
		this.guardrailsHeading = page.getByRole('heading', {
			name: 'AI-Assisted Engineering Guardrails',
			exact: true,
		});
		this.inspectCodeHeading = page.getByRole('heading', { name: 'Inspect the Code', exact: true });
		this.agentsLink = page.getByTestId('quality-code-agents');
		this.playwrightConfigLink = page.getByTestId('quality-code-config');
		this.featuresLink = page.getByTestId('quality-code-features');
		this.pagesLink = page.getByTestId('quality-code-pages');
		this.workflowsLink = page.getByTestId('quality-code-workflows');
		this.footerQualityLink = page.getByTestId('footer-quality');

		page.on('pageerror', (error) => this.browserErrors.push(error.message));
		page.on('console', (message) => {
			if (message.type() === 'error') this.browserErrors.push(message.text());
		});
	}

	async goto(): Promise<void> {
		await this.page.goto('/quality');
	}

	async viewOnMobile(): Promise<void> {
		await this.page.setViewportSize({ width: 390, height: 844 });
	}

	async hasHorizontalOverflow(): Promise<boolean> {
		return this.page.evaluate(
			() => document.documentElement.scrollWidth > document.documentElement.clientWidth,
		);
	}

	getCurrentUrl(): string {
		return this.page.url();
	}

	getErrors(): string[] {
		return [...this.browserErrors];
	}
}
