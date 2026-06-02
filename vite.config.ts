import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const pagesBase = process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/'

export default defineConfig({
  base: pagesBase,
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@/lib/r-markdown',
        replacement: fileURLToPath(new URL('./src/engine/r-markdown', import.meta.url)),
      },
      {
        find: '@/themes',
        replacement: fileURLToPath(new URL('./src/engine/themes', import.meta.url)),
      },
      {
        find: '@/constants',
        replacement: fileURLToPath(new URL('./src/engine/constants', import.meta.url)),
      },
      {
        find: '@/utils',
        replacement: fileURLToPath(new URL('./src/engine/render', import.meta.url)),
      },
      {
        find: '@/types/theme',
        replacement: fileURLToPath(new URL('./src/types/theme.ts', import.meta.url)),
      },
      {
        find: '@/api/templateEntitlements',
        replacement: fileURLToPath(new URL('./src/api/templateEntitlements.ts', import.meta.url)),
      },
      {
        find: '@/types/entitlements',
        replacement: fileURLToPath(new URL('./src/types/entitlements.ts', import.meta.url)),
      },
      {
        find: '@/types/templateEntitlements',
        replacement: fileURLToPath(
          new URL('./src/engine/types/templateEntitlements.ts', import.meta.url),
        ),
      },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('engine/r-markdown')) return 'r-markdown'
          if (id.includes('node_modules/juice')) return 'juice'
        },
      },
    },
  },
})
