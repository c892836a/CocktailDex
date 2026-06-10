## Why

The repo root mixes the Markdown knowledge base (its real product) with Node/Yarn build
clutter — `package.json`, `yarn.lock`, `.yarnrc.yml`, `.yarn/`, `node_modules/`. The owner
wants these tooling files tucked into a dedicated folder so the root reads as a clean
content repository, while the published site and CI keep working unchanged.

- Relocate the entire VitePress toolchain into a new `site/` directory: the Node/Yarn
  project (`package.json`, `yarn.lock`, `.yarnrc.yml`, `.yarn/`, `node_modules/`) **and** the
  `.vitepress/` project root (config, theme, generated sidebar, dist, cache). `site/` becomes
  the VitePress project root.
- Set `srcDir: '..'` in `site/.vitepress/config.mjs` so VitePress reads the repo-root content
  in place (content does not move), and add `'site/**'` to `srcExclude`. `base: '/CocktailDex/'`
  is unchanged. `site/package.json` scripts run from `site/` (`vitepress … .`).
- Add a git-ignored `node_modules` symlink at the repo root → `site/node_modules` so the
  root-level content can resolve its `vue` / `vitepress` imports (Vite walks up from the
  importer, which sits at the repo root). CI recreates this symlink before the build.
- Point `scripts/wiki.py` at the relocated sidebar path (`site/.vitepress/sidebar.generated.json`).
- Update `.gitignore` (`.yarn` → `site/.yarn`, dist/cache → `site/.vitepress/…`) and the
  GitHub Actions deploy workflow: run Yarn/Corepack steps from `site/`
  (`defaults.run.working-directory: site`), key the Yarn cache on `site/yarn.lock`, create the
  root `node_modules` symlink, and upload `site/.vitepress/dist`.

## Capabilities

### New Capabilities
- `build-toolchain-layout`: Defines where the Node/Yarn build toolchain lives relative to
  the content and the VitePress project root, and how local and CI commands invoke the
  build from that location.

### Modified Capabilities
<!-- None. The github-pages-deployment requirements remain satisfied verbatim: CI still
     runs `yarn install --immutable` + `yarn docs:build` and uploads `.vitepress/dist`;
     the pipeline stays Node-only. Only the invocation location changes, which is captured
     by the new build-toolchain-layout capability. -->

## Impact

- **Moved:** `package.json`, `yarn.lock`, `.yarnrc.yml`, `.yarn/`, `node_modules/`, and
  `.vitepress/` → `site/`.
- **Edited:** `site/.vitepress/config.mjs` (`srcDir: '..'`, `srcExclude` += `site/**`),
  `scripts/wiki.py` (`VITEPRESS` → `ROOT / "site" / ".vitepress"`), `.gitignore`,
  `.github/workflows/deploy.yml` (working directory, cache path, root-symlink step, upload
  path), and docs (CLAUDE.md §2/§5/§10).
- **Added:** a git-ignored `node_modules` symlink at the repo root → `site/node_modules`.
- **Unchanged (key payoff):** all wiki content and generated `index.md` / `tags.md` at the
  repo root; the deployed URL and `base: /CocktailDex/`.
- **Validated locally:** `yarn docs:build` from `site/` succeeds with no dead links, emits
  `site/.vitepress/dist`, processes all photos into hashed assets, and generates `llms.txt`.
- **Risk to validate in CI:** `setup-node`'s `cache: yarn` resolves Yarn's cache folder from
  the workspace root, where there is no `package.json`; the deploy run must be verified, with
  a documented fallback (manual `actions/cache` or no cache) if that step fails.
