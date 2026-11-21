import type { Locator, Page } from '@playwright/test';
import { NavBarComponent } from '../components/NavBarComponent';

type CountryId = 'ES' | 'UK' | 'TR';

export class MapsPage {
	readonly nav: NavBarComponent;
	readonly heading: Locator;
	readonly map: Locator;
	readonly leafletContainer: Locator;
	readonly spainRegion: Locator;
	readonly ukRegion: Locator;
	readonly countryWithoutMetric: Locator;
	readonly popup: Locator;
	readonly attribution: Locator;

	constructor(private readonly page: Page) {
		this.nav = new NavBarComponent(page);
		this.heading = page.getByRole('heading', { name: 'Maps', exact: true });
		this.map = page.getByTestId('leaflet-map');
		this.leafletContainer = page.locator('.leaflet-container');
		this.spainRegion = this.map.getByTestId('map-region-ES');
		this.ukRegion = this.map.getByTestId('map-region-UK');
		this.countryWithoutMetric = this.map.getByTestId('map-region-TR');
		this.popup = page.locator('.leaflet-popup').last();
		this.attribution = this.map.locator('.leaflet-control-attribution');
	}

	async goto(): Promise<void> {
		await this.page.goto('/maps');
	}

	async selectCountry(countryId: CountryId): Promise<void> {
		await this.map.getByTestId(`map-region-${countryId}`).click();
	}
}
