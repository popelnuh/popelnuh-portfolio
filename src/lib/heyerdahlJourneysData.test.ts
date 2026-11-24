import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface JourneyProperties {
	id: string;
	name: string;
	year: number;
	vessel: string;
	departure: string;
	arrival: string;
	distance_nm: number;
	duration_days: number;
	status: string;
	summary: string;
	color: string;
}

interface JourneyFeature {
	type: string;
	id: string;
	properties: JourneyProperties;
	geometry: {
		type: string;
		coordinates: number[][];
	};
}

interface JourneyCollection {
	type: string;
	features: JourneyFeature[];
}

const collection = JSON.parse(
	readFileSync(new URL('../data/heyerdahl-journeys.geojson', import.meta.url), 'utf8'),
) as JourneyCollection;

describe('Heyerdahl expedition GeoJSON', () => {
	it('is a FeatureCollection containing all four expeditions', () => {
		expect(collection.type).toBe('FeatureCollection');
		expect(collection.features).toHaveLength(4);
		expect(new Set(collection.features.map(({ properties }) => properties.id))).toEqual(
			new Set(['kon-tiki', 'ra-i', 'ra-ii', 'tigris']),
		);
	});

	it('provides complete LineString metadata and valid longitude/latitude pairs', () => {
		for (const feature of collection.features) {
			expect(feature.type).toBe('Feature');
			expect(feature.id).toBe(feature.properties.id);
			expect(feature.geometry.type).toBe('LineString');
			expect(feature.geometry.coordinates.length).toBeGreaterThanOrEqual(2);

			expect(feature.properties.name).toBeTruthy();
			expect(Number.isInteger(feature.properties.year)).toBe(true);
			expect(feature.properties.vessel).toBeTruthy();
			expect(feature.properties.departure).toBeTruthy();
			expect(feature.properties.arrival).toBeTruthy();
			expect(feature.properties.color).toMatch(/^#[\da-f]{6}$/i);
			expect(feature.properties.summary).toBeTruthy();
			expect(feature.properties.distance_nm).toBeGreaterThan(0);
			expect(feature.properties.duration_days).toBeGreaterThan(0);
			expect(feature.properties.status).toBeTruthy();

			for (const coordinate of feature.geometry.coordinates) {
				expect(coordinate).toHaveLength(2);
				const [longitude, latitude] = coordinate;
				expect(Number.isFinite(longitude)).toBe(true);
				expect(Number.isFinite(latitude)).toBe(true);
				expect(longitude).toBeGreaterThanOrEqual(-180);
				expect(longitude).toBeLessThanOrEqual(180);
				expect(latitude).toBeGreaterThanOrEqual(-90);
				expect(latitude).toBeLessThanOrEqual(90);
			}
		}
	});
});
