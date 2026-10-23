// Build-time OG image for the landing page: /og/home.png
// The contact section as a share card: two-tone "BUILDING SOMETHING BIG?"
// headline over the fund stats row. Pages pass it explicitly from index.astro.
import type { APIRoute } from 'astro';
import {
	bottomRow,
	canvas,
	el,
	kindPill,
	pngResponse,
	renderPng,
	tagPill,
	text,
	topRow,
	GRAY,
} from '../../lib/og';

/** One fund stat: big numeric value + small mono label. */
function stat(value: string, label: string): ReturnType<typeof text> {
	return el('div', { display: 'flex', flexDirection: 'column', gap: 8 }, [
		text({ fontWeight: 900, fontSize: 72, letterSpacing: '-0.03em', lineHeight: 1 }, value),
		text(
			{ fontFamily: 'JetBrains Mono', fontSize: 16, color: GRAY, letterSpacing: '0.1em' },
			label.toUpperCase(),
		),
	]);
}

function card(): ReturnType<typeof canvas> {
	return canvas([
		topRow('t3nk.com'),
		el(
			'div',
			{
				display: 'flex',
				flex: '1',
				flexDirection: 'column',
				justifyContent: 'center',
				margin: '0 64px',
				gap: 44,
			},
			[
				// Deer-style two-tone headline: ink first line, gray second line.
				el('div', { display: 'flex', flexDirection: 'column', gap: 4 }, [
					text(
						{ fontWeight: 900, fontSize: 92, letterSpacing: '-0.04em', lineHeight: 1 },
						'BUILDING',
					),
					text(
						{
							fontWeight: 900,
							fontSize: 92,
							letterSpacing: '-0.04em',
							lineHeight: 1,
							color: GRAY,
						},
						'SOMETHING BIG?',
					),
				]),
				el('div', { display: 'flex', justifyContent: 'space-between' }, [
					stat('24', 'Portfolio Companies'),
					stat('$180M', 'Assets Under Management'),
					stat('12', 'Countries'),
					stat('3.2x', 'Avg. MOIC'),
				]),
			],
		),
		bottomRow([kindPill('PITCH US'), tagPill('CAPITAL + CODE')], 'IN@T3NK.COM'),
	]);
}

export const GET: APIRoute = async () => pngResponse(await renderPng(card()));

export {};
