import type { ThemeColors } from '../themeColors'
import { parseAttrs, leaf, esc } from './helpers'
import { Badges_DA01 } from '../editor-components/Badges_DA01'
import { Statement_DA01 } from '../editor-components/Statement_DA01'
import { Lead_DA01 } from '../editor-components/Lead_DA01'
import { Engage_DA01 } from '../editor-components/Engage_DA01'
import { Engage_DA02 } from '../editor-components/Engage_DA02'
import { Breaking_DA01 } from '../editor-components/Breaking_DA01'
import { CaseFlow_DA01 } from '../editor-components/CaseFlow_DA01'
import { PTitle } from '../editor-components/PTitle_DA01'
import { Title_DA01 } from '../editor-components/Title_DA01'
import { CTA_DA01 } from '../editor-components/Cta_DA01'

const MODULE_CLOSE_RE = /^:::\s*$/
const EXTENSION_FENCED_RE =
  /^:::\s*(lead|cta|statement|badges|engage|breaking|case-flow|reading-path|gallery|p-title|title-da01)\b(.*)$/i

export type PTitleLevel1Item = { num: string; title: string; subtitle: string }

export function readFencedModule(
  lines: string[],
  start: number,
): { name: string; attrs: Record<string, string>; bodyLines: string[]; next: number } | null {
  const openMatch = lines[start].match(/^:::\s*([\w-]+)\b(.*)$/i)
  if (!openMatch) return null
  const name = openMatch[1].toLowerCase()
  const attrs = parseAttrs(openMatch[2] ?? '')
  let i = start + 1
  const bodyLines: string[] = []
  while (i < lines.length && !MODULE_CLOSE_RE.test(lines[i].trim())) {
    bodyLines.push(lines[i])
    i++
  }
  if (i >= lines.length) return null
  i++
  const prose: string[] = []
  for (const raw of bodyLines) {
    const fm = raw.match(/^([\w.-]+):\s*(.+)$/)
    if (fm && !raw.includes(' | ')) attrs[fm[1]] = fm[2].trim()
    else if (raw.trim()) prose.push(raw)
  }
  if (prose.length) attrs._body = prose.join('\n').trim()
  return { name, attrs, bodyLines, next: i }
}

function renderGalleryHtml(body: string): string {
  const imgs: { alt: string; src: string }[] = []
  const re = /!\[([^\]]*)\]\(([^)]+)\)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(body)) !== null) {
    imgs.push({ alt: m[1], src: m[2] })
  }
  if (!imgs.length) return ''
  let html = `<section style="white-space:nowrap;overflow-x:auto;margin:12px 0px;padding:4px 0px">`
  imgs.forEach((img) => {
    html += `<img src="${esc(img.src)}" alt="${esc(img.alt)}" style="display:inline-block;vertical-align:top;max-height:200px;border-radius:8px;margin-right:8px">`
  })
  html += `</section>`
  return html
}

export function collectPTitleLevel1(lines: string[]): PTitleLevel1Item[] {
  const list: PTitleLevel1Item[] = []
  for (let j = 0; j < lines.length; j++) {
    const fenced = readFencedModule(lines, j)
    if (fenced?.name === 'p-title') {
      const level = parseInt(fenced.attrs.level || '1', 10)
      if (level === 1) {
        list.push({
          num: fenced.attrs.num || '',
          title: fenced.attrs.title || fenced.attrs._body || '',
          subtitle: fenced.attrs.subtitle || '',
        })
      }
      j = fenced.next - 1
    }
  }
  return list
}

export function renderReadingPathHtml(
  pTitleLevel1List: PTitleLevel1Item[],
  t: ThemeColors,
): string {
  if (pTitleLevel1List.length <= 1) return ''
  let html = `<section style="margin:0px 0px 30px"><section>`
  html += `<section style="display:flex;align-items:flex-end;justify-content:space-between;padding-bottom:14px;gap:12px"><section style="flex-shrink:0"><p style="margin:0px;padding:0px 0px 6px;font-size:10px;color:rgb(100,116,139);text-transform:uppercase;letter-spacing:2.8px;font-weight:800;white-space:nowrap">${leaf('READING PATH')}</p><p style="margin:0px;font-size:16px;line-height:1.35;color:rgb(17,24,39);font-weight:800">${leaf('阅读路线')}</p></section><p style="margin:0px;font-size:10px;color:rgb(148,163,184);white-space:nowrap">${leaf(pTitleLevel1List.length + ' 个章节')}</p></section>`
  html += `<section style="padding:14px 12px 12px;border:1px solid rgb(229,231,235);border-radius:13px;background:linear-gradient(rgb(255,255,255) 0%,rgb(248,250,252) 100%);box-shadow:rgba(15,23,42,0.04) 0px 12px 30px;overflow-x:auto;white-space:nowrap;font-size:0px">`
  pTitleLevel1List.forEach((item, idx) => {
    const label = item.title
      .replace(/::.*/, '')
      .trim()
      .replace(/^\d+\s*/, '')
    const num = item.num || String(idx + 1).padStart(2, '0')
    const isActive = idx === 0
    html += `<section style="display:inline-flex;vertical-align:middle;align-items:center">`
    html += `<section style="display:inline-block;vertical-align:top;width:126px;white-space:normal;text-align:center">`
    html += `<section style="display:flex;justify-content:center;margin-bottom:10px">`
    html += `<span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:999px;background:${isActive ? t.accent : 'rgb(255,255,255)'};color:${isActive ? 'rgb(255,255,255)' : 'rgb(17,24,39)'};border:1px solid ${isActive ? t.accent : 'rgb(219,227,238)'};font-size:11px;font-weight:900;letter-spacing:1.2px;white-space:nowrap">${leaf(num)}</span>`
    html += `</section>`
    html += `<p style="margin:0px;font-size:13px;line-height:1.55;color:${isActive ? 'rgb(17,24,39)' : 'rgb(31,41,55)'};font-weight:800;letter-spacing:0.05px;white-space:normal;word-break:break-all">${leaf(label)}</p>`
    html += `</section>`
    if (idx < pTitleLevel1List.length - 1) {
      html += `<span style="display:inline-block;vertical-align:middle;width:32px;height:1px;line-height:1px;margin:0px 8px;background:linear-gradient(90deg,rgba(148,163,184,0.35),rgba(148,163,184,0.85));color:transparent;overflow:hidden">${leaf('-')}</span>`
    }
    html += `</section>`
  })
  html += `</section></section></section>`
  return html
}

/** 解析墨韵扩展 ::: 围栏模块（仅 ::: 语法，无 XML 标签） */
export function tryParseExtensionFencedModule(
  lines: string[],
  start: number,
  t: ThemeColors,
  pTitleLevel1List: PTitleLevel1Item[],
): { html: string; next: number } | null {
  if (!EXTENSION_FENCED_RE.test(lines[start])) return null

  const fenced = readFencedModule(lines, start)
  if (!fenced) return null

  const { name, attrs, bodyLines, next } = fenced
  const bodyText = attrs._body || ''
  delete attrs._body

  switch (name) {
    case 'lead':
      return { html: Lead_DA01.render(attrs, bodyText, t), next }
    case 'cta':
      return { html: CTA_DA01.render(attrs, bodyText, t), next }
    case 'statement':
      return { html: Statement_DA01.render(attrs, bodyText, t), next }
    case 'badges': {
      const body = bodyText || bodyLines.join('\n').trim()
      return { html: Badges_DA01.render(attrs, body, t), next }
    }
    case 'engage': {
      if (attrs.type && attrs.type.toUpperCase() === 'DA02') {
        return { html: Engage_DA02.render(attrs, '', t), next }
      }
      return { html: Engage_DA01.render(attrs, '', t), next }
    }
    case 'breaking':
      return { html: Breaking_DA01.render(attrs, bodyText, t), next }
    case 'case-flow':
      return {
        html: CaseFlow_DA01.render(attrs, bodyLines.join('\n').trim(), t),
        next,
      }
    case 'reading-path':
      return { html: renderReadingPathHtml(pTitleLevel1List, t), next }
    case 'gallery': {
      const body = bodyLines.join(' ').trim() || bodyText
      return { html: renderGalleryHtml(body), next }
    }
    case 'p-title':
      return { html: PTitle.render(attrs, bodyText, t), next }
    case 'title-da01':
      return {
        html: Title_DA01.render(
          { ...attrs, type: attrs.type || 'DA01' },
          attrs.title || bodyText,
          t,
        ),
        next,
      }
    default:
      return null
  }
}

/** @deprecated 使用 tryParseExtensionFencedModule */
export const tryParseRMarkdownFencedModule = tryParseExtensionFencedModule
