export function trackEvent(name: string, properties?: Record<string, string>): void {
	if (!import.meta.env.DEV) return;

	console.debug('[analytics]', name, properties);
}
