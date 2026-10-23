// Build-time OG images for team members: /og/team/<person-slug>.png
// Two-column card — name + role on the left, photo (embedded) on the right.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
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
	type El,
} from '../../../lib/og';

export const getStaticPaths = (async () => {
	const members = await getCollection('team');
	return members.map((member) => ({ params: { slug: member.id }, props: { member } }));
}) satisfies GetStaticPaths;

type Member = CollectionEntry<'team'>;

const photoCache = new Map<string, string>();
async function photoDataUri(relPath: string): Promise<string> {
	let dataUri = photoCache.get(relPath);
	if (!dataUri) {
		const mime = relPath.endsWith('.png') ? 'image/png' : 'image/jpeg';
		const data = await readFile(path.resolve('public', relPath.replace(/^\/+/, '')));
		dataUri = `data:${mime};base64,${data.toString('base64')}`;
		photoCache.set(relPath, dataUri);
	}
	return dataUri;
}

function nameSize(name: string): number {
	if (name.length <= 12) return 92;
	if (name.length <= 18) return 72;
	return 58;
}

function card(member: Member, photo: string): El {
	const photoEl = {
		type: 'img',
		props: {
			src: photo,
			style: { width: 380, height: 470, objectFit: 'cover' },
		},
	};
	const columns = el(
		'div',
		{
			display: 'flex',
			flex: '1',
			alignItems: 'center',
			gap: 40,
			margin: '0 64px',
		},
		[
			// Left column: name + role
			el(
				'div',
				{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					gap: 20,
					flex: '1',
				},
				[
					text(
						{
							fontWeight: 900,
							fontSize: nameSize(member.data.name),
							letterSpacing: '-0.03em',
							lineHeight: 1.02,
						},
						member.data.name.toUpperCase(),
					),
					el('div', { display: 'flex', gap: 12 }, [kindPill('the builders')]),
				],
			),
			// Right column: photo
			photoEl,
		],
	);

	return canvas([
		topRow('t3nk.com/team'),
		columns,
		bottomRow(
			[text({ fontFamily: 'JetBrains Mono', fontSize: 20, color: GRAY }, member.data.role.toUpperCase())],
			String(member.data.order ?? 0).padStart(2, '0'),
		),
	]);
}

export const GET: APIRoute = async ({ props }) => {
	const { member } = props as { member: Member };
	const photo = await photoDataUri(member.data.photo);
	return pngResponse(await renderPng(card(member, photo)));
};
