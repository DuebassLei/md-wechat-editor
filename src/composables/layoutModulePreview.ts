import { buildLayoutModuleSnippet } from '@/constants/layoutModuleSnippets'
import {
  OPEN_RENDER_ENTITLEMENTS,
  normalizeThemeId,
  preloadLayoutRenderer,
  renderMarkdownWithThemeExtras,
  type ThemeId,
} from '@/engine'
import { getSnippet } from '@/modules'

const cache = new Map<string, string>()
const pending = new Map<string, Promise<string>>()

export function preloadLayoutModulePreviewRenderer(): void {
  preloadLayoutRenderer()
}

export async function renderLayoutModulePreviewHtml(moduleId: string): Promise<string> {
  const cached = cache.get(moduleId)
  if (cached !== undefined) return cached

  let task = pending.get(moduleId)
  if (!task) {
    task = (async () => {
      const markdown = getSnippet(moduleId) || buildLayoutModuleSnippet(moduleId)
      const previewTheme: ThemeId =
        moduleId === 'ai-indigo-hero' ? 'aiIndigo' : normalizeThemeId('normal')
      const html = await renderMarkdownWithThemeExtras(
        markdown,
        previewTheme,
        OPEN_RENDER_ENTITLEMENTS,
        null,
      )
      cache.set(moduleId, html)
      pending.delete(moduleId)
      return html
    })()
    pending.set(moduleId, task)
  }

  return task
}
