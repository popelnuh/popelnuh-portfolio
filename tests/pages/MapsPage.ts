import type { Locator, Page } from '@playwright/test';
import { NavBarComponent } from '../components/NavBarComponent';

type CountryId = 'ES' | 'EE' | 'EL' | 'UK' | 'TR';

export class MapsPage {
	readonly nav: NavBarComponent;
	readonly heading: Locator;
	readonly childcareTab: Locator;
	readonly childcareHeading: Locator;
	readonly childcareLegend: Locator;
	readonly childcareSwatch: Locator;
	readonly childcareSource: Locator;
	readonly map: Locator;
	readonly resetViewControl: Locator;
	readonly zoomInControl: Locator;
	readonly leafletContainer: Locator;
	readonly spainRegion: Locator;
	readonly ukRegion: Locator;
	readonly countryWithoutMetric: Locator;
	readonly popup: Locator;
	readonly tooltip: Locator;
	readonly attribution: Locator;
	readonly status: Locator;
	readonly geoJsonRegions: Locator;
	private readonly browserErrors: string[] = [];

	constructor(private readonly page: Page) {
		this.nav = new NavBarComponent(page);
		this.heading = page.getByRole('heading', { name: 'Maps', exact: true });
		this.childcareTab = page.getByRole('tab', { name: 'Childcare Costs' });
		this.childcareHeading = page.getByRole('heading', {
			name: 'Net Childcare Costs Across Europe',
		});
		this.childcareLegend = page.getByRole('list', { name: 'Net childcare cost legend' });
		this.childcareSwatch = this.childcareLegend.locator('.swatch').first();
		this.childcareSource = page.getByRole('link', { name: 'OECD Data Explorer' });
		this.map = page.getByTestId('leaflet-map');
		this.resetViewControl = page.getByRole('button', { name: 'Reset view', exact: true });
		this.zoomInControl = this.map.locator('.leaflet-control-zoom-in');
		this.leafletContainer = page.locator('.leaflet-container');
		this.spainRegion = this.map.getByTestId('map-region-ES');
		this.ukRegion = this.map.getByTestId('map-region-UK');
		this.countryWithoutMetric = this.map.getByTestId('map-region-TR');
		this.popup = page.locator('.leaflet-popup').last();
		this.tooltip = page.locator('.leaflet-tooltip').last();
		this.attribution = this.map.locator('.leaflet-control-attribution');
		this.status = page.locator('.map-status');
		this.geoJsonRegions = this.map.locator('svg path[data-testid^="map-region-"]');

		page.on('pageerror', (error) => this.browserErrors.push(error.message));
		page.on('console', (message) => {
			if (message.type() === 'error') this.browserErrors.push(message.text());
		});
	}

	async goto(): Promise<void> {
		await this.page.goto('/maps');
	}

	async selectChildcareMap(): Promise<void> {
		await this.childcareTab.click();
	}

	async zoomInAndReset(): Promise<void> {
		await this.zoomInControl.click();
		await this.resetViewControl.click();
	}

	async selectCountry(countryId: CountryId): Promise<void> {
		await this.map.getByTestId(`map-region-${countryId}`).click();
	}

	async hoverCountryWithoutOECDData(): Promise<void> {
		await this.countryWithoutMetric.hover();
	}

	getErrors(): string[] {
		return [...this.browserErrors];
	}
}
