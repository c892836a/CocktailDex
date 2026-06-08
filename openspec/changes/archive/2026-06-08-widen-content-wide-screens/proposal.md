## Why

On wide displays (the owner's 27" 1080p and 1440p monitors), the VitePress default
theme centers the layout at `--vp-layout-max-width: 1440px` and caps the prose column at
`688px`, leaving large symmetric empty gutters and a narrow content area. The index/tags
reference tables and recipe cards have room to breathe but don't use it. Smaller screens
(laptops ≤1536px, tablets, phones) already read well and must not change.

## What Changes

- Add additive `min-width` media-query blocks to `.vitepress/theme/custom.css` that widen
  the main content area **only at ≥1600px**, leaving every smaller breakpoint byte-for-byte
  unchanged.
- Tier 1 (`≥1600px`): raise `--vp-layout-max-width` 1440 → **1648px** and the doc content
  container 688 → **856px** for all doc pages.
- Tier 2 (`≥1920px`): raise `--vp-layout-max-width` → **1840px** and the content container
  → **920px**, so 1440p / ultrawide screens use their extra room without over-widening prose.
- Override beats VitePress's scoped `[data-v-…]` rule by repeating the `.content-container`
  class; never targets the build-volatile `data-v` hash.
- Presentation-only: no content, config, or generated files touched.

## Capabilities

### New Capabilities
<!-- None — folded into the existing site-theme capability (see below). -->

### Modified Capabilities
- `site-theme`: Add a "Content area widens on wide viewports" requirement to the
  presentation-only theme — breakpoint-gated (≥1600px) content-area widening, the target
  layout/content widths per tier, uniform application across doc pages, and the guarantee
  that screens below the threshold are unaffected.

## Impact

- **File:** `.vitepress/theme/custom.css` (append a new responsive-width section; existing
  palette/typography/chip/rating blocks unchanged).
- **No change to:** `.vitepress/config.mjs`, generated files (`index.md`, `tags.md`,
  `sidebar.generated.json`), wiki cards, or build pipeline (still Node-only, no Python at build).
- **Behavioral surface:** visual layout of all doc pages at viewport ≥1600px only.
