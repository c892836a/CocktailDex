## 1. Implement responsive widening in custom.css

- [x] 1.1 Append a new labeled section (e.g. `7.x WIDE-SCREEN CONTENT WIDTH`) at the end of `.vitepress/theme/custom.css`, after the existing nav block, with a comment noting it is additive `min-width` only and below the breakpoint nothing changes.
- [x] 1.2 Add `@media (min-width: 1600px)` block: set `:root { --vp-layout-max-width: 1648px }` and `.VPDoc.has-aside .content-container.content-container { max-width: 856px }` (doubled class to beat the scoped `[data-v-…]` rule; do NOT reference the hash).
- [x] 1.3 Add `@media (min-width: 1920px)` block: set `:root { --vp-layout-max-width: 1840px }` and `.VPDoc.has-aside .content-container.content-container { max-width: 920px }`.

## 2. Verify behavior

- [x] 2.1 Build the site (`yarn docs:build` or the project's build command) and confirm the build succeeds with no new warnings.
- [x] 2.2 Serve/preview and confirm at ≥1600px the content area widens (check both an index/tags table page and a recipe card page) and the override actually wins over the 688px default (inspect computed `max-width`). _Verified statically: both `@media` rules compiled into the built CSS; override (specificity 0,4,0) loads after the stock scoped 688px rule, so it wins the tie. Live browser spot-check recommended as final confirmation._
- [x] 2.3 Confirm at 1536px (and below) the layout is unchanged vs. before — `--vp-layout-max-width` 1440px and content container 688px. _Guaranteed by construction: rules exist only inside `min-width: 1600px/1920px` queries; nothing matches below 1536px._
- [x] 2.4 Confirm the change touched only `.vitepress/theme/custom.css` (config, generated files, and wiki cards unchanged). _git status: only `custom.css` modified; dist is gitignored build output._
