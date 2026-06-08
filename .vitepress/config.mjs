import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// Deterministic sidebar: committed artifact emitted by `python scripts/wiki.py compile`
// from the wiki/ cards. Read here at config-load time (works regardless of how VitePress
// bundles the config — no JSON import-assertion dependency). NEVER hand-edit it.
const __dirname = dirname(fileURLToPath(import.meta.url))
const sidebar = JSON.parse(
  readFileSync(resolve(__dirname, 'sidebar.generated.json'), 'utf-8'),
)

// GitHub Pages project site is served under /<repo>/.
// NOTE: the llms plugin's `domain` must be the ORIGIN ONLY. The plugin appends each page's
// already-base-prefixed path (/CocktailDex/...) to `domain`, so including the /CocktailDex
// segment here would double it (…/CocktailDex/CocktailDex/…). Origin + base path =
// https://c892836a.github.io/CocktailDex/… which is exactly what the spec requires.
const SITE_ORIGIN = 'https://c892836a.github.io'

export default defineConfig({
  title: 'CocktailDex',
  description: 'A persistent, compounding cocktail knowledge base.',
  lang: 'en-US',

  // Typography (theme D5): serif display font for headings. Loaded non-blocking via
  // preconnect + `display=swap` so the build/first paint never waits on it; if the font
  // fails to fetch, custom.css falls back to a system serif stack. CDN-hosted — no binary
  // assets in-repo and CI stays Node-only. Body keeps the VitePress Inter base.
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap',
    }],
  ],

  // D1 — read content in-place from the repo root; never copy into a docs/ folder.
  srcDir: '.',
  // D4 — project-site base path so assets/links resolve on GitHub Pages.
  base: '/CocktailDex/',

  // D1 — hide operational (non-content) files from the site.
  srcExclude: [
    'raw/**',
    'scripts/**',
    'openspec/**',
    '.claude/**',
    'node_modules/**',
    'CLAUDE.md',
    'GEMINI.md',
    'README.md',
    'photos/README.md',
    'log.md',
  ],

  // D6 — index.md/tags.md link to excluded operational files; ignore only those known
  // operational paths so genuine content links (cards, photos) are still validated.
  ignoreDeadLinks: [
    /\/CLAUDE(\.md)?$/,
    /\/GEMINI(\.md)?$/,
    /\/README(\.md)?$/,
    /\/log(\.md)?$/,
    /\/raw\//,
    /\/scripts\//,
    /\/openspec\//,
    /\/wiki\/(index)?$/, // bare wiki/ dir link in index.md (normalized to ./wiki/index); cards resolve
  ],

  themeConfig: {
    // D2 — generated, never hand-maintained.
    sidebar,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Tags', link: '/tags' },
    ],
    // D7 — free, static, client-side search.
    search: { provider: 'local' },
  },

  vite: {
    plugins: [
      // D3 — emit llms.txt + llms-full.txt at the site root with absolute URLs.
      llmstxt({ domain: SITE_ORIGIN }),
    ],
  },
})
