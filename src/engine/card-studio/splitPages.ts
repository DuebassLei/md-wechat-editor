import type { CardSegment } from './types'

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
const MANUAL_BREAK_RE = /^(?:---|\:\:\:page(?:\s+.+)?)\s*$/

function splitBody(md: string): CardSegment[] {
  const lines = md.split('\n')
  const chunks: string[] = []
  let buf: string[] = []

  for (const line of lines) {
    if (MANUAL_BREAK_RE.test(line.trim())) {
      const text = buf.join('\n').trim()
      if (text) chunks.push(text)
      buf = []
      continue
    }
    buf.push(line)
  }

  const tail = buf.join('\n').trim()
  if (tail) chunks.push(tail)

  if (!chunks.length) return []
  return chunks.map((markdown, index) => ({ index, markdown }))
}

export function splitByManualBreaks(md: string): CardSegment[] {
  const trimmed = md.trim()
  if (!trimmed) return [{ index: 0, markdown: '' }]

  let prefix = ''
  let body = md
  const fmMatch = md.match(FRONTMATTER_RE)
  if (fmMatch && md.trimStart().startsWith('---')) {
    prefix = fmMatch[0]
    body = md.slice(fmMatch[0].length)
  }

  const segments = splitBody(body)
  if (!segments.length) {
    return [{ index: 0, markdown: md.trim() }]
  }

  if (prefix) {
    segments[0] = {
      index: segments[0].index,
      markdown: prefix + segments[0].markdown,
    }
  }

  return segments.map((s, i) => ({ index: i, markdown: s.markdown }))
}
