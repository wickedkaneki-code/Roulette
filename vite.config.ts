import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/** Inlines the built JS and CSS into index.html so it works as one portable file. */
function inlineIntoHtml(): Plugin {
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return {
    name: 'inline-into-html',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = bundle['index.html']
      if (!html || html.type !== 'asset') return
      let source = String(html.source)
      for (const [file, output] of Object.entries(bundle)) {
        if (output.type === 'chunk' && file.endsWith('.js')) {
          const tag = new RegExp(`<script[^>]*src="[^"]*${escape(file)}"[^>]*></script>`)
          source = source.replace(tag, () => `<script type="module">${output.code}</script>`)
          delete bundle[file]
        } else if (output.type === 'asset' && file.endsWith('.css')) {
          const tag = new RegExp(`<link[^>]*href="[^"]*${escape(file)}"[^>]*>`)
          source = source.replace(tag, () => `<style>${String(output.source)}</style>`)
          delete bundle[file]
        }
      }
      html.source = source
    },
  }
}

// `vite build --mode single` writes one self-contained dist-single/index.html.
export default defineConfig(({ mode }) =>
  mode === 'single'
    ? {
        plugins: [react(), inlineIntoHtml()],
        base: './',
        build: { outDir: 'dist-single', cssCodeSplit: false, modulePreload: false, assetsInlineLimit: Infinity },
      }
    : { plugins: [react()] },
)
