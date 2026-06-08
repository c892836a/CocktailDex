## ADDED Requirements

### Requirement: Content area widens on wide viewports

The theme SHALL widen the main content area on wide viewports, and only on wide viewports. At
viewport widths at or above 1600px it SHALL raise `--vp-layout-max-width` and the doc content
container max-width; at any width below 1600px the rendered geometry SHALL be identical to the
stock default theme (no change to `--vp-layout-max-width` or the content container), so laptops,
tablets, and phones are unaffected. The widening SHALL apply uniformly to all doc pages, SHALL take
precedence over the default theme's scoped content-width rule, and SHALL NOT depend on the
build-volatile scoped-style hash (`data-v-…`).

#### Scenario: Narrow viewport unchanged
- **WHEN** the site is viewed at a viewport width of 1536px (or any width below 1600px)
- **THEN** `--vp-layout-max-width` remains 1440px and the doc content container keeps its default
  688px max-width, identical to the theme before this requirement

#### Scenario: Tier 1 widening at 1600px
- **WHEN** the site is viewed at a viewport width between 1600px and 1919px
- **THEN** `--vp-layout-max-width` is 1648px and the doc content container max-width is 856px

#### Scenario: Tier 2 widening at 1920px
- **WHEN** the site is viewed at a viewport width of 1920px or greater
- **THEN** `--vp-layout-max-width` is 1840px and the doc content container max-width is 920px

#### Scenario: Uniform across all doc pages
- **WHEN** the site is viewed at ≥1600px and the user navigates between the index/tags pages and a
  recipe card page
- **THEN** both render their content at the same widened container width for that tier

#### Scenario: Override wins and survives rebuild
- **WHEN** the default theme emits its scoped content-container rule
  (`.VPDoc.has-aside .content-container[data-v-<hash>] { max-width: 688px }`) and a later rebuild
  changes the `data-v-<hash>` value
- **THEN** the widening still applies, because the override matches-or-beats the scoped rule's
  specificity and never references the hash
