import type { ThemeColors } from '../themeColors'
import { inlineFormat } from './inlineFormat'
import { Compare_DA01 } from '../editor-components/Compare_DA01'
import { Compare_DA02 } from '../editor-components/Compare_DA02'
import type { ParseMarkdownOptions } from '../parseOptions'
import { guardLayoutModule } from '../parseOptions'
import { readFencedModule } from './fencedModule'

const LEFT_MARK = /^---left---\s*$/i
const RIGHT_MARK = /^---right---\s*$/i

function splitCompareRichBody(bodyLines: string[]): { left: string; right: string } | null {
  let leftLines: string[] = []
  let rightLines: string[] = []
  let side: 'none' | 'left' | 'right' = 'none'
  let sawMarker = false

  for (const line of bodyLines) {
    if (LEFT_MARK.test(line.trim())) {
      side = 'left'
      sawMarker = true
      continue
    }
    if (RIGHT_MARK.test(line.trim())) {
      side = 'right'
      sawMarker = true
      continue
    }
    if (side === 'left') leftLines.push(line)
    else if (side === 'right') rightLines.push(line)
    else if (side === 'none' && line.trim()) return null
  }

  if (!sawMarker) return null
  return {
    left: leftLines.join('\n').trim(),
    right: rightLines.join('\n').trim(),
  }
}

/** :::compare 富文本分区（---left--- / ---right---）；无分区时返回 null 走行式解析 */
export function tryParseCompareFenced(
  lines: string[],
  start: number,
  t: ThemeColors,
  opts?: ParseMarkdownOptions,
): { html: string; next: number } | null {
  if (!/^:::\s*compare\b/i.test(lines[start])) return null

  const fenced = readFencedModule(lines, start)
  if (!fenced || fenced.name !== 'compare') return null

  const parts = splitCompareRichBody(fenced.bodyLines)
  if (!parts) return null

  const locked = guardLayoutModule('compare', opts)
  if (locked) return { html: locked, next: fenced.next }

  const attrs = { ...fenced.attrs }
  delete attrs._body

  const body = `<left>\n${parts.left}\n</left>\n<right>\n${parts.right}\n</right>`
  const inlineRenderer = (md: string) => inlineFormat(md, t)
  const renderer = attrs.type === 'DA02' ? Compare_DA02 : Compare_DA01
  const html = renderer.render(attrs, body, t, inlineRenderer)
  return { html, next: fenced.next }
}
