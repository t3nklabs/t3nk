// Build-time OG images: /og/<post-slug>.png
// Each posts entry gets a 1200x630 card in the site's look (cream field, ink
// type, mono series chips), rendered with satori + sharp at build time.
// Pages that don't pass one fall back to the shared /banner.png in BaseHead.
import satori from 'satori';
import sharp from 'sharp';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const getStaticPaths = (async () => {
	const posts = await getCollection('posts');
	return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

type Post = CollectionEntry<'posts'>;

const W = 1200;
const H = 630;
const INK = '#0a0a0a';
const PAPER = '#fffdfa';
const GRAY = '#52525b';

// Fonts are vendored variable TTFs; the same buffer serves all weights.
let fontsPromise: Promise<{ data: Buffer; name: string }[]>;
type Fonts = { data: Buffer; name: string }[];
const loadFonts = (): Promise<Fonts> => {
	fontsPromise ??= Promise.all([
		readFile(path.resolve('public/fonts/Inter-Variable.ttf')).then((data) => ({ name: 'Inter', data })),
		readFile(path.resolve('public/fonts/JetBrainsMono-Variable.ttf')).then((data) => ({
			name: 'JetBrains Mono',
			data,
		})),
	]);
	return fontsPromise;
};

function titleSize(title: string): number {
	if (title.length <= 24) return 84;
	if (title.length <= 40) return 68;
	if (title.length <= 60) return 56;
	return 44;
}

function formatDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

type El = { type: string; props: { style: Record<string, unknown>; children?: unknown } };

const el = (type: string, style: Record<string, unknown>, children?: unknown): El => ({
	type,
	props: { style, children },
});

const text = (style: Record<string, unknown>, value: string): El => el('div', { display: 'flex', ...style }, value);

function card(post: Post, date: string) {
	// Root = the bare 1200x630 canvas. Satori lays out content-box, so the
	// root must never carry padding; children position themselves with margins.
	return el('div', {
		display: 'flex',
		flexDirection: 'column',
		width: W,
		height: H,
		backgroundColor: PAPER,
		color: INK,
		fontFamily: 'Inter',
		fontWeight: 400,
	}, [
		// Top row: brand block + path
		el('div', {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			margin: '48px 64px 0',
		}, [
			text(
				{
					backgroundColor: INK,
					color: PAPER,
					fontWeight: 900,
					fontSize: 30,
					letterSpacing: '-0.04em',
					padding: '6px 14px',
				},
				'T3NK',
			),
			text({ fontFamily: 'JetBrains Mono', fontSize: 20, color: GRAY }, 'T3NK.COM/POSTS'),
		]),
		// Title, vertically centered across the remaining space
		el('div', {
			display: 'flex',
			flex: '1',
			alignItems: 'center',
			margin: '0 64px',
		}, [
			text(
				{
					fontWeight: 800,
					fontSize: titleSize(post.data.title),
					letterSpacing: '-0.03em',
					lineHeight: 1.05,
					maxWidth: '1020px',
				},
				post.data.title,
			),
		]),
		// Bottom: series chips + date, under a rule
		el('div', {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			borderTop: '2px solid ' + INK,
			margin: '0 64px 40px',
			paddingTop: '24px',
		}, [
			el('div', {
				display: 'flex',
				gap: 12,
			}, post.data.tags.map((tag) =>
				text(
					{
						fontFamily: 'JetBrains Mono',
						fontSize: 20,
						fontWeight: 700,
						border: '2px solid ' + INK,
						padding: '8px 14px',
					},
					tag.toUpperCase(),
				),
			)),
			text({ fontFamily: 'JetBrains Mono', fontSize: 20, color: GRAY }, date),
		]),
	]);
}

export const GET: APIRoute = async ({ props }) => {
	const { post } = props as { post: Post };
	const fonts = await loadFonts();
	const svg = await satori(card(post, formatDate(post.data.date)), {
		width: W,
		height: H,
		fonts: fonts.map((f) => ({ ...f, style: 'normal' })),
	});
	const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
	return new Response(new Uint8Array(png), {
		headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000' },
	});
};
