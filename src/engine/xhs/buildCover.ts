import { esc } from '@/lib/r-markdown/utils/helpers'
import type { ThemeColors } from '@/lib/r-markdown/themeColors'
import { ASPECTS, PAD_BOTTOM, PAD_TOP, PAD_X, XHS } from './tokens'
import type { XhsAspect, XhsMeta } from './types'

function swoosh(width: number, accent: string): string {
  const w = width
  return `<svg width="${w}" height="14" viewBox="0 0 ${w} 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block"><path d="M2 9 C ${w * 0.2} 2, ${w * 0.4} 13, ${w * 0.6} 7 S ${w * 0.85} 2, ${w - 3} 8" stroke="${accent}" stroke-width="4" stroke-linecap="round"/></svg>`
}

function star(size: number, accent: string): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${accent}" xmlns="http://www.w3.org/2000/svg" style="display:block"><path d="M12 0 C13 7 17 11 24 12 C17 13 13 17 12 24 C11 17 7 13 0 12 C7 11 11 7 12 0Z"/></svg>`
}

function titleHtml(title: string, accent: string): string {
  const parts = title.split(/(==[^=]+==)/)
  let out = ''
  for (const p of parts) {
    if (!p) continue
    const m = p.match(/^==([^=]+)==$/)
    if (m) out += `<span style="color:${accent}">${esc(m[1])}</span>`
    else out += `<span style="color:${XHS.ink}">${esc(p)}</span>`
  }
  return out
}

function chipsHtml(chips: string[], t: ThemeColors): string {
  if (!chips.length) return ''
  let html = `<section style="margin:0px;font-size:0px;line-height:1.9">`
  for (const c of chips) {
    html += `<span style="display:inline-block;margin:0px 8px 0px 0px;padding:3px 12px;border-radius:999px;border:1.5px solid ${t.border};background:${t.light};font-size:12px;font-weight:700;color:${t.dark};white-space:nowrap">${esc('#' + c)}</span>`
  }
  html += `</section>`
  return html
}

export function buildCover(meta: XhsMeta, aspect: XhsAspect, t: ThemeColors): string {
  const { w, h } = ASPECTS[aspect]
  const contentW = w - PAD_X * 2

  let html = `<section style="position:relative;box-sizing:border-box;width:${w}px;height:${h}px;background:${XHS.bg};padding:${PAD_TOP}px ${PAD_X}px ${PAD_BOTTOM}px;overflow:hidden;display:flex;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif">`

  html += `<section style="position:absolute;top:20px;right:24px">${star(22, t.accent)}</section>`
  html += `<section style="position:absolute;bottom:74px;left:16px;opacity:0.75">${star(13, t.accent)}</section>`

  if (meta.badge) {
    html += `<section style="flex-shrink:0;margin:0px 0px 16px"><span style="display:inline-block;padding:6px 16px;border-radius:11px;background:${t.accent};color:#fff;font-size:15px;font-weight:800;line-height:1.3;letter-spacing:0.5px;white-space:nowrap;box-shadow:0 4px 12px ${t.accent}55">${esc(meta.badge)}</span></section>`
  }

  html += `<h1 style="flex-shrink:0;margin:0px;font-size:34px;line-height:1.18;font-weight:900;letter-spacing:-0.5px;word-break:break-word">${titleHtml(meta.title, t.accent)}</h1>`
  html += `<section style="flex-shrink:0;margin:8px 0px 14px">${swoosh(Math.min(contentW, 220), t.accent)}</section>`

  const teaser = meta.teaser || meta.subtitle
  if (teaser) {
    html += `<section style="position:relative;flex:1 1 auto;min-height:0;overflow:hidden;margin:0px 0px 14px">`
    html += `<p style="margin:0px;font-size:15.5px;line-height:1.75;color:${XHS.inkSoft};font-weight:500">${esc(teaser)}</p>`
    html += `<section style="position:absolute;left:0px;right:0px;bottom:0px;height:56px;background:linear-gradient(to bottom,rgba(247,242,232,0),${XHS.bg})"></section>`
    html += `</section>`
  }

  if (meta.hook) {
    html += `<section style="flex-shrink:0;margin:0px 0px 12px"><span style="display:inline-block;padding:8px 16px;border-radius:12px;background:${XHS.ink};color:#fff;font-size:15px;font-weight:800;line-height:1.45">${esc(meta.hook)}</span></section>`
  }

  if (meta.chips.length) {
    html += `<section style="flex-shrink:0;margin:0px 0px 14px">${chipsHtml(meta.chips, t)}</section>`
  }

  html += `<section style="flex-shrink:0;display:flex;align-items:flex-end;justify-content:space-between;border-top:1.5px dashed ${XHS.dash};padding-top:12px">`
  html += `<span style="font-size:12px;color:${XHS.inkFaint};font-weight:700;letter-spacing:0.3px">${esc(`共 ${meta.charCount} 字 · 约 ${meta.readMin} 分钟`)}</span>`
  html += `<span style="font-size:13px;color:${t.dark};font-weight:800">${esc('@' + meta.brand)}</span>`
  html += `</section>`

  html += `</section>`
  return html
}
