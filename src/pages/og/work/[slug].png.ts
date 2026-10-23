// Build-time OG images for every work entry: /og/work/<entry-id>.png
// Projects show their order number as card meta; updates show their date.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import {
	bottomRow,
	canvas,
	formatDate,
	kindPill,
	pngResponse,
	renderPng,
	tagPill,
	titleBlock,
	topRow,
} from '../../../lib/og';

export const getStaticPaths = (async () => {
	const entries = await getCollection('work');
	return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

type Entry = CollectionEntry<'work'>;

function card(entry: Entry): ReturnType<typeof canvas> {
	const isUpdate = entry.data.kind === 'update';
	const chips = [
		kindPill(entry.data.kind),
		...entry.data.tags.map((tag) => tagPill(tag)),
	];
	const meta = isUpdate && entry.data.date ? formatDate(entry.data.date) : `#${entry.data.order ?? 0}`;
	return canvas([topRow('t3nk.com/work'), titleBlock(entry.data.title), bottomRow(chips, meta)]);
}

export const GET: APIRoute = async ({ props }) => {
	const { entry } = props as { entry: Entry };
	return pngResponse(await renderPng(card(entry)));
};
