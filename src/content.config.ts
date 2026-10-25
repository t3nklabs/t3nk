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

// TEAM — one markdown file per person. The body is their personal-page bio;
// `desc` is the short card copy shown on /team; `hobbies` are emoji+title
// chips shown off the clock on the profile page.
const team = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/team' }),
	schema: z.object({
		name: z.string(),
		role: z.string(),
		desc: z.string(),
		photo: z.string(), // path under /team/ (public dir), e.g. "/team/kevin-sterling.png"
		links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
		order: z.number().optional(),
		hobbies: z.array(z.object({ emoji: z.string(), title: z.string() })).default([]),
	}),
});

export const collections = { work, posts, team };
