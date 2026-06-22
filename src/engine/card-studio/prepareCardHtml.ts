import { degradeModulesToGfm } from '@/engine/export/moduleToGfm/degrade'
import { markdownUsesLayoutModules } from '@/utils/detectLayoutModules'
import { normalizeMarkdownContent } from '@/utils/normalizeMarkdownContent'
import { buildCardThemeStyleBlock } from './cardThemeStyles'
import type { CardThemeId } from './cardThemes/types'
import { buildKatexStyleBlock } from './katexCardStyles'
import { buildXhsShellStyleBlock } from './cardXhsChrome'
import { getCardTheme } from './cardThemes/registry'
import { renderCardMarkdown } from './renderCardMarkdown'
import { wrapWithCardChrome } from './wrapCardChrome'

export interface PrepareCardHtmlOptions {
  richContent?: boolean
}

export interface PrepareCardHtmlResult {
  html: string
  hadModules: boolean
}

export function prepareCardHtml(
  md: string,
  themeId: CardThemeId,
  opts: PrepareCardHtmlOptions = {},
): PrepareCardHtmlResult {
  const hadModules = markdownUsesLayoutModules(md)
  const normalized = normalizeMarkdownContent(md)
  const { markdown } = degradeModulesToGfm(normalized)
  const inner = renderCardMarkdown(markdown.trim(), { richContent: opts.richContent })
  const theme = getCardTheme(themeId)
  const needsKatex = Boolean(opts.richContent && inner.includes('class="katex'))
  const styles =
    buildCardThemeStyleBlock(themeId) +
    buildXhsShellStyleBlock(theme) +
    (needsKatex ? buildKatexStyleBlock() : '')
  if (!inner.trim()) {
    return { html: styles, hadModules }
  }
  const body = wrapWithCardChrome(inner, themeId)
  return { html: `${styles}${body}`, hadModules }
}
