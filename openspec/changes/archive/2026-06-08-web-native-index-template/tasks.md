## 1. Rewrite the index template

- [x] 1.1 In `scripts/wiki.py` `build_index()`, remove the `## Quick greps` fenced shell block.
- [x] 1.2 Replace the "An LLM answering any question… narrow with `grep`" preamble with a human-first intro (what the page is + how to find a drink: search, Tags, the table).
- [x] 1.3 Add a one-line fetch-LLM pointer to `llms-full.txt` as the single-fetch machine-readable dump.
- [x] 1.4 Fold "Browse by" into the wayfinding: keep the Tags link (`./tags`), drop the `raw/inbox/` and `log.md` links.
- [x] 1.5 Keep the first-layer reference table, the `> Auto-generated… don't hand-edit` note, the closing `*Regenerated…*` line, and all f-string placeholders (`{len(cards)}`, `{bases}`, `{today}`, `{rows}`) intact.

## 2. Regenerate and verify

- [x] 2.1 Run `python scripts/wiki.py compile`; confirm regenerated `index.md` has no `grep`/`Quick greps` and renders the table and counts.
- [x] 2.2 Run `python scripts/wiki.py lint`; confirm it passes.
- [x] 2.3 Run `yarn docs:build`; confirm the homepage builds with no dead-link errors (Tags + card links resolve).
- [x] 2.4 Confirm CLAUDE.md §11 still holds the grep cookbook and `index.md` no longer duplicates it.

## 3. Commit

- [x] 3.1 Commit `scripts/wiki.py` and the regenerated `index.md` together.
