import type { ThemeColors } from '../themeColors'
import { esc, leaf } from '../utils/helpers'
import { inlineFormat } from '../utils/inlineFormat'

export interface Md2wechatModuleBody {
  label?: string
  fields: Record<string, string>
  rows: string[][]
  jsonRaw?: string
}

export function splitTags(value: string): string[] {
  return value
    .split(/[|｜]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function splitFeatures(value: string): string[] {
  return value
    .split(/\s*\/\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function rowCells(row: string[]): { cells: string[]; accent: boolean } {
  const accent = row[row.length - 1]?.toLowerCase() === 'accent'
  const cells = accent ? row.slice(0, -1) : row
  return { cells, accent }
}

export function parseJsonContent(body: Md2wechatModuleBody): unknown {
  if (body.jsonRaw) {
    try {
      return JSON.parse(body.jsonRaw)
    } catch {
      return null
    }
  }
  return null
}

export function highlightBars(text: string, t: ThemeColors): string {
  const parts = text.split(/(\|[^|]+\|)/g)
  return parts
    .map((p) => {
      if (p.startsWith('|') && p.endsWith('|')) {
        const inner = p.slice(1, -1)
        return `<strong style="color:${t.accent}">${leaf(inner)}</strong>`
      }
      return leaf(p)
    })
    .join('')
}

export function sectionWrap(inner: string, margin = '20px 0'): string {
  return `<section style="margin:${margin}">${inner}</section>`
}

export function cardFrame(
  t: ThemeColors,
  inner: string,
  opts: { accent?: boolean; padding?: string } = {},
): string {
  const border = opts.accent ? t.accent : 'rgba(229,231,235,0.95)'
  const bg = opts.accent
    ? `linear-gradient(135deg,${t.accent}12,rgba(255,255,255,0.96))`
    : 'linear-gradient(135deg,rgb(248,250,252),rgb(255,255,255))'
  const pad = opts.padding ?? '18px 16px'
  return (
    `<section style="margin:20px 0;padding:${pad};border-radius:14px;` +
    `border:1px solid ${border};background:${bg};box-shadow:rgba(15,23,42,0.04) 0 8px 24px">${inner}</section>`
  )
}

export function eyebrow(text: string, t: ThemeColors): string {
  return `<p style="margin:0 0 8px;font-size:10px;color:${t.accent};letter-spacing:2.2px;font-weight:800;text-transform:uppercase">${leaf(text)}</p>`
}

export function hTitle(text: string, size = '18px'): string {
  return `<p style="margin:0 0 10px;font-size:${size};font-weight:800;color:rgb(17,24,39);line-height:1.45">${leaf(text)}</p>`
}

export function bodyText(text: string, t: ThemeColors): string {
  return `<p style="margin:0;font-size:14px;color:rgb(71,85,105);line-height:1.75">${inlineFormat(text, t)}</p>`
}

export function chipRow(items: string[], t: ThemeColors, tone: 'fit' | 'avoid' | 'neutral' = 'neutral'): string {
  const styles = {
    fit: { bg: 'rgb(236,253,245)', color: 'rgb(5,150,105)', border: 'rgb(167,243,208)' },
    avoid: { bg: 'rgb(254,242,242)', color: 'rgb(185,28,28)', border: 'rgb(254,202,202)' },
    neutral: { bg: `${t.accent}10`, color: t.accent, border: `${t.accent}30` },
  }[tone]
  let html = `<section style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">`
  items.forEach((item) => {
    html += `<span style="display:inline-block;padding:5px 10px;border-radius:999px;font-size:12px;font-weight:600;background:${styles.bg};color:${styles.color};border:1px solid ${styles.border}">${leaf(item)}</span>`
  })
  html += '</section>'
  return html
}
