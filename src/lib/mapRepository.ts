import {
	adaptOecdToGisco,
	type OecdChildcareDataset,
} from './adapters/oecdToGiscoAdapter';
import type { MapMetricRecord, CountryBoundaries } from './mapTypes';

export interface ChildcareMapData {
	boundaries: CountryBoundaries;
	dataset: OecdChildcareDataset;
	recordsByCNTR_ID: Record<string, MapMetricRecord>;
}

const jsonRequests = new Map<string, Promise<unknown>>();
const childcareRequests = new Map<string, Promise<ChildcareMapData>>();

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
