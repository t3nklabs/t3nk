import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const work = await getCollection('work');
	const posts = await getCollection('posts');

	const items = [
		...[...work].map((entry) => ({
			title: entry.data.title,
			description: entry.data.desc,
			link: `work/${entry.id}/`,
			pubDate: entry.data.date ?? new Date(),
			categories: entry.data.tags,
		})),
		...[
			...posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime()),
		].map((post) => ({
			title: post.data.title,
			description: post.data.desc,
			link: `posts/${post.id}/`,
			pubDate: post.data.date,
			categories: ['POSTS', ...post.data.tags],
		})),
	].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items,
	});
}
