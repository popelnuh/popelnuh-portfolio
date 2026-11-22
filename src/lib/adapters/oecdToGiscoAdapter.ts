import type { MapMetricRecord } from '../mapTypes';

export interface OecdChildcareCostRecord {
	iso3: string;
	country: string;
	netCostPctIncome?: number | null;
	year: number;
}

export interface OecdChildcareDataset {
	dataset: string;
	indicator: string;
	referenceYear: number;
	unit: string;
	sourceUrl: string;
	household: string;
	childrenAges: number[];
	earningsScenario: string;
	values: OecdChildcareCostRecord[];
}

const OECD_TO_GISCO_CODE: Readonly<Record<string, string>> = {
	AUT: 'AT',
	BEL: 'BE',
	CHE: 'CH',
	CZE: 'CZ',
	DEU: 'DE',
	DNK: 'DK',
	ESP: 'ES',
	EST: 'EE',
	FIN: 'FI',
	FRA: 'FR',
	GBR: 'UK',
	GRC: 'EL',
	HUN: 'HU',
	IRL: 'IE',
	ISL: 'IS',
	ITA: 'IT',
	LTU: 'LT',
	LUX: 'LU',
	LVA: 'LV',
	NLD: 'NL',
	NOR: 'NO',
	POL: 'PL',
	PRT: 'PT',
	SVK: 'SK',
	SVN: 'SI',
	SWE: 'SE',
};

export function adaptOecdToGisco(
	input: unknown,
): Record<string, MapMetricRecord> {
	if (!isRecord(input)) {
		throw new Error('Invalid OECD childcare dataset: expected an object');
	}
	if (!Array.isArray(input.values)) {
		throw new Error('Invalid OECD childcare dataset: values must be an array');
	}
	const referenceYear = input.referenceYear;
	if (typeof referenceYear !== 'number' || !Number.isInteger(referenceYear)) {
		throw new Error('Invalid OECD childcare dataset: referenceYear must be an integer');
	}
	const unit = input.unit;
	if (typeof unit !== 'string' || unit.trim() === '') {
		throw new Error('Invalid OECD childcare dataset: unit must be a non-empty string');
	}

	const records: Record<string, MapMetricRecord> = {};
	const seenGiscoIds = new Set<string>();

	for (const [index, entry] of input.values.entries()) {
		if (!isRecord(entry)) {
			throw new Error(`Invalid OECD childcare record at index ${index}: expected an object`);
		}

		const iso3 = entry.iso3;
		if (typeof iso3 !== 'string' || iso3.trim() === '') {
			throw new Error(`Invalid OECD childcare record at index ${index}: iso3 must be a string`);
		}

		const giscoId = Object.prototype.hasOwnProperty.call(OECD_TO_GISCO_CODE, iso3)
			? OECD_TO_GISCO_CODE[iso3]
			: undefined;
		if (!giscoId) {
			throw new Error(`No GISCO country code configured for OECD ISO3 code ${iso3}`);
		}
		if (seenGiscoIds.has(giscoId)) {
			throw new Error(`Duplicate GISCO country code ${giscoId} in OECD childcare data`);
		}
		seenGiscoIds.add(giscoId);

		const country = entry.country;
		if (typeof country !== 'string' || country.trim() === '') {
			throw new Error(`Invalid country name for OECD ISO3 code ${iso3}`);
		}

		const year = entry.year;
		if (typeof year !== 'number' || !Number.isInteger(year) || year !== referenceYear) {
			throw new Error(`Unexpected childcare data year for ${iso3}: ${String(year)}`);
		}

		const value = entry.netCostPctIncome;
		if (value === null || value === undefined) continue;
		if (
			typeof value !== 'number' ||
			!Number.isFinite(value) ||
			value < 0 ||
			value > 100
		) {
			throw new Error(`Invalid net childcare cost percentage for ${iso3}`);
		}

		records[giscoId] = {
			country,
			value,
			year,
			unit,
		};
	}

	return records;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
