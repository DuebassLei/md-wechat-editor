import { hexAlpha } from './cardThemePatterns'
import type { CardThemeDef, CardXhsShellLayout } from './cardThemes/types'

function decorHtml(layout: CardXhsShellLayout): string {
  switch (layout) {
    case 'xhs-spring-outing':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <span class="card-xhs__spring-flower card-xhs__spring-flower--1"></span>
        <span class="card-xhs__spring-flower card-xhs__spring-flower--2"></span>
        <span class="card-xhs__spring-blob"></span>
      </div>`
    case 'xhs-notebook-dry':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <div class="card-xhs__notebook-rings">${'<span></span>'.repeat(5)}</div>
        <span class="card-xhs__notebook-arrow"></span>
      </div>`
    case 'xhs-browser-cta':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <div class="card-xhs__browser-bar">
          <span class="card-xhs__megaphone"></span>
          <span class="card-xhs__browser-dots"><span></span><span></span><span></span></span>
        </div>
      </div>`
    case 'xhs-palm-editorial':
      return `<div class="card-xhs__deco card-xhs__palm-shadow" aria-hidden="true"></div>`
    case 'xhs-workplace':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <span class="card-xhs__work-megaphone"></span>
        <span class="card-xhs__work-star card-xhs__work-star--1">✦</span>
        <span class="card-xhs__work-star card-xhs__work-star--2">✦</span>
      </div>`
    case 'xhs-media':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <span class="card-xhs__media-blob card-xhs__media-blob--1"></span>
        <span class="card-xhs__media-blob card-xhs__media-blob--2"></span>
        <span class="card-xhs__media-star">✦</span>
      </div>`
    case 'xhs-memphis':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <span class="card-xhs__memphis-heart"></span>
        <span class="card-xhs__memphis-blob"></span>
        <span class="card-xhs__memphis-arrow"></span>
      </div>`
    case 'xhs-scrapbook':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <span class="card-xhs__scrap-star card-xhs__scrap-star--1">★</span>
        <span class="card-xhs__scrap-star card-xhs__scrap-star--2">★</span>
      </div>`
    case 'xhs-fashion-class':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <span class="card-xhs__fashion-figure"></span>
        <span class="card-xhs__fashion-flower">✿</span>
      </div>`
    case 'xhs-job-checklist':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <span class="card-xhs__job-bulb">💡</span>
        <span class="card-xhs__job-magnifier">🔍</span>
        <div class="card-xhs__job-rings">${'<span></span>'.repeat(6)}</div>
      </div>`
    case 'xhs-photo-notes':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <div class="card-xhs__photo-rings">${'<span></span>'.repeat(5)}</div>
        <span class="card-xhs__photo-wave"></span>
      </div>`
    case 'xhs-outdoor-copy':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <span class="card-xhs__outdoor-tree card-xhs__outdoor-tree--1"></span>
        <span class="card-xhs__outdoor-tree card-xhs__outdoor-tree--2"></span>
        <span class="card-xhs__outdoor-tent"></span>
        <span class="card-xhs__outdoor-plane">✈</span>
        <span class="card-xhs__outdoor-ground"></span>
      </div>`
    case 'xhs-vintage-quote':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <span class="card-xhs__vintage-rose card-xhs__vintage-rose--tl"></span>
        <span class="card-xhs__vintage-rose card-xhs__vintage-rose--br"></span>
        <span class="card-xhs__vintage-butterfly">🦋</span>
      </div>`
    case 'xhs-poetic-mist':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <span class="card-xhs__mist-mountain"></span>
        <span class="card-xhs__mist-reed"></span>
        <span class="card-xhs__mist-duck">🦆</span>
        <span class="card-xhs__mist-seal"></span>
      </div>`
    case 'xhs-solar-science':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <span class="card-xhs__solar-roof"></span>
        <span class="card-xhs__solar-bird card-xhs__solar-bird--1"></span>
        <span class="card-xhs__solar-bird card-xhs__solar-bird--2"></span>
        <span class="card-xhs__solar-bamboo"></span>
        <span class="card-xhs__solar-mountain"></span>
      </div>`
    case 'xhs-spring-art':
      return `<div class="card-xhs__deco" aria-hidden="true">
        <span class="card-xhs__art-corner card-xhs__art-corner--tl"></span>
        <span class="card-xhs__art-corner card-xhs__art-corner--tr"></span>
        <span class="card-xhs__art-corner card-xhs__art-corner--bl"></span>
        <span class="card-xhs__art-corner card-xhs__art-corner--br"></span>
        <span class="card-xhs__art-vertical">立春</span>
      </div>`
    default:
      return ''
  }
}

function shellCss(layout: CardXhsShellLayout, t: CardThemeDef['tokens']): string {
  const inner = t.innerCardBg ?? '#fff'
  const frame = t.frameBorder ?? t.hr
  const accent = t.accent

  const base = `
.card-xhs-shell{box-sizing:border-box;position:relative;overflow:hidden;width:100%;min-height:100%;}
.card-xhs-shell > .card-xhs__inner{position:relative;z-index:2;box-sizing:border-box;}
.card-xhs-shell > .card-xhs__deco{position:absolute;pointer-events:none;z-index:1;}
.card-xhs-shell .card-reading{position:relative;z-index:2;}
`

  const layouts: Record<CardXhsShellLayout, string> = {
    'xhs-spring-outing': `
.card-xhs-shell--xhs-spring-outing{background:#c8e650;padding:16px 14px 14px;}
.card-xhs-shell--xhs-spring-outing .card-xhs__inner{background:${inner};border-radius:42% 58% 55% 45%/48% 42% 58% 52%;padding:20px 18px;box-shadow:0 6px 20px rgba(0,0,0,0.1);border:3px solid #fff;margin-top:8px;}
.card-xhs__spring-flower{position:absolute;border:2px solid #1a1a1a;border-radius:50%;background:#fff;}
.card-xhs__spring-flower--1{width:12px;height:12px;top:6%;right:10%;}
.card-xhs__spring-flower--2{width:8px;height:8px;bottom:18%;left:6%;background:#f5d020;}
.card-xhs__spring-blob{position:absolute;bottom:14%;right:8%;width:36px;height:20px;border:3px solid #f5d020;border-color:transparent #f5d020 #f5d020 transparent;border-radius:0 0 100% 0;transform:rotate(-12deg);}
`,
    'xhs-notebook-dry': `
.card-xhs-shell--xhs-notebook-dry{background-color:#b5daf3;background-image:linear-gradient(rgba(255,255,255,0.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.35) 1px,transparent 1px);background-size:16px 16px;padding:14px 12px;}
.card-xhs-shell--xhs-notebook-dry .card-xhs__inner{background:${inner};border-radius:4px;box-shadow:0 4px 16px rgba(0,0,0,0.1);padding:14px 14px 14px 28px;display:flex;flex-direction:column;}
.card-xhs__notebook-rings{position:absolute;left:14px;top:14px;bottom:14px;width:16px;display:flex;flex-direction:column;justify-content:space-around;align-items:center;}
.card-xhs__notebook-rings span{width:12px;height:12px;border:2.5px solid #6ba3d9;border-radius:50%;background:#fff;display:block;}
.card-xhs__notebook-arrow{position:absolute;bottom:16%;right:10%;width:22px;height:22px;border:3px solid #e85d4c;border-color:#e85d4c transparent transparent #e85d4c;transform:rotate(45deg);}
`,
    'xhs-browser-cta': `
.card-xhs-shell--xhs-browser-cta{background-color:#3b8fd9;background-image:radial-gradient(circle,#fff 1.5px,transparent 1.5px);background-size:14px 14px;padding:18px 14px;}
.card-xhs-shell--xhs-browser-cta .card-xhs__inner{background:${inner};border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.14);padding:28px 16px 16px;position:relative;}
.card-xhs__browser-bar{position:absolute;top:0;left:0;right:0;height:22px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;border-bottom:1px solid #e5e7eb;}
.card-xhs__megaphone{width:16px;height:12px;background:#f5d020;clip-path:polygon(0 30%,70% 10%,70% 90%,0 70%);border-radius:2px;}
.card-xhs__browser-dots span{display:inline-block;width:6px;height:6px;border-radius:50%;margin-left:3px;}
.card-xhs__browser-dots span:nth-child(1){background:#f87171;}
.card-xhs__browser-dots span:nth-child(2){background:#fbbf24;}
.card-xhs__browser-dots span:nth-child(3){background:#34d399;}
`,
    'xhs-palm-editorial': `
.card-xhs-shell--xhs-palm-editorial{background:linear-gradient(165deg,#b8956c 0%,#d4b896 45%,#e8d4bc 100%);padding:20px 16px;}
.card-xhs__palm-shadow{inset:0;background:radial-gradient(ellipse 80% 50% at 20% 30%,rgba(0,0,0,0.18),transparent 60%),radial-gradient(ellipse 60% 40% at 85% 70%,rgba(0,0,0,0.14),transparent 55%);}
.card-xhs-shell--xhs-palm-editorial .card-xhs__inner{background:rgba(255,255,255,0.9);padding:20px 16px;text-align:center;border:1px solid ${frame};}
`,
    'xhs-workplace': `
.card-xhs-shell--xhs-workplace{background:linear-gradient(180deg,#b8e4f5 0%,#e8f6fc 55%,#ffffff 100%);padding:16px 14px;border:2px solid #7ec8e3;}
.card-xhs-shell--xhs-workplace .card-xhs__inner{padding:4px 2px;}
.card-xhs__work-megaphone{position:absolute;top:8px;right:10px;width:28px;height:24px;background:#f5d020;clip-path:polygon(0 25%,65% 5%,65% 95%,0 75%);border-radius:2px;}
.card-xhs__work-star{position:absolute;color:#1a1a1a;font-size:10px;opacity:0.7;}
.card-xhs__work-star--1{bottom:10%;right:12%;}
.card-xhs__work-star--2{bottom:14%;right:8%;font-size:8px;}
`,
    'xhs-media': `
.card-xhs-shell--xhs-media{background:linear-gradient(160deg,#c4b5fd 0%,#ddd6fe 40%,#ede9fe 75%,#f5f3ff 100%);padding:16px 12px;}
.card-xhs-shell--xhs-media .card-xhs__inner{background:${inner};border-radius:10px;padding:16px 14px;box-shadow:0 6px 20px rgba(0,0,0,0.08);}
.card-xhs__media-blob{position:absolute;border-radius:30% 70% 60% 40%/40% 50% 50% 60%;opacity:0.45;}
.card-xhs__media-blob--1{width:60px;height:60px;top:2%;right:-6%;background:#a78bfa;}
.card-xhs__media-blob--2{width:44px;height:44px;bottom:6%;left:-5%;background:#c4b5fd;}
.card-xhs__media-star{position:absolute;top:10%;right:14%;color:#7c3aed;font-size:12px;}
`,
    'xhs-memphis': `
.card-xhs-shell--xhs-memphis{background:#f5d020;padding:10px;}
.card-xhs-shell--xhs-memphis .card-xhs__inner{background:${inner};border:2px solid #1a1a1a;border-top:6px solid #4ade80;padding:16px 14px;box-shadow:0 4px 0 rgba(0,0,0,0.12);}
.card-xhs__memphis-heart{position:absolute;top:14px;right:14px;width:18px;height:18px;background:#f472b6;clip-path:polygon(50% 0%,100% 35%,85% 100%,50% 75%,15% 100%,0% 35%);transform:rotate(-12deg);}
.card-xhs__memphis-blob{position:absolute;top:10px;right:36px;width:14px;height:14px;background:#f5d020;border-radius:50%;}
.card-xhs__memphis-arrow{position:absolute;left:8px;top:28%;width:30px;height:30px;border:4px solid #f5d020;border-color:transparent transparent #f5d020 #f5d020;border-radius:0 0 0 100%;transform:rotate(-30deg);}
`,
    'xhs-scrapbook': `
.card-xhs-shell--xhs-scrapbook{background:#a8dcc0;padding:10px;}
.card-xhs-shell--xhs-scrapbook .card-xhs__inner{background-color:#fff;background-image:linear-gradient(rgba(0,0,0,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.05) 1px,transparent 1px);background-size:12px 12px;padding:16px 14px;}
.card-xhs__scrap-star{position:absolute;color:#fbbf24;}
.card-xhs__scrap-star--1{top:12%;right:10%;font-size:14px;}
.card-xhs__scrap-star--2{bottom:16%;left:8%;font-size:10px;}
`,
    'xhs-fashion-class': `
.card-xhs-shell--xhs-fashion-class{background:linear-gradient(165deg,#3d2b1f 0%,#5c4033 55%,#4a3428 100%);padding:16px 14px;}
.card-xhs-shell--xhs-fashion-class .card-xhs__inner{padding:8px 4px;}
.card-xhs__fashion-figure{position:absolute;right:4%;top:18%;width:48px;height:80px;background:linear-gradient(180deg,${hexAlpha(accent,0.3)} 0%,transparent 100%);border-radius:40% 40% 10% 10%;opacity:0.6;}
.card-xhs__fashion-flower{position:absolute;top:8%;left:10%;color:${accent};font-size:12px;opacity:0.7;}
`,
    'xhs-job-checklist': `
.card-xhs-shell--xhs-job-checklist{background-color:#fef08a;background-image:linear-gradient(rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.04) 1px,transparent 1px);background-size:12px 12px;padding:14px 12px;}
.card-xhs-shell--xhs-job-checklist .card-xhs__inner{background:${inner};border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,0.08);padding:22px 14px 14px;margin-top:8px;}
.card-xhs__job-rings{position:absolute;top:6px;left:12px;right:12px;height:14px;display:flex;justify-content:space-around;}
.card-xhs__job-rings span{width:10px;height:10px;border:2px solid #9ca3af;border-radius:50%;background:#fff;}
.card-xhs__job-bulb{position:absolute;left:6%;top:32%;font-size:16px;opacity:0.8;}
.card-xhs__job-magnifier{position:absolute;right:8%;bottom:14%;font-size:14px;opacity:0.7;}
`,
    'xhs-photo-notes': `
.card-xhs-shell--xhs-photo-notes{background:#b8dff5;padding:14px 12px;}
.card-xhs-shell--xhs-photo-notes .card-xhs__inner{background:${inner};border-radius:4px;padding:20px 14px 14px;box-shadow:0 4px 12px rgba(0,0,0,0.08);}
.card-xhs__photo-rings{position:absolute;top:14px;left:20px;right:20px;display:flex;justify-content:space-around;}
.card-xhs__photo-rings span{width:10px;height:10px;border:2.5px solid ${accent};border-radius:50%;background:#fff;}
.card-xhs__photo-wave{position:absolute;bottom:0;left:0;right:0;height:24px;background:linear-gradient(180deg,transparent,${hexAlpha(accent,0.25)});border-radius:0 0 50% 50%/0 0 100% 100%;}
`,
    'xhs-outdoor-copy': `
.card-xhs-shell--xhs-outdoor-copy{background:#e8f0e4;padding:12px;border:3px solid #a8c9a0;}
.card-xhs-shell--xhs-outdoor-copy .card-xhs__inner{border:2px dashed #a8c9a0;padding:16px 12px;background:${hexAlpha(inner,0.85)};}
.card-xhs__outdoor-tree{position:absolute;width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:20px solid #5c7a5c;opacity:0.5;}
.card-xhs__outdoor-tree--1{left:6%;bottom:22%;}
.card-xhs__outdoor-tree--2{left:10%;bottom:18%;transform:scale(0.7);}
.card-xhs__outdoor-tent{position:absolute;right:8%;bottom:20%;width:0;height:0;border-left:16px solid transparent;border-right:16px solid transparent;border-bottom:22px solid #e8dcc8;}
.card-xhs__outdoor-plane{position:absolute;top:12%;right:16%;font-size:12px;color:${accent};opacity:0.7;}
.card-xhs__outdoor-ground{position:absolute;bottom:0;left:0;right:0;height:18%;background:linear-gradient(180deg,transparent,#a8c9a0);opacity:0.25;border-radius:0 0 40% 40%;}
`,
    'xhs-vintage-quote': `
.card-xhs-shell--xhs-vintage-quote{background:#4a2c2a;padding:16px 14px;}
.card-xhs-shell--xhs-vintage-quote .card-xhs__inner{background:#f5f0e6;padding:18px 16px;border-radius:2px;position:relative;box-shadow:0 4px 16px rgba(0,0,0,0.2);}
.card-xhs-shell--xhs-vintage-quote .card-xhs__inner::after{content:"";position:absolute;top:0;right:0;width:24px;height:24px;background:linear-gradient(135deg,transparent 50%,#4a2c2a 50%);}
.card-xhs__vintage-rose{position:absolute;width:28px;height:28px;border:1px solid ${hexAlpha(accent,0.4)};border-radius:50%;opacity:0.35;}
.card-xhs__vintage-rose--tl{top:6%;left:6%;}
.card-xhs__vintage-rose--br{bottom:6%;right:6%;}
.card-xhs__vintage-butterfly{position:absolute;top:14%;right:18%;font-size:12px;opacity:0.6;}
`,
    'xhs-poetic-mist': `
.card-xhs-shell--xhs-poetic-mist{background:#e8e4df;padding:18px 14px;}
.card-xhs-shell--xhs-poetic-mist .card-xhs__inner{border:1px double ${frame};padding:18px 14px;background:${hexAlpha(inner,0.7)};}
.card-xhs__mist-mountain{position:absolute;bottom:12%;left:0;right:0;height:30%;background:linear-gradient(180deg,transparent,${hexAlpha('#9ca3af',0.15)});opacity:0.6;}
.card-xhs__mist-reed{position:absolute;bottom:8%;left:6%;width:20px;height:40px;background:linear-gradient(180deg,${hexAlpha(accent,0.3)},transparent);border-radius:50% 50% 0 0;}
.card-xhs__mist-duck{position:absolute;bottom:10%;right:10%;font-size:14px;opacity:0.6;}
.card-xhs__mist-seal{position:absolute;top:12%;right:12%;width:14px;height:14px;background:#c0392b;border-radius:2px;opacity:0.75;}
`,
    'xhs-solar-science': `
.card-xhs-shell--xhs-solar-science{background:linear-gradient(180deg,#e8f4fc 0%,#fff 100%);padding:14px 12px;}
.card-xhs-shell--xhs-solar-science .card-xhs__inner{border:1.5px solid ${accent};padding:16px 14px;background:${hexAlpha(inner,0.92)};background-image:linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px);background-size:14px 14px;}
.card-xhs__solar-roof{position:absolute;top:0;left:10%;right:10%;height:12px;background:repeating-linear-gradient(90deg,#9ca3af 0,#9ca3af 8px,transparent 8px,transparent 16px);opacity:0.4;}
.card-xhs__solar-bird{position:absolute;width:10px;height:4px;background:${accent};border-radius:50%;opacity:0.5;}
.card-xhs__solar-bird--1{left:8%;top:18%;}
.card-xhs__solar-bird--2{left:12%;top:20%;transform:scale(0.8);}
.card-xhs__solar-bamboo{position:absolute;top:8%;right:6%;width:16px;height:30px;background:linear-gradient(180deg,${hexAlpha(accent,0.25)},transparent);border-radius:0 50% 0 0;}
.card-xhs__solar-mountain{position:absolute;bottom:6%;right:6%;width:40px;height:20px;background:linear-gradient(180deg,transparent,${hexAlpha(accent,0.2)});border-radius:50% 50% 0 0;}
`,
    'xhs-spring-art': `
.card-xhs-shell--xhs-spring-art{background:#86c67a;padding:14px;border:2px solid #fff;}
.card-xhs-shell--xhs-spring-art .card-xhs__inner{background:${hexAlpha(inner,0.15)};padding:16px 14px;border:1px solid rgba(255,255,255,0.5);border-radius:50% 50% 45% 45%/40% 40% 60% 60%;}
.card-xhs__art-corner{position:absolute;width:16px;height:16px;border:2px solid #fff;}
.card-xhs__art-corner--tl{top:8px;left:8px;border-right:none;border-bottom:none;}
.card-xhs__art-corner--tr{top:8px;right:8px;border-left:none;border-bottom:none;}
.card-xhs__art-corner--bl{bottom:8px;left:8px;border-right:none;border-top:none;}
.card-xhs__art-corner--br{bottom:8px;right:8px;border-left:none;border-top:none;}
.card-xhs__art-vertical{position:absolute;top:10%;right:8%;writing-mode:vertical-rl;color:#fff;font-size:18px;font-weight:900;letter-spacing:0.15em;opacity:0.85;}
`,
  }

  return base + (layouts[layout] ?? '')
}

export function buildXhsShellStyleBlock(theme: CardThemeDef): string {
  const layout = theme.style.shellLayout
  if (!layout) return ''
  return `<style>${shellCss(layout, theme.tokens)}</style>`
}

export function wrapXhsCardChrome(innerHtml: string, theme: CardThemeDef): string {
  const layout = theme.style.shellLayout
  if (!layout) return innerHtml

  const trimmed = innerHtml.trim()
  if (!trimmed) return trimmed

  return (
    `<div class="card-xhs-shell card-xhs-shell--${layout}">` +
    decorHtml(layout) +
    `<div class="card-xhs__inner"><div class="card-reading">${trimmed}</div></div>` +
    `</div>`
  )
}

export function isXhsShellTheme(theme: CardThemeDef): boolean {
  return Boolean(theme.style.shellLayout)
}
