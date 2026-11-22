export const SCHOOL_UNIFORM_CATEGORIES = [
	'standard',
	'optional_or_private',
	'not_used',
] as const;

export type SchoolUniformCategory = (typeof SCHOOL_UNIFORM_CATEGORIES)[number];

export const FREE_SCHOOL_MEALS_CATEGORIES = [
	'universal',
	'partial_universal',
	'targeted',
	'none',
] as const;

export type FreeSchoolMealsCategory = (typeof FREE_SCHOOL_MEALS_CATEGORIES)[number];

export const TEACHER_QUALIFICATIONS_CATEGORIES = [
	'masters_all',
	'masters_secondary_only',
	'bachelors_all',
] as const;

export const RELIGIOUS_EDUCATION_CATEGORIES = [
	'secular',
	'non_confessional',
	'confessional_opt_out',
	'statutory_worship_or_patron',
] as const;

export type TeacherQualificationsCategory =
	(typeof TEACHER_QUALIFICATIONS_CATEGORIES)[number];
export type ReligiousEducationCategory =
	(typeof RELIGIOUS_EDUCATION_CATEGORIES)[number];
export type CategoricalPolicyCategory =
	| SchoolUniformCategory
	| FreeSchoolMealsCategory
	| TeacherQualificationsCategory
	| ReligiousEducationCategory;

export interface CategoricalPolicyRecord<T extends CategoricalPolicyCategory = CategoricalPolicyCategory> {
	giscoId: string;
	country: string;
	category: T;
	note: string;
	sourceLabel: string;
	sourceUrl: string;
}

export type SchoolUniformRecord = CategoricalPolicyRecord<SchoolUniformCategory>;
export type FreeSchoolMealsRecord = CategoricalPolicyRecord<FreeSchoolMealsCategory>;
export type TeacherQualificationsRecord =
	CategoricalPolicyRecord<TeacherQualificationsCategory>;
export type ReligiousEducationRecord =
	CategoricalPolicyRecord<ReligiousEducationCategory>;

export interface SchoolUniformDataset {
	dataset: string;
	referencePeriod: string;
	values: SchoolUniformRecord[];
}

export interface FreeSchoolMealsDataset {
	dataset: string;
	referencePeriod: string;
	values: FreeSchoolMealsRecord[];
}

export interface TeacherQualificationsDataset {
	dataset: string;
	referencePeriod: string;
	values: TeacherQualificationsRecord[];
}

export interface ReligiousEducationDataset {
	dataset: string;
	referencePeriod: string;
	values: ReligiousEducationRecord[];
}

const CATEGORICAL_POLICY_CATEGORIES: readonly CategoricalPolicyCategory[] = [
	...SCHOOL_UNIFORM_CATEGORIES,
	...FREE_SCHOOL_MEALS_CATEGORIES,
	...TEACHER_QUALIFICATIONS_CATEGORIES,
	...RELIGIOUS_EDUCATION_CATEGORIES,
];

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
	return adaptDataset(input, SCHOOL_UNIFORM_CATEGORIES, 'school uniforms');
}

export function adaptFreeSchoolMealsDataset(
	input: unknown,
): Record<string, FreeSchoolMealsRecord> {
	return adaptDataset(input, FREE_SCHOOL_MEALS_CATEGORIES, 'free school meals');
}

export function adaptTeacherQualificationsDataset(
	input: unknown,
): Record<string, TeacherQualificationsRecord> {
	return adaptDataset(
		input,
		TEACHER_QUALIFICATIONS_CATEGORIES,
		'teacher qualifications',
	);
}

export function adaptReligiousEducationDataset(
	input: unknown,
): Record<string, ReligiousEducationRecord> {
	return adaptDataset(input, RELIGIOUS_EDUCATION_CATEGORIES, 'religious education');
}

export function adaptCategoricalPolicyDataset(
	input: unknown,
): Record<string, CategoricalPolicyRecord> {
	return adaptDataset(input, CATEGORICAL_POLICY_CATEGORIES, 'categorical policy');
}

function adaptDataset<T extends CategoricalPolicyCategory>(
	input: unknown,
	categories: readonly T[],
	datasetName: string,
): Record<string, CategoricalPolicyRecord<T>> {
	if (!isRecord(input)) {
		throw new Error(`Invalid ${datasetName} dataset: expected an object`);
	}
	if (typeof input.dataset !== 'string' || input.dataset.trim() === '') {
		throw new Error(`Invalid ${datasetName} dataset: dataset must be a non-empty string`);
	}
	if (typeof input.referencePeriod !== 'string' || input.referencePeriod.trim() === '') {
		throw new Error(
			`Invalid ${datasetName} dataset: referencePeriod must be a non-empty string`,
		);
	}
	if (!Array.isArray(input.values)) {
		throw new Error(`Invalid ${datasetName} dataset: values must be an array`);
	}

	const records: Record<string, CategoricalPolicyRecord<T>> = {};

	for (const [index, rawRecord] of input.values.entries()) {
		if (!isRecord(rawRecord)) {
			throw new Error(`Invalid ${datasetName} record at index ${index}: expected an object`);
		}

		const giscoId = rawRecord.giscoId;
		if (typeof giscoId !== 'string' || !/^[A-Z]{2}$/.test(giscoId)) {
			throw new Error(`Invalid GISCO ID for ${datasetName} record at index ${index}`);
		}
		if (Object.prototype.hasOwnProperty.call(records, giscoId)) {
			throw new Error(`Duplicate GISCO ID ${giscoId} in ${datasetName} data`);
		}

		const country = requiredString(rawRecord.country, 'country', giscoId);
		const category = rawRecord.category;
		if (!isCategory(category, categories)) {
			throw new Error(
				datasetName === 'school uniforms'
					? `Invalid school uniform category for ${giscoId}`
					: `Invalid category for ${datasetName} record ${giscoId}`,
			);
		}
		const note = requiredString(rawRecord.note, 'note', giscoId);
		const sourceLabel = requiredString(rawRecord.sourceLabel, 'sourceLabel', giscoId);
		const sourceUrl = rawRecord.sourceUrl;
		if (!isSafeHttpsUrl(sourceUrl)) {
			throw new Error(`Invalid HTTPS source URL for ${datasetName} record ${giscoId}`);
		}

		records[giscoId] = { giscoId, country, category, note, sourceLabel, sourceUrl };
	}

	return records;
}

function isCategory<T extends CategoricalPolicyCategory>(
	value: unknown,
	categories: readonly T[],
): value is T {
	return categories.some((category) => category === value);
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
