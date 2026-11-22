import type { Locator, Page } from '@playwright/test';
import { NavBarComponent } from '../components/NavBarComponent';

type CountryId = 'ES' | 'EE' | 'EL' | 'UK' | 'TR';

export class MapsPage {
	readonly nav: NavBarComponent;
	readonly heading: Locator;
	readonly pageContents: Locator;
	readonly europeanContentsLink: Locator;
	readonly worldContentsLink: Locator;
	readonly europeanMapSection: Locator;
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
	readonly worldTravelMap: Locator;
	readonly worldMapShell: Locator;
	readonly worldMapStatus: Locator;
	readonly worldResetViewControl: Locator;
	readonly worldMapHeading: Locator;
	readonly worldCountryCount: Locator;
	readonly franceWorldRegion: Locator;
	readonly norwayWorldRegion: Locator;
	readonly unitedStatesWorldRegion: Locator;
	readonly chinaWorldRegion: Locator;
	readonly vaticanWorldMarker: Locator;
	private readonly browserErrors: string[] = [];

	constructor(private readonly page: Page) {
		this.nav = new NavBarComponent(page);
		this.heading = page.getByRole('heading', { name: 'Maps', exact: true });
		this.pageContents = page.getByRole('navigation', { name: 'Page contents' });
		this.europeanContentsLink = this.pageContents.getByRole('link', {
			name: 'European Data Maps',
		});
		this.worldContentsLink = this.pageContents.getByRole('link', { name: 'World Travel Map' });
		this.europeanMapSection = page.getByRole('region', { name: 'European Data Maps' });
		this.tabList = page.getByRole('tablist', { name: 'Map datasets' });
		this.renewableTab = this.tabList.getByRole('tab', { name: 'Renewable Energy' });
		this.childcareTab = this.tabList.getByRole('tab', { name: 'Childcare Costs' });
		this.schoolUniformsTab = this.tabList.getByRole('tab', { name: 'School Uniforms' });
		this.childcareHeading = page.getByRole('heading', {
			name: 'Net Childcare Costs Across Europe',
		});
		this.childcareLegend = page.getByRole('list', { name: 'Net childcare cost legend' });
		this.childcareSwatch = page.getByTestId('map-legend-swatch').first();
		this.childcareSource = page.getByRole('link', { name: 'OECD Data Explorer' });
		this.schoolUniformsHeading = page.getByRole('heading', {
			name: 'School Uniform Policies Across Europe',
		});
		this.schoolUniformsLegend = page.getByRole('list', {
			name: 'School uniform policy legend',
		});
		this.map = page.getByTestId('leaflet-map');
		this.mapShell = page.getByTestId('map-shell');
		this.resetViewControl = this.mapShell.getByRole('button', { name: 'Reset view', exact: true });
		this.zoomInControl = this.map.getByRole('button', { name: 'Zoom in' });
		this.leafletContainer = page.getByRole('region', { name: /European countries by/ });
		this.spainRegion = this.map.getByTestId('map-region-ES');
		this.ukRegion = this.map.getByTestId('map-region-UK');
		this.countryWithoutMetric = this.map.getByTestId('map-region-TR');
		this.popup = page.getByTestId('map-country-popup').last();
		this.uniformSourceLink = this.popup.getByRole('link', {
			name: 'UK Department for Education',
		});
		this.tooltip = page.getByRole('tooltip').last();
		this.attribution = page.getByText(
			'© EuroGeographics for the administrative boundaries',
			{ exact: true },
		);
		this.status = this.mapShell.getByRole('status');
		this.worldTravelMap = page.getByTestId('world-travel-map');
		this.worldMapShell = page.getByTestId('world-map-shell');
		this.worldMapStatus = page.getByRole('status').last();
		this.worldResetViewControl = this.worldMapShell.getByRole('button', {
			name: 'Reset view',
			exact: true,
		});
		this.worldMapHeading = page.getByRole('heading', { name: 'Countries Visited', exact: true });
		this.worldCountryCount = page.getByText('38 countries', { exact: true });
		this.franceWorldRegion = this.worldTravelMap.getByTestId('world-region-FRA');
		this.norwayWorldRegion = this.worldTravelMap.getByTestId('world-region-NOR');
		this.unitedStatesWorldRegion = this.worldTravelMap.getByTestId('world-region-USA');
		this.chinaWorldRegion = this.worldTravelMap.getByTestId('world-region-CHN');
		this.vaticanWorldMarker = this.worldTravelMap.getByTestId('world-region-VAT');

		page.on('pageerror', (error) => this.browserErrors.push(error.message));
		page.on('console', (message) => {
			if (message.type() === 'error') this.browserErrors.push(message.text());
		});
	}

	async goto(): Promise<void> {
		await this.page.goto('/maps');
	}

	async followWorldContentsLink(): Promise<void> {
		await this.worldContentsLink.click();
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
