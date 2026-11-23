interface BlogPost {
	data: {
		pubDate: Date;
		draft: boolean;
	};
}

export function getPublishedPosts<Post extends BlogPost>(posts: readonly Post[]): Post[] {
	return posts
		.filter((post) => !post.data.draft)
		.sort((first, second) => second.data.pubDate.getTime() - first.data.pubDate.getTime());
}

export function estimateReadingTime(markdownBody: string, wordsPerMinute = 200): number {
	if (!Number.isFinite(wordsPerMinute) || wordsPerMinute <= 0) {
		throw new RangeError('wordsPerMinute must be a positive finite number');
	}

	const plainText = markdownBody
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]*>/g, ' ')
		.replace(/https?:\/\/\S+/g, ' ')
		.replace(/^[ \t]{0,3}(?:#{1,6}\s+|>\s*|[-+*]\s+|\d+[.)]\s+)/gm, ' ');
	const wordCount = plainText.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length ?? 0;

	return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function formatPostDate(date: Date): string {
	return new Intl.DateTimeFormat('en-GB', {
		day: '2-digit',
		month: 'long',
		timeZone: 'UTC',
		year: 'numeric',
	}).format(date);
}
