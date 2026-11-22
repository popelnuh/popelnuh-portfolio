const NAME_TO_ISO3: Record<string, string> = {
	france: 'FRA',
	norway: 'NOR',
};

export function resolveWorldFeatureIso3(properties: unknown): string | null {
	if (!isRecord(properties)) return null;

	const primaryCodes = [
		properties.ISO_A3,
		properties['ISO3166-1-Alpha-3'],
	];
	for (const code of primaryCodes) {
		if (isIso3(code)) return code;
	}

	const fallbackCodes = [properties.ISO_A3_EH, properties.ADM0_A3];
	for (const code of fallbackCodes) {
		if (isIso3(code)) return code;
	}

	const name = properties.ADMIN;
	if (typeof name !== 'string') return null;
	return NAME_TO_ISO3[name.trim().toLowerCase()] ?? null;
}

function isIso3(value: unknown): value is string {
	return typeof value === 'string' && /^[A-Z]{3}$/.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
