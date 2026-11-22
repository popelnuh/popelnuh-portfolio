export const SCHOOL_UNIFORM_CATEGORIES = [
	'standard',
	'optional_or_private',
	'not_used',
] as const;

export type SchoolUniformCategory = (typeof SCHOOL_UNIFORM_CATEGORIES)[number];

export interface SchoolUniformRecord {
	giscoId: string;
	country: string;
	category: SchoolUniformCategory;
	note: string;
	sourceLabel: string;
	sourceUrl: string;
}

export interface SchoolUniformDataset {
	dataset: string;
	referencePeriod: string;
	values: SchoolUniformRecord[];
}

export function isSafeHttpsUrl(value: unknown): value is string {
	if (typeof value !== 'string') return false;

	try {
		const url = new URL(value);
		return url.protocol === 'https:' && url.hostname.length > 0;
	} catch {
		return false;
	}
}

export function adaptSchoolUniformsDataset(input: unknown): Record<string, SchoolUniformRecord> {
	if (!isRecord(input)) {
		throw new Error('Invalid school uniforms dataset: expected an object');
	}
	if (typeof input.dataset !== 'string' || input.dataset.trim() === '') {
		throw new Error('Invalid school uniforms dataset: dataset must be a non-empty string');
	}
	if (typeof input.referencePeriod !== 'string' || input.referencePeriod.trim() === '') {
		throw new Error('Invalid school uniforms dataset: referencePeriod must be a non-empty string');
	}
	if (!Array.isArray(input.values)) {
		throw new Error('Invalid school uniforms dataset: values must be an array');
	}

	const records: Record<string, SchoolUniformRecord> = {};

	for (const [index, rawRecord] of input.values.entries()) {
		if (!isRecord(rawRecord)) {
			throw new Error(`Invalid school uniforms record at index ${index}: expected an object`);
		}

		const giscoId = rawRecord.giscoId;
		if (typeof giscoId !== 'string' || !/^[A-Z]{2}$/.test(giscoId)) {
			throw new Error(`Invalid GISCO ID for school uniforms record at index ${index}`);
		}
		if (Object.prototype.hasOwnProperty.call(records, giscoId)) {
			throw new Error(`Duplicate GISCO ID ${giscoId} in school uniforms data`);
		}

		const country = requiredString(rawRecord.country, 'country', giscoId);
		const category = rawRecord.category;
		if (!isSchoolUniformCategory(category)) {
			throw new Error(`Invalid school uniform category for ${giscoId}`);
		}
		const note = requiredString(rawRecord.note, 'note', giscoId);
		const sourceLabel = requiredString(rawRecord.sourceLabel, 'sourceLabel', giscoId);
		const sourceUrl = rawRecord.sourceUrl;
		if (!isSafeHttpsUrl(sourceUrl)) {
			throw new Error(`Invalid HTTPS source URL for ${giscoId}`);
		}

		records[giscoId] = { giscoId, country, category, note, sourceLabel, sourceUrl };
	}

	return records;
}

function isSchoolUniformCategory(value: unknown): value is SchoolUniformCategory {
	return SCHOOL_UNIFORM_CATEGORIES.some((category) => category === value);
}

function requiredString(value: unknown, field: string, giscoId: string): string {
	if (typeof value !== 'string' || value.trim() === '') {
		throw new Error(`Invalid ${field} for school uniforms record ${giscoId}`);
	}
	return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
