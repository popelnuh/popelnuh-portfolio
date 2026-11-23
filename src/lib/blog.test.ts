import { describe, expect, it } from 'vitest';
import { estimateReadingTime, formatPostDate, getPublishedPosts } from './blog';

describe('getPublishedPosts', () => {
	it('excludes drafts and sorts published posts newest first', () => {
		const posts = [
			{ id: 'older', data: { pubDate: new Date('2025-01-01'), draft: false } },
			{ id: 'draft', data: { pubDate: new Date('2027-01-01'), draft: true } },
			{ id: 'newer', data: { pubDate: new Date('2026-01-01'), draft: false } },
		];

		expect(getPublishedPosts(posts).map(({ id }) => id)).toEqual(['newer', 'older']);
	});
});

describe('estimateReadingTime', () => {
	it('returns at least one minute for an empty body', () => {
		expect(estimateReadingTime('')).toBe(1);
	});

	it('estimates two minutes for about 400 words', () => {
		expect(estimateReadingTime(Array.from({ length: 400 }, () => 'word').join(' '))).toBe(2);
	});

	it('does not count Markdown link destinations or syntax as prose', () => {
		const heading = Array.from({ length: 198 }, () => 'word').join(' ');
		const body = `# ${heading}\n\n[link](https://example.com/${Array.from(
			{ length: 10 },
			() => 'segment',
		).join('/')})`;

		expect(estimateReadingTime(body)).toBe(1);
	});
});

describe('formatPostDate', () => {
	it('formats dates consistently in a readable day-month-year order', () => {
		expect(formatPostDate(new Date('2026-11-22T00:00:00.000Z'))).toBe('22 November 2026');
	});
});
