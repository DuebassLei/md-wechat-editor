export interface LegacySyntaxReport {
  found: boolean
  tags: string[]
}

const LEGACY_TAG_RE =
  /<\s*(lead|statement|engage|breaking|p-title|title|reading-path|case-flow|badges|cta|compare|timeline|steps)\b/gi

const LEGACY_OTHER_RE = [
  /<\s*!\s*\[/,
  /^:::\s*block\s+/im,
]

export function detectLegacyLayoutSyntax(markdown: string): LegacySyntaxReport {
  if (!markdown?.trim()) return { found: false, tags: [] }

  const tags = new Set<string>()
  for (const m of markdown.matchAll(LEGACY_TAG_RE)) {
    if (m[1]) tags.add(m[1].toLowerCase())
  }

  const other = LEGACY_OTHER_RE.some((re) => re.test(markdown))
  const tagList = [...tags].sort()

  return {
    found: tagList.length > 0 || other,
    tags: tagList,
  }
}
