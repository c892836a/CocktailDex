## Context

The repo root currently carries both the Markdown knowledge base (the product) and the
Node/Yarn build toolchain. VitePress imposes a hard constraint: `.vitepress/` must sit at
the "project root" — the directory passed to `vitepress build [root]` — and it expects the
Markdown content to live under that same root via `srcDir` (default `.`). CocktailDex's
CLAUDE.md **D1** independently pins the content to the repo root ("read content in-place
from the repo root; never copy into a docs/ folder").

These two constraints mean the *content* and `.vitepress/` cannot move. What can move
freely is the package-manager layer — `package.json`, `yarn.lock`, `.yarnrc.yml`,
`.yarn/`, `node_modules/` — none of which VitePress ties to the project root. That layer is
also the bulk of the root clutter the owner wants gone.

## Goals / Non-Goals

**Goals:**
- Remove the VitePress toolchain (Node/Yarn project **and** `.vitepress/`) from the repo root
  into `site/`, so the committed root reads as a content repository.
- Keep the published site, deployed URL, and `base: /CocktailDex/` byte-for-byte equivalent.
- Keep the CI deploy workflow green, still Node-only.

**Non-Goals:**
- Moving any content (`index.md`, `tags.md`, `wiki/`, `photos/`) — forbidden by D1.
- Eliminating `node_modules` from the root entirely — impossible with in-place content (see
  Decision 1a); a git-ignored symlink is the minimum footprint.
- Changing the tag vocabulary, the compile/lint logic, or any wiki workflow.
- Switching package managers or Node version.

## Decisions

### Discovered constraint (drove the final design)
`node_modules` must be reachable by walking **up** from any file that imports a package.
Two such files exist: `.vitepress/config.mjs` (imports `vitepress`) and every compiled
content page (imports `vue` / `vue/server-renderer`). Node/Vite resolve these from the
*importer's* location, not from the cwd. This was confirmed empirically — two successive
build failures (`Cannot find package 'vitepress' from .vitepress/config.mjs`, then
`Rollup failed to resolve "vue/server-renderer" from index.md`). Consequence: **whatever
imports a package must have `node_modules` on its ancestor path.** Since the content is
pinned to the repo root, the repo root must have `node_modules` reachable from it.

### Decision 1: `site/` is the VitePress root; content read via `srcDir: '..'`; root `node_modules` symlink
Move the *entire* toolchain — Node/Yarn project **and** `.vitepress/` — into `site/`, making
`site/` the VitePress project root. `site/.vitepress/config.mjs` sets `srcDir: '..'` to read
the repo-root content in place, with `srcExclude: ['site/**', …]` so the toolchain dir is not
scanned. The config's `vitepress` import resolves from `site/node_modules` (co-located). To
let the repo-root content resolve `vue`, add a git-ignored `node_modules` symlink at the repo
root → `site/node_modules`. Output and cache default to `site/.vitepress/{dist,cache}`.

**Alternatives considered:**
- *Original Decision 1 — keep `.vitepress/` at root, scripts target `..`.* Attempted first;
  **failed**: the config at `repo-root/.vitepress/` could not resolve `vitepress` because
  `node_modules` (in `site/`) is a sibling, not an ancestor. The separation of config from
  `node_modules` is fatal.
- *Junction `node_modules` at root, keep `.vitepress/` at root (Option A′).* Works, but
  leaves both `.vitepress/` and a `node_modules` link at the root — strictly less clean than
  moving `.vitepress/` into `site/` for the same required symlink.
- *Alias `vue`/`vitepress` in Vite config instead of a symlink.* Rejected: VitePress pulls in
  many runtime packages (`@vue/*`, the VitePress client, theme deps); aliasing each by
  absolute path is brittle and breaks on upgrades. A `node_modules` symlink is the standard,
  robust fix for content compiled outside the package directory.

### Decision 1a: Accept that the root cannot be 100% `node_modules`-free
The originally-hoped "truly clean root" (no `node_modules` at all) is **not achievable** with
in-place content: the root content must resolve `vue` from an ancestor `node_modules`. The
symlink is git-ignored, so the *committed* repo stays clean — only the local working tree and
the CI runner show a `node_modules` link. This is the minimum unavoidable footprint.

### Decision 2: CI runs from `site/` via `defaults.run.working-directory`
Set `defaults.run.working-directory: site` on the build job so `corepack enable`,
`yarn install --immutable`, the symlink step, and `yarn docs:build` execute in `site/`, where
the pinned `packageManager` field and lockfile now live. The symlink step overrides its own
`working-directory` to the workspace root (`ln -s site/node_modules node_modules`), and the
`upload-pages-artifact` `path` is `site/.vitepress/dist` (action steps resolve from the
workspace root, unaffected by `run` defaults).

**Alternative considered:** prefixing each `run` step with `cd site &&`. Rejected: noisier
and easy to forget on a new step; the job-level default is the idiomatic GitHub Actions way.

### Decision 3: Yarn cache keyed on `site/yarn.lock`, with a documented fallback
Add `cache-dependency-path: site/yarn.lock` to the `cache: yarn` `setup-node` step so the
cache key hashes the relocated lockfile. This is the one delicate interaction (see Risks).
If the cache step proves unreliable, the fallback is to drop `cache: yarn` and either cache
manually with `actions/cache` keyed on `site/yarn.lock`, or skip caching entirely — the
build is small and the time cost is negligible.

**Alternative considered:** keeping a stub `package.json` at the root just to satisfy
`setup-node`'s cache detection. Rejected: reintroduces root clutter, the exact thing this
change removes.

## Risks / Trade-offs

- **[`setup-node` cache resolves Yarn's cache folder from the workspace root, where there is
  no longer a `package.json`]** → Add `cache-dependency-path: site/yarn.lock`; verify the
  deploy run end-to-end; if the step errors or misses, fall back to manual `actions/cache`
  or no caching (Decision 3). This is the single must-validate item.
- **[Corepack reads the pinned Yarn version from the `package.json` nearest the cwd]** →
  Running Corepack/Yarn with `working-directory: site` ensures it reads `site/package.json`
  (which carries the `packageManager: yarn@4.x` field), so the pinned version still
  activates. Verified by `yarn install --immutable` succeeding in CI.
- **[A future contributor runs `yarn` from the repo root and gets "no package.json"]** →
  Low impact (clear error), documented by the new `build-toolchain-layout` spec; optionally
  note the `cd site` step in README.
- **[`srcDir: '..'` is outside the VitePress root — VitePress docs flag this as unsupported]**
  → Validated empirically: with the root `node_modules` symlink in place the build completes,
  reports no dead links, processes all photos into hashed assets, and emits `llms.txt`. The
  symlink is what makes the otherwise-fragile config work here.
- **[The root `node_modules` symlink is missing locally or in CI → `vue` resolution fails]** →
  CI recreates it before the build; locally it is created once and persists. Documented in
  CLAUDE.md and the spec.
- **[A future contributor runs `yarn` from the repo root and gets "no package.json"]** →
  Low impact (clear error), documented in CLAUDE.md §2; build commands are `cd site && yarn …`.
- **[Stale local `node_modules`/`.yarn` left at root after the move]** → The migration
  deletes the originals; `.yarn/` holds only the regenerable `install-state.gz`, so a fresh
  `yarn install` in `site/` recreates state cleanly.

## Migration Plan

1. Create `site/`; move `package.json`, `yarn.lock`, `.yarnrc.yml`, `.yarn/`, and `.vitepress/`
   into it; remove the root `node_modules/`.
2. Edit `site/.vitepress/config.mjs` (`srcDir: '..'`, `srcExclude` += `site/**`); keep
   `site/package.json` scripts as `vitepress … .` (run from `site/`).
3. Point `scripts/wiki.py` `VITEPRESS` at `ROOT / "site" / ".vitepress"`; recompile.
4. Update `.gitignore` (`site/.yarn/*`, `site/.vitepress/{dist,cache}/`).
5. Edit `.github/workflows/deploy.yml`: `defaults.run.working-directory: site`,
   `cache-dependency-path: site/yarn.lock`, a root-`node_modules`-symlink step, and upload
   path `site/.vitepress/dist`.
6. Create the local root `node_modules` symlink → `site/node_modules`.
7. Verify locally: `cd site && yarn install --immutable && yarn docs:build`; confirm
   `site/.vitepress/dist` is produced and the site renders with working links and photos.
8. Push; verify the GitHub Actions deploy is green and the live URL + `llms.txt` still
   resolve. **Rollback:** revert the commit and move the toolchain back — pure file relocation
   + config, no data migration, so reverting fully restores the working root layout.
