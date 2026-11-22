import {
	adaptOecdToGisco,
	type OecdChildcareDataset,
} from './adapters/oecdToGiscoAdapter';
import {
	adaptCategoricalPolicyDataset,
	type CategoricalPolicyRecord,
} from './adapters/schoolUniformsAdapter';
import {
	adaptSummerHolidayDataset,
	type SummerHolidayDataset,
	type SummerHolidayRecord,
} from './adapters/summerHolidaysAdapter';
import {
	adaptSchoolStartingAgeDataset,
	type SchoolStartingAgeDataset,
	type SchoolStartingAgeRecord,
} from './adapters/schoolStartingAgeAdapter';
import type { MapMetricRecord, CountryBoundaries } from './mapTypes';

export interface ChildcareMapData {
	boundaries: CountryBoundaries;
	dataset: OecdChildcareDataset;
	recordsByCNTR_ID: Record<string, MapMetricRecord>;
}

export interface SchoolUniformMapData {
	boundaries: CountryBoundaries;
	recordsByGiscoId: Record<string, CategoricalPolicyRecord>;
}

export interface SummerHolidayMapData {
	boundaries: CountryBoundaries;
	dataset: SummerHolidayDataset;
	recordsByGiscoId: Record<string, SummerHolidayRecord>;
}

export interface SchoolStartingAgeMapData {
	boundaries: CountryBoundaries;
	dataset: SchoolStartingAgeDataset;
	recordsByGiscoId: Record<string, SchoolStartingAgeRecord>;
}

type CategoricalPolicyDatasetKey =
	| 'school-uniforms'
	| 'free-school-meals'
	| 'teacher-qualifications'
	| 'religious-education';

const CATEGORICAL_POLICY_DATASET_URLS: Record<CategoricalPolicyDatasetKey, string> = {
	'school-uniforms': '/data/europe-school-uniforms.json',
	'free-school-meals': '/data/europe-free-school-meals.json',
	'teacher-qualifications': '/data/europe-teacher-qualifications.json',
	'religious-education': '/data/europe-religious-education.json',
};

const jsonRequests = new Map<string, Promise<unknown>>();
const childcareRequests = new Map<string, Promise<ChildcareMapData>>();
const schoolUniformRequests = new Map<string, Promise<SchoolUniformMapData>>();
const summerHolidayRequests = new Map<string, Promise<SummerHolidayMapData>>();
const schoolStartingAgeRequests = new Map<string, Promise<SchoolStartingAgeMapData>>();
let selectedCategoricalPolicyDataset: CategoricalPolicyDatasetKey | null = null;

export function selectCategoricalPolicyDataset(key: CategoricalPolicyDatasetKey): void {
	selectedCategoricalPolicyDataset = key;
}

export function fetchMapJson<T>(url: string): Promise<T> {
	const cachedRequest = jsonRequests.get(url);
	if (cachedRequest) return cachedRequest as Promise<T>;

	const request = fetch(url)
		.then(async (response) => {
			if (!response.ok) {
				throw new Error(`Request for ${url} failed with status ${response.status}`);
			}
			return (await response.json()) as T;
		})
		.catch((error: unknown) => {
			jsonRequests.delete(url);
			throw error;
		});

	jsonRequests.set(url, request);
	return request;
}

export function loadChildcareMapData(
	boundariesUrl: string,
	metricsUrl: string,
): Promise<ChildcareMapData> {
	const cacheKey = `${boundariesUrl}\n${metricsUrl}`;
	const cachedRequest = childcareRequests.get(cacheKey);
	if (cachedRequest) return cachedRequest;

	const request = Promise.all([
		fetchMapJson<CountryBoundaries>(boundariesUrl),
		fetchMapJson<OecdChildcareDataset>(metricsUrl),
	])
		.then(([boundaries, dataset]) => ({
			boundaries,
			dataset,
			recordsByCNTR_ID: adaptOecdToGisco(dataset),
		}))
		.catch((error: unknown) => {
			childcareRequests.delete(cacheKey);
			throw error;
		});

	childcareRequests.set(cacheKey, request);
	return request;
}

export function loadSchoolUniformMapData(
	boundariesUrl: string,
	datasetUrl: string,
): Promise<SchoolUniformMapData> {
	const selectedDatasetUrl = selectedCategoricalPolicyDataset
		? CATEGORICAL_POLICY_DATASET_URLS[selectedCategoricalPolicyDataset]
		: datasetUrl;
	const cacheKey = `${boundariesUrl}\n${selectedDatasetUrl}`;
	const cachedRequest = schoolUniformRequests.get(cacheKey);
	if (cachedRequest) return cachedRequest;

	const request = Promise.all([
		fetchMapJson<CountryBoundaries>(boundariesUrl),
		fetchMapJson<unknown>(selectedDatasetUrl),
	])
		.then(([boundaries, dataset]) => ({
			boundaries,
			recordsByGiscoId: adaptCategoricalPolicyDataset(dataset),
		}))
		.catch((error: unknown) => {
			schoolUniformRequests.delete(cacheKey);
			throw error;
		});

	schoolUniformRequests.set(cacheKey, request);
	return request;
}

export function loadSummerHolidayMapData(
	boundariesUrl: string,
	datasetUrl: string,
): Promise<SummerHolidayMapData> {
	const cacheKey = `${boundariesUrl}\n${datasetUrl}`;
	const cachedRequest = summerHolidayRequests.get(cacheKey);
	if (cachedRequest) return cachedRequest;

	const request = Promise.all([
		fetchMapJson<CountryBoundaries>(boundariesUrl),
		fetchMapJson<SummerHolidayDataset>(datasetUrl),
	])
		.then(([boundaries, dataset]) => ({
			boundaries,
			dataset,
			recordsByGiscoId: adaptSummerHolidayDataset(dataset),
		}))
		.catch((error: unknown) => {
			summerHolidayRequests.delete(cacheKey);
			throw error;
		});

	summerHolidayRequests.set(cacheKey, request);
	return request;
}

export function loadSchoolStartingAgeMapData(
	boundariesUrl: string,
	datasetUrl: string,
): Promise<SchoolStartingAgeMapData> {
	const cacheKey = `${boundariesUrl}\n${datasetUrl}`;
	const cachedRequest = schoolStartingAgeRequests.get(cacheKey);
	if (cachedRequest) return cachedRequest;

	const request = Promise.all([
		fetchMapJson<CountryBoundaries>(boundariesUrl),
		fetchMapJson<SchoolStartingAgeDataset>(datasetUrl),
	])
		.then(([boundaries, dataset]) => ({
			boundaries,
			dataset,
			recordsByGiscoId: adaptSchoolStartingAgeDataset(dataset),
		}))
		.catch((error: unknown) => {
			schoolStartingAgeRequests.delete(cacheKey);
			throw error;
		});

	schoolStartingAgeRequests.set(cacheKey, request);
	return request;
}
