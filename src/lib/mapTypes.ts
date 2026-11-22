import type { FeatureCollection, Geometry } from 'geojson';

export interface CountryBoundaryProperties {
	CNTR_ID: string;
	CNTR_NAME?: string;
	NAME_ENGL?: string;
	[key: string]: unknown;
}

export interface MapMetricRecord {
	country: string;
	value: number;
	year: number;
	unit: string;
	estimated?: boolean;
}

export interface MapMetricProperties extends CountryBoundaryProperties {
	metricValue: number | null;
	estimated: boolean;
}

export type CountryBoundaries = FeatureCollection<Geometry, CountryBoundaryProperties>;
export type MapMetricBoundaries = FeatureCollection<Geometry, MapMetricProperties>;
