import { marked } from 'marked'
import { applyHeadingThemeCompat } from '@/utils/markdownThemeCompat'

marked.setOptions({
  gfm: true,
  breaks: false,
})

/** Markdown → HTML，并补齐 mdnice 主题所需的标题/列表 DOM 结构 */
export function renderMarkdown(content: string): string {
  if (!content?.trim()) return ''
  const html = marked.parse(content) as string
  return applyHeadingThemeCompat(html)
}
