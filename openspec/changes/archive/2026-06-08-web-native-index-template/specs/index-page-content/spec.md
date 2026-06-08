## ADDED Requirements

### Requirement: Generated index page serves web audiences only
The generated `index.md` SHALL contain only content meaningful to the site's two web
audiences — human visitors and fetch-LLMs ingesting pages over HTTP — and is produced by
`scripts/wiki.py compile` and published as the VitePress site homepage. It MUST NOT contain
shell commands or instructions that assume a local shell or a checked-out `wiki/` directory.
`scripts/wiki.py compile` SHALL remain the single source of truth that generates this page;
`index.md` MUST NOT be hand-edited.

#### Scenario: No shell grep block on the homepage
- **WHEN** `python scripts/wiki.py compile` regenerates `index.md`
- **THEN** the output contains no `## Quick greps` section
- **AND** the output contains no `grep` shell command targeting `wiki/`

#### Scenario: No maintainer-LLM preamble on the homepage
- **WHEN** `python scripts/wiki.py compile` regenerates `index.md`
- **THEN** the intro text does not instruct the reader to "narrow with `grep`"
- **AND** the intro does not direct an LLM to read the page before answering as a maintainer step

### Requirement: Human-facing wayfinding on the homepage
The generated `index.md` SHALL provide navigation that works in the browser, pointing human
visitors to the means of finding a cocktail that the published site actually offers: the
client-side search, the Tags browse page, and the first-layer reference table.

#### Scenario: Homepage links humans to search and tags
- **WHEN** `python scripts/wiki.py compile` regenerates `index.md`
- **THEN** the output references the site's search and links to the Tags page (`./tags`)
- **AND** the first-layer reference table listing every cocktail with its core data is retained

#### Scenario: Homepage links resolve in the built site
- **WHEN** `yarn docs:build` builds the site from the regenerated `index.md`
- **THEN** the homepage's links (Tags page, cocktail cards) resolve without dead-link errors

### Requirement: Fetch-LLM pointer to the full-text dump
The generated `index.md` SHALL direct a fetch-LLM to `llms-full.txt` as the single-fetch,
machine-readable source for the entire collection, instead of any filesystem-based retrieval
instruction.

#### Scenario: Homepage points fetch-LLMs at llms-full.txt
- **WHEN** `python scripts/wiki.py compile` regenerates `index.md`
- **THEN** the output references `llms-full.txt` as the machine-readable full dump for LLM ingestion

### Requirement: Grep cookbook remains canonical in CLAUDE.md only
The `grep wiki/` cookbook SHALL exist only in CLAUDE.md (§11), which is excluded from the
published site, and SHALL NOT be duplicated in the generated `index.md`.

#### Scenario: Grep guidance lives solely in CLAUDE.md
- **WHEN** the change is complete
- **THEN** CLAUDE.md §11 still contains the grep cookbook
- **AND** `index.md` contains no grep cookbook
