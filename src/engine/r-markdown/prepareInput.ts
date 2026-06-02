const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

function parseYamlBlock(raw: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const line of raw.split('\n')) {
    const m = line.match(/^([\w-]+):\s*(.+)$/)
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
  return out
}

function heroBlockFromMeta(meta: Record<string, string>): string {
  const lines: string[] = []
  const eyebrow = meta.badge || meta.heroTag || meta.eyebrow || ''
  const title = meta.heroTitle || meta.title || ''
  const subtitle = meta.heroSubtitle || meta.subtitle || ''
  const chipsRaw = meta.heroTags || meta.chips || ''
  const chips = chipsRaw
    .split(/[,，|]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .join('|')
  if (eyebrow) lines.push(`eyebrow: ${eyebrow}`)
  if (title) lines.push(`title: ${title}`)
  if (subtitle) lines.push(`subtitle: ${subtitle}`)
  if (chips) lines.push(`chips: ${chips}`)
  if (!lines.length) return ''
  return `:::hero\n${lines.join('\n')}\n:::\n\n`
}

/** 将文首 YAML 转为 :::hero 围栏，统一走排版模块解析 */
export function prepareLayoutInput(markdown: string): string {
  if (!markdown?.trim()) return markdown

  const fmMatch = markdown.trimStart().match(FRONTMATTER_RE)
  if (!fmMatch) return markdown

  const meta = parseYamlBlock(fmMatch[1])
  const body = markdown.slice(fmMatch[0].length).replace(/^\s+/, '')

  const hasHeroMeta = Boolean(
    meta.badge ||
      meta.title ||
      meta.subtitle ||
      meta.chips ||
      meta.heroTag ||
      meta.heroTitle ||
      meta.heroSubtitle ||
      meta.heroTags ||
      meta.eyebrow,
  )

  if (!hasHeroMeta) return body

  return heroBlockFromMeta(meta) + body
}

/** @deprecated 使用 prepareLayoutInput */
export const prepareRMarkdownInput = prepareLayoutInput
