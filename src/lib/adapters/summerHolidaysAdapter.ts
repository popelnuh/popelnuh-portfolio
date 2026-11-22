import { isSafeHttpsUrl } from './schoolUniformsAdapter';

export interface SummerHolidayRecord {
	giscoId: string;
	country: string;
	weeks: number;
	note: string;
	sourceLabel: string;
	sourceUrl: string;
}

export interface SummerHolidayDataset {
	dataset: string;
	referencePeriod: string;
	values: SummerHolidayRecord[];
}

export function adaptSummerHolidayDataset(input: unknown): Record<string, SummerHolidayRecord> {
	if (!isRecord(input)) {
		throw new Error('Invalid summer holidays dataset: expected an object');
	}
	if (requiredString(input.dataset, 'dataset') === '') {
		throw new Error('Invalid summer holidays dataset: dataset must be a non-empty string');
	}
	if (requiredString(input.referencePeriod, 'referencePeriod') === '') {
		throw new Error('Invalid summer holidays dataset: referencePeriod must be a non-empty string');
	}
	if (!Array.isArray(input.values)) {
		throw new Error('Invalid summer holidays dataset: values must be an array');
	}

	const records: Record<string, SummerHolidayRecord> = {};

	for (const [index, rawRecord] of input.values.entries()) {
		if (!isRecord(rawRecord)) {
			throw new Error(`Invalid summer holiday record at index ${index}: expected an object`);
		}

		const giscoId = rawRecord.giscoId;
		if (typeof giscoId !== 'string' || !/^[A-Z]{2}$/.test(giscoId)) {
			throw new Error(`Invalid GISCO ID for summer holiday record at index ${index}`);
		}
		if (Object.prototype.hasOwnProperty.call(records, giscoId)) {
			throw new Error(`Duplicate GISCO ID ${giscoId} in summer holiday data`);
		}

		const country = requiredString(rawRecord.country, 'country', giscoId);
		const weeks = rawRecord.weeks;
		if (typeof weeks !== 'number' || !Number.isFinite(weeks) || weeks <= 0) {
			throw new Error(`Invalid summer holiday duration for ${giscoId}`);
		}

		const note = requiredString(rawRecord.note, 'note', giscoId);
		const sourceLabel = requiredString(rawRecord.sourceLabel, 'sourceLabel', giscoId);
		const sourceUrl = rawRecord.sourceUrl;
		if (!isSafeHttpsUrl(sourceUrl)) {
			throw new Error(`Invalid HTTPS source URL for summer holiday record ${giscoId}`);
		}

		records[giscoId] = { giscoId, country, weeks, note, sourceLabel, sourceUrl };
	}

	return records;
}

function requiredString(value: unknown, field: string, giscoId?: string): string {
	if (typeof value !== 'string' || value.trim() === '') {
		const context = giscoId ? ` for ${giscoId}` : '';
		throw new Error(`Invalid ${field}${context} in summer holidays data`);
	}
	return value.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
