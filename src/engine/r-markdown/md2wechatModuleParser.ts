import type { ThemeColors } from './themeColors'
import { esc, leaf, parseAttrs } from './utils/helpers'
import { layoutModuleById } from '@/constants/layoutModules'
import { renderModule } from '@/modules/registry'
import type { ParseMarkdownOptions } from './parseOptions'
import { guardLayoutModule } from './parseOptions'
import {
  cardFrame,
  eyebrow,
  hTitle,
  type Md2wechatModuleBody,
} from './md2wechat-renderers/shared'

const MODULE_OPEN_RE = /^:::\s*([\w-]+)(?:\[(.+)\])?(?:\s+(.+))?\s*$/i
const MODULE_CLOSE_RE = /^:::\s*$/
const FIELD_RE = /^([\w.-]+):\s*(.+)$/
const OPEN_ATTR_MODULES = new Set(['steps', 'timeline'])

export type { Md2wechatModuleBody }

export function parseMd2wechatModuleBody(bodyLines: string[]): Md2wechatModuleBody {
  const fields: Record<string, string> = {}
  const rows: string[][] = []
  let jsonRaw: string | undefined

  for (const raw of bodyLines) {
    const line = raw.trimEnd()
    if (!line.trim()) continue

    const fm = line.match(FIELD_RE)
    if (fm && !line.includes(' | ')) {
      fields[fm[1]] = fm[2].trim()
      continue
    }

    const trimmed = line.trim()
    if ((trimmed.startsWith('{') || trimmed.startsWith('[')) && !jsonRaw) {
      jsonRaw = trimmed
      continue
    }

    if (line.includes('|')) {
      rows.push(line.split('|').map((c) => c.trim()))
    } else if (!jsonRaw) {
      rows.push([line.trim()])
    }
  }

  return { fields, rows, jsonRaw }
}

function renderFallbackModule(name: string, body: Md2wechatModuleBody, t: ThemeColors): string {
  const mod = layoutModuleById(name)
  let inner = ''
  if (body.label) inner += eyebrow(body.label, t)
  const entries = Object.entries(body.fields)
  if (entries.length) {
    entries.forEach(([k, v], idx) => {
      if (idx === 0 && (k === 'title' || k === 'heading')) inner += hTitle(v)
      else inner += `<p style="margin:${idx ? '8px' : '0'} 0 0;font-size:13px;color:rgb(71,85,105)"><strong>${leaf(k)}</strong> ${leaf(v)}</p>`
    })
  }
  if (body.rows.length) {
    body.rows.forEach((row) => {
      inner += `<p style="margin:8px 0 0;font-size:13px;color:rgb(71,85,105)">${leaf(row.join(' · '))}</p>`
    })
  }
  if (!inner && body.jsonRaw) {
    inner = `<pre style="margin:0;font-size:12px;white-space:pre-wrap">${esc(body.jsonRaw)}</pre>`
  }
  return cardFrame(t, inner || `<p style="margin:0;font-size:13px;color:rgb(148,163,184)">${leaf(mod?.name ?? name)}</p>`)
}

/** 解析并渲染 md2wechat 原生 :::module 块；不匹配时返回 null */
export function tryParseMd2wechatModule(
  lines: string[],
  start: number,
  t: ThemeColors,
  fullMd: string,
  opts?: ParseMarkdownOptions,
): { html: string; next: number } | null {
  const openMatch = lines[start].match(MODULE_OPEN_RE)
  if (!openMatch) return null

  const name = openMatch[1].toLowerCase()
  const label = openMatch[2]?.trim()
  const openInline = openMatch[3]?.trim()

  let i = start + 1
  const bodyLines: string[] = []
  while (i < lines.length && !MODULE_CLOSE_RE.test(lines[i].trim())) {
    bodyLines.push(lines[i])
    i++
  }
  if (i >= lines.length) return null
  i++

  const locked = guardLayoutModule(name, opts)
  if (locked) {
    return { html: locked, next: i }
  }

  const body = parseMd2wechatModuleBody(bodyLines)
  if (OPEN_ATTR_MODULES.has(name)) {
    const tail = lines[start].replace(/^:::\s*[\w-]+(?:\[[^\]]*\])?\s*/i, '')
    body.fields = { ...parseAttrs(tail), ...body.fields }
  }
  if (label) body.label = label
  if (openInline?.includes('|')) {
    const [left, right] = openInline.split('|').map((s) => s.trim())
    if (name === 'compare') {
      if (left) body.fields['left-title'] = left
      if (right) body.fields['right-title'] = right
    } else if (!body.rows.length) {
      body.rows.push([left, right].filter(Boolean))
    }
  } else if (openInline && name !== 'compare') {
    body.fields.title = openInline
  }

  const html = renderModule(name, body, t, fullMd) ?? renderFallbackModule(name, body, t)
  return { html, next: i }
}
