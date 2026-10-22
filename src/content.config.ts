import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// Every entry in /work — projects and updates live in one collection and are
// separated by kind, then sliced by free-form tags (TOOL, AI/ML, WEB3...).
const work = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
	schema: z.object({
		title: z.string(),
		desc: z.string(),
		kind: z.enum(['project', 'update']),
		tags: z.array(z.string()).default([]),
		// Required for updates; a project's slug (e.g. "yantra").
		project: z.string().optional(),
		url: z.string().url().optional(),
		// Display order for projects (updates sort by date instead).
		order: z.number().optional(),
		date: z.coerce.date().optional(),
	}),
});

// POSTS — the writing feed (the thing that isn't called a blog).
// One markdown file per post, newest first by date, free-form tags.
const posts = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
	schema: z.object({
		title: z.string(),
		desc: z.string(),
		date: z.coerce.date(),
		tags: z.array(z.string()).default([]),
	}),
});

export const collections = { work, posts };
