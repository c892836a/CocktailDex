# 📓 Log — Activity Record

Append-only, reverse-chronological (newest on top). Every Ingest / Query-of-note / Lint
gets a dated entry. Date prefixes are ISO `YYYY-MM-DD` so the log stays greppable.

---

## 2026-06-10 — Ingest

- Ingested **The Salty Shaker** from `raw/inbox/The salty shaker.md`.
- Completed Background, Glassware, and enriched recipe context from the web (Source: murlarkey.com).
- Added `Mango` to the **Ingredient** tag vocabulary in `scripts/wiki.py`.
- Assigned 7 tags: `#Whiskey`, `#Lime`, `#Mango`, `#Spiced`, `#Refreshing`, `#Shaken`, `#Sour`.
- Linked **Other Similar Cocktails**: mutual link with **Daiquiri** (Shaken Sour family).
- Updated `index.md`, `tags.md`, and VitePress sidebar.

## 2026-06-09 — Ingest

- Ingested **Sangria** from `raw/inbox/Sangria.md`.
- Completed Background, Glassware (partially), Ingredients normalization, Instruction, Garnish, Profile, and Tags from the web (Source: thisdayinwinehistory.com).
- Added `Wine` to Base Spirit and renamed `Wine` Glassware to `WineGlass` in `scripts/wiki.py` to avoid tag collision.
- Linked **Other Similar Cocktails**: mutual link with **Bermuda Rum Swizzle**.
- Updated `index.md`, `tags.md`, and VitePress sidebar.

## 2026-06-08 — VitePress site

Added a static **VitePress** site over the existing wiki markdown, published to GitHub Pages,
plus an `llms.txt` export so any external LLM can query the collection over HTTP.

- **Site (view, not a fork):** reads content in-place from the repo root (`srcDir: '.'`),
  `base: '/CocktailDex/'`, with `srcExclude` hiding operational files (`raw/`, `scripts/`,
  `openspec/`, `.claude/`, `node_modules/`, `CLAUDE.md`, `GEMINI.md`, `README.md`, `log.md`).
  Built-in local search; photos and card↔card links resolve in the build.
- **Deterministic nav:** `scripts/wiki.py compile` now also emits the committed
  `.vitepress/sidebar.generated.json` (alongside `index.md` / `tags.md`); the VitePress config
  imports it, so the sidebar stays in lockstep with the cards. CLAUDE.md §5/§10 updated.
- **llms.txt:** `vitepress-plugin-llms` emits `llms.txt` (index map) + `llms-full.txt` (full
  text) at the site root with absolute `https://c892836a.github.io/CocktailDex/` URLs. Note:
  the plugin's `domain` is set to the **origin only** (`https://c892836a.github.io`) because it
  appends the already-base-prefixed page paths — using `.../CocktailDex` would double the base.
- **Deploy:** `.github/workflows/deploy.yml` builds (Node-only, Yarn via Corepack) and deploys
  to Pages on push to `main` + manual dispatch. Build consumes the committed artifacts — no
  Python in CI.
- **Card heading → H1:** changed each card's title heading from `## {Name}` to `# {Name}`
  (and CLAUDE.md §3b template) so VitePress and `llms.txt` pick up the cocktail name as the
  page title — previously they showed "Untitled". This is a presentation tweak only; the card
  **schema** (frontmatter fields, ingest/lint/query, human-only ratings) is unchanged, and
  `wiki.py` parses the name from frontmatter, so compile/lint are unaffected.
- **Manual one-time step (pending):** set GitHub repo Settings → Pages → Source = **GitHub
  Actions** before the first deploy will publish.

## 2026-06-08 — Rename

Project renamed from "Cocktail LLM Wiki" to **CocktailDex**. Updated titles/headers in
`CLAUDE.md`, `GEMINI.md`, `README.md`, and `scripts/wiki.py` (index + tags page headers),
then recompiled `index.md` / `tags.md`. The folder on disk is still `調酒LLM wiki/` — rename
it manually if desired (the docs don't depend on the folder name).

---

## 2026-06-08 — Ingest (seed)

Ingested 4 connected seed-demo cocktails from `raw/inbox/` → `wiki/`, then archived the
originals to `raw/archive/`:

- **Bermuda Rum Swizzle**, **Daiquiri**, **Mojito**, **Queen's Park Swizzle**.
- Completed from the web: Background (all four, with source links), plus Glassware /
  Profile / Garnish / full measured Ingredients where the raw drop was sparse (esp. Mojito
  and Bermuda Rum Swizzle, which arrived as little more than a name).
- Tagged each with 6-dimension tags (3–7 each) and registered them in `tags.md`.
- Cross-linked **Other Similar Cocktails** by structure / flavour / technique: the rum +
  lime + mint trio (QPS ↔ Mojito ↔ Daiquiri) and the Swizzle pair (QPS ↔ Bermuda).
- Left all Eric / Charlene ratings and Modified Variations blank (human-only fields).
- Updated `index.md`.

## 2026-06-08 — Wiki created

Initialised the wiki scaffolding per `CLAUDE.md`: `raw/inbox`, `raw/archive`, `wiki`,
`photos` folders; `index.md`, `tags.md` (Standard 6-dimension scheme), and this log.
Architecture: two-layer (immutable `raw/` + maintained `wiki/`); links: standard Markdown.

---

<!-- New entries go ABOVE this line, newest first. Template:

## YYYY-MM-DD — Ingest | Query | Lint
- what happened, what changed, anything left as TBD
-->
