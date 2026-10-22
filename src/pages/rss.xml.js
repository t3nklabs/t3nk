import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const work = await getCollection('work');

	const items = [...work]
		.sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0))
		.map((entry) => ({
			title: entry.data.title,
			description: entry.data.desc,
			link: `work/${entry.id}/`,
			pubDate: entry.data.date ?? new Date(),
			categories: entry.data.tags,
		}));

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items,
	});
}
