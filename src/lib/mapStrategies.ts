import { getRenewableEnergyColor, NO_DATA_COLOR } from './renewableEnergyAdapter';
import type { MapMetricValue } from './mapTypes';
import {
	isSafeHttpsUrl,
	type SchoolUniformCategory,
} from './adapters/schoolUniformsAdapter';

export type MapStrategyKey = 'renewable' | 'childcare' | 'school-uniforms';

export interface MapLegendItem {
	label: string;
	color: string;
}

export interface MapTooltipContext {
	country: string;
	value: MapMetricValue;
	year?: number;
	estimated: boolean;
	indicator: string;
	unit: string;
	note?: string;
	sourceLabel?: string;
	sourceUrl?: string;
}

export interface MapPopupDetails {
	valueLabel: string;
	note?: string;
	sourceLabel?: string;
	sourceUrl?: string;
}

export interface MapRenderingStrategy {
	title: string;
	description: string;
	ariaLabel: string;
	legendLabel: string;
	sourceUrl: string;
	sourceLabel: string;
	sourceDetail: string;
	unitLabel: string;
	legendIntervals: readonly MapLegendItem[];
	colorScale: (value: MapMetricValue) => string;
	formatTooltip: (context: MapTooltipContext) => string;
	formatPopup?: (context: MapTooltipContext) => MapPopupDetails;
}

export const CHILDCARE_NO_DATA_COLOR = '#e2e8f0';
export const SCHOOL_UNIFORMS_NO_DATA_COLOR = '#f1f5f9';

const SCHOOL_UNIFORM_CATEGORY_LABELS: Record<SchoolUniformCategory, string> = {
	standard: 'Standard in state schools',
	optional_or_private: 'Mostly private / optional',
	not_used: 'Not used in state schools',
};

const SCHOOL_UNIFORM_CATEGORY_COLORS: Record<SchoolUniformCategory, string> = {
	standard: '#0f766e',
	optional_or_private: '#d4a373',
	not_used: '#cbd5e1',
};

export function getChildcareCostColor(value: number | null): string {
	if (value === null || !Number.isFinite(value)) return CHILDCARE_NO_DATA_COLOR;
	if (value >= 15) return '#bd0026';
	if (value >= 10) return '#f03b20';
	if (value >= 5) return '#feb24c';
	return '#ffeda0';
}

export function getSchoolUniformCategoryLabel(value: MapMetricValue): string {
	if (typeof value !== 'string' || !isSchoolUniformCategory(value)) {
		return 'No policy data available';
	}
	return SCHOOL_UNIFORM_CATEGORY_LABELS[value];
}

export function getSchoolUniformColor(value: MapMetricValue): string {
	if (typeof value !== 'string' || !isSchoolUniformCategory(value)) {
		return SCHOOL_UNIFORMS_NO_DATA_COLOR;
	}
	return SCHOOL_UNIFORM_CATEGORY_COLORS[value];
}

export function formatSchoolUniformPopup(context: MapTooltipContext): MapPopupDetails {
	if (context.value === null) {
		return {
			valueLabel: 'No policy data available',
			note: 'No curated school-uniform policy entry is available for this country.',
		};
	}

	const details: MapPopupDetails = {
		valueLabel: getSchoolUniformCategoryLabel(context.value),
	};
	if (context.note?.trim()) details.note = context.note.trim();
	if (context.sourceLabel?.trim() && isSafeHttpsUrl(context.sourceUrl)) {
		details.sourceLabel = context.sourceLabel.trim();
		details.sourceUrl = context.sourceUrl;
	}
	return details;
}

function isSchoolUniformCategory(value: string): value is SchoolUniformCategory {
	return Object.prototype.hasOwnProperty.call(SCHOOL_UNIFORM_CATEGORY_LABELS, value);
}

export const schoolUniformsStrategy: MapRenderingStrategy = {
	title: 'School Uniform Policies Across Europe',
	description:
		'Curated qualitative policy data compiled from Eurydice (European Commission) and national education ministry guidance (2024–2026), reflecting prevailing de facto practice in state schools rather than national legal mandates.',
	ariaLabel: 'European countries by school uniform policy',
	legendLabel: 'School uniform policy legend',
	sourceUrl: 'https://eurydice.eacea.ec.europa.eu/national-education-systems',
	sourceLabel: 'Eurydice – European Commission',
	sourceDetail: 'Selected-country popups include policy notes and country-specific source links.',
	unitLabel: 'policy category',
	legendIntervals: [
		{ label: 'No data', color: SCHOOL_UNIFORMS_NO_DATA_COLOR },
		{ label: 'Standard in state schools', color: SCHOOL_UNIFORM_CATEGORY_COLORS.standard },
		{
			label: 'Mostly private / optional',
			color: SCHOOL_UNIFORM_CATEGORY_COLORS.optional_or_private,
		},
		{ label: 'Not used in state schools', color: SCHOOL_UNIFORM_CATEGORY_COLORS.not_used },
	],
	colorScale: getSchoolUniformColor,
	formatTooltip: ({ value }) => getSchoolUniformCategoryLabel(value),
	formatPopup: formatSchoolUniformPopup,
};

export const mapStrategies: Record<MapStrategyKey, MapRenderingStrategy> = {
	renewable: {
		title: 'Renewable Energy',
		description: 'Renewable energy share in gross final energy consumption, 2024.',
		ariaLabel: 'European countries by renewable energy share',
		legendLabel: 'Renewable energy share legend',
		sourceUrl:
			'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_ind_ren?nrg_bal=REN&unit=PC&sinceTimePeriod=2024&untilTimePeriod=2024',
		sourceLabel: 'Eurostat nrg_ind_ren (2024)',
		sourceDetail:
			'The United Kingdom has no 2024 observation; gray indicates countries without a reported value.',
		unitLabel: '%',
		legendIntervals: [
			{ label: 'No data', color: NO_DATA_COLOR },
			{ label: '< 15%', color: '#e6eceb' },
			{ label: '15–24.9%', color: '#bfd4d8' },
			{ label: '25–39.9%', color: '#92bac8' },
			{ label: '40–59.9%', color: '#5f98b5' },
			{ label: '60%+', color: '#2f6f9f' },
		],
		colorScale: (value) =>
			typeof value === 'number' ? getRenewableEnergyColor(value) : NO_DATA_COLOR,
		formatTooltip: ({ value, year, estimated, indicator, unit }) =>
			typeof value !== 'number'
				? `${indicator}: no data`
				: `${indicator}${year === undefined ? '' : ` (${year})`}: ${value.toFixed(1)}${unit}${estimated ? ' (estimate)' : ''}`,
	},
	childcare: {
		title: 'Net Childcare Costs Across Europe',
		description:
			'Net childcare cost as % of disposable household income · Couple, 2 children (ages 2 and 3) · 2023. Earnings scenario: reference person at 100%, spouse at 67% of average wage.',
		ariaLabel: 'European countries by net childcare cost',
		legendLabel: 'Net childcare cost legend',
		sourceUrl:
			'https://data-explorer.oecd.org/vis?lc=en&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_TAXBEN_NCC%40DF_NCC&df[ag]=OECD.ELS.JAI&dq=.NCF.PT_INC_DISP_HH.AW100.C_C2.Y2_3.AW67.YES.YES.YES._T.A&pd=2023%2C2023&vw=tb',
		sourceLabel: 'OECD Data Explorer',
		sourceDetail: 'No OECD data is available for countries without an observation.',
		unitLabel: '% of disposable household income',
		legendIntervals: [
			{ label: 'No OECD data', color: CHILDCARE_NO_DATA_COLOR },
			{ label: '0–4.9%', color: '#ffeda0' },
			{ label: '5–9.9%', color: '#feb24c' },
			{ label: '10–14.9%', color: '#f03b20' },
			{ label: '15%+', color: '#bd0026' },
		],
		colorScale: (value) =>
			typeof value === 'number' ? getChildcareCostColor(value) : CHILDCARE_NO_DATA_COLOR,
		formatTooltip: ({ value, year, unit }) =>
			typeof value !== 'number'
				? 'No OECD data available'
				: `${value.toFixed(1)}${unit}${year === undefined ? '' : ` (${year})`}`,
	},
	'school-uniforms': schoolUniformsStrategy,
};
