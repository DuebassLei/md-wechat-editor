const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

function parseYamlBlock(raw: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const line of raw.split('\n')) {
    const m = line.match(/^([\w-]+):\s*(.+)$/)
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
  return out
}

export interface FrontmatterSplit {
  preamble: string
  body: string
  hadFrontmatter: boolean
}

/** YAML frontmatter → GFM 标题区；返回 preamble + 剩余 body */
export function splitFrontmatterToGfm(markdown: string): FrontmatterSplit {
  const trimmed = markdown.trimStart()
  const fmMatch = trimmed.match(FRONTMATTER_RE)
  if (!fmMatch) return { preamble: '', body: markdown, hadFrontmatter: false }

  const meta = parseYamlBlock(fmMatch[1])
  const body = trimmed.slice(fmMatch[0].length).replace(/^\s+/, '')
  const lines: string[] = []

  const title = meta.heroTitle || meta.title || ''
  const subtitle = meta.heroSubtitle || meta.subtitle || ''
  const chipsRaw = meta.heroTags || meta.chips || meta.tags || ''
  const chips = chipsRaw
    .split(/[,，|]/)
    .map((s) => s.trim())
    .filter(Boolean)

  if (title) lines.push(`# ${title}`, '')
  if (subtitle) lines.push(`> ${subtitle}`, '')
  if (chips.length) lines.push(`**标签：** ${chips.join(' · ')}`, '')

  return {
    preamble: lines.join('\n').trimEnd(),
    body,
    hadFrontmatter: true,
  }
}
