// Build-time OG image for /pitch: /og/pitch.png
// PITCH US + the pitch one-liner; "no deck required" fill pill, VC inbox meta.
import type { APIRoute } from 'astro';
import {
	bottomRow,
	canvas,
	el,
	kindPill,
	pngResponse,
	renderPng,
	text,
	topRow,
	GRAY,
} from '../../lib/og';

function card(): ReturnType<typeof canvas> {
	return canvas([
		topRow('t3nk.com/pitch'),
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
					{ fontWeight: 900, fontSize: 110, letterSpacing: '-0.04em', lineHeight: 1 },
					'PITCH US',
				),
				text(
					{
						fontFamily: 'JetBrains Mono',
						fontSize: 24,
						color: GRAY,
						lineHeight: 1.5,
						maxWidth: '940px',
					},
					'We back technical founders building software that has to work.',
				),
			],
		),
		bottomRow([kindPill('NO DECK REQUIRED')], 'VC@T3NK.COM'),
	]);
}

export const GET: APIRoute = async () => pngResponse(await renderPng(card()));

export {};
