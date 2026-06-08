## Context

`index.md` is emitted by the `build_index()` f-string template in `scripts/wiki.py`
(`scripts/wiki.py:154-196`) and is published, unmodified, as the VitePress homepage (it is
not in `srcExclude`). The template was authored when the wiki was repo-only, so it speaks to
a maintainer LLM with a shell: a `## Quick greps` fenced block (`grep … wiki/`), a preamble
("An LLM answering any question… narrow with `grep`"), and a "Browse by" list that links to
`raw/inbox/` and `log.md` — both of which are `srcExclude`d from the site and only present in
`ignoreDeadLinks`. The published site already provides the human affordances (client-side
`search: { provider: 'local' }`, a Tags nav entry) and the fetch-LLM affordance
(`llms.txt` / `llms-full.txt` via `vitepress-plugin-llms`). The grep cookbook is also fully
present in CLAUDE.md §11, which is excluded from the site.

## Goals / Non-Goals

**Goals:**
- Make the generated homepage speak only to its real audiences: human web visitors and
  fetch-LLMs.
- Remove shell/filesystem-assuming content (grep block, grep preamble) and the leaking
  maintainer links (`raw/inbox/`, `log.md`).
- Add web-native wayfinding (search, Tags page, table) and a fetch-LLM pointer to
  `llms-full.txt`.
- Keep the change confined to the template string; output stays deterministic.

**Non-Goals:**
- Splitting into separate maintainer vs published index outputs (single template stays).
- Touching `llms.txt`/`llms-full.txt` generation, VitePress config, the Tags page, the card
  schema, or the table's columns/data.
- Removing the grep cookbook from CLAUDE.md §11.

## Decisions

**D1 — Single template, fully web-oriented (not a dual-output split).**
Rewrite the one `build_index()` template for the web. *Alternative considered:* emit a
maintainer-only variant alongside the published one (exploration option 2). Rejected as
YAGNI — the maintainer LLM gets its guidance from CLAUDE.md (loaded every session) and the
fetch-LLM gets `llms-full.txt`; no consumer needs a second index variant today.

**D2 — Replace preamble with a human-first intro + an explicit fetch-LLM line.**
The new intro states what the page is (the collection's at-a-glance index) and how to find a
drink (search box, Tags page, the table below). A separate short line points fetch-LLMs at
`llms-full.txt` for a single-fetch full dump. *Alternative:* drop all LLM-facing copy and let
the llms plugin speak for itself. Rejected — an explicit in-page pointer costs one line and
directly serves the stated purpose 2 (a skill fetching the site).

**D3 — Fold "Browse by" into the wayfinding; drop `raw/inbox/` and `log.md` links.**
Those targets are `srcExclude`d (operational, maintainer-only) and only survive today via
`ignoreDeadLinks`. They have no meaning to a web visitor. Keep only the Tags link, which is
real content on the site. *Alternative:* keep them. Rejected — they are dead weight on the
published page and reinforce the maintainer framing we are removing.

**D4 — Retain the first-layer reference table unchanged.**
It is the highest-value structured artifact for both audiences (humans scan it; fetch-LLMs
parse it). Out of scope to alter its columns or data here.

**D5 — Use site-relative links matching existing build conventions.**
Tags link as `./tags` (the nav uses `/tags`; the in-page link stays `./tags` consistent with
current `index.md`); keep the `> Auto-generated … don't hand-edit` note so the deterministic
-generation invariant remains visible. The closing `*Regenerated …*` line stays.

## Risks / Trade-offs

- [Dead-link check fails after dropping `raw/inbox/` & `log.md` links] → Removing the links
  removes the need for those `ignoreDeadLinks` entries; leave the config entries as-is (they
  are harmless if unused) to keep this change scoped to `scripts/wiki.py`. Verify with
  `yarn docs:build`.
- [Maintainer LLM loses the in-index grep hint] → No loss: CLAUDE.md §11 is the canonical,
  more complete cookbook and is always in the maintainer's context.
- [Template f-string edit breaks `{rows}` / `{today}` interpolation] → Keep the existing
  `{len(cards)}`, `{bases}`, `{today}`, `{rows}` placeholders intact; verify the recompiled
  `index.md` renders the table and counts.

## Migration Plan

1. Edit the `build_index()` template in `scripts/wiki.py`.
2. Run `python scripts/wiki.py compile` to regenerate `index.md` (+ `tags.md`, sidebar).
3. Run `python scripts/wiki.py lint` and `yarn docs:build` to confirm no dead links.
4. Commit `scripts/wiki.py` and the regenerated `index.md` together.

Rollback: revert the `scripts/wiki.py` template edit and recompile — output is deterministic,
so the prior `index.md` is reproduced exactly.

## Open Questions

- Exact wording/emoji of the human wayfinding lines — cosmetic; resolve during implementation
  to match the site's existing tone.
