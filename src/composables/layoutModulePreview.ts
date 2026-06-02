import { buildLayoutModuleSnippet } from '@/constants/layoutModuleSnippets'
import {
  OPEN_RENDER_ENTITLEMENTS,
  preloadLayoutRenderer,
  renderMarkdownWithThemeExtras,
} from '@/engine'

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
      const markdown = buildLayoutModuleSnippet(moduleId)
      const html = await renderMarkdownWithThemeExtras(
        markdown,
        'normal',
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
