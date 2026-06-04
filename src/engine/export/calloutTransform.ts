const CALLOUT_LABELS: Record<string, string> = {
  NOTE: '📝 **注意**',
  TIP: '💡 **提示**',
  IMPORTANT: '❗ **重要**',
  WARNING: '⚠️ **警告**',
  CAUTION: '🚨 **危险**',
}

/** 墨韵 `> [TIP]` 与 GitHub `> [!TIP]` → 掘金/CSDN 兼容引用块 */
export function transformCallouts(markdown: string): string {
  const lines = markdown.split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const moyun = lines[i].match(/^>\s*\[(TIP|NOTE|WARNING|CAUTION|IMPORTANT)\]\s*(.*)$/i)
    const github = lines[i].match(/^>\s*\[!(TIP|NOTE|WARNING|CAUTION|IMPORTANT)\]\s*(.*)$/i)
    const m = moyun ?? github
    if (!m) {
      out.push(lines[i])
      i++
      continue
    }
    const type = m[1].toUpperCase()
    const rest = m[2]?.trim() ?? ''
    const label = CALLOUT_LABELS[type] ?? CALLOUT_LABELS.NOTE
    out.push(`> ${label}${rest ? `：${rest}` : ''}`)
    i++
    while (i < lines.length && /^>\s?/.test(lines[i])) {
      out.push(lines[i].replace(/^>\s?/, '> '))
      i++
    }
  }

  return out.join('\n')
}
