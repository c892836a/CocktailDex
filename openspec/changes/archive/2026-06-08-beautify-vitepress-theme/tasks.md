## 1. Theme scaffold (extend default theme)

- [x] 1.1 Create `.vitepress/theme/index.js` that imports `vitepress/theme`, imports `./custom.css`, and exports `{ extends: DefaultTheme, enhanceApp, Layout }`
- [x] 1.2 Create an empty `.vitepress/theme/custom.css` and confirm `yarn docs:dev` picks up the custom theme (sidebar/search/dark-toggle still work)

## 2. Palette (light + dark)

- [x] 2.1 In `custom.css`, override `--vp-c-brand-1/2/3` and `--vp-c-brand-soft` under `:root` (deep copper) and `.dark` (bright gold-amber, same hue)
- [x] 2.2 Override `--vp-c-bg`, `--vp-c-bg-alt`, `--vp-c-bg-soft`, `--vp-c-text-1/2` for warm-paper (light) and warm-espresso (dark)
- [x] 2.3 Verify WCAG AA contrast for body text and brand colour in BOTH modes; adjust lightness if any token fails

## 3. Typography

- [x] 3.1 Load Playfair Display without blocking the build (self-host under theme assets or preconnect/preload via `config.mjs` `transformHead`); set `font-display: swap`
- [x] 3.2 Apply the serif display font to content `h1, h2` only; keep Inter (`--vp-font-family-base`) for body
- [x] 3.3 Confirm headings fall back to a system serif stack when the web font is blocked

## 4. Tag chips by dimension (component)

- [x] 4.1 Add a small dimension lookup mirroring the 6-dimension VOCABULARY from `scripts/wiki.py`, commented "keep in sync"; unknown tags map to a neutral fallback
- [x] 4.2 Implement a global `TagList`/`TagChip` component (or `enhanceApp` DOM transform) that turns inline `#Tag` text into pills with a `data-dimension` attribute; must NOT throw on unexpected markup (degrade to plain text)
- [x] 4.3 Style the chips in `custom.css` (one colour family per dimension, light + dark variants)

## 5. Read-only star ratings (component)

- [x] 5.1 Implement a `Rating` component/transform that reads the number in `N / 5` lines and renders ★ glyphs — read-only; never writes/guesses a value
- [x] 5.2 Render blank (`_ / 5`) as an explicit "not yet rated" state with no value written; verify Eric/Charlene/Modified Variation values are untouched

## 6. Photo, table, and nav polish (CSS)

- [x] 6.1 Style content photos: rounded corners, soft shadow, max-width, centering; reduce brightness in `.dark`
- [x] 6.2 Style the index reference table: zebra stripes, distinct header bg (`--vp-c-bg-alt`), row hover
- [x] 6.3 Add a 🍸 brand mark in the nav title (`nav-bar-title-before` slot or logo/title CSS)

## 7. Verify & guard invariants

- [x] 7.1 Run `yarn docs:build` then `yarn docs:preview`; confirm no Python step runs and the build is green
- [x] 7.2 Confirm `index.md`, `tags.md`, `.vitepress/sidebar.generated.json`, `scripts/wiki.py` are unchanged (git diff clean); run `python scripts/wiki.py compile` and confirm it reproduces them identically
- [x] 7.3 Visually check all 4 cards + index + tags pages in both light and dark modes; verify graceful degradation if a component can't parse a line
