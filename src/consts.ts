// Global site constants + tiny URL helpers.
// Everything internal should build links through `url()` / `asset()` so the
// site keeps working under the GitHub Pages base path (repo deployed at
// https://t3nklabs.github.io/t3nk/).

export const SITE_TITLE = 'T3NK — Capital + Code';
export const SITE_DESCRIPTION =
	'T3NK is the engineering-first VC. We invest in early-stage software companies, then our team joins the repo and helps them ship.';

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Path inside the site ("" for home, "work", "pitch"...). */
export const url = (path: string = '') => {
	if (path.startsWith('/')) return `${BASE}${path === '/' ? '' : path}`;
	return path ? `${BASE}/${path}` : `${BASE}/`;
};

/** Path inside /public ("" defaults: "/banner.png"). */
export const asset = (path: string) => `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
