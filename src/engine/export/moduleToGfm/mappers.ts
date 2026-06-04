import type { Md2wechatModuleBody } from '@/lib/r-markdown/md2wechatModuleParser'
import { layoutModuleById } from '@/constants/layoutModules'
import type { ConversionEntry } from '../types'

type MapperFn = (
  body: Md2wechatModuleBody,
  label?: string,
  openInline?: string,
) => string

const CALLOUT_TYPE_LABELS: Record<string, string> = {
  tip: '💡 **提示**',
  note: '📝 **注意**',
  warning: '⚠️ **警告**',
  caution: '🚨 **危险**',
  important: '❗ **重要**',
}

function fieldProse(body: Md2wechatModuleBody): string {
  return body.fields._body || body.rows.map((r) => r.join(' ')).join('\n')
}

function quoteBlock(text: string): string {
  return text
    .split('\n')
    .map((line) => (line.trim() ? `> ${line}` : '>'))
    .join('\n')
}

function rowsTable(headers: string[], rows: string[][]): string {
  const lines = [`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`]
  for (const row of rows) {
    lines.push(`| ${row.map((c) => c || '').join(' | ')} |`)
  }
  return lines.join('\n')
}

const PRECISE_MAPPERS: Record<string, MapperFn> = {
  'p-title': (body) => {
    const title = body.fields.title || body.fields.heading || ''
    const subtitle = body.fields.subtitle || ''
    const lines: string[] = []
    if (title) lines.push(`### ${title}`, '')
    if (subtitle) lines.push(`> ${subtitle}`, '')
    return lines.join('\n').trimEnd()
  },
  hero: (body) => {
    const title = body.fields.title || body.fields.heading || ''
    const subtitle = body.fields.subtitle || ''
    const eyebrow = body.fields.eyebrow || body.fields.badge || ''
    const chips = (body.fields.chips || '')
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean)
    const lines: string[] = []
    if (title) lines.push(`# ${title}`, '')
    if (subtitle) lines.push(`> ${subtitle}`, '')
    if (eyebrow) lines.push(`**${eyebrow}**`, '')
    if (chips.length) lines.push(`**标签：** ${chips.join(' · ')}`, '')
    const prose = fieldProse(body)
    if (prose) lines.push(prose)
    return lines.join('\n').trim()
  },

  steps: (body, label, openInline) => {
    const title = body.fields.title || openInline || label || '步骤'
    const lines = [`### ${title}`, '']
    body.rows.forEach(([head, ...rest], i) => {
      lines.push(`${i + 1}. **${head}**${rest.length ? ` — ${rest.join(' ')}` : ''}`)
    })
    return lines.join('\n')
  },

  timeline: (body, label, openInline) => {
    const title = body.fields.title || openInline || label || '时间轴'
    const lines = [`### ${title}`, '']
    body.rows.forEach(([time, ...rest]) => {
      lines.push(`- **${time}**${rest.length ? ` — ${rest.join(' ')}` : ''}`)
    })
    return lines.join('\n')
  },

  compare: (body) => {
    const leftTitle = body.fields['left-title'] || body.fields.leftTitle || '对比 A'
    const rightTitle = body.fields['right-title'] || body.fields.rightTitle || '对比 B'
    return rowsTable([leftTitle, rightTitle], body.rows)
  },

  faq: (body) => {
    const lines: string[] = []
    body.rows.forEach(([q, a]) => {
      lines.push(`**Q:** ${q}`, '', `**A:** ${a || ''}`, '')
    })
    return lines.join('\n').trim()
  },

  callout: (body) => {
    const type = (body.fields.type || body.fields.kind || 'note').toLowerCase()
    const label = CALLOUT_TYPE_LABELS[type] || CALLOUT_TYPE_LABELS.note
    const text = body.fields.body || body.fields.text || fieldProse(body)
    return text ? `> ${label}：${text}` : `> ${label}`
  },

  quote: (body) => quoteBlock(body.fields.text || body.fields.quote || fieldProse(body)),

  'quote-card': (body) => {
    const text = body.fields.text || body.fields.quote || fieldProse(body)
    const author = body.fields.author || body.fields.source || ''
    return author ? `${quoteBlock(text)}\n\n— ${author}` : quoteBlock(text)
  },

  statement: (body, _label, _openInline) => quoteBlock(fieldProse(body) || body.fields.text || ''),

  checklist: (body) => body.rows.map(([item]) => `- [ ] ${item}`).join('\n'),

  summary: (body) => {
    const title = body.fields.title || '要点总结'
    const lines = [`### ${title}`, '']
    if (body.rows.length) {
      body.rows.forEach(([item]) => lines.push(`- ${item}`))
    } else if (fieldProse(body)) {
      lines.push(fieldProse(body))
    }
    return lines.join('\n')
  },

  cta: (body) => {
    const title = body.fields.title || '行动号召'
    const btn = body.fields.button || body.fields.label || ''
    const prose = fieldProse(body)
    const lines = [`### ${title}`, '']
    if (prose) lines.push(prose, '')
    if (btn) lines.push(`**${btn}**`)
    return lines.join('\n').trim()
  },

  metrics: (body) => {
    const title = body.fields.title || '核心数据'
    const headers = body.rows[0]?.length >= 2 ? body.rows[0] : ['指标', '数值']
    const dataRows = body.rows[0]?.length >= 2 ? body.rows.slice(1) : body.rows
    return [`### ${title}`, '', rowsTable(headers, dataRows)].join('\n')
  },

  'stat-row': (body) => {
    const headers = ['项目', '数值']
    return rowsTable(headers, body.rows)
  },

  notice: (body) => quoteBlock(`⚠️ 提示：${body.fields.text || body.fields.body || fieldProse(body)}`),

  lead: (body) => quoteBlock(fieldProse(body)),

  definition: (body) => {
    const term = body.fields.term || body.fields.title || '术语'
    const def = body.fields.definition || body.fields.body || fieldProse(body)
    return `**${term}** — ${def}`
  },

  toc: (body) => {
    const title = body.fields.title || '目录'
    const lines = [`### ${title}`, '']
    body.rows.forEach(([item, url]) => {
      if (url) lines.push(`- [${item}](${url})`)
      else lines.push(`- ${item}`)
    })
    return lines.join('\n')
  },
}

function mapRowsTable(id: string, body: Md2wechatModuleBody, label?: string): string {
  const name = layoutModuleById(id)?.name ?? id
  const title = body.fields.title || label || name
  const lines = [`### ${title}`, '']
  if (body.rows.length >= 2 && body.rows.every((r) => r.length >= 2)) {
    const headers = body.rows[0]
    lines.push(rowsTable(headers, body.rows.slice(1)))
  } else {
    body.rows.forEach((row) => lines.push(`- ${row.join(' · ')}`))
  }
  return lines.join('\n')
}

function mapFallback(id: string, body: Md2wechatModuleBody, label?: string): string {
  const name = layoutModuleById(id)?.name ?? id
  const lines = [`> **[${name}]**`, '>']
  if (label) lines.push(`> ${label}`, '>')
  for (const [k, v] of Object.entries(body.fields)) {
    if (k.startsWith('_')) continue
    lines.push(`> ${k}: ${v}`)
  }
  for (const row of body.rows) lines.push(`> ${row.join(' · ')}`)
  if (body.jsonRaw) lines.push('>', `> ${body.jsonRaw}`)
  return lines.join('\n')
}

export function mapModuleToGfm(
  moduleId: string,
  label: string | undefined,
  openInline: string | undefined,
  body: Md2wechatModuleBody,
): { markdown: string; entry: ConversionEntry } {
  const id = moduleId.toLowerCase()
  const precise = PRECISE_MAPPERS[id]
  if (precise) {
    return { markdown: precise(body, label, openInline), entry: { moduleId: id, strategy: 'precise' } }
  }
  if (body.rows.length >= 2 && body.rows[0]?.length >= 2) {
    return {
      markdown: mapRowsTable(id, body, label),
      entry: { moduleId: id, strategy: 'generic' },
    }
  }
  return { markdown: mapFallback(id, body, label), entry: { moduleId: id, strategy: 'fallback' } }
}
