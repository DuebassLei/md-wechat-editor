import { applySharedCleanup } from '../markdownCleanup'
import { transformCallouts } from '../calloutTransform'

/** Markdown Extra 自定义列表 "term : def" → 无序列表 */
function normalizeDefinitionLists(markdown: string): string {
  return markdown.replace(/^(.+?)\s*:\s+(.+)$/gm, (match, term, def) => {
    const t = term.trim()
    if (t.startsWith('http') || t.startsWith('#') || t.startsWith('>')) return match
    if (t.includes('|') || t.includes('`')) return match
    if (/^\d+\.\s/.test(t) || /^[-*+]\s/.test(t)) return match
    if (def.includes('|')) return match
    return `- **${t}** — ${def.trim()}`
  })
}

export function adaptForJuejin(markdown: string): string {
  let out = transformCallouts(markdown)
  out = normalizeDefinitionLists(out)
  out = applySharedCleanup(out)
  return out
}
