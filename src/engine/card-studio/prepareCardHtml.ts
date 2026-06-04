import { degradeModulesToGfm } from '@/engine/export/moduleToGfm/degrade'
import { markdownUsesLayoutModules } from '@/utils/detectLayoutModules'
import { normalizeMarkdownContent } from '@/utils/normalizeMarkdownContent'
import { renderMarkdown } from '@/utils/renderMarkdown'
import { buildCardThemeStyleBlock } from './cardThemeStyles'
import type { CardThemeId } from './cardThemes/types'
import { wrapWithCardChrome } from './wrapCardChrome'

export interface PrepareCardHtmlResult {
  html: string
  hadModules: boolean
}

export function prepareCardHtml(md: string, themeId: CardThemeId): PrepareCardHtmlResult {
  const hadModules = markdownUsesLayoutModules(md)
  const normalized = normalizeMarkdownContent(md)
  const { markdown } = degradeModulesToGfm(normalized)
  const inner = renderMarkdown(markdown.trim())
  const styles = buildCardThemeStyleBlock(themeId)
  if (!inner.trim()) {
    return { html: styles, hadModules }
  }
  const body = wrapWithCardChrome(inner, themeId)
  return { html: `${styles}${body}`, hadModules }
}
