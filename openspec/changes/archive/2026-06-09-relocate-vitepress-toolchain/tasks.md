## 1. Relocate the toolchain into site/

- [x] 1.1 Create the `site/` directory.
- [x] 1.2 Move `package.json`, `yarn.lock`, `.yarnrc.yml`, and `.yarn/` from the repo root into `site/`.
- [x] 1.3 Remove the root `node_modules/` (regenerated under `site/`).
- [x] 1.4 Move `.vitepress/` into `site/.vitepress/` (config, theme, generated sidebar, dist, cache) — `site/` becomes the VitePress project root.
- [x] 1.5 Create a git-ignored `node_modules` symlink/junction at the repo root → `site/node_modules` so root content resolves `vue`/`vitepress` imports.

## 2. Repoint config, build scripts, and ignore rules

- [x] 2.1 In `site/.vitepress/config.mjs`, set `srcDir: '..'` (content stays at the repo root, the parent of `site/`) and add `'site/**'` to `srcExclude` so the toolchain dir is not scanned as content.
- [x] 2.2 In `site/package.json`, set the scripts to `vitepress dev/build/preview .` (run from `site/`, which is now the VitePress root).
- [x] 2.3 In `.gitignore`, retarget `.vitepress/dist/` and `.vitepress/cache/` to `site/.vitepress/dist/` and `site/.vitepress/cache/`; keep the `site/.yarn/*` patterns; confirm `node_modules/` still matches at any depth.

## 3. Update the sidebar generator path

- [x] 3.1 In `scripts/wiki.py`, change `VITEPRESS = ROOT / ".vitepress"` to `ROOT / "site" / ".vitepress"` and update the compile print/message to the new path.
- [x] 3.2 Run `python scripts/wiki.py compile` and confirm it writes `site/.vitepress/sidebar.generated.json` (and still regenerates `index.md` / `tags.md` at the root).

## 4. Update the CI deploy workflow

- [x] 4.1 Add `defaults.run.working-directory: site` to the `build` job so Corepack, `yarn install --immutable`, and `yarn docs:build` run from `site/`.
- [x] 4.2 Add `cache-dependency-path: site/yarn.lock` to the `cache: yarn` `setup-node` step.
- [x] 4.3 Change the `upload-pages-artifact` `path` to `site/.vitepress/dist`; add a step that recreates the root `node_modules` symlink (workspace-root working-directory) before the build.

## 5. Verify locally

- [x] 5.1 From `site/`, run `yarn install --immutable` and confirm the lockfile is unchanged and `site/node_modules/` is populated.
- [x] 5.2 From `site/`, run `yarn docs:build`; confirm it loads `site/.vitepress/config.mjs`, resolves the repo-root content via `srcDir: '..'`, reports no dead links, and emits `site/.vitepress/dist`.
- [x] 5.3 Inspected `site/.vitepress/dist`: home, tags, wiki cards, `llms.txt`/`llms-full.txt`, search assets present; all 4 photos processed into hashed `assets/`. (Equivalent to a preview spot-check.)
- [x] 5.4 Ran `python scripts/wiki.py lint`: 0 errors, 0 warnings, 4 info (blank ratings only), all 4 cards found — no path regression. (Pre-existing cp950 console-encoding crash on the final emoji print is unrelated and out of scope.)

## 6. Deploy and validate CI

- [x] 6.1 Commit and push the change to a branch; open/observe the GitHub Actions deploy run.
- [x] 6.2 Confirm the `cache: yarn` step resolves with the relocated lockfile; if it errors, apply the documented fallback (manual `actions/cache` on `site/yarn.lock`, or drop caching) per design.md.
- [x] 6.3 After deploy, confirm `https://c892836a.github.io/CocktailDex/` and `https://c892836a.github.io/CocktailDex/llms.txt` still resolve and render.

## 7. Documentation

- [x] 7.1 Updated CLAUDE.md (§2 directory structure + rationale, §5 ingest step 4, §10 generated files + toolchain note) so the VitePress root / sidebar path is `site/.vitepress/…` and build commands run from `site/`. README has no build references to change; all wiki content paths unchanged.
