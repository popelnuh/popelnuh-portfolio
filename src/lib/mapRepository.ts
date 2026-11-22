import {
	adaptOecdToGisco,
	type OecdChildcareDataset,
} from './adapters/oecdToGiscoAdapter';
import {
	adaptSchoolUniformsDataset,
	type SchoolUniformRecord,
} from './adapters/schoolUniformsAdapter';
import type { MapMetricRecord, CountryBoundaries } from './mapTypes';

export interface ChildcareMapData {
	boundaries: CountryBoundaries;
	dataset: OecdChildcareDataset;
	recordsByCNTR_ID: Record<string, MapMetricRecord>;
}

export interface SchoolUniformMapData {
	boundaries: CountryBoundaries;
	recordsByGiscoId: Record<string, SchoolUniformRecord>;
}

const jsonRequests = new Map<string, Promise<unknown>>();
const childcareRequests = new Map<string, Promise<ChildcareMapData>>();
const schoolUniformRequests = new Map<string, Promise<SchoolUniformMapData>>();

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
	const cacheKey = `${boundariesUrl}\n${datasetUrl}`;
	const cachedRequest = schoolUniformRequests.get(cacheKey);
	if (cachedRequest) return cachedRequest;

	const request = Promise.all([
		fetchMapJson<CountryBoundaries>(boundariesUrl),
		fetchMapJson<unknown>(datasetUrl),
	])
		.then(([boundaries, dataset]) => ({
			boundaries,
			recordsByGiscoId: adaptSchoolUniformsDataset(dataset),
		}))
		.catch((error: unknown) => {
			schoolUniformRequests.delete(cacheKey);
			throw error;
		});

	schoolUniformRequests.set(cacheKey, request);
	return request;
}
