# vitepress-site

## Purpose
Build the CocktailDex wiki into a static VitePress site in-place, with deterministic navigation and correctly resolving links and assets for a GitHub Pages project site.

## Requirements

### Requirement: Build the wiki into a static site in-place
The system SHALL build the existing wiki markdown into a static website using VitePress,
reading content **in-place** from the repository root (`srcDir` = repo root) without copying
or duplicating content. Operational files MUST be excluded from the build via `srcExclude`,
specifically: `raw/`, `scripts/`, `openspec/`, `.claude/`, `node_modules/`, `CLAUDE.md`,
`GEMINI.md`. `scripts/wiki.py` SHALL remain the single source of truth for content.

#### Scenario: Production build excludes operational files
- **WHEN** `yarn docs:build` is run
- **THEN** a static site is produced under `.vitepress/dist`
- **AND** it contains pages for `index.md`, `tags.md`, and every card in `wiki/`
- **AND** it contains no page derived from `raw/`, `scripts/`, `openspec/`, `CLAUDE.md`, or `GEMINI.md`

#### Scenario: Local dev and preview servers run
- **WHEN** the owner runs `yarn docs:dev` (or `docs:preview` after a build)
- **THEN** a local server serves the browsable site for verification before any push

### Requirement: Correct base path for a GitHub Pages project site
The site SHALL set VitePress `base` to `/CocktailDex/` so that, when served from a GitHub
Pages project site, all asset URLs and internal links resolve correctly under that path.

#### Scenario: Asset URLs are prefixed with the base path
- **WHEN** the site is built and previewed with `yarn docs:preview`
- **THEN** generated asset and internal-link URLs are prefixed with `/CocktailDex/`
- **AND** the previewed pages load their CSS/JS and navigate without 404s

### Requirement: Relative card links and photo assets resolve
The build SHALL resolve the cards' existing relative links so they work in the built site:
card-to-card links of the form `./<slug>.md` and photo references of the form
`../photos/<slug>.jpg`. Photos referenced by cards MUST appear in the build output.

#### Scenario: Card-to-card link works in the built site
- **WHEN** a card body links to another card via `[Name](./other-slug.md)`
- **THEN** the corresponding page in the built site links to the other card's page and resolves

#### Scenario: Photo renders in the built site
- **WHEN** a card references `![Name](../photos/<slug>.jpg)`
- **THEN** that image is included in the build output and renders on the card's page

### Requirement: Navigation generated deterministically by wiki.py
The site sidebar/navigation SHALL be generated deterministically by extending
`scripts/wiki.py compile`, which writes a committed VitePress sidebar configuration artifact
(e.g. `.vitepress/sidebar.generated.json`) from the parsed cards. The VitePress config SHALL
consume that committed artifact. The navigation MUST list every card in `wiki/`. The
navigation MUST NOT be hand-maintained.

#### Scenario: Compile regenerates the sidebar from cards
- **WHEN** `python scripts/wiki.py compile` is run
- **THEN** the committed sidebar artifact is regenerated from the current `wiki/` cards
- **AND** building the site produces navigation listing every card

#### Scenario: Adding a card updates navigation after recompile
- **WHEN** a new card is added to `wiki/` and `wiki.py compile` is re-run
- **THEN** the regenerated sidebar artifact includes the new card
- **AND** no manual edit to the VitePress config is required
