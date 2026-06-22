import { ASPECTS } from '@/engine/card-export/constants'
import type { CardMeta } from '@/engine/card-export/types'
import type { CardAspect } from '@/engine/card-export/types'
import { hexAlpha } from '@/engine/card-studio/cardThemePatterns'
import { buildXhsShellStyleBlock } from '@/engine/card-studio/cardXhsChrome'
import { esc } from '@/lib/r-markdown/utils/helpers'
import { getCardTheme } from './cardThemes/registry'
import type { CardCoverLayout, CardThemeId, CardXhsShellLayout } from './cardThemes/types'

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

function footerHtml(
  meta: CardMeta,
  t: ReturnType<typeof getCardTheme>['tokens'],
  bg: string,
  showBrand = true,
): string {
  const brandVisible = showBrand && Boolean(meta.brand?.trim())
  const hasStats = meta.charCount > 0
  if (!brandVisible && !hasStats) return ''

  const justify =
    brandVisible && hasStats ? 'space-between' : brandVisible ? 'flex-end' : 'flex-start'
  let html = `<section style="flex-shrink:0;display:flex;align-items:flex-end;justify-content:${justify};border-top:1.5px dashed ${t.footerDash};padding-top:12px;margin-top:auto">`
  if (hasStats) {
    html += `<span style="font-size:11px;color:${t.pageColor};font-weight:700">${esc(`共 ${meta.charCount} 字 · 约 ${meta.readMin} 分钟`)}</span>`
  }
  if (brandVisible) {
    html += `<span style="font-size:13px;color:${t.brandColor};font-weight:800">${esc('@' + meta.brand)}</span>`
  }
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
        <section aria-hidden="true" style="position:absolute;left:20px;right:20px;top:56px;height:1px;background:${hexAlpha(accent, 0.2)};z-index:1"></section>`
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

function xhsCoverDecor(layout: CardXhsShellLayout, accent: string): string {
  switch (layout) {
    case 'xhs-spring-outing':
      return `<section aria-hidden="true" style="position:absolute;top:4%;left:50%;transform:translateX(-50%) rotate(-8deg);font-size:9px;font-weight:700;letter-spacing:0.12em;color:#1a1a1a;opacity:0.75;z-index:2">SPRING IS COMING</section>
        <section aria-hidden="true" style="position:absolute;top:28%;left:50%;transform:translateX(-50%);width:72%;aspect-ratio:1.05;border-radius:45% 55% 52% 48%/48% 45% 55% 52%;border:3px solid #fff;box-shadow:0 8px 24px rgba(0,0,0,0.12);background:linear-gradient(145deg,#ffe566,#f5d020);z-index:1"></section>`
    case 'xhs-notebook-dry':
      return `<section aria-hidden="true" style="position:absolute;top:10%;left:8%;right:6%;bottom:8%;background:#fff;border-radius:4px;box-shadow:0 6px 20px rgba(0,0,0,0.1);z-index:1"></section>`
    case 'xhs-browser-cta':
      return `<section aria-hidden="true" style="position:absolute;top:14%;left:10%;right:10%;bottom:12%;background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.15);z-index:1"></section>`
    case 'xhs-palm-editorial':
      return `<section aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 20% 30%,rgba(0,0,0,0.18),transparent 60%),radial-gradient(ellipse 60% 40% at 85% 70%,rgba(0,0,0,0.14),transparent 55%);z-index:1"></section>`
    case 'xhs-workplace':
      return `<section aria-hidden="true" style="position:absolute;top:8%;right:8%;width:36px;height:32px;background:#f5d020;clip-path:polygon(0 25%,65% 5%,65% 95%,0 75%);z-index:2"></section>`
    case 'xhs-media':
      return `<section aria-hidden="true" style="position:absolute;top:28%;left:8%;right:8%;bottom:8%;background:#fff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.08);z-index:1"></section>`
    case 'xhs-memphis':
      return `<section aria-hidden="true" style="position:absolute;inset:3%;background:#faf7f2;border:2px solid #1a1a1a;border-top:6px solid #4ade80;z-index:1"></section>`
    case 'xhs-scrapbook':
      return `<section aria-hidden="true" style="position:absolute;inset:4%;background:#fff;background-image:linear-gradient(rgba(0,0,0,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.06) 1px,transparent 1px);background-size:14px 14px;z-index:1"></section>`
    case 'xhs-fashion-class':
      return `<section aria-hidden="true" style="position:absolute;right:4%;top:18%;width:48px;height:80px;background:linear-gradient(180deg,${hexAlpha(accent, 0.3)},transparent);border-radius:40% 40% 10% 10%;opacity:0.6;z-index:1"></section>`
    case 'xhs-job-checklist':
      return `<section aria-hidden="true" style="position:absolute;top:6%;left:8%;right:8%;height:14px;display:flex;justify-content:space-around;z-index:2">${'<span style="width:10px;height:10px;border:2px solid #9ca3af;border-radius:50%;background:#fff"></span>'.repeat(6)}</section>`
    case 'xhs-photo-notes':
      return `<section aria-hidden="true" style="position:absolute;top:8%;left:16%;right:16%;display:flex;justify-content:space-around;z-index:2">${`<span style="width:10px;height:10px;border:2.5px solid ${accent};border-radius:50%;background:#fff"></span>`.repeat(5)}</section>`
    case 'xhs-outdoor-copy':
      return `<section aria-hidden="true" style="position:absolute;bottom:0;left:0;right:0;height:18%;background:linear-gradient(180deg,transparent,#a8c9a0);opacity:0.25;z-index:1"></section>`
    case 'xhs-vintage-quote':
      return `<section aria-hidden="true" style="position:absolute;top:18%;left:10%;right:10%;bottom:16%;background:#f5f0e6;box-shadow:0 4px 16px rgba(0,0,0,0.2);z-index:1"></section>`
    case 'xhs-poetic-mist':
      return `<section aria-hidden="true" style="position:absolute;bottom:12%;left:0;right:0;height:30%;background:linear-gradient(180deg,transparent,rgba(156,163,175,0.15));z-index:1"></section>`
    case 'xhs-solar-science':
      return `<section aria-hidden="true" style="position:absolute;top:0;left:10%;right:10%;height:12px;background:repeating-linear-gradient(90deg,#9ca3af 0,#9ca3af 8px,transparent 8px,transparent 16px);opacity:0.4;z-index:2"></section>`
    case 'xhs-spring-art':
      return `<section aria-hidden="true" style="position:absolute;top:10%;right:8%;writing-mode:vertical-rl;color:#fff;font-size:18px;font-weight:900;letter-spacing:0.15em;opacity:0.85;z-index:2">立春</section>`
    default:
      return ''
  }
}

function buildXhsCoverBody(
  meta: CardMeta,
  layout: CardXhsShellLayout,
  themeId: CardThemeId,
  t: ReturnType<typeof getCardTheme>['tokens'],
): string {
  const title = meta.title || '编辑你的标题'
  const headingFont = inlineFontFamily(t.headingFont ?? `-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif`)
  let html = ''
  const titlePos =
    layout === 'xhs-palm-editorial' || layout === 'xhs-vintage-quote' || layout === 'xhs-spring-art'
      ? 'text-align:center;'
      : ''
  const titleSize =
    layout === 'xhs-browser-cta' || layout === 'xhs-notebook-dry' ? 28 : 32

  if (meta.badge) {
    const badgeStyle =
      layout === 'xhs-fashion-class'
        ? `display:inline-block;padding:4px 12px;border-radius:6px;background:${t.accent};color:${t.ink};font-size:11px;font-weight:800;`
        : `display:inline-block;padding:5px 14px;border-radius:999px;background:${t.accent};color:#fff;font-size:12px;font-weight:800;`
    html += `<section style="flex-shrink:0;margin:0 0 12px;${titlePos}"><span style="${badgeStyle}">${esc(meta.badge)}</span></section>`
  }

  const highlightTitle =
    layout === 'xhs-notebook-dry'
      ? `<span style="background:linear-gradient(transparent 55%,#ffe566 55%);padding:0 4px;">${titleHtml(title, t.accent, t.ink)}</span>`
      : titleHtml(title, t.accent, t.ink)

  html += `<h1 style="flex-shrink:0;margin:0;font-family:${headingFont};font-size:${titleSize}px;line-height:1.15;font-weight:900;word-break:break-word;color:${t.ink};${titlePos}">${highlightTitle}</h1>`

  const teaser = meta.subtitle || meta.teaser
  if (teaser) {
    html += `<p style="flex-shrink:0;margin:10px 0 0;font-size:14px;line-height:1.6;color:${t.inkSoft};font-weight:500;${titlePos}">${esc(teaser)}</p>`
  }

  if (meta.hook) {
    const btnLayouts = new Set<CardXhsShellLayout>(['xhs-browser-cta', 'xhs-notebook-dry', 'xhs-outdoor-copy'])
    if (btnLayouts.has(layout)) {
      html += `<section style="flex-shrink:0;margin:14px 0 0;${titlePos}"><span style="display:inline-block;padding:10px 22px;border-radius:999px;background:${t.accent};color:#fff;font-size:14px;font-weight:800;box-shadow:0 4px 0 ${hexAlpha(t.accent, 0.6)}">${esc(meta.hook)}</span></section>`
    } else {
      html += `<section style="flex-shrink:0;margin:12px 0 0;${titlePos}"><span style="display:inline-block;padding:6px 12px;border-radius:8px;background:${hexAlpha(t.accent, 0.2)};color:${t.ink};font-size:13px;font-weight:700">${esc(meta.hook)}</span></section>`
    }
  }

  if (meta.chips.length) {
    html += `<section style="flex-shrink:0;margin:12px 0 0;${titlePos}">${chipsHtml(meta.chips, themeId)}</section>`
  }

  return html
}

function buildXhsStudioCover(
  meta: CardMeta,
  aspect: CardAspect,
  themeId: CardThemeId,
  showBrand = true,
): string {
  const { w, h } = ASPECTS[aspect]
  const theme = getCardTheme(themeId)
  const layout = theme.style.shellLayout!
  const t = theme.tokens
  const bg = t.coverBg ?? t.exportBg
  const bodyFont = inlineFontFamily(t.bodyFont ?? `-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif`)
  const padMap: Partial<Record<CardXhsShellLayout, { top: number; x: number }>> = {
    'xhs-spring-outing': { top: 32, x: 20 },
    'xhs-notebook-dry': { top: 48, x: 28 },
    'xhs-browser-cta': { top: 56, x: 28 },
    'xhs-palm-editorial': { top: 80, x: 28 },
    'xhs-vintage-quote': { top: 56, x: 24 },
    'xhs-spring-art': { top: 40, x: 24 },
  }
  const pad = padMap[layout] ?? { top: 36, x: 24 }

  const styles = buildXhsShellStyleBlock(theme)
  let html = styles
  html += `<section class="card-xhs-shell card-xhs-shell--${layout}" style="position:relative;box-sizing:border-box;width:${w}px;height:${h}px;background:${bg};font-family:${bodyFont};overflow:hidden;display:flex;flex-direction:column;">`
  html += xhsCoverDecor(layout, t.accent)
  html += `<section style="position:relative;z-index:3;display:flex;flex-direction:column;flex:1;min-height:0;padding:${pad.top}px ${pad.x}px 20px;">`
  html += buildXhsCoverBody(meta, layout, themeId, t)
  const coverFooter = footerHtml(meta, t, bg, showBrand)
  if (coverFooter) {
    html += `<section style="margin-top:auto;padding-top:12px">${coverFooter.replace('border-top:1.5px dashed', 'border-top:1px dashed')}</section>`
  }
  html += `</section></section>`
  return html
}

function buildYamlOverlayCover(
  meta: CardMeta,
  aspect: CardAspect,
  themeId: CardThemeId,
  showBrand = true,
): string {
  const { w, h } = ASPECTS[aspect]
  const t = getCardTheme(themeId).tokens
  const title = meta.title || '未命名'
  const teaser = meta.subtitle || meta.teaser
  const headingFont = inlineFontFamily(t.headingFont ?? `-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif`)
  const bodyFont = inlineFontFamily(t.bodyFont ?? `-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif`)
  const img = esc(meta.coverImage!)

  let html = `<section class="card-studio-cover card-studio-cover--overlay" style="position:relative;box-sizing:border-box;width:${w}px;height:${h}px;overflow:hidden;display:flex;flex-direction:column;font-family:${bodyFont};color:#fff;">`
  html += `<section aria-hidden="true" style="position:absolute;inset:0;background:url('${img}') center/cover no-repeat;z-index:0"></section>`
  html += `<section aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.55) 55%,rgba(0,0,0,0.82) 100%);z-index:1"></section>`
  html += `<section style="position:relative;z-index:2;display:flex;flex-direction:column;flex:1;min-height:0;padding:28px 24px 22px;">`
  if (meta.badge) {
    html += `<section style="flex-shrink:0;margin:0 0 12px"><span style="display:inline-block;padding:5px 14px;border-radius:999px;background:${hexAlpha(t.accent, 0.9)};color:#fff;font-size:12px;font-weight:800">${esc(meta.badge)}</span></section>`
  }
  html += `<h1 style="flex-shrink:0;margin:0;font-family:${headingFont};font-size:30px;line-height:1.2;font-weight:900;word-break:break-word;text-shadow:0 2px 12px rgba(0,0,0,0.35)">${titleHtml(title, '#fff', '#fff')}</h1>`
  if (teaser) {
    html += `<p style="flex-shrink:0;margin:12px 0 0;font-size:14px;line-height:1.65;opacity:0.92;font-weight:500">${esc(teaser)}</p>`
  }
  if (meta.hook) {
    html += `<section style="flex-shrink:0;margin:14px 0 0"><span style="display:inline-block;padding:8px 14px;border-radius:10px;background:#fff;color:${t.ink};font-size:13px;font-weight:800">${esc(meta.hook)}</span></section>`
  }
  if (meta.chips.length) {
    html += `<section style="flex-shrink:0;margin:12px 0 0">${chipsHtml(meta.chips, themeId)}</section>`
  }
  const brandVisible = showBrand && Boolean(meta.brand?.trim())
  if (brandVisible || meta.date) {
    html += `<section style="margin-top:auto;padding-top:12px;display:flex;justify-content:space-between;align-items:flex-end;border-top:1px dashed rgba(255,255,255,0.35);">`
    if (meta.date) {
      html += `<span style="font-size:11px;opacity:0.8">${esc(meta.date)}</span>`
    } else {
      html += `<span></span>`
    }
    if (brandVisible) {
      html += `<span style="font-size:13px;font-weight:800">${esc('@' + meta.brand)}</span>`
    }
    html += `</section>`
  }
  html += `</section></section>`
  return html
}

function buildYamlSeparateCover(
  meta: CardMeta,
  aspect: CardAspect,
  themeId: CardThemeId,
  showBrand = true,
): string {
  const { w, h } = ASPECTS[aspect]
  const t = getCardTheme(themeId).tokens
  const bg = t.coverBg ?? t.exportBg
  const title = meta.title || '未命名'
  const teaser = meta.subtitle || meta.teaser
  const headingFont = inlineFontFamily(t.headingFont ?? `-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif`)
  const bodyFont = inlineFontFamily(t.bodyFont ?? `-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif`)
  const img = esc(meta.coverImage!)
  const imgH = Math.round(h * 0.42)

  let html = `<section class="card-studio-cover card-studio-cover--separate" style="position:relative;box-sizing:border-box;width:${w}px;height:${h}px;overflow:hidden;display:flex;flex-direction:column;font-family:${bodyFont};background:${bg};">`
  html += `<section style="flex-shrink:0;height:${imgH}px;background:url('${img}') center/cover no-repeat"></section>`
  html += `<section style="position:relative;z-index:2;display:flex;flex-direction:column;flex:1;min-height:0;padding:18px 24px 20px;">`
  if (meta.badge) {
    html += `<section style="flex-shrink:0;margin:0 0 10px"><span style="display:inline-block;padding:5px 14px;border-radius:8px;background:${t.accent};color:#fff;font-size:12px;font-weight:800">${esc(meta.badge)}</span></section>`
  }
  html += `<h1 style="flex-shrink:0;margin:0;font-family:${headingFont};font-size:26px;line-height:1.25;font-weight:900;word-break:break-word;color:${t.ink}">${titleHtml(title, t.accent, t.ink)}</h1>`
  if (teaser) {
    html += `<p style="flex-shrink:0;margin:10px 0 0;font-size:14px;line-height:1.65;color:${t.inkSoft}">${esc(teaser)}</p>`
  }
  if (meta.hook) {
    html += `<section style="flex-shrink:0;margin:12px 0 0"><span style="display:inline-block;padding:7px 12px;border-radius:8px;background:${t.ink};color:#fff;font-size:13px;font-weight:800">${esc(meta.hook)}</span></section>`
  }
  if (meta.chips.length) {
    html += `<section style="flex-shrink:0;margin:10px 0 0">${chipsHtml(meta.chips, themeId)}</section>`
  }
  const coverFooter = footerHtml(meta, t, bg, showBrand)
  if (coverFooter) html += coverFooter
  html += `</section></section>`
  return html
}

export interface BuildCardStudioCoverOptions {
  showBrand?: boolean
}

export function buildCardStudioCover(
  meta: CardMeta,
  aspect: CardAspect,
  themeId: CardThemeId,
  opts: BuildCardStudioCoverOptions = {},
): string {
  const showBrand = opts.showBrand !== false
  if (meta.coverImage) {
    const layout = meta.coverLayout ?? 'overlay'
    return layout === 'separate'
      ? buildYamlSeparateCover(meta, aspect, themeId, showBrand)
      : buildYamlOverlayCover(meta, aspect, themeId, showBrand)
  }

  const theme = getCardTheme(themeId)
  if (theme.style.shellLayout) {
    return buildXhsStudioCover(meta, aspect, themeId, showBrand)
  }

  const { w, h } = ASPECTS[aspect]
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
  const coverFooter = footerHtml(meta, t, bg, showBrand)
  if (coverFooter) html += coverFooter
  html += `</section></section>`

  return html
}

export function canBuildCover(meta: CardMeta): boolean {
  return Boolean(meta.title?.trim() || meta.badge?.trim())
}
