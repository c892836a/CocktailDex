## ADDED Requirements

### Requirement: Custom theme extends the default theme

The site SHALL provide a VitePress custom theme that **extends** (not replaces) the default
theme, so the default sidebar, local search, outline, and dark-mode toggle remain functional. The
theme SHALL be defined under `.vitepress/theme/` and load a `custom.css` stylesheet.

#### Scenario: Theme is picked up at build time
- **WHEN** the site is built with `.vitepress/theme/index.js` present
- **THEN** the build succeeds with no Python step and the rendered site applies the custom styles
- **AND** the default theme's sidebar, search, outline, and dark-mode toggle still work

#### Scenario: Rollback by removal
- **WHEN** the `.vitepress/theme/` directory is removed
- **THEN** the site builds and renders with the stock default theme
- **AND** no generated content file is required to change

### Requirement: Generated and human-only data are never modified

The theme SHALL be a presentation-only layer. It MUST NOT edit, regenerate, or require changes to
any generated file (`index.md`, `tags.md`, `.vitepress/sidebar.generated.json`) or to
`scripts/wiki.py`. It MUST NOT write, default, infer, or alter the human-only fields
(Eric Rating, Charlene Rating, Modified Variation).

#### Scenario: No generated file is touched
- **WHEN** the theme is added and the site is built
- **THEN** `index.md`, `tags.md`, `.vitepress/sidebar.generated.json`, and `scripts/wiki.py`
  are unchanged on disk
- **AND** `scripts/wiki.py compile` still reproduces those generated files identically

#### Scenario: Rating values are read-only
- **WHEN** the theme renders a card's rating line
- **THEN** it derives the display solely from the number already present in the markdown
- **AND** a blank rating (`_ / 5`) renders a "not yet rated" state without any value being written

### Requirement: Light and dark palette share one brand hue

The theme SHALL define an amber/copper "speakeasy" palette with both a light and a dark variant
that share the same brand hue, implemented by overriding VitePress CSS variables
(`--vp-c-brand-*`, `--vp-c-bg-*`, `--vp-c-text-*`). Brand and body text SHALL meet WCAG AA
contrast against their backgrounds in both modes.

#### Scenario: Light mode
- **WHEN** the site is viewed in light mode
- **THEN** the background is a warm paper tone and the brand/link colour is a deep copper
- **AND** body text on background meets WCAG AA contrast

#### Scenario: Dark mode
- **WHEN** the user toggles dark mode
- **THEN** the background is a warm espresso-black and the brand/link colour is a bright gold-amber
  of the same hue family as the light mode copper
- **AND** body text on background meets WCAG AA contrast

### Requirement: Serif display headings with sans body

The theme SHALL render top-level content headings (`h1`, `h2`) in a serif display font (Playfair
Display) while body text keeps a clean sans-serif (Inter). Fonts SHALL load without blocking the
build, and a system fallback SHALL keep the site readable if the web font fails to load.

#### Scenario: Headings use the display font
- **WHEN** a cocktail card or index page renders
- **THEN** its `h1`/`h2` use the serif display font and body text uses the sans font

#### Scenario: Font failure degrades gracefully
- **WHEN** the web font cannot be fetched
- **THEN** headings fall back to a system serif stack and the page remains readable

### Requirement: Tag hashtags render as dimension-coloured chips

The theme SHALL render the inline `#Tag` hashtags as coloured pill chips, assigning one colour
family per tag dimension (Base Spirit, Ingredient, Flavor/Profile, Technique, Family/Style,
Glassware) consistent with the 6-dimension VOCABULARY in `scripts/wiki.py`. A tag whose dimension
cannot be resolved SHALL fall back to a neutral chip colour rather than erroring.

#### Scenario: Chip coloured by dimension
- **WHEN** a card displays `#Rum #Mint #Refreshing`
- **THEN** `#Rum` uses the Base Spirit colour, `#Mint` the Ingredient colour, and `#Refreshing`
  the Flavor colour

#### Scenario: Unknown tag falls back
- **WHEN** a tag is not found in any dimension
- **THEN** it renders as a neutral-coloured chip and the page does not error

### Requirement: Ratings render as read-only stars

The theme SHALL render each `_ / N` rating line as a row of star glyphs reflecting the value
already present in the markdown, as a read-only display. It MUST NOT add, change, or guess a value.

#### Scenario: Numeric rating shown as stars
- **WHEN** a card line reads `4 / 5`
- **THEN** the theme renders four filled stars and one empty star

#### Scenario: Blank rating shown as not-rated
- **WHEN** a card line reads `_ / 5`
- **THEN** the theme renders an empty/"not yet rated" state and writes no value

### Requirement: Photo, table, and nav polish

The theme SHALL apply purely visual polish without changing markup: content photos get rounded
corners, a soft shadow, a sensible max-width and centering (with reduced brightness in dark mode);
the index reference table gets zebra striping, a distinct header background, and row hover; the nav
shows a 🍸 brand mark alongside the title.

#### Scenario: Photo styling
- **WHEN** a card with a photo renders
- **THEN** the image has rounded corners, a soft shadow, and a constrained max-width
- **AND** in dark mode its brightness is slightly reduced

#### Scenario: Index table styling
- **WHEN** the index reference table renders
- **THEN** rows are zebra-striped, the header has a distinct background, and hovering a row
  highlights it
