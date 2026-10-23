// Build-time OG image for /about: /og/about.png
// Mirrors the page hero: two-tone CAPITAL. / THEN CODE. + the firm one-liner.
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
		topRow('t3nk.com/about'),
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
				el('div', { display: 'flex', flexDirection: 'column', gap: 4 }, [
					text(
						{ fontWeight: 900, fontSize: 92, letterSpacing: '-0.04em', lineHeight: 1 },
						'CAPITAL.',
					),
					text(
						{
							fontWeight: 900,
							fontSize: 92,
							letterSpacing: '-0.04em',
							lineHeight: 1,
							color: GRAY,
						},
						'THEN CODE.',
					),
				]),
				text(
					{
						fontFamily: 'JetBrains Mono',
						fontSize: 24,
						color: GRAY,
						lineHeight: 1.5,
						maxWidth: '900px',
					},
					'The engineering-first VC. We invest, then we work.',
				),
			],
		),
		bottomRow([tagPill('CAPITAL + CODE')], 'IN@T3NK.COM'),
	]);
}

export const GET: APIRoute = async () => pngResponse(await renderPng(card()));

export {};
