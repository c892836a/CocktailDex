<script setup>
// Thin wrapper around the default theme Layout. Its only job is to run the read-only
// client-side DOM transform (chips + stars) after each page renders. SSR emits the plain
// markdown; the transform applies on the client, so no-JS / pre-hydration still shows the
// original `#Tag` text and `N / 5` lines — graceful degradation by construction.
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { nextTick, onMounted, watch } from 'vue'
import { enhanceContent } from './enhance.js'

const { Layout } = DefaultTheme
const route = useRoute()

function run() {
  nextTick(() => enhanceContent())
}

onMounted(run)
// Re-run on client-side navigation between pages.
watch(() => route.path, run)
</script>

<template>
  <Layout />
</template>
