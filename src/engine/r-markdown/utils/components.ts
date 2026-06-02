import type { ThemeColors } from '../themeColors'
import { leaf } from './helpers'
import { inlineFormat } from './inlineFormat'

/** GFM 引用式 callout：> [TIP] 正文 */
export function parseCallout(
  lines: string[],
  start: number,
  t: ThemeColors,
): { html: string; next: number } {
  let i = start
  const m = lines[i].match(/>\s*\[(TIP|NOTE|WARNING|CAUTION|IMPORTANT)\]\s*(.*)/)
  const type = m ? m[1] : 'NOTE'
  const title = m ? m[2] : ''
  i++
  let body = ''
  while (i < lines.length && /^>\s/.test(lines[i])) {
    body += lines[i].replace(/^>\s?/, '') + '\n'
    i++
  }
  const icons: Record<string, string> = {
    TIP: '💡',
    NOTE: '📝',
    WARNING: '⚠️',
    CAUTION: '🚨',
    IMPORTANT: '❗',
  }
  const bgs: Record<string, string> = {
    TIP: '#f0f4fa',
    NOTE: '#f0f4fa',
    WARNING: '#fff8f0',
    CAUTION: '#fff0f0',
    IMPORTANT: '#f0f4fa',
  }
  const borders: Record<string, string> = {
    TIP: t.accent,
    NOTE: t.accent,
    WARNING: '#f5a623',
    CAUTION: '#e74c3c',
    IMPORTANT: t.accent,
  }
  const bg = bgs[type] || '#f0f4fa'
  const border = borders[type] || t.accent
  let html = `<section style="margin:16px 0px;padding:16px 18px;background:${bg};border-left:4px solid ${border};border-radius:0px 10px 10px 0px">`
  if (title)
    html += `<p style="margin:0px 0px 6px;font-size:14px;font-weight:700;color:rgb(51,65,85)">${leaf((icons[type] || '') + ' ' + title)}</p>`
  if (body.trim())
    html += `<section style="font-size:14px;color:rgb(85,85,85);line-height:1.7">${inlineFormat(body.trim(), t)}</section>`
  html += `</section>`
  return { html, next: i }
}
