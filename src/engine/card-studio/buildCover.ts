import { ASPECTS } from '@/engine/card-export/constants'
import type { CardMeta } from '@/engine/card-export/types'
import type { CardAspect } from '@/engine/card-export/types'
import { hexAlpha } from '@/engine/card-studio/cardThemePatterns'
import { esc } from '@/lib/r-markdown/utils/helpers'
import { getCardTheme } from './cardThemes/registry'
import type { CardCoverLayout, CardThemeId } from './cardThemes/types'

/** inline style 属性内 font-family 须用单引号，双引号会破坏 HTML 解析 */
function inlineFontFamily(font: string): string {
  return font.replace(/"/g, "'")
}

function swoosh(width: number, accent: string): string {
  const w = width
  return `<svg width="${w}" height="14" viewBox="0 0 ${w} 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block"><path d="M2 9 C ${w * 0.2} 2, ${w * 0.4} 13, ${w * 0.6} 7 S ${w * 0.85} 2, ${w - 3} 8" stroke="${accent}" stroke-width="4" stroke-linecap="round"/></svg>`
}

function star(size: number, accent: string, opacity = 0.9): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${accent}" xmlns="http://www.w3.org/2000/svg" style="display:block;opacity:${opacity}"><path d="M12 0 C13 7 17 11 24 12 C17 13 13 17 12 24 C11 17 7 13 0 12 C7 11 11 7 12 0Z"/></svg>`
}

function titleHtml(title: string, accent: string, ink: string): string {
  const parts = title.split(/(==[^=]+==)/)
  let out = ''
  for (const p of parts) {
    if (!p) continue
    const m = p.match(/^==([^=]+)==$/)
    if (m) out += `<span style="color:${accent}">${esc(m[1])}</span>`
    else out += `<span style="color:${ink}">${esc(p)}</span>`
  }
  return out
}

function chipsHtml(chips: string[], themeId: CardThemeId): string {
  if (!chips.length) return ''
  const t = getCardTheme(themeId).tokens
  const bg = t.chipBg ?? t.accentWeak
  const border = t.chipBorder ?? t.hr
  const ink = t.chipInk ?? t.ink
  let html = `<section style="margin:0;font-size:0;line-height:1.9">`
  for (const c of chips) {
    html += `<span style="display:inline-block;margin:0 8px 0 0;padding:3px 12px;border-radius:999px;border:1.5px solid ${border};background:${bg};font-size:12px;font-weight:700;color:${ink};white-space:nowrap">${esc('#' + c)}</span>`
  }
  html += `</section>`
  return html
}

function footerHtml(meta: CardMeta, t: ReturnType<typeof getCardTheme>['tokens'], bg: string): string {
  let html = `<section style="flex-shrink:0;display:flex;align-items:flex-end;justify-content:space-between;border-top:1.5px dashed ${t.footerDash};padding-top:12px;margin-top:auto">`
  if (meta.charCount > 0) {
    html += `<span style="font-size:11px;color:${t.pageColor};font-weight:700">${esc(`共 ${meta.charCount} 字 · 约 ${meta.readMin} 分钟`)}</span>`
  } else {
    html += `<span></span>`
  }
  html += `<span style="font-size:13px;color:${t.brandColor};font-weight:800">${esc('@' + meta.brand)}</span>`
  html += `</section>`
  return html
}

function coverBgDecor(layout: CardCoverLayout, w: number, h: number, accent: string, bg: string): string {
  switch (layout) {
    case 'big-title':
      return `<section aria-hidden="true" style="position:absolute;left:0;top:0;right:0;height:42%;background:linear-gradient(165deg,${hexAlpha(accent, 0.18)} 0%,transparent 100%);z-index:0"></section>`
    case 'split-block':
      return `<section aria-hidden="true" style="position:absolute;left:0;top:0;right:0;height:52%;background:linear-gradient(160deg,${hexAlpha(accent, 0.22)} 0%,${hexAlpha(accent, 0.08)} 100%);z-index:0"></section>`
    case 'sticker':
      return `<section aria-hidden="true" style="position:absolute;left:18px;top:-4px;width:52px;height:14px;background:linear-gradient(90deg,${hexAlpha(accent, 0.55)},${hexAlpha(accent, 0.33)});transform:rotate(-6deg);border-radius:2px;z-index:3;opacity:0.85"></section>
        <section aria-hidden="true" style="position:absolute;right:28px;top:8px;width:48px;height:12px;background:linear-gradient(90deg,${hexAlpha('#F5B7B1', 0.6)},${hexAlpha('#F5B7B1', 0.35)});transform:rotate(5deg);border-radius:2px;z-index:3;opacity:0.8"></section>
        <section aria-hidden="true" style="position:absolute;left:12%;top:18%;width:6px;height:6px;border-radius:50%;background:${hexAlpha(accent, 0.45)};z-index:1"></section>
        <section aria-hidden="true" style="position:absolute;right:14%;top:28%;width:5px;height:5px;border-radius:50%;background:${hexAlpha('#AED6F1', 0.5)};z-index:1"></section>`
    case 'journal':
      return `<section aria-hidden="true" style="position:absolute;left:22px;top:0;bottom:0;width:1.5px;background:${hexAlpha('#E8B4B4', 0.55)};z-index:1"></section>
        <section aria-hidden="true" style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 28px,${hexAlpha('#000', 0.04)} 28px,${hexAlpha('#000', 0.04)} 29px);opacity:0.35;z-index:0"></section>`
    case 'newspaper':
      return `<section aria-hidden="true" style="position:absolute;left:20px;right:20px;top:52px;height:2px;background:${hexAlpha(accent, 0.35)};z-index:1"></section>
        <section aria-hidden="true" style="position:absolute;left:20px;right:20px;top:56px;height:1px;background:${hexAlpha(accent, 0.2)};z-index:1"></section>
        <section aria-hidden="true" style="position:absolute;inset:0;background-image:radial-gradient(circle at 20% 30%,${hexAlpha('#000', 0.03)} 0%,transparent 50%),repeating-linear-gradient(45deg,transparent,transparent 2px,${hexAlpha('#000', 0.012)} 2px,${hexAlpha('#000', 0.012)} 3px);z-index:0"></section>`
    case 'gold-quote':
      return `<section aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 0%,${hexAlpha(accent, 0.2)} 0%,transparent 60%);z-index:0"></section>
        <section aria-hidden="true" style="position:absolute;left:50%;top:38%;width:80px;height:1px;background:${hexAlpha(accent, 0.5)};transform:translateX(-50%);z-index:1"></section>`
    case 'magazine':
      return `<section aria-hidden="true" style="position:absolute;left:24px;top:48px;width:48px;height:3px;background:${accent};z-index:1"></section>`
    default:
      return `<section aria-hidden="true" style="position:absolute;top:22px;right:24px;opacity:0.9;z-index:2">${star(20, accent)}</section>
        <section aria-hidden="true" style="position:absolute;bottom:80px;left:20px;opacity:0.5;z-index:2">${star(12, accent)}</section>`
  }
}

function buildCoverBody(
  meta: CardMeta,
  layout: CardCoverLayout,
  themeId: CardThemeId,
  contentW: number,
  t: ReturnType<typeof getCardTheme>['tokens'],
  bg: string,
): string {
  const title = meta.title || '未命名'
  const teaser = meta.subtitle || meta.teaser
  const headingFont = inlineFontFamily(t.headingFont ?? `-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif`)
  let html = ''

  if (layout === 'magazine') {
    if (meta.badge) {
      html += `<section style="flex-shrink:0;margin:0 0 20px"><span style="font-size:10px;font-weight:800;letter-spacing:0.2em;color:${t.inkSoft};text-transform:uppercase">${esc(meta.badge)}</span></section>`
    }
    html += `<h1 style="flex-shrink:0;margin:0;font-family:${headingFont};font-size:36px;line-height:1.12;font-weight:900;letter-spacing:-0.02em;word-break:break-word;color:${t.ink}">${titleHtml(title, t.accent, t.ink)}</h1>`
  } else if (layout === 'big-title') {
    if (meta.badge) {
      html += `<section style="flex-shrink:0;margin:0 0 16px"><span style="display:inline-block;padding:5px 14px;border-radius:8px;background:${t.accent};color:#fff;font-size:13px;font-weight:800;letter-spacing:0.06em">${esc(meta.badge)}</span></section>`
    }
    html += `<h1 style="flex-shrink:0;margin:0;font-size:38px;line-height:1.1;font-weight:900;letter-spacing:-0.03em;word-break:break-word;color:${t.ink}">${titleHtml(title, t.accent, t.ink)}</h1>`
  } else if (layout === 'gold-quote') {
    html += `<section style="flex-shrink:0;text-align:center;margin:auto 0">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:${t.accent};letter-spacing:0.15em">${esc(meta.badge || 'QUOTE')}</p>
      <h1 style="margin:0;font-family:${headingFont};font-size:30px;line-height:1.35;font-weight:800;color:${t.ink};text-align:center">${titleHtml(title, t.accent, t.ink)}</h1>
    </section>`
  } else if (layout === 'newspaper') {
    html += `<section style="flex-shrink:0;margin:0 0 8px;text-align:center"><span style="font-size:10px;font-weight:700;letter-spacing:0.25em;color:${t.inkSoft};text-transform:uppercase">${esc(meta.badge || 'KNOWLEDGE')}</span></section>`
    html += `<h1 style="flex-shrink:0;margin:0 0 6px;font-family:${headingFont};font-size:28px;line-height:1.25;font-weight:800;text-align:center;word-break:break-word;color:${t.ink}">${titleHtml(title, t.accent, t.ink)}</h1>`
  } else {
    if (meta.badge) {
      html += `<section style="flex-shrink:0;margin:0 0 14px"><span style="display:inline-block;padding:6px 16px;border-radius:11px;background:${t.accent};color:#fff;font-size:14px;font-weight:800;line-height:1.3;letter-spacing:0.5px;white-space:nowrap;box-shadow:0 4px 14px ${hexAlpha(t.accent, 0.4)}">${esc(meta.badge)}</span></section>`
    }
    const titleSize = layout === 'journal' ? 30 : 32
    html += `<h1 style="flex-shrink:0;margin:0;font-family:${headingFont};font-size:${titleSize}px;line-height:1.2;font-weight:900;letter-spacing:-0.5px;word-break:break-word;color:${t.ink}">${titleHtml(title, t.accent, t.ink)}</h1>`
    if (layout !== 'split-block') {
      html += `<section style="flex-shrink:0;margin:8px 0 12px">${swoosh(Math.min(contentW, 200), t.accent)}</section>`
    }
  }

  if (teaser && layout !== 'gold-quote') {
    html += `<section style="position:relative;flex:1 1 auto;min-height:0;overflow:hidden;margin:0 0 12px">`
    html += `<p style="margin:0;font-size:15px;line-height:1.7;color:${t.inkSoft};font-weight:500">${esc(teaser)}</p>`
    html += `<section style="position:absolute;left:0;right:0;bottom:0;height:48px;background:linear-gradient(to bottom,transparent,${bg});"></section>`
    html += `</section>`
  }

  if (meta.hook) {
    const hookBg = layout === 'gold-quote' ? t.accent : t.ink
    const hookColor = layout === 'gold-quote' ? t.ink : '#ffffff'
    html += `<section style="flex-shrink:0;margin:0 0 10px"><span style="display:inline-block;padding:8px 14px;border-radius:10px;background:${hookBg};color:${hookColor};font-size:14px;font-weight:800;line-height:1.45">${esc(meta.hook)}</span></section>`
  }

  if (meta.chips.length) {
    html += `<section style="flex-shrink:0;margin:0 0 12px">${chipsHtml(meta.chips, themeId)}</section>`
  }

  return html
}

export function buildCardStudioCover(
  meta: CardMeta,
  aspect: CardAspect,
  themeId: CardThemeId,
): string {
  const { w, h } = ASPECTS[aspect]
  const theme = getCardTheme(themeId)
  const t = theme.tokens
  const layout = theme.style.coverLayout ?? 'classic'
  const bg = t.coverBg ?? t.exportBg
  const padX = 24
  const padTop = layout === 'magazine' ? 36 : 28
  const padBottom = 24
  const contentW = w - padX * 2
  const bodyFont = inlineFontFamily(t.bodyFont ?? `-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif`)

  let html = `<section class="card-studio-cover" style="position:relative;box-sizing:border-box;width:${w}px;height:${h}px;background:${bg};padding:${padTop}px ${padX}px ${padBottom}px;overflow:hidden;display:flex;flex-direction:column;font-family:${bodyFont}">`

  const decor = theme.style.headerDecor ?? 'accent-strip'
  if (decor !== 'none') {
    html += `<section style="position:absolute;left:0;top:0;right:0;height:12px;border-bottom:1px solid ${t.hr};background:linear-gradient(90deg,${t.accent} 0 72px,transparent 72px);z-index:2"></section>`
  }

  html += coverBgDecor(layout, w, h, t.accent, bg)
  html += `<section style="position:relative;z-index:2;display:flex;flex-direction:column;flex:1;min-height:0">`
  html += buildCoverBody(meta, layout, themeId, contentW, t, bg)
  html += footerHtml(meta, t, bg)
  html += `</section></section>`

  return html
}

export function canBuildCover(meta: CardMeta): boolean {
  return Boolean(meta.title?.trim() || meta.badge?.trim())
}
