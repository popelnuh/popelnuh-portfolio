import { getRenewableEnergyColor, NO_DATA_COLOR } from './renewableEnergyAdapter';

export type MapStrategyKey = 'renewable' | 'childcare';

export interface MapLegendItem {
	label: string;
	color: string;
}

export interface MapTooltipContext {
	value: number | null;
	year: number;
	estimated: boolean;
	indicator: string;
	unit: string;
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
	colorScale: (value: number | null) => string;
	formatTooltip: (context: MapTooltipContext) => string;
}

export const CHILDCARE_NO_DATA_COLOR = '#e2e8f0';

export function getChildcareCostColor(value: number | null): string {
	if (value === null || !Number.isFinite(value)) return CHILDCARE_NO_DATA_COLOR;
	if (value >= 15) return '#bd0026';
	if (value >= 10) return '#f03b20';
	if (value >= 5) return '#feb24c';
	return '#ffeda0';
}

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
		colorScale: getRenewableEnergyColor,
		formatTooltip: ({ value, year, estimated, indicator, unit }) =>
			value === null
				? `${indicator}: no data`
				: `${indicator} (${year}): ${value.toFixed(1)}${unit}${estimated ? ' (estimate)' : ''}`,
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
		colorScale: getChildcareCostColor,
		formatTooltip: ({ value, year, unit }) =>
			value === null ? 'No OECD data available' : `${value.toFixed(1)}${unit} (${year})`,
	},
};
