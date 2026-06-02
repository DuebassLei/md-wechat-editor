import { renderMarkdown } from '@/utils/renderMarkdown'
import { getThemeCss } from '@/types/theme'
import { buildWechatHtml } from '@/utils/wechatCopy'
import type { ThemeId } from '@/types/theme'

/** 混合排版中 GFM 片段的包裹类，用于 scoped 主题 CSS */
export const AWP_GFM_THEME_CLASS = 'awp-gfm-theme'

export function wrapGfmThemeHtml(markdownHtml: string): string {
  if (!markdownHtml.trim()) return ''
  return `<div class="${AWP_GFM_THEME_CLASS}">${markdownHtml}</div>`
}

export function flushGfmMarkdownBuffer(lines: string[]): string {
  if (!lines.length) return ''
  const content = lines.join('\n').trim()
  lines.length = 0
  if (!content) return ''
  return wrapGfmThemeHtml(renderMarkdown(content))
}

const GFM_THEME_BLOCK_RE = new RegExp(
  `<div class="${AWP_GFM_THEME_CLASS}">([\\s\\S]*?)</div>`,
  'g',
)

/** 导出/复制：仅对 GFM 块做 juice 内联主题，排版组件保持原样 */
export async function juiceGfmThemeBlocks(html: string, themeId: ThemeId): Promise<string> {
  const themeCss = getThemeCss(themeId, '#nice')
  const re = new RegExp(GFM_THEME_BLOCK_RE.source, 'g')
  let result = ''
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(html)) !== null) {
    result += html.slice(lastIndex, match.index)
    result += await buildWechatHtml(match[1], themeCss)
    lastIndex = match.index + match[0].length
  }

  return result + html.slice(lastIndex)
}
