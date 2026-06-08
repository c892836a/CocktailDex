## 1. Project scaffolding & dependencies

- [x] 1.1 Add `package.json` with scripts `docs:dev`, `docs:build`, `docs:preview`, dev dependencies `vitepress` and `vitepress-plugin-llms` (pinned versions), and a `packageManager` field so Corepack pins the Yarn version
- [x] 1.2 Run `corepack enable` then `yarn install`; commit the generated `yarn.lock`
- [x] 1.3 Add/update `.gitignore` to ignore `node_modules/`, `.vitepress/dist`, `.vitepress/cache`

## 2. Deterministic navigation via wiki.py (D2)

- [x] 2.1 Extend `scripts/wiki.py` (and `wikilib.py` as needed) so `compile` emits `.vitepress/sidebar.generated.json` from the parsed `wiki/` cards (alongside `index.md` / `tags.md`)
- [x] 2.2 Run `python scripts/wiki.py compile`; confirm `index.md`, `tags.md`, and `.vitepress/sidebar.generated.json` all regenerate and the JSON lists all 4 cards
- [x] 2.3 Update CLAUDE.md §5/§10 to note that `compile` also emits the committed sidebar artifact

## 3. VitePress configuration (D1, D4, D5, D6, D7)

- [x] 3.1 Create `.vitepress/config.mjs` with `title`, `srcDir: '.'`, and `base: '/CocktailDex/'`
- [x] 3.2 Set `srcExclude` to hide operational files: `raw/**`, `scripts/**`, `openspec/**`, `.claude/**`, `node_modules/**`, `CLAUDE.md`, `GEMINI.md`, `README.md`, `log.md`
- [x] 3.3 Import `.vitepress/sidebar.generated.json` and wire it into `themeConfig.sidebar`; add a top `nav` (Home / Tags)
- [x] 3.4 Configure `ignoreDeadLinks` with targeted patterns for excluded operational links (`CLAUDE.md`, `raw/inbox/`, etc.) so real content links are still validated
- [x] 3.5 Enable VitePress built-in local search (`themeConfig.search = { provider: 'local' }`)

## 4. llms.txt output (D3)

- [x] 4.1 Register `vitepress-plugin-llms` in the Vite `plugins` array in `.vitepress/config.mjs`
- [x] 4.2 Configure the plugin `domain: 'https://c892836a.github.io'` (**origin only**) so generated links are absolute. The plugin appends each page's already-`base`-prefixed path (`/CocktailDex/…`), so setting `domain` to `…/CocktailDex` would double the base (`…/CocktailDex/CocktailDex/…`); origin + base resolves to the correct `https://c892836a.github.io/CocktailDex/…`
- [x] 4.3 Normalize each card's title heading `## {Name}` → `# {Name}` (and the CLAUDE.md §3b template) so VitePress and `llms.txt` resolve the cocktail name as the page title instead of "Untitled" — presentation only; the card schema (frontmatter fields), `wiki.py` parsing, and human-only ratings are unchanged

## 5. Local build & verification (do this BEFORE any push)

- [x] 5.1 Run `yarn docs:build`; confirm it succeeds and produces `.vitepress/dist`
- [x] 5.2 Run `yarn docs:preview`; verify pages render, navigation lists all cards, and search works under the `/CocktailDex/` base
- [x] 5.3 Verify card→card links (`./other.md`) and photos (`../photos/<slug>.jpg`) resolve in the previewed site; if photos fail to bundle, apply the `public/photos/` fallback (D5) and rebuild
- [x] 5.4 Verify `.vitepress/dist/llms.txt` and `.vitepress/dist/llms-full.txt` exist, list/contain the cards, and use absolute `https://c892836a.github.io/CocktailDex/` URLs

## 6. GitHub Actions deployment (Node-only)

- [x] 6.1 Add `.github/workflows/deploy.yml`: trigger on push to `main` + `workflow_dispatch`; `permissions` for Pages (`pages: write`, `id-token: write`); single-run `concurrency`
- [x] 6.2 Workflow steps: checkout → setup-node (v20+) → `corepack enable` → setup-node (`cache: yarn`) → `yarn install --immutable` → `yarn docs:build` → `actions/configure-pages` → `actions/upload-pages-artifact` (path `.vitepress/dist`) → `actions/deploy-pages`. **Note:** `corepack enable` must precede any `cache: yarn` step — the runner's global Yarn 1.x errors out on a `packageManager: yarn@4.x` project, so caching is wired via a second `setup-node` after Corepack is active
- [x] 6.3 Confirm the workflow contains NO Python/`pip`/`wiki.py` step (build consumes committed artifacts)

## 7. Deploy & production verification

- [x] 7.1 Commit all new/changed files (config, package files, workflow, generated sidebar, regenerated index/tags) and push to `main`
- [x] 7.2 In the GitHub repo, set Settings → Pages → Source = **GitHub Actions** (one-time)
- [x] 7.3 Confirm the Actions run succeeds and verify `https://c892836a.github.io/CocktailDex/` and `…/llms.txt` are reachable

## 8. Wrap-up

- [x] 8.1 Append a `## YYYY-MM-DD — VitePress site` entry to `log.md` summarizing the site, llms.txt, and deploy setup
- [x] 8.2 Run `python scripts/wiki.py lint` to confirm the wiki is still consistent after changes
