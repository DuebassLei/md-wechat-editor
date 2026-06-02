const DEFAULT_TITLES = new Set(['未命名文档', '入门草稿'])

/** 从 Markdown 首条标题提取文档名 */
export function extractMarkdownTitle(content: string): string | null {
  const line = content
    .split('\n')
    .map((l) => l.trim())
    .find((l) => /^#{1,3}\s+\S/.test(l))
  if (!line) return null
  const m = line.match(/^#{1,3}\s+(.+)$/)
  return m?.[1]?.trim() ?? null
}

/** 是否适合用正文标题自动覆盖文档名 */
export function shouldAutoTitleDoc(currentTitle: string): boolean {
  return DEFAULT_TITLES.has(currentTitle.trim())
}
