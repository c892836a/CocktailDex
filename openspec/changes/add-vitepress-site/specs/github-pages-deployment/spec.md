## ADDED Requirements

### Requirement: Build and deploy to GitHub Pages on push
The system SHALL provide a GitHub Actions workflow that builds the VitePress site and deploys
it to GitHub Pages whenever changes are pushed to the default branch (`main`). The workflow
MUST use the official GitHub Pages deployment actions (configure-pages, upload-pages-artifact,
deploy-pages) and the correct permissions/concurrency for Pages.

#### Scenario: Push to main triggers build and deploy
- **WHEN** a commit is pushed to `main`
- **THEN** the workflow runs `yarn install --immutable` and `yarn docs:build`
- **AND** the resulting `.vitepress/dist` is uploaded and deployed to GitHub Pages

#### Scenario: Manual run is supported
- **WHEN** the workflow is dispatched manually (`workflow_dispatch`)
- **THEN** it performs the same build and deploy

### Requirement: CI build pipeline is Node-only
The deploy workflow SHALL NOT require Python. Generated artifacts that the build depends on
(the sidebar configuration, `index.md`, `tags.md`) MUST be committed to the repository so the
build consumes them directly; the workflow MUST only install Node dependencies and run the
VitePress build.

#### Scenario: Workflow contains no Python step
- **WHEN** the deploy workflow is inspected
- **THEN** it sets up Node (version 20+), enables Corepack/Yarn, and runs Yarn scripts only
- **AND** it contains no step that runs `python`, `wiki.py`, or `pip`

### Requirement: Deployed site and llms.txt are reachable at the Pages URL
After a successful deploy, the site and its `llms.txt` SHALL be reachable at the GitHub Pages
project URL `https://c892836a.github.io/CocktailDex/`.

#### Scenario: Site and llms.txt resolve after deploy
- **WHEN** a deploy completes successfully
- **THEN** `https://c892836a.github.io/CocktailDex/` serves the wiki site
- **AND** `https://c892836a.github.io/CocktailDex/llms.txt` serves the generated index

### Requirement: Pages source configuration is documented
The change SHALL document the one-time manual repository setting required for the workflow to
succeed: GitHub repo Settings → Pages → Source = **GitHub Actions**.

#### Scenario: First-time setup instruction is present
- **WHEN** the owner sets up deployment for the first time
- **THEN** the documented steps state that Pages Source must be set to "GitHub Actions" before the first deploy will publish
