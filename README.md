# T3NK — Capital + Code

The T3NK marketing site. Rebuilt as a static Astro site (migrated from the Vue
SPA in `t3nk-old`), deployed to GitHub Pages at
**https://t3nklabs.github.io/t3nk/** on every push to `main`.

## Structure

- `src/components/` — shared components (`BaseHead`, `Header`, `NoiseCanvas`,
  work cards) and the home-page sections under `components/sections/`
- `src/layouts/Layout.astro` — page shell (head, fixed header, noise canvas)
- `src/content/work/` — **the work feed**. Every `.md/.mdx` file is a project
  or an update:

  ```yaml
  title: Yantra
  desc: One-line description shown on cards and RSS.
  kind: project        # or "update"
  tags: [TOOL, AI/ML]  # drive the /work tabs
  url: https://github.com/org/repo   # projects: external repo
  project: yantra      # optional (updates): link back to a project
  date: 2026-10-22     # required for updates, optional for projects
  order: 1             # optional (projects): display order
  ```

  Tags generate pages automatically: `/work` (all), `/work/projects`,
  `/work/updates`, `/work/tag/ai-ml`, … and every entry gets a detail page at
  `/work/<id>`. The slugs `projects`, `updates` and `tag/*` are reserved.

## Develop

```sh
npm install
npm run dev     # http://localhost:4321/
npm run build   # dist/
```

Dev server in background mode (per repo convention): `astro dev --background`,
managed with `astro dev stop` / `astro dev status` / `astro dev logs`.

## Custom domain

The site deploys to **https://t3nk.com** on GitHub Pages. `astro.config.mjs`
sets `site: 'https://t3nk.com'` with no `base` (served at the domain root);
`public/CNAME` keeps the custom domain bound across deployments. All internal
links go through `url()` / `asset()` in `src/consts.ts` — never hardcode
routes.

One-time DNS setup (at the registrar):

```text
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
AAAA  @     2606:50c0:8000::153
AAAA  @     2606:50c0:8001::153
AAAA  @     2606:50c0:8002::153
AAAA  @     2606:50c0:8003::153
CNAME www   t3nklabs.github.io
```

Then in the repo: **Settings → Pages → Build and deployment → Source: GitHub
Actions**, add the custom domain `t3nk.com`, and enable **Enforce HTTPS**
once the certificate finishes provisioning.

## Deploy

`.github/workflows/deploy.yml` builds and deploys on push to `main`.
One-time setup in the repo: **Settings → Pages → Build and deployment →
Source: GitHub Actions**.
