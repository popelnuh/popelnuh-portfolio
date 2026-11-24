import type { Locator, Page } from '@playwright/test';
import { NavBarComponent } from '../components/NavBarComponent';

type CountryId = 'ES' | 'EE' | 'EL' | 'UK' | 'TR' | 'FI' | 'IT';

export class MapsPage {
	readonly nav: NavBarComponent;
	readonly heading: Locator;
	readonly pageContents: Locator;
	readonly educationContentsLink: Locator;
	readonly worldContentsLink: Locator;
	readonly heyerdahlContentsLink: Locator;
	readonly renewableContentsLink: Locator;
	readonly educationInsightsSection: Locator;
	readonly heyerdahlSection: Locator;
	readonly heyerdahlMap: Locator;
	readonly heyerdahlMapStatus: Locator;
	readonly heyerdahlMapSvg: Locator;
	readonly heyerdahlRoutePaths: Locator;
	readonly heyerdahlFilters: Locator;
	readonly renewableMapSection: Locator;
	readonly tabList: Locator;
	readonly childcareTab: Locator;
	readonly schoolUniformsTab: Locator;
	readonly freeSchoolMealsTab: Locator;
	readonly summerHolidaysTab: Locator;
	readonly schoolStartingAgeTab: Locator;
	readonly teacherQualificationsTab: Locator;
	readonly religiousEducationTab: Locator;
	readonly selectedDatasetTab: Locator;
	readonly childcareHeading: Locator;
	readonly childcareLegend: Locator;
	readonly childcareSwatch: Locator;
	readonly childcareSource: Locator;
	readonly schoolUniformsHeading: Locator;
	readonly schoolUniformsLegend: Locator;
	readonly uniformSourceLink: Locator;
	readonly freeSchoolMealsHeading: Locator;
	readonly freeSchoolMealsLegend: Locator;
	readonly freeSchoolMealsSource: Locator;
	readonly freeSchoolMealsSourceLink: Locator;
	readonly freeSchoolMealsAttribution: Locator;
	readonly freeSchoolMealsMapRegion: Locator;
	readonly finlandRegion: Locator;
	readonly summerHolidaysHeading: Locator;
	readonly summerHolidaysLegend: Locator;
	readonly summerHolidaysSource: Locator;
	readonly summerHolidaysAttribution: Locator;
	readonly summerHolidaysSourceLink: Locator;
	readonly italyRegion: Locator;
	readonly schoolStartingAgeHeading: Locator;
	readonly schoolStartingAgeLegend: Locator;
	readonly schoolStartingAgeSource: Locator;
	readonly schoolStartingAgeAttribution: Locator;
	readonly schoolStartingAgeSourceLink: Locator;
	readonly estoniaSchoolStartingAgeRegion: Locator;
	readonly teacherQualificationsHeading: Locator;
	readonly teacherQualificationsLegend: Locator;
	readonly teacherQualificationsSource: Locator;
	readonly teacherQualificationsAttribution: Locator;
	readonly teacherQualificationsSourceLink: Locator;
	readonly teacherQualificationsMapRegion: Locator;
	readonly religiousEducationHeading: Locator;
	readonly religiousEducationLegend: Locator;
	readonly religiousEducationSource: Locator;
	readonly religiousEducationAttribution: Locator;
	readonly religiousEducationSourceLink: Locator;
	readonly religiousEducationMapRegion: Locator;
	readonly map: Locator;
	readonly educationMap: Locator;
	readonly mapShell: Locator;
	readonly educationMapShell: Locator;
	readonly resetViewControl: Locator;
	readonly zoomInControl: Locator;
	readonly leafletContainer: Locator;
	readonly educationLeafletContainer: Locator;
	readonly spainRegion: Locator;
	readonly educationSpainRegion: Locator;
	readonly ukRegion: Locator;
	readonly countryWithoutMetric: Locator;
	readonly educationCountryWithoutMetric: Locator;
	readonly popup: Locator;
	readonly renewablePopup: Locator;
	readonly tooltip: Locator;
	readonly attribution: Locator;
	readonly status: Locator;
	readonly educationStatus: Locator;
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
	private selectedMap: 'education' | 'renewable' = 'education';

	constructor(private readonly page: Page) {
		this.nav = new NavBarComponent(page);
		this.heading = page.getByRole('heading', { name: 'Maps', exact: true });
		this.pageContents = page.getByRole('navigation', { name: 'On this page' });
		this.educationContentsLink = this.pageContents.getByRole('link', {
			name: 'European Children Education Insights',
		});
		this.worldContentsLink = this.pageContents.getByRole('link', {
			name: 'World Travel Map',
		});
		this.heyerdahlContentsLink = this.pageContents.getByRole('link', {
			name: "Thor Heyerdahl's Maritime Expeditions",
		});
		this.renewableContentsLink = this.pageContents.getByRole('link', {
			name: 'Renewable Energy',
		});
		this.educationInsightsSection = page.getByRole('region', {
			name: 'European Children Education Insights',
		});
		this.heyerdahlSection = page.getByRole('region', {
			name: "Thor Heyerdahl's Maritime Expeditions",
			exact: true,
		});
		this.heyerdahlMap = this.heyerdahlSection.getByTestId('heyerdahl-map-shell');
		this.heyerdahlMapStatus = this.heyerdahlMap.getByRole('status');
		this.heyerdahlMapSvg = this.heyerdahlMap.getByTestId('heyerdahl-routes-svg');
		this.heyerdahlRoutePaths = this.heyerdahlMap.getByTestId(/^heyerdahl-route-/);
		this.heyerdahlFilters = this.heyerdahlMap.getByRole('group', {
			name: 'Filter expeditions',
		});
		this.renewableMapSection = page.getByRole('region', {
			name: 'Renewable Energy',
			exact: true,
		});
		this.tabList = page.getByRole('tablist', { name: 'Map datasets' });
		this.childcareTab = this.tabList.getByRole('tab', {
			name: 'Childcare Costs',
		});
		this.schoolUniformsTab = this.tabList.getByRole('tab', {
			name: 'School Uniforms',
		});
		this.freeSchoolMealsTab = this.tabList.getByRole('tab', {
			name: 'Free School Meals',
		});
		this.summerHolidaysTab = this.tabList.getByRole('tab', {
			name: 'Summer Holidays',
		});
		this.schoolStartingAgeTab = this.tabList.getByRole('tab', {
			name: 'School Starting Age',
		});
		this.teacherQualificationsTab = this.tabList.getByRole('tab', {
			name: 'Teacher Qualifications',
		});
		this.religiousEducationTab = this.tabList.getByRole('tab', {
			name: 'Religion in Schools',
		});
		this.selectedDatasetTab = this.tabList.getByRole('tab', { selected: true });
		this.childcareHeading = page.getByRole('heading', {
			name: 'Net Childcare Costs Across Europe',
		});
		this.childcareLegend = page.getByRole('list', {
			name: 'Net childcare cost legend',
		});
		this.childcareSwatch = page.getByTestId('map-legend-swatch').first();
		this.childcareSource = page.getByRole('link', {
			name: 'OECD Data Explorer',
		});
		this.schoolUniformsHeading = page.getByRole('heading', {
			name: 'School Uniform Policies Across Europe',
		});
		this.schoolUniformsLegend = page.getByRole('list', {
			name: 'School uniform policy legend',
		});
		this.map = this.renewableMapSection.getByTestId('leaflet-map');
		this.educationMap = this.educationInsightsSection.getByTestId('leaflet-map');
		this.mapShell = this.renewableMapSection.getByTestId('map-shell');
		this.educationMapShell = this.educationInsightsSection.getByTestId('map-shell');
		this.resetViewControl = this.mapShell.getByRole('button', {
			name: 'Reset view',
			exact: true,
		});
		this.zoomInControl = this.map.getByRole('button', { name: 'Zoom in' });
		this.leafletContainer = this.renewableMapSection.getByRole('region', {
			name: 'European countries by renewable energy share',
		});
		this.educationLeafletContainer = this.educationInsightsSection.getByRole('region', {
			name: /European countries by/,
		});
		this.spainRegion = this.map.getByTestId('map-region-ES');
		this.educationSpainRegion = this.educationMap.getByTestId('map-region-ES');
		this.ukRegion = this.map.getByTestId('map-region-UK');
		this.countryWithoutMetric = this.map.getByTestId('map-region-TR');
		this.educationCountryWithoutMetric = this.educationMap.getByTestId('map-region-TR');
		this.popup = this.educationMap.getByTestId('map-country-popup').last();
		this.renewablePopup = this.map.getByTestId('map-country-popup').last();
		this.uniformSourceLink = this.popup.getByRole('link', {
			name: 'UK Department for Education',
		});
		this.freeSchoolMealsHeading = page.getByRole('heading', {
			name: 'Free School Meals Across Europe',
		});
		this.freeSchoolMealsLegend = page.getByRole('list', {
			name: 'Free school meals policy legend',
		});
		this.freeSchoolMealsSource = page.getByRole('link', {
			name: 'Eurydice – European Commission',
		});
		this.freeSchoolMealsSourceLink = this.popup.getByRole('link', {
			name: 'Eurydice – Finland',
		});
		this.freeSchoolMealsAttribution = page.getByText(
			/The Current State, Benefits, and Exemplary Models of School Meal Programmes in the European Union/,
		);
		this.freeSchoolMealsMapRegion = page.getByRole('region', {
			name: 'European countries by free school meals provision',
		});
		this.finlandRegion = this.educationMap.getByTestId('map-region-FI');
		this.summerHolidaysHeading = page.getByRole('heading', {
			name: 'Length of Summer School Holidays Across Europe',
		});
		this.summerHolidaysLegend = page.getByRole('list', {
			name: 'Summer school holiday duration legend',
		});
		this.summerHolidaysSource = page.getByRole('link', {
			name: 'Eurydice – European School Calendars',
		});
		this.summerHolidaysAttribution = page.getByText(
			/Shorter summer breaks do not mean fewer holidays overall/,
		);
		this.summerHolidaysSourceLink = this.popup.getByRole('link', {
			name: 'Eurydice – European School Calendars',
		});
		this.italyRegion = this.educationMap.getByTestId('map-region-IT');
		this.schoolStartingAgeHeading = page.getByRole('heading', {
			name: 'Compulsory School Starting Age Across Europe',
		});
		this.schoolStartingAgeLegend = page.getByRole('list', {
			name: 'Compulsory school starting age legend',
		});
		this.schoolStartingAgeSource = page.getByRole('link', {
			name: 'Eurydice – Compulsory Education in Europe',
		});
		this.schoolStartingAgeAttribution = page.getByText(
			/Compulsory education often begins 1–3 years before formal primary school/,
		);
		this.schoolStartingAgeSourceLink = this.popup.getByRole('link', {
			name: 'Eurydice – Compulsory Education in Europe',
		});
		this.estoniaSchoolStartingAgeRegion = this.educationMap.getByTestId('map-region-EE');
		this.teacherQualificationsHeading = page.getByRole('heading', {
			name: 'Minimum Teacher Qualification Level Across Europe',
		});
		this.teacherQualificationsLegend = page.getByRole('list', {
			name: 'Minimum teacher qualification level legend',
		});
		this.teacherQualificationsSource = page.getByRole('link', {
			name: 'Eurydice – Teachers in Europe',
		});
		this.teacherQualificationsAttribution = page.getByText(
			/ISCED 6 \(Bachelor’s\) and ISCED 7 \(Master’s\)/,
		);
		this.teacherQualificationsSourceLink = this.popup.getByRole('link', {
			name: 'Eurydice – Teachers in Europe',
		});
		this.teacherQualificationsMapRegion = this.educationMap.getByTestId('map-region-FI');
		this.religiousEducationHeading = page.getByRole('heading', {
			name: 'Religious Education & Worship in State Schools Across Europe',
		});
		this.religiousEducationLegend = page.getByRole('list', {
			name: 'Religious education and worship policy legend',
		});
		this.religiousEducationSource = page.getByRole('link', {
			name: 'Eurydice – National Education Systems',
		});
		this.religiousEducationAttribution = page.getByText(
			/regional exceptions.*private faith schools/i,
		);
		this.religiousEducationSourceLink = this.popup.getByRole('link', {
			name: 'Eurydice – National Education Systems',
		});
		this.religiousEducationMapRegion = this.educationMap.getByTestId('map-region-UK');
		this.tooltip = page.getByRole('tooltip').last();
		this.attribution = this.renewableMapSection.getByText(
			'© EuroGeographics for the administrative boundaries',
			{ exact: true },
		);
		this.status = this.mapShell.getByRole('status');
		this.educationStatus = this.educationMapShell.getByRole('status');
		this.worldTravelMap = page.getByTestId('world-travel-map');
		this.worldMapShell = page.getByTestId('world-map-shell');
		this.worldMapStatus = this.worldMapShell.getByRole('status');
		this.worldResetViewControl = this.worldMapShell.getByRole('button', {
			name: 'Reset view',
			exact: true,
		});
		this.worldMapHeading = page.getByRole('heading', {
			name: 'Countries Visited',
			exact: true,
		});
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

	async goto(path = '/maps'): Promise<void> {
		this.selectedMap = 'education';
		await this.page.goto(path);
	}

	async gotoDataset(datasetKey: string): Promise<void> {
		await this.goto(`/maps?dataset=${encodeURIComponent(datasetKey)}`);
	}

	async setDesktopViewport(): Promise<void> {
		await this.page.setViewportSize({ width: 1280, height: 900 });
	}

	async setMobileViewport(): Promise<void> {
		await this.page.setViewportSize({ width: 390, height: 844 });
	}

	async hasHorizontalOverflow(): Promise<boolean> {
		return this.page.evaluate(
			() => document.documentElement.scrollWidth > document.documentElement.clientWidth,
		);
	}

	async contentsAreAboveFirstMap(): Promise<boolean> {
		return this.page.evaluate(() => {
			const contents = document.querySelector<HTMLElement>('.maps-contents');
			const firstMap = document.getElementById('european-education-insights');
			return Boolean(
				contents &&
				firstMap &&
				contents.getBoundingClientRect().bottom <= firstMap.getBoundingClientRect().top,
			);
		});
	}

	async contentsSidebarIsSticky(): Promise<boolean> {
		return this.pageContents.evaluate(
			(navigation) => getComputedStyle(navigation.parentElement!).position === 'sticky',
		);
	}

	getCurrentUrl(): string {
		return this.page.url();
	}

	async followWorldContentsLink(): Promise<void> {
		await this.worldContentsLink.click();
	}

	async followHeyerdahlContentsLink(): Promise<void> {
		await this.heyerdahlContentsLink.click();
	}

	async viewRenewableEnergySection(): Promise<void> {
		await this.renewableContentsLink.click();
		this.selectedMap = 'renewable';
	}

	async renewableEnergySectionFollowsWorldMap(): Promise<boolean> {
		return this.page.evaluate(() => {
			const worldMap = document.getElementById('world-travel-map');
			const renewableMap = document.getElementById('renewable-energy');
			return Boolean(
				worldMap &&
				renewableMap &&
				worldMap.compareDocumentPosition(renewableMap) & Node.DOCUMENT_POSITION_FOLLOWING,
			);
		});
	}

	async selectChildcareMap(): Promise<void> {
		this.selectedMap = 'education';
		await this.childcareTab.click();
	}

	async selectSchoolUniformsMap(): Promise<void> {
		this.selectedMap = 'education';
		await this.schoolUniformsTab.click();
	}

	async selectFreeSchoolMealsMap(): Promise<void> {
		this.selectedMap = 'education';
		await this.freeSchoolMealsTab.click();
	}

	async selectSummerHolidaysMap(): Promise<void> {
		this.selectedMap = 'education';
		await this.summerHolidaysTab.click();
	}

	async selectSchoolStartingAgeMap(): Promise<void> {
		this.selectedMap = 'education';
		await this.schoolStartingAgeTab.click();
	}

	async selectTeacherQualificationsMap(): Promise<void> {
		this.selectedMap = 'education';
		await this.teacherQualificationsTab.click();
	}

	async selectReligiousEducationMap(): Promise<void> {
		this.selectedMap = 'education';
		await this.religiousEducationTab.click();
	}

	async selectChildcareMapByKeyboard(): Promise<void> {
		this.selectedMap = 'education';
		await this.schoolUniformsTab.focus();
		await this.schoolUniformsTab.press('ArrowLeft');
	}

	async zoomInAndReset(): Promise<void> {
		await this.zoomInControl.click();
		await this.resetViewControl.click();
	}

	async selectCountry(countryId: CountryId): Promise<void> {
		const map = this.selectedMap === 'renewable' ? this.map : this.educationMap;
		await map.getByTestId(`map-region-${countryId}`).click();
	}

	async hoverCountry(countryId: CountryId): Promise<void> {
		const map = this.selectedMap === 'renewable' ? this.map : this.educationMap;
		await map.getByTestId(`map-region-${countryId}`).hover();
	}

	async hoverCountryWithoutOECDData(): Promise<void> {
		this.selectedMap = 'education';
		await this.educationCountryWithoutMetric.hover();
	}

	getErrors(): string[] {
		return [...this.browserErrors];
	}
}
