export function resolveDatasetFromSearch(
	search: string,
	validKeys: readonly string[],
	fallbackKey: string,
): string {
	const datasetKey = new URLSearchParams(search).get('dataset');
	return datasetKey && validKeys.includes(datasetKey) ? datasetKey : fallbackKey;
}

export function buildDatasetUrl(currentHref: string, datasetKey: string): string {
	const url = new URL(currentHref);
	url.searchParams.set('dataset', datasetKey);
	return url.toString();
}
