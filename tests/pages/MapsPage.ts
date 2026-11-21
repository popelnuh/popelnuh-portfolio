import type { Locator, Page } from '@playwright/test';
import { NavBarComponent } from '../components/NavBarComponent';

export class MapsPage {
	readonly nav: NavBarComponent;
	readonly heading: Locator;
	readonly map: Locator;
	readonly leafletContainer: Locator;
	readonly spainRegion: Locator;
	readonly countryWithoutMetric: Locator;
	readonly popup: Locator;

	constructor(private readonly page: Page) {
		this.nav = new NavBarComponent(page);
		this.heading = page.getByRole('heading', { name: 'Maps', exact: true });
		this.map = page.getByTestId('leaflet-map');
		this.leafletContainer = page.locator('.leaflet-container');
		this.spainRegion = this.map.getByTestId('map-region-ES');
		this.countryWithoutMetric = this.map.getByTestId('map-region-AD');
		this.popup = page.locator('.leaflet-popup');
	}

	async goto(): Promise<void> {
		await this.page.goto('/maps');
	}

	async selectSpain(): Promise<void> {
		await this.spainRegion.click();
	}
}
