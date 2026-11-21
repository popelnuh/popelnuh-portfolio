import type { FeatureCollection, Geometry } from 'geojson';

export interface CountryBoundaryProperties {
	CNTR_ID: string;
	CNTR_NAME?: string;
	NAME_ENGL?: string;
	[key: string]: unknown;
}

export interface RenewableEnergyDataset {
	dataset: string;
	indicator: string;
	referenceYear: number;
	unit: string;
	sourceUrl: string;
	estimatedCNTR_IDs: string[];
	valuesByCNTR_ID: Record<string, number>;
}

export interface JoinedCountryProperties extends CountryBoundaryProperties {
	renewable_energy_pct: number | null;
	choropleth_color: string;
	estimated: boolean;
}

export type CountryBoundaries = FeatureCollection<Geometry, CountryBoundaryProperties>;
export type JoinedCountryBoundaries = FeatureCollection<Geometry, JoinedCountryProperties>;

export const NO_DATA_COLOR = '#e5e7eb';

export function getRenewableEnergyColor(value: number | null): string {
	if (value === null || !Number.isFinite(value)) return NO_DATA_COLOR;
	if (value >= 60) return '#2f6f9f';
	if (value >= 40) return '#5f98b5';
	if (value >= 25) return '#92bac8';
	if (value >= 15) return '#bfd4d8';
	return '#e6eceb';
}

export function joinRenewableEnergyData(
	boundaries: CountryBoundaries,
	metrics: RenewableEnergyDataset,
): JoinedCountryBoundaries {
	return {
		...boundaries,
		features: boundaries.features.map((feature) => {
			const properties = feature.properties;
			if (!properties || !properties.CNTR_ID) {
				throw new Error('Country boundary feature is missing CNTR_ID');
			}

			const value = metrics.valuesByCNTR_ID[properties.CNTR_ID] ?? null;
			if (value !== null && (!Number.isFinite(value) || value < 0 || value > 100)) {
				throw new Error(`Invalid renewable energy percentage for ${properties.CNTR_ID}`);
			}

			return {
				...feature,
				properties: {
					...properties,
					renewable_energy_pct: value,
					choropleth_color: getRenewableEnergyColor(value),
					estimated: metrics.estimatedCNTR_IDs.includes(properties.CNTR_ID),
				},
			};
		}),
	};
}
