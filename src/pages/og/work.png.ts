// Build-time OG image for /work: /og/work.png
// WORK + feed one-liner, projects/updates chips, "in the repo" meta.
import type { APIRoute } from 'astro';
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

function card(): ReturnType<typeof canvas> {
	return canvas([
		topRow('t3nk.com/work'),
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
					'WORK',
				),
				text(
					{
						fontFamily: 'JetBrains Mono',
						fontSize: 24,
						color: GRAY,
						lineHeight: 1.5,
						maxWidth: '900px',
					},
					'Products and open-source tools built by our team.',
				),
			],
		),
		bottomRow([tagPill('PROJECTS'), tagPill('UPDATES')], 'IN THE REPO.'),
	]);
}

export const GET: APIRoute = async () => pngResponse(await renderPng(card()));

export {};
