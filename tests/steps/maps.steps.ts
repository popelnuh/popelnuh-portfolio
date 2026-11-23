import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { Given, When, Then } = createBdd(test);

Given('I open the Maps page', async ({ mapsPage }) => {
	await mapsPage.goto();
});

Given('I open the Maps page with dataset {string}', async ({ mapsPage }, datasetKey) => {
	await mapsPage.gotoDataset(datasetKey);
});

Then('the Maps URL includes dataset {string}', async ({ mapsPage }, datasetKey) => {
	expect(new URL(mapsPage.getCurrentUrl()).searchParams.get('dataset')).toBe(datasetKey);
});

Then('the Maps contents links point to all map sections', async ({ mapsPage }) => {
	await expect(mapsPage.educationContentsLink).toHaveAttribute(
		'href',
		'#european-education-insights',
	);
	await expect(mapsPage.worldContentsLink).toHaveAttribute('href', '#world-travel-map');
	await expect(mapsPage.renewableContentsLink).toHaveAttribute('href', '#renewable-energy');
});

When('I navigate to the Renewable Energy section', async ({ mapsPage }) => {
	await mapsPage.viewRenewableEnergySection();
});

Then('the Renewable Energy section follows the World Travel Map', async ({ mapsPage }) => {
	await expect(mapsPage.renewableMapSection).toBeVisible();
	expect(await mapsPage.renewableEnergySectionFollowsWorldMap()).toBe(true);
});

When('I follow the World Travel Map contents link', async ({ mapsPage }) => {
	await mapsPage.followWorldContentsLink();
});

Then('the world travel map section shows 38 countries', async ({ mapsPage }) => {
	await expect(mapsPage.worldMapHeading).toBeVisible();
	await expect(mapsPage.worldCountryCount).toBeVisible();
	await expect(mapsPage.worldTravelMap).toBeVisible();
	await expect(mapsPage.worldMapStatus).toHaveText(
		'World map loaded. Hover over a country to see visit status.',
	);
	await expect(mapsPage.worldResetViewControl).toBeVisible();
	await expect(mapsPage.franceWorldRegion).toBeVisible();
	await expect(mapsPage.norwayWorldRegion).toBeVisible();
	await expect(mapsPage.vaticanWorldMarker).toBeVisible();
	await expect(mapsPage.franceWorldRegion).toHaveAttribute('fill', '#0f766e');
	await expect(mapsPage.unitedStatesWorldRegion).toHaveAttribute('fill', '#0f766e');
	await expect(mapsPage.chinaWorldRegion).toHaveAttribute('fill', '#e2e8f0');
});

Then('the world map renders without browser errors', async ({ mapsPage }) => {
	await mapsPage.worldResetViewControl.click();
	expect(mapsPage.getErrors()).toEqual([]);
});

Then('the map is visible', async ({ mapsPage }) => {
	await expect(mapsPage.heading).toBeVisible();
	await expect(mapsPage.map).toBeVisible();
	await expect(mapsPage.leafletContainer).toBeVisible();
	await expect(mapsPage.mapShell).toHaveCSS('min-height', '500px');
});

Then('the map dataset tabs are rendered with Childcare Costs selected', async ({ mapsPage }) => {
	await expect(mapsPage.tabList).toBeVisible();
	await expect(mapsPage.childcareTab).toHaveAttribute('aria-selected', 'true');
	await expect(mapsPage.schoolUniformsTab).toHaveAttribute('aria-selected', 'false');
});

Then('Spain is available on the map', async ({ mapsPage }) => {
	await expect(mapsPage.spainRegion).toBeVisible();
});

Then('the reset view control is available and works without browser errors', async ({ mapsPage }) => {
	await expect(mapsPage.resetViewControl).toBeVisible();
	await mapsPage.zoomInAndReset();
	expect(mapsPage.getErrors()).toEqual([]);
});

Then('countries without a metric are styled as no data', async ({ mapsPage }) => {
	await expect(mapsPage.countryWithoutMetric).toHaveAttribute('fill', '#e5e7eb');
});

Then('the map credits the administrative boundaries', async ({ mapsPage }) => {
	await expect(mapsPage.attribution).toContainText(
		'EuroGeographics for the administrative boundaries',
	);
});

When('I select Spain', async ({ mapsPage }) => {
	await mapsPage.selectCountry('ES');
});

Then("the popup shows Spain's renewable energy share", async ({ mapsPage }) => {
	await expect(mapsPage.renewablePopup).toBeVisible();
	await expect(mapsPage.renewablePopup).toContainText('Spain');
	await expect(mapsPage.renewablePopup).toContainText('(2024): 25.4%');
});

When('I select the UK', async ({ mapsPage }) => {
	await mapsPage.selectCountry('UK');
});

Then('the UK is shown without a reported renewable-energy value', async ({ mapsPage }) => {
	await expect(mapsPage.ukRegion).toBeVisible();
	await expect(mapsPage.ukRegion).toHaveAttribute('fill', '#e5e7eb');
});

Then('the popup reports that the UK has no data', async ({ mapsPage }) => {
	await expect(mapsPage.renewablePopup).toContainText('United Kingdom');
	await expect(mapsPage.renewablePopup).toContainText('no data');
});

When('I select Türkiye', async ({ mapsPage }) => {
	await mapsPage.selectCountry('TR');
});

Then('the popup reports that Türkiye has no data', async ({ mapsPage }) => {
	await expect(mapsPage.renewablePopup).toContainText('Türkiye');
	await expect(mapsPage.renewablePopup).toContainText('no data');
});

When('I switch to the Childcare Costs map', async ({ mapsPage }) => {
	await mapsPage.selectChildcareMap();
});

When('I select Childcare Costs with the keyboard', async ({ mapsPage }) => {
	await mapsPage.selectChildcareMapByKeyboard();
});

Then('the childcare heading, legend, and source are shown', async ({ mapsPage }) => {
	await expect(mapsPage.educationStatus).toHaveText(
		'Map data loaded. Select a country for details.',
	);
	await expect(mapsPage.childcareTab).toHaveAttribute('aria-selected', 'true');
	await expect(mapsPage.schoolUniformsTab).toHaveAttribute('aria-selected', 'false');
	await expect(mapsPage.childcareHeading).toBeVisible();
	await expect(mapsPage.childcareLegend).toBeVisible();
	await expect(mapsPage.childcareLegend).toContainText('15%+');
	await expect(mapsPage.childcareSwatch).toHaveCSS('width', '14px');
	await expect(mapsPage.childcareSwatch).toHaveCSS('height', '14px');
	await expect(mapsPage.childcareSource).toHaveAttribute('href', /data-explorer\.oecd\.org/);
});

Then('the childcare map renders without browser errors', async ({ mapsPage }) => {
	await expect(mapsPage.educationCountryWithoutMetric).toBeVisible();
	await expect(mapsPage.educationCountryWithoutMetric).toHaveAttribute('fill', '#e2e8f0');
	await expect(mapsPage.educationSpainRegion).toBeVisible();
	expect(mapsPage.getErrors()).toEqual([]);
});

Then('the popup shows the UK childcare cost from OECD', async ({ mapsPage }) => {
	await expect(mapsPage.popup).toContainText('18.0% of disposable household income (2023)');
});

When('I select Greece', async ({ mapsPage }) => {
	await mapsPage.selectCountry('EL');
});

Then("the popup shows Greece's childcare cost from OECD", async ({ mapsPage }) => {
	await expect(mapsPage.popup).toContainText('Greece');
	await expect(mapsPage.popup).toContainText('7.0% of disposable household income (2023)');
});

When('I select Estonia', async ({ mapsPage }) => {
	await mapsPage.selectCountry('EE');
});

Then("the popup shows Estonia's childcare cost from OECD", async ({ mapsPage }) => {
	await expect(mapsPage.popup).toContainText('Estonia');
	await expect(mapsPage.popup).toContainText('3.0% of disposable household income (2023)');
});

When('I hover Türkiye', async ({ mapsPage }) => {
	await mapsPage.hoverCountryWithoutOECDData();
});

Then("Türkiye's tooltip explains that OECD data is unavailable", async ({ mapsPage }) => {
	await expect(mapsPage.tooltip).toContainText('Türkiye');
	await expect(mapsPage.tooltip).toContainText('No OECD data available');
	await expect(mapsPage.tooltip).not.toContainText(/undefined|NaN/);
});

When('I switch to the School Uniforms map', async ({ mapsPage }) => {
	await mapsPage.selectSchoolUniformsMap();
});

When('I switch to the Free School Meals map', async ({ mapsPage }) => {
	await mapsPage.selectFreeSchoolMealsMap();
});

When('I switch to the Summer Holidays map', async ({ mapsPage }) => {
	await mapsPage.selectSummerHolidaysMap();
});

When('I switch to the School Starting Age map', async ({ mapsPage }) => {
	await mapsPage.selectSchoolStartingAgeMap();
});

When('I switch to the Teacher Qualifications map', async ({ mapsPage }) => {
	await mapsPage.selectTeacherQualificationsMap();
});

When('I switch to the Religion in Schools map', async ({ mapsPage }) => {
	await mapsPage.selectReligiousEducationMap();
});

Then(
	'the religious education heading, four-tier legend, and map load without browser errors',
	async ({ mapsPage }) => {
		await expect(mapsPage.educationStatus).toHaveText(
			'Map data loaded. Select a country for details.',
		);
		await expect(mapsPage.religiousEducationTab).toHaveAttribute('aria-selected', 'true');
		await expect(mapsPage.religiousEducationHeading).toBeVisible();
		await expect(mapsPage.religiousEducationLegend.getByRole('listitem')).toHaveText([
			'No data',
			'Secular (Excluded from Curriculum)',
			'Non-Confessional / Comparative',
			'Confessional (With Opt-Out / Ethics)',
			'Statutory Worship / Faith-Patron System',
		]);
		await expect(mapsPage.religiousEducationSource).toHaveAttribute(
			'href',
			'https://eurydice.eacea.ec.europa.eu/national-education-systems',
		);
		await expect(mapsPage.religiousEducationAttribution).toBeVisible();
		await expect(mapsPage.educationLeafletContainer).toHaveAttribute(
			'aria-label',
			'European countries by religious education and worship policy in state schools',
		);
		await expect(mapsPage.religiousEducationMapRegion).toHaveAttribute('fill', '#d4a373');
		expect(mapsPage.getErrors()).toEqual([]);
	},
);

Then("the tooltip shows the UK's religious education policy", async ({ mapsPage }) => {
	await expect(mapsPage.tooltip).toContainText('United Kingdom');
	await expect(mapsPage.tooltip).toContainText('Statutory Worship / Faith-Patron System');
});

Then(
	'the UK religious education popup shows its note and source link',
	async ({ mapsPage }) => {
		await expect(mapsPage.popup).toContainText('United Kingdom');
		await expect(mapsPage.popup).toContainText(
			'Statutory Religious Education plus daily collective worship',
		);
		await expect(mapsPage.popup).toContainText('parental opt-out');
		await expect(mapsPage.religiousEducationSourceLink).toHaveAttribute(
			'href',
			'https://eurydice.eacea.ec.europa.eu/national-education-systems',
		);
		await expect(mapsPage.religiousEducationSourceLink).toHaveAttribute('target', '_blank');
		await expect(mapsPage.religiousEducationSourceLink).toHaveAttribute(
			'rel',
			'noopener noreferrer',
		);
		expect(mapsPage.getErrors()).toEqual([]);
	},
);

Then(
	'the teacher qualifications heading, three-tier legend, and map load without browser errors',
	async ({ mapsPage }) => {
		await expect(mapsPage.educationStatus).toHaveText(
			'Map data loaded. Select a country for details.',
		);
		await expect(mapsPage.teacherQualificationsTab).toHaveAttribute('aria-selected', 'true');
		await expect(mapsPage.teacherQualificationsHeading).toBeVisible();
		await expect(mapsPage.teacherQualificationsLegend.getByRole('listitem')).toHaveText([
			'No data',
			"Master's (Primary & Secondary)",
			"Bachelor's Primary / Master's Secondary",
			"Bachelor's + Teaching Qualification",
		]);
		await expect(mapsPage.teacherQualificationsSource).toHaveAttribute(
			'href',
			'https://eurydice.eacea.ec.europa.eu/national-education-systems',
		);
		await expect(mapsPage.teacherQualificationsAttribution).toBeVisible();
		await expect(mapsPage.educationLeafletContainer).toHaveAttribute(
			'aria-label',
			'European countries by minimum teacher qualification level',
		);
		await expect(mapsPage.teacherQualificationsMapRegion).toHaveAttribute(
			'fill',
			'#0f766e',
		);
		expect(mapsPage.getErrors()).toEqual([]);
	},
);

When('I hover Finland', async ({ mapsPage }) => {
	await mapsPage.hoverCountry('FI');
});

Then("the tooltip shows Finland's minimum teacher qualification", async ({ mapsPage }) => {
	await expect(mapsPage.tooltip).toContainText('Finland');
	await expect(mapsPage.tooltip).toContainText("Master's (Primary & Secondary)");
});

Then(
	'the Finland teacher qualifications popup shows its note and source link',
	async ({ mapsPage }) => {
		await expect(mapsPage.popup).toContainText('Finland');
		await expect(mapsPage.popup).toContainText(
			"A Master's degree (ISCED 7) is required for both primary and secondary teachers.",
		);
		await expect(mapsPage.teacherQualificationsSourceLink).toHaveAttribute(
			'href',
			'https://eurydice.eacea.ec.europa.eu/national-education-systems',
		);
		await expect(mapsPage.teacherQualificationsSourceLink).toHaveAttribute('target', '_blank');
		await expect(mapsPage.teacherQualificationsSourceLink).toHaveAttribute(
			'rel',
			'noopener noreferrer',
		);
		expect(mapsPage.getErrors()).toEqual([]);
	},
);

Then(
	'the school starting age heading, four-tier legend, and map load without browser errors',
	async ({ mapsPage }) => {
		await expect(mapsPage.educationStatus).toHaveText(
			'Map data loaded. Select a country for details.',
		);
		await expect(mapsPage.schoolStartingAgeTab).toHaveAttribute('aria-selected', 'true');
		await expect(mapsPage.schoolStartingAgeHeading).toBeVisible();
		await expect(mapsPage.schoolStartingAgeLegend.getByRole('listitem')).toHaveText([
			'No data',
			'3–4 years',
			'5 years',
			'6 years',
			'7 years',
		]);
		await expect(mapsPage.schoolStartingAgeSource).toHaveAttribute(
			'href',
			'https://eurydice.eacea.ec.europa.eu/publications',
		);
		await expect(mapsPage.schoolStartingAgeAttribution).toBeVisible();
		await expect(mapsPage.educationLeafletContainer).toHaveAttribute(
			'aria-label',
			'European countries by compulsory education starting age',
		);
		await expect(mapsPage.estoniaSchoolStartingAgeRegion).toHaveAttribute(
			'fill',
			'#cbd5e1',
		);
		expect(mapsPage.getErrors()).toEqual([]);
	},
);

When('I hover Estonia', async ({ mapsPage }) => {
	await mapsPage.hoverCountry('EE');
});

Then("the tooltip shows Estonia's compulsory starting age", async ({ mapsPage }) => {
	await expect(mapsPage.tooltip).toContainText('Estonia');
	await expect(mapsPage.tooltip).toContainText('Age 7');
});

Then('the Estonia popup shows its starting age, note, and source link', async ({ mapsPage }) => {
	await expect(mapsPage.popup).toContainText('Estonia');
	await expect(mapsPage.popup).toContainText('Age 7');
	await expect(mapsPage.popup).toContainText(
		'Compulsory basic education starts at age 7, the highest starting age in the EU.',
	);
	await expect(mapsPage.schoolStartingAgeSourceLink).toHaveAttribute(
		'href',
		'https://eurydice.eacea.ec.europa.eu/publications',
	);
	await expect(mapsPage.schoolStartingAgeSourceLink).toHaveAttribute('target', '_blank');
	await expect(mapsPage.schoolStartingAgeSourceLink).toHaveAttribute(
		'rel',
		'noopener noreferrer',
	);
	expect(mapsPage.getErrors()).toEqual([]);
});

Then(
	'the summer holidays heading, bucket legend, and map load without browser errors',
	async ({ mapsPage }) => {
		await expect(mapsPage.educationStatus).toHaveText(
			'Map data loaded. Select a country for details.',
		);
		await expect(mapsPage.summerHolidaysTab).toHaveAttribute('aria-selected', 'true');
		await expect(mapsPage.summerHolidaysHeading).toBeVisible();
		await expect(mapsPage.summerHolidaysLegend.getByRole('listitem')).toHaveText([
			'No data',
			'≤ 8 weeks',
			'> 8–10 weeks',
			'> 10–12 weeks',
			'> 12 weeks',
		]);
		await expect(mapsPage.summerHolidaysSource).toHaveAttribute(
			'href',
			'https://eurydice.eacea.ec.europa.eu/data-and-visuals/european-school-calendars',
		);
		await expect(mapsPage.summerHolidaysAttribution).toBeVisible();
		await expect(mapsPage.educationLeafletContainer).toHaveAttribute(
			'aria-label',
			'European countries by primary school summer holiday duration',
		);
		await expect(mapsPage.italyRegion).toHaveAttribute('fill', '#0f766e');
		expect(mapsPage.getErrors()).toEqual([]);
	},
);

When('I hover Italy', async ({ mapsPage }) => {
	await mapsPage.hoverCountry('IT');
});

Then("the tooltip shows Italy's summer holiday duration", async ({ mapsPage }) => {
	await expect(mapsPage.tooltip).toContainText('Italy');
	await expect(mapsPage.tooltip).toContainText('~13 weeks');
});

When('I select Italy', async ({ mapsPage }) => {
	await mapsPage.selectCountry('IT');
});

Then('the Italy popup shows its duration, note, and source link', async ({ mapsPage }) => {
	await expect(mapsPage.popup).toContainText('Italy');
	await expect(mapsPage.popup).toContainText('~13 weeks');
	await expect(mapsPage.popup).toContainText(
		'among the longest summer holidays in Europe.',
	);
	await expect(mapsPage.summerHolidaysSourceLink).toHaveAttribute(
		'href',
		'https://eurydice.eacea.ec.europa.eu/data-and-visuals/european-school-calendars',
	);
	await expect(mapsPage.summerHolidaysSourceLink).toHaveAttribute('target', '_blank');
	await expect(mapsPage.summerHolidaysSourceLink).toHaveAttribute(
		'rel',
		'noopener noreferrer',
	);
	expect(mapsPage.getErrors()).toEqual([]);
});

Then(
	'the free school meals heading, four-tier legend, and map load without browser errors',
	async ({ mapsPage }) => {
		await expect(mapsPage.educationStatus).toHaveText(
			'Map data loaded. Select a country for details.',
		);
		await expect(mapsPage.freeSchoolMealsTab).toHaveAttribute('aria-selected', 'true');
		await expect(mapsPage.freeSchoolMealsHeading).toBeVisible();
		await expect(mapsPage.freeSchoolMealsLegend.getByRole('listitem')).toHaveText([
			'No data',
			'Universal (Primary & Secondary)',
			'Partial Universal / Transitioning',
			'Targeted / Means-Tested',
			'No National Programme',
		]);
		await expect(mapsPage.freeSchoolMealsSource).toHaveAttribute(
			'href',
			'https://eurydice.eacea.ec.europa.eu/national-education-systems',
		);
		await expect(mapsPage.freeSchoolMealsAttribution).toBeVisible();
		await expect(mapsPage.freeSchoolMealsMapRegion).toBeVisible();
		await expect(mapsPage.finlandRegion).toHaveAttribute('fill', '#0f766e');
		expect(mapsPage.getErrors()).toEqual([]);
	},
);

When('I select Finland', async ({ mapsPage }) => {
	await mapsPage.selectCountry('FI');
});

Then('the Finland popup shows its policy note and source link', async ({ mapsPage }) => {
	await expect(mapsPage.popup).toContainText('Finland');
	await expect(mapsPage.popup).toContainText(
		'Universal free hot school meals have been provided to all primary and secondary pupils since 1948.',
	);
	await expect(mapsPage.freeSchoolMealsSourceLink).toHaveAttribute(
		'href',
		'https://eurydice.eacea.ec.europa.eu/national-education-systems/finland/overview',
	);
	await expect(mapsPage.freeSchoolMealsSourceLink).toHaveAttribute('target', '_blank');
	await expect(mapsPage.freeSchoolMealsSourceLink).toHaveAttribute(
		'rel',
		'noopener noreferrer',
	);
});

Then('the school uniform heading, legend, and map load without browser errors', async ({ mapsPage }) => {
	await expect(mapsPage.educationStatus).toHaveText(
		'Map data loaded. Select a country for details.',
	);
	await expect(mapsPage.schoolUniformsTab).toHaveAttribute('aria-selected', 'true');
	await expect(mapsPage.schoolUniformsHeading).toBeVisible();
	await expect(mapsPage.schoolUniformsLegend.getByRole('listitem')).toHaveText([
		'No data',
		'Standard in state schools',
		'Mostly private / optional',
		'Not used in state schools',
	]);
	await expect(mapsPage.educationSpainRegion).toBeVisible();
	expect(mapsPage.getErrors()).toEqual([]);
});

When('I hover the UK', async ({ mapsPage }) => {
	await mapsPage.hoverCountry('UK');
});

Then('the tooltip shows the country and policy category', async ({ mapsPage }) => {
	await expect(mapsPage.tooltip).toContainText('United Kingdom');
	await expect(mapsPage.tooltip).toContainText('Standard in state schools');
});

Then('the UK popup shows its policy note and source link', async ({ mapsPage }) => {
	await expect(mapsPage.popup).toContainText('United Kingdom');
	await expect(mapsPage.popup).toContainText(
		'Standard in over 90% of state schools, set at school level rather than national law.',
	);
	await expect(mapsPage.uniformSourceLink).toHaveAttribute(
		'href',
		'https://www.gov.uk/government/publications/school-uniform/school-uniforms',
	);
	await expect(mapsPage.uniformSourceLink).toHaveAttribute('target', '_blank');
	await expect(mapsPage.uniformSourceLink).toHaveAttribute('rel', 'noopener noreferrer');
});
