/** ATX 标题：`#` 与标题文字之间必须有空格（CommonMark） */
const ATX_HEADING_MISSING_SPACE = /^(#{1,6})([^\s#].*)$/

/**
 * 修正 AI 生成正文常见的 Markdown 问题，保证公众号主题预览可解析标题。
 */
export function normalizeMarkdownContent(markdown: string): string {
  if (!markdown.trim()) return markdown

  const body = unwrapMarkdownFence(markdown.trim())
  return body
    .split('\n')
    .map((line) => {
      const m = line.match(ATX_HEADING_MISSING_SPACE)
      if (!m) return line
      return `${m[1]} ${m[2]}`
    })
    .join('\n')
}

function unwrapMarkdownFence(text: string): string {
  if (!text.startsWith('```')) return text
  const firstNewline = text.indexOf('\n')
  if (firstNewline < 0) return text
  const opener = text.slice(0, firstNewline).trim()
  if (!/^```(?:markdown|md)?$/i.test(opener)) return text
  const close = text.lastIndexOf('\n```')
  if (close <= firstNewline) return text
  return text.slice(firstNewline + 1, close).trim()
}
