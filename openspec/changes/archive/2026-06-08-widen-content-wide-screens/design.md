## Context

CocktailDex publishes via VitePress using the default theme plus a presentation-only
`.vitepress/theme/custom.css` (palette, typography, tag chips, star ratings — no geometry
overrides today). The default theme is **mobile-first**: every width constraint is a
`min-width` media query that *adds* limits as the viewport grows. Two stacked caps create
the wide-screen empty space:

- `:root { --vp-layout-max-width: 1440px }` — centers the whole layout, producing symmetric
  gutters past 1440px.
- `@media (min-width: 1280px) { .VPDoc.has-aside .content-container { max-width: 688px } }` —
  caps the prose/content column (verified in the built `dist` CSS, emitted with a scoped
  `[data-v-<hash>]` attribute).

The owner uses 27" 1080p (1920px) and 1440p (2560px) monitors; both clear any threshold in
the 1440–1600 range. Common laptops are ≤1536px and must stay untouched.

## Goals / Non-Goals

**Goals:**
- Widen the main content area on wide screens (≥1600px) for all doc pages.
- Guarantee screens below 1600px are byte-for-byte unchanged.
- Keep the override robust against VitePress's scoped styling and rebuilds.
- Stay presentation-only: one file, no config/content/build changes.

**Non-Goals:**
- Per-page or per-route width differences (owner chose uniform widening for all doc pages).
- Full-bleed / 100%-width layout (preserve a sane reading measure).
- Touching photos (already capped at ~460px, independent), nav, sidebar, or aside behavior
  beyond what the layout-max-width change naturally allows.
- Any change to the build pipeline (must remain Node-only, no Python at build).

## Decisions

**1. Additive `min-width` breakpoints, never `max-width`.**
Because the theme is mobile-first, new rules placed behind `@media (min-width: 1600px)` /
`(min-width: 1920px)` *cannot* affect any narrower viewport — the guarantee is structural,
not just by-convention. Alternative (a `max-width`-bounded block or JS-driven resize) was
rejected as unnecessary and riskier.

**2. Breakpoint at 1600px, with a second tier at 1920px.**
1600px sits safely above laptops (≤1536px) and below both owner monitors. The 1920px tier
lets the 1440p/ultrawide display use extra room without over-stretching prose on the 1080p
screen. Owner confirmed 1600px; the 1920px tier is a gentle enhancement, easy to drop.

**3. Width targets — layout 1648/1840px, content 856/920px.**
Tier 1 (≥1600): `--vp-layout-max-width: 1648px`, content `856px`. Tier 2 (≥1920):
`1840px` / `920px`. Content stays ≤920px to keep long Background paragraphs within a
comfortable reading measure (~90 chars) while giving the index/tags tables real room.

**4. Beat scoped specificity without binding to the hash.**
VitePress's rule is `.VPDoc.has-aside .content-container[data-v-<hash>]` (specificity
0,4,0). A plain `.VPDoc.has-aside .content-container` (0,3,0) loses even though custom.css
loads later. The override repeats the class —
`.VPDoc.has-aside .content-container.content-container` (0,4,0) — to win on source order,
and never references the `data-v-<hash>` attribute (which changes per build). Alternative
(`!important`) rejected as a heavier hammer that's harder to override later.

**5. Override both the `:root` variable and the concrete container rule.**
Raising `--vp-layout-max-width` alone shrinks the gutters but leaves the 688px prose cap;
the 688px rule is a hard pixel value (not derived from the variable), so it must be
overridden directly. Both are needed.

## Risks / Trade-offs

- **VitePress changes its content-container class/structure in a future major** → the
  override silently no-ops. Mitigation: rule is isolated in one labeled section; a visual
  check at ≥1600px after any VitePress upgrade catches it. Low likelihood, low blast radius.
- **Reading measure on long prose at 920px** → slightly long lines for dense Background
  paragraphs. Mitigation: capped at 920px (not full-bleed); revisit per-page split later if
  it bothers the owner.
- **Specificity drift if VitePress raises its own specificity** → override could lose again.
  Mitigation: the doubled-class approach already matches their token count and wins on order;
  if it ever ties higher, bump with a wrapper class rather than `!important`.

## Open Questions

- None blocking. The 1920px tier is optional polish and can be removed in one edit if the
  owner prefers a single breakpoint.
