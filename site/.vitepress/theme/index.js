// CocktailDex custom theme — a presentation-only layer that EXTENDS the default
// VitePress theme (D1). Sidebar, local search, outline, and the dark-mode toggle all
// come from DefaultTheme for free. We add:
//   - custom.css           → speakeasy palette, typography, chip/star/photo/table/nav styling
//   - Layout (wrapper)      → runs a client-side DOM transform that turns the existing
//                             `#Tag` text into dimension chips and `N / 5` lines into stars.
//
// Hard invariant: this layer NEVER edits generated content or human-only rating values.
// The DOM transform only READS the already-rendered markup and degrades to plain text on
// anything it can't parse (see enhance.js).
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Layout from './Layout.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    // No globally-registered components needed — beautification is CSS + the Layout's
    // client-side transform. Hook kept (per design) for future enhancements.
  },
}
