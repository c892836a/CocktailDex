# 📓 Log — Activity Record

Append-only, reverse-chronological (newest on top). Every Ingest / Query-of-note / Lint
gets a dated entry. Date prefixes are ISO `YYYY-MM-DD` so the log stays greppable.

---

## 2026-06-08 — Rename

Project renamed from "Cocktail LLM Wiki" to **CocktailDex**. Updated titles/headers in
`CLAUDE.md`, `GEMINI.md`, `README.md`, and `scripts/wiki.py` (index + tags page headers),
then recompiled `index.md` / `tags.md`. The folder on disk is still `調酒LLM wiki/` — rename
it manually if desired (the docs don't depend on the folder name).

---

## 2026-06-08 — Ingest (seed)

Ingested 4 connected seed-demo cocktails from `raw/inbox/` → `wiki/`, then archived the
originals to `raw/archive/`:

- **Bermuda Rum Swizzle**, **Daiquiri**, **Mojito**, **Queen's Park Swizzle**.
- Completed from the web: Background (all four, with source links), plus Glassware /
  Profile / Garnish / full measured Ingredients where the raw drop was sparse (esp. Mojito
  and Bermuda Rum Swizzle, which arrived as little more than a name).
- Tagged each with 6-dimension tags (3–7 each) and registered them in `tags.md`.
- Cross-linked **Other Similar Cocktails** by structure / flavour / technique: the rum +
  lime + mint trio (QPS ↔ Mojito ↔ Daiquiri) and the Swizzle pair (QPS ↔ Bermuda).
- Left all Eric / Charlene ratings and Modified Variations blank (human-only fields).
- Updated `index.md`.

## 2026-06-08 — Wiki created

Initialised the wiki scaffolding per `CLAUDE.md`: `raw/inbox`, `raw/archive`, `wiki`,
`photos` folders; `index.md`, `tags.md` (Standard 6-dimension scheme), and this log.
Architecture: two-layer (immutable `raw/` + maintained `wiki/`); links: standard Markdown.

---

<!-- New entries go ABOVE this line, newest first. Template:

## YYYY-MM-DD — Ingest | Query | Lint
- what happened, what changed, anything left as TBD
-->
