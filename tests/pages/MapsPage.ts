import type { Locator, Page } from '@playwright/test';
import { NavBarComponent } from '../components/NavBarComponent';

type CountryId = 'ES' | 'EE' | 'EL' | 'UK' | 'TR';

export class MapsPage {
	readonly nav: NavBarComponent;
	readonly heading: Locator;
	readonly tabList: Locator;
	readonly renewableTab: Locator;
	readonly childcareTab: Locator;
	readonly schoolUniformsTab: Locator;
	readonly childcareHeading: Locator;
	readonly childcareLegend: Locator;
	readonly childcareSwatch: Locator;
	readonly childcareSource: Locator;
	readonly schoolUniformsHeading: Locator;
	readonly schoolUniformsLegend: Locator;
	readonly uniformSourceLink: Locator;
	readonly map: Locator;
	readonly mapShell: Locator;
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
		this.tabList = page.getByRole('tablist', { name: 'Map datasets' });
		this.renewableTab = this.tabList.getByRole('tab', { name: 'Renewable Energy' });
		this.childcareTab = this.tabList.getByRole('tab', { name: 'Childcare Costs' });
		this.schoolUniformsTab = this.tabList.getByRole('tab', { name: 'School Uniforms' });
		this.childcareHeading = page.getByRole('heading', {
			name: 'Net Childcare Costs Across Europe',
		});
		this.childcareLegend = page.getByRole('list', { name: 'Net childcare cost legend' });
		this.childcareSwatch = this.childcareLegend.locator('.swatch').first();
		this.childcareSource = page.getByRole('link', { name: 'OECD Data Explorer' });
		this.schoolUniformsHeading = page.getByRole('heading', {
			name: 'School Uniform Policies Across Europe',
		});
		this.schoolUniformsLegend = page.getByRole('list', {
			name: 'School uniform policy legend',
		});
		this.map = page.getByTestId('leaflet-map');
		this.mapShell = page.locator('.map-shell');
		this.resetViewControl = page.getByRole('button', { name: 'Reset view', exact: true });
		this.zoomInControl = this.map.locator('.leaflet-control-zoom-in');
		this.leafletContainer = page.locator('.leaflet-container');
		this.spainRegion = this.map.getByTestId('map-region-ES');
		this.ukRegion = this.map.getByTestId('map-region-UK');
		this.countryWithoutMetric = this.map.getByTestId('map-region-TR');
		this.popup = page.locator('.leaflet-popup').last();
		this.uniformSourceLink = this.popup.getByRole('link', {
			name: 'UK Department for Education',
		});
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

	async selectSchoolUniformsMap(): Promise<void> {
		await this.schoolUniformsTab.click();
	}

	async selectChildcareMapByKeyboard(): Promise<void> {
		await this.renewableTab.focus();
		await this.renewableTab.press('ArrowRight');
	}

	async zoomInAndReset(): Promise<void> {
		await this.zoomInControl.click();
		await this.resetViewControl.click();
	}

	async selectCountry(countryId: CountryId): Promise<void> {
		await this.map.getByTestId(`map-region-${countryId}`).click();
	}

	async hoverCountry(countryId: CountryId): Promise<void> {
		await this.map.getByTestId(`map-region-${countryId}`).hover();
	}

	async hoverCountryWithoutOECDData(): Promise<void> {
		await this.countryWithoutMetric.hover();
	}

	getErrors(): string[] {
		return [...this.browserErrors];
	}
}
