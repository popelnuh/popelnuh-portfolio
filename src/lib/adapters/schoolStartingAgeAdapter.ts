import { isSafeHttpsUrl } from './schoolUniformsAdapter';

export interface SchoolStartingAgeRecord {
	giscoId: string;
	country: string;
	age: number;
	note: string;
	sourceLabel: string;
	sourceUrl: string;
}

export interface SchoolStartingAgeDataset {
	dataset: string;
	referencePeriod: string;
	values: SchoolStartingAgeRecord[];
}

export function adaptSchoolStartingAgeDataset(
	input: unknown,
): Record<string, SchoolStartingAgeRecord> {
	if (!isRecord(input)) {
		throw new Error('Invalid school starting age dataset: expected an object');
	}
	requiredString(input.dataset, 'dataset');
	requiredString(input.referencePeriod, 'referencePeriod');
	if (!Array.isArray(input.values)) {
		throw new Error('Invalid school starting age dataset: values must be an array');
	}

	const records: Record<string, SchoolStartingAgeRecord> = {};

	for (const [index, rawRecord] of input.values.entries()) {
		if (!isRecord(rawRecord)) {
			throw new Error(`Invalid school starting age record at index ${index}: expected an object`);
		}

		const giscoId = rawRecord.giscoId;
		if (typeof giscoId !== 'string' || !/^[A-Z]{2}$/.test(giscoId)) {
			throw new Error(`Invalid GISCO ID for school starting age record at index ${index}`);
		}
		if (Object.prototype.hasOwnProperty.call(records, giscoId)) {
			throw new Error(`Duplicate GISCO ID ${giscoId} in school starting age data`);
		}

		const country = requiredString(rawRecord.country, 'country', giscoId);
		const age = rawRecord.age;
		if (typeof age !== 'number' || !Number.isFinite(age) || age < 3 || age > 8) {
			throw new Error(`Invalid compulsory starting age for ${giscoId}`);
		}

		const note = requiredString(rawRecord.note, 'note', giscoId);
		const sourceLabel = requiredString(rawRecord.sourceLabel, 'sourceLabel', giscoId);
		const sourceUrl = rawRecord.sourceUrl;
		if (!isSafeHttpsUrl(sourceUrl)) {
			throw new Error(`Invalid HTTPS source URL for school starting age record ${giscoId}`);
		}

		records[giscoId] = { giscoId, country, age, note, sourceLabel, sourceUrl };
	}

	return records;
}

function requiredString(value: unknown, field: string, giscoId?: string): string {
	if (typeof value !== 'string' || value.trim() === '') {
		const context = giscoId ? ` for ${giscoId}` : '';
		throw new Error(`Invalid ${field}${context} in school starting age data`);
	}
	return value.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
