# llms-txt-export

## Purpose
Emit `llms.txt` and `llms-full.txt` artifacts in the build so external LLMs can discover and ingest the entire cocktail collection via absolute, fetchable URLs.

## Requirements

### Requirement: Emit an llms.txt index map
The build SHALL emit an `llms.txt` file at the site root that provides a structured,
machine-readable map of the collection (title, summary, and links to the wiki pages),
following the llmstxt.org convention.

#### Scenario: llms.txt is present in the build output
- **WHEN** `yarn docs:build` completes
- **THEN** `.vitepress/dist/llms.txt` exists
- **AND** it lists the wiki pages with links to their URLs

### Requirement: Emit an llms-full.txt full-text dump
The build SHALL emit an `llms-full.txt` file at the site root containing the full
concatenated text content of the wiki pages, so an LLM can ingest the entire collection in a
single fetch.

#### Scenario: llms-full.txt contains the collection content
- **WHEN** `yarn docs:build` completes
- **THEN** `.vitepress/dist/llms-full.txt` exists
- **AND** it contains the text content of the wiki cards (e.g. ingredients, instructions, profiles)

### Requirement: llms.txt links are absolute and fetchable
Links in the generated `llms.txt` / `llms-full.txt` SHALL be absolute URLs under the deployed
site base (`https://c892836a.github.io/CocktailDex/` — i.e. origin `https://c892836a.github.io`
plus the `/CocktailDex/` base path) so that an external LLM can fetch the referenced pages over
HTTP without knowing the host out of band.

#### Scenario: Generated links use the deployed origin
- **WHEN** the llms output is generated for production
- **THEN** page links in `llms.txt` are absolute URLs under `https://c892836a.github.io/CocktailDex/`

#### Scenario: An external LLM can query the collection from a single URL
- **WHEN** an external LLM is given `https://c892836a.github.io/CocktailDex/llms-full.txt`
- **THEN** it can read the full collection content and answer questions about the cocktails without filesystem access
