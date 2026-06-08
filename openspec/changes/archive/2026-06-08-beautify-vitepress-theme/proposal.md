## Why

The published VitePress site renders the wiki with the stock default theme: cold blue/violet
brand colour, no typographic identity, raw `![]()` photos, and plain `#Rum #Mint` text tags.
For a cocktail collection this reads as generic and "陽春" (bare). We want a styling layer that
gives the site a speakeasy / aged-spirit identity — without touching any generated content.

## What Changes

- Add a VitePress **custom theme that extends the default theme** (`.vitepress/theme/index.js`
  + `custom.css`), so all styling lives in the theme layer and the generated markdown is
  untouched.
- **Amber/copper "speakeasy" palette** with light + dark variants sharing one hue: light =
  warm paper + deep copper; dark = warm espresso-black + bright gold-amber. Overrides VitePress
  `--vp-c-brand-*`, `--vp-c-bg-*`, and `--vp-c-text-*` variables.
- **Typography**: serif display font (Playfair Display) for `h1`/`h2`, clean sans (Inter, the
  VitePress default) for body. Fonts loaded without blocking the build.
- **6-dimension tag chips**: render the existing inline `#Tag` hashtags as coloured pills, one
  colour family per tag dimension (Base Spirit copper, Ingredient green, Flavor wine, Technique
  blue, Family/Style plum, Glassware graphite). Requires a small global component because the
  dimension→colour mapping is data, not pure CSS.
- **Card & table polish**: rounded photos with soft shadow and a sensible max-width; zebra-striped
  index table with hover highlight; a 🍸 logo/title treatment in the nav.
- **Star ratings**: render the `_ / 5` rating lines as ★ glyphs (read-only display) via a small
  component. Human-only rating *values* are never modified — this is presentation only.

## Capabilities

### New Capabilities
- `site-theme`: the visual identity layer for the VitePress site — colour palette (light/dark),
  typography, tag-chip styling by dimension, card/photo/table polish, and the read-only star
  rating display. Defines what the theme must render and the invariants it must respect (no edits
  to generated files, no mutation of human-only rating values).

### Modified Capabilities
<!-- None. The existing vitepress-site capability (site builds & deploys over the wiki markdown)
     is unchanged; theming is additive and lives entirely in the theme layer. -->

## Impact

- **New files**: `.vitepress/theme/index.js`, `.vitepress/theme/custom.css`, and small Vue
  component(s) for tag chips and star ratings (under `.vitepress/theme/components/`).
- **Touched**: `.vitepress/config.mjs` only if a font preload (`transformHead`) or logo asset is
  wired in.
- **Must NOT touch** (hard invariant): `index.md`, `tags.md`, `.vitepress/sidebar.generated.json`,
  `scripts/wiki.py` — all generated/owned by the compile pipeline.
- **Dependencies**: a web-font source (CDN or self-hosted Playfair Display). No new build-time
  Python; CI stays Node-only.
- **Risk**: the tag-chip and star components must degrade gracefully — if a card's markup differs,
  the plain markdown must still render readably.
