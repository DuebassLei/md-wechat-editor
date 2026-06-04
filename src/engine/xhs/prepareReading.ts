import { renderMarkdown } from '@/utils/renderMarkdown'
import { normalizeMarkdownContent } from '@/utils/normalizeMarkdownContent'
import { degradeModulesToGfm } from '@/engine/export/moduleToGfm/degrade'
import {
  buildReadingStyleBlock,
  type ReadingSkin,
} from '@/engine/card-export/readingStyles'
import type { ThemeColors } from '@/engine/r-markdown/themeColors'

export interface PrepareReadingOptions {
  skin?: ReadingSkin
  colors?: ThemeColors
}

export function prepareReadingHtml(
  contentMd: string,
  opts?: ThemeColors | PrepareReadingOptions,
): string {
  let skin: ReadingSkin = 'xhs'
  let colors: ThemeColors | undefined
  if (opts && 'accent' in opts) {
    colors = opts
  } else if (opts && typeof opts === 'object') {
    skin = opts.skin ?? 'xhs'
    colors = opts.colors
  }

  const normalized = normalizeMarkdownContent(contentMd)
  const { markdown } = degradeModulesToGfm(normalized)
  const inner = renderMarkdown(markdown.trim())
  if (!inner.trim()) return ''
  const styles = buildReadingStyleBlock(skin, colors)
  return `${styles}${inner}`
}
