import type { Locator, Page } from '@playwright/test';
import { NavBarComponent } from '../components/NavBarComponent';

export class AboutPage {
	readonly nav: NavBarComponent;
	readonly heading: Locator;
	readonly linkedInLink: Locator;
	readonly githubLink: Locator;
	readonly emailLink: Locator;
	readonly emailStatus: Locator;
	readonly bioCard: Locator;
	readonly aboutGrid: Locator;
	readonly glanceHeading: Locator;
	readonly location: Locator;
	readonly certification: Locator;
	readonly experience: Locator;
	readonly coreStack: Locator;
	readonly footer: Locator;
	readonly liveE2EBadge: Locator;
	readonly liveE2EBadgeImage: Locator;
	readonly liveE2EReportLink: Locator;

	constructor(private readonly page: Page) {
		this.nav = new NavBarComponent(page);
		this.heading = page.getByRole('heading', { name: 'Zlata Popelnuh', exact: true });
		this.linkedInLink = page.getByRole('link', { name: 'LinkedIn', exact: true });
		this.githubLink = page.getByRole('link', { name: 'GitHub', exact: true });
		this.emailLink = page.getByRole('link', { name: 'popelnuh@gmail.com', exact: true });
		this.emailStatus = page.getByRole('status');
		this.bioCard = page.getByTestId('about-bio-card');
		this.aboutGrid = page.getByTestId('about-grid');
		this.glanceHeading = page.getByRole('heading', { name: 'At a Glance', exact: true });
		this.location = page.getByText('55.86° N, 4.25° W · Scotland, UK', { exact: true });
		this.certification = page.getByText('ISTQB · CSM · Azure (AZ-900)', { exact: true });
		this.experience = page.getByText('10+ years in QA & Automation', { exact: true });
		this.coreStack = page.getByRole('list', { name: 'Core technologies' });
		this.footer = page.getByRole('contentinfo');
		this.liveE2EBadge = page.getByTestId('footer-live-e2e-badge');
		this.liveE2EBadgeImage = this.liveE2EBadge.getByRole('img', { name: 'Live E2E status' });
		this.liveE2EReportLink = page.getByTestId('footer-live-e2e-report');
	}

	async goto(): Promise<void> {
		await this.page.goto('/about');
	}

	async clickEmailLink(): Promise<void> {
		await this.page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
		await this.emailLink.click();
	}
}
