// Shared pieces for the build-time OG image endpoints (src/pages/og/**).
// Design language: cream field, ink type, brand block, mono path, chips.
import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const W = 1200;
export const H = 630;
export const INK = '#0a0a0a';
export const PAPER = '#fffdfa';
export const GRAY = '#52525b';

export type El = { type: string; props: { style: Record<string, unknown>; children?: unknown } };

export const el = (type: string, style: Record<string, unknown>, children?: unknown): El => ({
	type,
	props: { style, children },
});

export const text = (style: Record<string, unknown>, value: string): El =>
	el('div', { display: 'flex', ...style }, value);

/** Title font size, clipped to three comfortable lines on the 1200px card. */
export function titleSize(title: string): number {
	if (title.length <= 24) return 84;
	if (title.length <= 40) return 68;
	if (title.length <= 60) return 56;
	return 44;
}

export function formatDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

/** "PROJECT"/"UPDATE" pill — filled chip, reserved for the entry kind. */
export function kindPill(kind: string): El {
	return text(
		{
			backgroundColor: INK,
			color: PAPER,
			fontFamily: 'JetBrains Mono',
			fontSize: 18,
			fontWeight: 700,
			padding: '8px 14px',
		},
		kind.toUpperCase(),
	);
}

/** Outlined pill for free tags. */
export function tagPill(label: string): El {
	return text(
		{
			fontFamily: 'JetBrains Mono',
			fontSize: 18,
			fontWeight: 700,
			border: '2px solid ' + INK,
			padding: '8px 14px',
		},
		label.toUpperCase(),
	);
}

/** Top row: brand block + mono path. */
export function topRow(pathLine: string): El {
	return el(
		'div',
		{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '48px 64px 0' },
		[
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
			text({ fontFamily: 'JetBrains Mono', fontSize: 20, color: GRAY }, pathLine.toUpperCase()),
		],
	);
}

/** Bottom row: rule + chips left, mono meta right. */
export function bottomRow(chips: El[], meta: string): El {
	return el(
		'div',
		{
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			borderTop: '2px solid ' + INK,
			margin: '0 64px 40px',
			paddingTop: '24px',
		},
		[
			el('div', { display: 'flex', gap: 12 }, chips),
			text({ fontFamily: 'JetBrains Mono', fontSize: 20, color: GRAY }, meta),
		],
	);
}

/** Centered title block for the card's middle. */
export function titleBlock(title: string): El {
	return el(
		'div',
		{ display: 'flex', flex: '1', alignItems: 'center', margin: '0 64px' },
		[
			text(
				{
					fontWeight: 800,
					fontSize: titleSize(title),
					letterSpacing: '-0.03em',
					lineHeight: 1.05,
					maxWidth: '1020px',
				},
				title,
			),
		],
	);
}

/** Bare-canvas root: satori lays out content-box, so no padding ever on root. */
export function canvas(children: unknown[]): El {
	return el(
		'div',
		{
			display: 'flex',
			flexDirection: 'column',
			width: W,
			height: H,
			backgroundColor: PAPER,
			color: INK,
			fontFamily: 'Inter',
			fontWeight: 400,
		},
		children,
	);
}

export interface OgNode {
	type: string;
	props: { style: Record<string, unknown>; children?: unknown };
}

const fontsPromise = Promise.all([
	readFile(path.resolve('public/fonts/Inter-Variable.ttf')).then((data) => ({ name: 'Inter', data })),
	readFile(path.resolve('public/fonts/JetBrainsMono-Variable.ttf')).then((data) => ({
		name: 'JetBrains Mono',
		data,
	})),
]);

export async function renderPng(node: OgNode): Promise<Uint8Array> {
	const fonts = await fontsPromise;
	const svg = await satori(node, {
		width: W,
		height: H,
		fonts: fonts.map((f) => ({ ...f, style: 'normal' })),
	});
	return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

export function pngResponse(png: Uint8Array): Response {
	return new Response(png, {
		headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000' },
	});
}
