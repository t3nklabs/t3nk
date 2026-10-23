// Build-time OG images for posts: /og/<post-slug>.png
// Pages that don't pass one fall back to the shared /banner.png in BaseHead.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import {
	bottomRow,
	canvas,
	el,
	formatDate,
	kindPill,
	pngResponse,
	renderPng,
	tagPill,
	text,
	titleBlock,
	topRow,
	GRAY,
	H as CANVAS_H,
	W as CANVAS_W,
} from '../../lib/og';

export const getStaticPaths = (async () => {
	const posts = await getCollection('posts');
	return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

type Post = CollectionEntry<'posts'>;

function card(post: Post): ReturnType<typeof canvas> {
	return canvas([
		topRow('t3nk.com/posts'),
		titleBlock(post.data.title),
		bottomRow(
			[...post.data.tags.map((tag) => tagPill(tag))],
			formatDate(post.data.date),
		),
	]);
}

export const GET: APIRoute = async ({ props }) => {
	const { post } = props as { post: Post };
	return pngResponse(await renderPng(card(post)));
};

export {};
