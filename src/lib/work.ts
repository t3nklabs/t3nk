// Helpers shared by the /work pages.

export const slugify = (tag: string): string =>
	tag
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

type WorkEntry = {
	id: string;
	data: { title: string; order?: number; date?: Date };
};

/** Projects keep their curated JSON order (fall back to title). */
export const byOrder = (a: WorkEntry, b: WorkEntry) =>
	(a.data.order ?? Number.MAX_SAFE_INTEGER) - (b.data.order ?? Number.MAX_SAFE_INTEGER) ||
	a.data.title.localeCompare(b.data.title);

/** Newest update first. */
export const byDateDesc = (a: WorkEntry, b: WorkEntry) =>
	(b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0);
