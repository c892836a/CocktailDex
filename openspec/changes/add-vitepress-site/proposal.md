## Why

CocktailDex is currently a markdown-only wiki that is browsable and queryable only by an
LLM with direct filesystem access (the `CLAUDE.md` / `GEMINI.md` workflow). The owner wants
the same compounding knowledge base to be (1) a human-browsable website and (2) reachable by
any external LLM over the open web — without standing up a backend. Publishing the existing
markdown as a static VitePress site on GitHub Pages, plus emitting an `llms.txt` map and an
`llms-full.txt` full-text dump, achieves both: humans get navigation/search, and any LLM
(Claude, ChatGPT, …) can fetch a single URL and answer questions about the collection.

## What Changes

- Add a VitePress static-site build over the **existing** wiki markdown, read **in-place**
  from the repo root (`srcDir = .`), with `srcExclude` hiding non-content files
  (`raw/`, `scripts/`, `openspec/`, `.claude/`, `CLAUDE.md`, `GEMINI.md`, `node_modules/`).
  `scripts/wiki.py compile` remains the single source of truth; the site is a *view* over it.
- Set VitePress `base: '/CocktailDex/'` so a GitHub Pages **project** site resolves all
  assets/links correctly, and resolve the cards' relative links (`./other.md`,
  `../photos/<slug>.jpg`) so they work in the built site.
- Generate the site sidebar/nav **deterministically** by extending `scripts/wiki.py compile`
  to emit a VitePress sidebar config alongside `index.md` / `tags.md` — cards, index, tags,
  and nav stay in sync from one command.
- Emit `llms.txt` (structured map/index) and `llms-full.txt` (concatenated full content) at
  build time via `vitepress-plugin-llms`, served at the site root for LLM consumption.
- Add a GitHub Actions workflow that builds the site and deploys it to GitHub Pages on push
  to `main`.
- Add `package.json` + Yarn scripts (`docs:dev`, `docs:build`, `docs:preview`) so the site
  can be built and verified **locally first**, before any push.

Non-goals: no embedded/interactive chatbot UI (GitHub Pages is static, no backend); no
changes to the cocktail card schema, the ingest/lint workflow, or the human-only rating
fields; no content migration into a separate `docs/` folder.

## Capabilities

### New Capabilities
- `vitepress-site`: Build the existing wiki markdown into a browsable static website locally,
  reading content in-place (srcDir/srcExclude), with correct `base` path, relative-link and
  photo-asset resolution, a homepage, and a deterministically generated navigation/sidebar.
- `llms-txt-export`: Emit machine-readable `llms.txt` (a structured index/map of the
  collection) and `llms-full.txt` (full concatenated content) into the build output so
  external LLMs can fetch and query the wiki over HTTP.
- `github-pages-deployment`: Continuously build and deploy the static site to GitHub Pages
  via GitHub Actions on push to the default branch.

### Modified Capabilities
<!-- None. openspec/specs/ is empty; scripts/wiki.py is existing code (an Impact below), not
     an existing spec'd capability. -->

## Impact

- **New files:** `.vitepress/config.{mjs,ts}`, `package.json`, `yarn.lock`,
  `.github/workflows/deploy.yml`, `.gitignore` (add `node_modules/`, `.vitepress/dist`,
  `.vitepress/cache`). Possibly a `wiki/index.md` landing/home page.
- **Modified files:** `scripts/wiki.py` (+ `wikilib.py`) — add sidebar-config emission to
  `compile`; `index.md` / `tags.md` regenerated.
- **Dependencies (dev):** `vitepress`, `vitepress-plugin-llms` (Node 22 with Corepack-managed Yarn).
- **External / manual:** GitHub repo `c892836a/CocktailDex` must have Pages source set to
  **GitHub Actions** (one-time settings step). Site URL: `https://c892836a.github.io/CocktailDex/`.
- **Unaffected:** card schema (§3), ingest/lint/query workflows, `raw/` state machine, and
  the three human-only fields (Eric/Charlene ratings, Modified Variation).
