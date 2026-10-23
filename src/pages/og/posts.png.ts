// Build-time OG image for /posts: /og/posts.png
// POSTS + the feed one-liner; series chips, live post count as meta.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
	bottomRow,
	canvas,
	el,
	pngResponse,
	renderPng,
	tagPill,
	text,
	topRow,
	GRAY,
} from '../../lib/og';

export async function GET(): Promise<Response> {
	const total = (await getCollection('posts')).length;
	return pngResponse(await renderPng(card(total)));
}

function card(total: number): ReturnType<typeof canvas> {
	return canvas([
		topRow('t3nk.com/posts'),
		el(
			'div',
			{
				display: 'flex',
				flex: '1',
				flexDirection: 'column',
				justifyContent: 'center',
				margin: '0 64px',
				gap: 40,
			},
			[
				text(
					{ fontWeight: 900, fontSize: 120, letterSpacing: '-0.04em', lineHeight: 1 },
					'POSTS',
				),
				text(
					{
						fontFamily: 'JetBrains Mono',
						fontSize: 24,
						color: GRAY,
						lineHeight: 1.5,
						maxWidth: '900px',
					},
					'Decisions, engineering logs and signals. Not a blog.',
				),
			],
		),
		bottomRow(
			[tagPill('DECISION NOTES'), tagPill('ENGINEERING LOGS'), tagPill('SIGNALS')],
			`${total} POSTS`,
		),
	]);
}

export {};
