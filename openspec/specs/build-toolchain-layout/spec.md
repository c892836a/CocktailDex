# build-toolchain-layout

## Purpose
Keep CocktailDex a content-first repository by housing the VitePress/Node/Yarn build toolchain in a dedicated `site/` directory while the wiki content stays at the repo root, with builds (local and CI) running from `site/` and the root content resolving its imports via a git-ignored `node_modules` symlink.

## Requirements

### Requirement: VitePress toolchain lives in a dedicated directory
The VitePress build toolchain SHALL reside in a dedicated `site/` directory, not at the repo
root. This includes the Node/Yarn project (`package.json`, `yarn.lock`, `.yarnrc.yml`,
`.yarn/`, `node_modules/`) and the entire `.vitepress/` project root (config, theme,
generated sidebar, build output, cache). The repo root MUST be free of these tooling files
(other than a single git-ignored `node_modules` symlink, see below) so it reads as a content
repository.

#### Scenario: Committed root contains no toolchain files
- **WHEN** the repo root is listed
- **THEN** it contains no committed `package.json`, `yarn.lock`, `.yarnrc.yml`, `.yarn/`, or `.vitepress/`
- **AND** those files live under `site/` instead (`site/.vitepress/`, `site/package.json`, …)

#### Scenario: Git ignores the relocated build artifacts
- **WHEN** `.gitignore` is inspected
- **THEN** the `.yarn/` patterns target `site/.yarn/`
- **AND** the VitePress output/cache patterns target `site/.vitepress/dist/` and `site/.vitepress/cache/`
- **AND** `node_modules/` remains ignored at any depth (covering `site/node_modules/` and the root symlink)

### Requirement: Content stays at the repo root with srcDir pointing up
Relocating the toolchain SHALL NOT move the wiki content. `index.md`, `tags.md`, `wiki/`, and
`photos/` MUST remain at the repo root. `site/` becomes the VitePress project root (the
directory holding `.vitepress/`), and `site/.vitepress/config.mjs` MUST set `srcDir: '..'` so
VitePress reads the repo-root content, while keeping `base: '/CocktailDex/'` unchanged. The
toolchain directory itself MUST be excluded from content scanning via `srcExclude: ['site/**', …]`.
`scripts/wiki.py compile` MUST write the generated sidebar to `site/.vitepress/sidebar.generated.json`.

#### Scenario: Config reads root content from the relocated root
- **WHEN** `site/.vitepress/config.mjs` is inspected
- **THEN** `srcDir` is `'..'`, `base` is `'/CocktailDex/'`, and `srcExclude` includes `'site/**'`

#### Scenario: Compile writes the sidebar under site/
- **WHEN** `python scripts/wiki.py compile` runs
- **THEN** it writes `site/.vitepress/sidebar.generated.json`
- **AND** it still regenerates `index.md` and `tags.md` at the repo root

### Requirement: Root content resolves its imports via a node_modules symlink
The repo root SHALL contain a git-ignored `node_modules` symlink pointing to
`site/node_modules`, so the repo-root content compiled by VitePress can resolve its `vue` /
`vitepress` imports (Vite walks up from the importer, which lives at the repo root). The CI
workflow MUST recreate this symlink after install and before the build.

#### Scenario: Local build succeeds with the symlink present
- **WHEN** a `node_modules` symlink to `site/node_modules` exists at the repo root and `yarn docs:build` runs from `site/`
- **THEN** the build loads `site/.vitepress/config.mjs`, resolves the root content's imports, reports no dead links, and emits `site/.vitepress/dist`

#### Scenario: CI recreates the symlink before building
- **WHEN** the deploy workflow runs
- **THEN** after `yarn install --immutable` it creates a `node_modules` symlink at the workspace root pointing to `site/node_modules`
- **AND** the subsequent `yarn docs:build` step succeeds

### Requirement: Local and CI builds run from the toolchain directory
Both local development and the CI workflow SHALL invoke Yarn from `site/`, producing the
VitePress output at `site/.vitepress/dist`. The CI deploy job MUST run its Corepack/Yarn
steps with `site/` as the working directory, key the Yarn cache on `site/yarn.lock`, and
upload `site/.vitepress/dist` as the Pages artifact.

#### Scenario: CI runs Yarn from site and uploads the relocated dist
- **WHEN** the deploy workflow runs on push to `main`
- **THEN** its Corepack, `yarn install --immutable`, and `yarn docs:build` steps execute with `site/` as the working directory
- **AND** the Yarn cache is keyed on `site/yarn.lock`
- **AND** the Pages artifact is uploaded from `site/.vitepress/dist`
