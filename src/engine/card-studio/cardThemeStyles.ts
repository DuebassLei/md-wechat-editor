import { FONT_STACK } from '@/engine/card-export/constants'
import type { CardExportTheme } from '@/engine/card-export/types'
import { hexAlpha, patternRules } from './cardThemePatterns'
import { getCardTheme } from './cardThemes/registry'
import type { CardBlockquoteStyle, CardH1Style, CardH2Style, CardThemeId, CardThemeStyleFlags } from './cardThemes/types'

function blockquoteRules(
  style: CardBlockquoteStyle,
  t: ReturnType<typeof getCardTheme>['tokens'],
  bqShadowOffset?: number,
): string {
  const bqBg = t.blockquoteBg ?? t.accentWeak
  const shadow = bqShadowOffset ? `box-shadow:${bqShadowOffset}px ${bqShadowOffset}px 0 ${t.hr};` : ''
  switch (style) {
    case 'bracket':
      return `
.card-reading blockquote{display:block;margin:14px 0;padding:12px 16px;border:none;background:transparent;color:${t.inkSoft};position:relative;}
.card-reading blockquote::before,.card-reading blockquote::after{font-family:Georgia,serif;font-size:28px;line-height:1;color:${t.accent};opacity:0.45;position:absolute;}
.card-reading blockquote::before{content:"\\201C";left:0;top:2px;}
.card-reading blockquote::after{content:"\\201D";right:4px;bottom:-4px;}
.card-reading blockquote p{margin:0;padding:4px 0 4px 20px;color:${t.inkSoft};font-style:italic;}
`
    case 'highlight':
      return `
.card-reading blockquote{display:block;margin:14px 0;padding:10px 14px;border-left:none;background:${hexAlpha(t.accent, 0.12)};color:${t.ink};border-radius:4px;box-shadow:inset 3px 0 0 ${t.accent};}
.card-reading blockquote p{margin:0;padding:4px 0;color:${t.ink};}
`
    case 'rounded':
      return `
.card-reading blockquote{display:block;margin:14px 0;padding:12px 16px;border:1.5px solid ${t.hr};border-left:4px solid ${t.accent};background:${bqBg};color:${t.inkSoft};border-radius:12px;${shadow}}
.card-reading blockquote p{margin:0;padding:4px 0;color:${t.inkSoft};}
`
    case 'literary':
      return `
.card-reading blockquote{display:block;margin:16px 0;padding:14px 18px;border:none;border-top:1px solid ${t.hr};border-bottom:1px solid ${t.hr};background:transparent;color:${t.inkSoft};font-style:italic;text-align:center;}
.card-reading blockquote p{margin:0;padding:6px 0;color:${t.inkSoft};line-height:1.8;}
`
    default:
      return `
.card-reading blockquote{display:block;margin:14px 0;padding:10px 14px;border-left:4px solid ${t.accent};background:${bqBg};color:${t.inkSoft};border-radius:8px;}
.card-reading blockquote p{margin:0;padding:4px 0;color:${t.inkSoft};}
`
  }
}

function h1Rules(
  h1Style: CardH1Style,
  t: ReturnType<typeof getCardTheme>['tokens'],
  headingFont: string,
  s?: CardThemeStyleFlags,
): string {
  const base = `
.card-reading h1{font-family:${headingFont};margin:4px 0 18px;font-size:24px;line-height:1.35;font-weight:700;color:${t.ink};letter-spacing:.2px;}
`
  if (h1Style === 'center-line') {
    return `${base}
.card-reading h1{text-align:center;}
.card-reading h1::after{content:"";display:block;width:72px;height:2px;margin:10px auto 0;background:${t.hr};border-radius:2px;}
`
  }
  if (h1Style === 'accent-bar') {
    return `${base}
.card-reading h1{position:relative;padding-left:14px;font-weight:800;font-size:22px;margin:0 0 12px;}
.card-reading h1::before{content:"";position:absolute;left:0;top:.2em;bottom:.2em;width:4px;border-radius:2px;background:${t.accent};}
`
  }
  if (h1Style === 'highlight-marker') {
    const rotate = s?.h1Rotate ? `transform:rotate(${s.h1Rotate}deg);` : ''
    if (s && (s.h1Rotate || s.bqShadowOffset)) {
      const color1 = hexAlpha(t.accent, 0.35)
      const color2 = t.hr
      const shadow = `box-shadow:${s.bqShadowOffset ?? 2}px ${(s.bqShadowOffset ?? 2) + 1}px 0 ${hexAlpha(t.hr, 0.6)};`
      return `${base}
.card-reading h1{font-size:22px;font-weight:900;margin:8px 0 14px;}
.card-reading h1 .content{display:inline-block;padding:0.35em 1.2em;background:linear-gradient(135deg,${color1} 0%,${color1} 48%,transparent 48%,transparent 52%,${color2} 52%,${color2} 100%);border-radius:4px;${shadow}${rotate}}
`
    }
    // 默认荧光笔效果
    return `${base}
.card-reading h1{font-size:22px;font-weight:900;margin:8px 0 14px;}
.card-reading h1 .content{display:inline;background:linear-gradient(transparent 55%,${hexAlpha('#ffe566', 0.85)} 55%);padding:0 4px;}
`
  }
  if (h1Style === 'serif-elegant') {
    return `${base}
.card-reading h1{font-size:20px;font-weight:700;line-height:1.3;letter-spacing:0.02em;}
`
  }
  return `${base}
.card-reading h1{font-size:22px;font-weight:800;margin:8px 0 14px;}
`
}

function h2Rules(
  h2Style: CardH2Style,
  t: ReturnType<typeof getCardTheme>['tokens'],
  headingFont: string,
): string {
  if (h2Style === 'accent-underline') {
    return `
.card-reading h2{font-family:${headingFont};margin:18px 0 10px;font-size:16px;line-height:1.4;font-weight:700;color:${t.ink};padding-bottom:6px;border-bottom:2px solid ${t.accentWeak};border-left:none;padding-left:0;}
`
  }
  if (h2Style === 'pill') {
    const softerAccent = hexAlpha(t.accent, 0.25)
    return `
.card-reading h2{font-family:${headingFont};margin:16px 0 10px;font-size:14px;line-height:1.4;font-weight:700;color:${t.ink};display:inline-block;padding:4px 12px;border-radius:999px;background:${softerAccent};border-left:none;padding-left:12px;}
`
  }
  if (h2Style === 'pill-solid') {
    const darkerAccent = hexAlpha(t.accent, 0.6)
    return `
.card-reading h2{font-family:${headingFont};margin:16px 0 10px;font-size:14px;line-height:1.4;font-weight:700;color:#fff;display:inline-block;padding:5px 14px;border-radius:999px;background:linear-gradient(135deg,${t.accent} 0%,${hexAlpha(t.accent, 0.55)} 100%);border-left:none;padding-left:14px;box-shadow:0 4px 0 ${darkerAccent},0 5px 14px ${hexAlpha(darkerAccent, 0.25)};}
`
  }
  if (h2Style === 'step-tag') {
    return `
.card-reading h2{counter-increment:mdwe-step;font-family:${headingFont};margin:14px 0 8px;font-size:15px;line-height:1.4;font-weight:700;color:${t.ink};border-left:none;padding-left:0;display:flex;align-items:center;gap:8px;}
.card-reading{counter-reset:mdwe-step;}
.card-reading h2::before{content:"STEP " counter(mdwe-step);flex-shrink:0;padding:3px 8px;background:${t.accent};color:#14532d;font-size:11px;font-weight:900;border:2px solid #1a1a1a;border-radius:2px;}
`
  }
  if (h2Style === 'numbered-box') {
    return `
.card-reading h2{counter-increment:mdwe-h2;font-family:${headingFont};margin:14px 0 8px;font-size:15px;line-height:1.4;font-weight:700;color:${t.ink};border-left:none;padding-left:0;display:flex;align-items:center;gap:8px;}
.card-reading{counter-reset:mdwe-h2;}
.card-reading h2::before{content:counter(mdwe-h2,decimal-leading-zero);flex-shrink:0;min-width:1.6em;padding:2px 6px;background:${t.accentWeak};color:${t.accent};font-size:12px;font-weight:900;text-align:center;border-radius:4px;}
`
  }
  if (h2Style === 'bracket-square') {
    return `
.card-reading h2{font-family:${headingFont};margin:16px 0 10px;font-size:15px;line-height:1.4;font-weight:700;color:${t.ink};border-left:none;padding-left:0;}
.card-reading h2::before{content:"[";color:${t.accent};margin-right:2px;}
.card-reading h2::after{content:"]";color:${t.accent};margin-left:2px;}
`
  }
  return `
.card-reading h2{font-family:${headingFont};margin:20px 0 10px;font-size:18px;line-height:1.4;font-weight:600;color:${t.ink};border-left:3px solid ${t.hr};padding-left:10px;}
`
}

function h3Rules(s: CardThemeStyleFlags, t: ReturnType<typeof getCardTheme>['tokens'], headingFont: string): string {
  const showDecor = s.showHeadingDecor
  const h3Style = s.h3Style ?? 'none'
  let prefixCss = ''
  if (showDecor && h3Style === 'emoji') {
    prefixCss = `
.card-reading h3 .prefix{display:inline;margin-right:4px;}
.card-reading h3 .suffix{display:none;}
`
  } else if (showDecor && h3Style === 'symbol') {
    prefixCss = `
.card-reading h3 .prefix{display:inline;margin-right:4px;color:${t.accent};}
.card-reading h3 .suffix{display:none;}
`
  }
  return `
.card-reading h3{font-family:${headingFont};margin:16px 0 8px;font-size:17px;font-weight:700;color:${t.ink};line-height:1.45;}
${prefixCss}`
}

function hrRules(hrStyle: string, t: ReturnType<typeof getCardTheme>['tokens']): string {
  switch (hrStyle) {
    case 'stripes': {
      const color1 = hexAlpha(t.accent, 0.35)
      const color2 = t.hr
      return `
.card-reading hr{border:none;height:12px;margin:18px 0;background:repeating-linear-gradient(90deg,${color1} 0,${color1} 8px,transparent 8px,transparent 12px,${color2} 12px,${color2} 20px,transparent 20px,transparent 24px);opacity:0.7;}
`
    }
    case 'text':
      return `
.card-reading hr{border:none;text-align:center;height:auto;margin:18px 0;background:none;}
.card-reading hr::before{content:"· · · ✿ · · ·";color:${t.hr};font-size:14px;letter-spacing:0.3em;}
`
    case 'dots':
      return `
.card-reading hr{border:none;text-align:center;height:auto;margin:18px 0;background:none;}
.card-reading hr::before{content:"· · · ✦ · · ·";color:${t.hr};font-size:14px;letter-spacing:0.25em;}
`
    default:
      return `
.card-reading hr{border:none;border-top:1px solid ${t.hr};margin:18px 0;}
`
  }
}

function strongRules(strongStyle: string, t: ReturnType<typeof getCardTheme>['tokens']): string {
  if (strongStyle === 'highlight') {
    return `
.card-reading strong,.card-reading b{font-weight:700;color:${t.ink};background:${hexAlpha(t.accent, 0.25)};padding:0 4px;border-radius:4px;}
`
  }
  return `
.card-reading strong,.card-reading b{font-weight:700;color:${t.ink};}
`
}

function linkRules(linkUnderline: string, t: ReturnType<typeof getCardTheme>['tokens']): string {
  const linkUnderlineColor = hexAlpha(t.link, 0.4)
  if (linkUnderline === 'wavy') {
    return `
.card-reading a{color:${t.link};text-decoration:underline wavy ${t.accent};text-underline-offset:2px;font-weight:600;border-bottom:none;}
`
  }
  return `
.card-reading a{color:${t.link};text-decoration:none;border-bottom:1px solid ${linkUnderlineColor};font-weight:600;}
`
}

function ulRules(liMarker: string | undefined, t: ReturnType<typeof getCardTheme>['tokens']): string {
  if (liMarker) {
    return `
.card-reading ul{margin:8px 0 12px;padding-left:1.2em;list-style:none;}
.card-reading ul li::marker{content:"${liMarker}";}
.card-reading ul ul{list-style-type:circle;}
`
  }
  return `
.card-reading ul{margin:8px 0 12px;padding-left:1.2em;list-style:disc;}
.card-reading ul ul{list-style-type:circle;}
`
}

export function buildCardThemeStyleBlock(themeId: CardThemeId): string {
  const theme = getCardTheme(themeId)
  const { tokens: t, style: s } = theme
  const bodyFont = t.bodyFont ?? FONT_STACK
  const headingFont = t.headingFont ?? bodyFont
  const h1Style = s.h1Style ?? 'default'
  const h2Style = s.h2Style ?? 'border-left'
  const codeBorder = s.codeBordered
    ? `border:1px solid ${t.tableBorder};`
    : ''
  const bqStyle = s.blockquoteStyle ?? 'bar'
  const pattern = s.bgPattern ?? 'none'
  const isXhs = Boolean(s.shellLayout)
  const linkUnderlineColor = hexAlpha(t.link, 0.4)
  const readingBg = isXhs || pattern !== 'none' ? 'transparent' : t.contentBg
  const showHeadingDecor = s.showHeadingDecor ?? false

  // 新增 style flags 默认值
  const hrStyleFlag = s.hrStyle ?? 'line'
  const strongStyleFlag = s.strongStyle ?? 'default'
  const linkUnderlineFlag = s.linkUnderline ?? 'solid'
  const bqShadowOffset = s.bqShadowOffset
  const tableRadius = s.tableRadius ?? 0
  const preStyle = s.preStyle ?? 'default'

  // 条件：h3 的 prefix/suffix 不再被隐藏
  const headingDecorHide = showHeadingDecor
    ? ''
    : `.card-reading h1 .prefix,.card-reading h2 .prefix,.card-reading h3 .prefix,.card-reading h4 .prefix,.card-reading h5 .prefix,.card-reading h6 .prefix,
.card-reading h1 .suffix,.card-reading h2 .suffix,.card-reading h3 .suffix,.card-reading h4 .suffix,.card-reading h5 .suffix,.card-reading h6 .suffix{display:none;}`

  const olRules = s.olAccentNumbers
    ? `
.card-reading ol{counter-reset:mdwe-ol;list-style:none;margin:8px 0 12px .4em;padding:0;}
.card-reading ol>li{counter-increment:mdwe-ol;position:relative;padding-left:1.6em;margin:6px 0;}
.card-reading ol>li::before{content:counter(mdwe-ol) ".";position:absolute;left:0;top:0;color:${t.accent};font-weight:700;width:1.4em;text-align:right;}
`
    : `
.card-reading ol{list-style-type:decimal;padding-left:1.2em;margin:8px 0 12px;}
.card-reading ol li::marker{color:${t.inkSoft};}
`

  // 表格圆角
  const tableCss = tableRadius > 0
    ? `
.card-reading table{width:100%;border-collapse:separate;border-spacing:0;margin:12px 0;font-size:15px;border-radius:${tableRadius}px;overflow:hidden;border:1.5px solid ${t.hr};}
.card-reading table th,.card-reading table td{border:none;padding:8px 10px;text-align:left;}
.card-reading table th{font-weight:600;background:${t.tableHeadBg};}
.card-reading table td{border-top:1px solid ${t.hr};background:#fff;}
.card-reading table tr:first-child th:first-child{border-top-left-radius:${tableRadius}px;}
.card-reading table tr:first-child th:last-child{border-top-right-radius:${tableRadius}px;}
.card-reading table tr:last-child td:first-child{border-bottom-left-radius:${tableRadius}px;}
.card-reading table tr:last-child td:last-child{border-bottom-right-radius:${tableRadius}px;}
`
    : `
.card-reading table{width:100%;border-collapse:collapse;margin:12px 0;font-size:15px;}
.card-reading table th,.card-reading table td{border:1px solid ${t.tableBorder};padding:8px 10px;text-align:left;}
.card-reading table th{font-weight:600;background:${t.tableHeadBg};border-bottom:2px solid ${t.tableBorder};}
`

  // 代码块样式
  const preCss = preStyle === 'card'
    ? `
.card-reading pre{margin:12px 0;padding:14px 16px;background:#fff;border:1.5px solid ${t.hr};border-radius:12px;overflow-x:auto;overflow-wrap:break-word;max-width:100%;box-sizing:border-box;box-shadow:3px 3px 0 ${t.hr};${codeBorder}}
.card-reading pre code{display:block;font-size:13px;line-height:1.6;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:${t.ink};background:transparent;border:0;padding:0;white-space:pre-wrap;word-break:break-all;overflow-wrap:anywhere;}
`
    : `
.card-reading pre{margin:12px 0;padding:14px 16px;background:${t.preBg};border-radius:10px;overflow-x:auto;overflow-wrap:break-word;max-width:100%;box-sizing:border-box;${codeBorder}}
.card-reading pre code{display:block;font-size:13px;line-height:1.6;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:${t.ink};background:transparent;border:0;padding:0;white-space:pre-wrap;word-break:break-all;overflow-wrap:anywhere;}
`

  const css = `
.card-reading{box-sizing:border-box;font-family:${bodyFont};font-size:15px;line-height:1.75;color:${t.ink};word-break:break-word;background:${readingBg};letter-spacing:.02em;}
.card-reading p{margin:10px 0;color:${t.ink};}
.card-reading p+p{margin-top:10px;}
${h1Rules(h1Style, t, headingFont, s)}
.card-reading h3,.card-reading h4,.card-reading h5,.card-reading h6{font-family:${headingFont};margin:16px 0 8px;font-weight:700;color:${t.ink};line-height:1.45;}
.card-reading h4{font-size:16px;}
.card-reading h5,.card-reading h6{font-size:15px;}
${h2Rules(h2Style, t, headingFont)}
${headingDecorHide}
${h3Rules(s, t, headingFont)}
.card-reading h1 .content,.card-reading h2 .content,.card-reading h3 .content,.card-reading h4 .content{display:inline;}
${ulRules(s.liMarker, t)}
${olRules}
.card-reading li{margin:4px 0;}
.card-reading li section{margin:0;line-height:1.75;color:${t.ink};}
${blockquoteRules(bqStyle, t, bqShadowOffset)}
${linkRules(linkUnderlineFlag, t)}
${strongRules(strongStyleFlag, t)}
.card-reading em,.card-reading i{font-style:italic;color:${t.inkSoft};}
.card-reading del{text-decoration:line-through;color:${t.inkSoft};}
.card-reading mark{background:${hexAlpha(t.accent, 0.22)};color:${t.ink};padding:0 .2em;border-radius:3px;}
.card-reading .katex{font-size:1.05em;}
.card-reading .katex-display{margin:12px 0;overflow-x:auto;}
.card-reading p[style],.card-reading font{line-height:inherit;}
${hrRules(hrStyleFlag, t)}
${preCss}
.card-reading p code,.card-reading li code{font-size:85%;padding:.12em .38em;border-radius:6px;background:${t.codeBg};color:${t.link};font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;word-break:break-all;${codeBorder}}
.card-reading img{display:block;max-width:100%;height:auto;margin:12px auto;border-radius:10px;border:1px solid ${t.tableBorder};}
${tableCss}
.card-reading input[type="checkbox"]{margin-right:6px;accent-color:${t.accent};width:14px;height:14px;}
${isXhs ? '' : `.card-studio-shell{box-sizing:border-box;background:${t.contentBg};position:relative;overflow:hidden;}
.card-studio-shell > .card-reading,.card-studio-shell > .card-studio-header{position:relative;z-index:1;}
${pattern !== 'none' ? patternRules(pattern, t.accent, t.hr) : ''}
.card-studio-header{flex-shrink:0;height:12px;box-sizing:border-box;}
.card-studio-header--none{display:none;}
.card-studio-header--accent-strip{border-bottom:1px solid ${t.hr};background:linear-gradient(90deg,${t.accent} 0 64px,transparent 64px);}
.card-studio-header--gradient-fade{border-bottom:1px solid ${t.hr};background:linear-gradient(to bottom,rgba(0,0,0,0.03),transparent),linear-gradient(90deg,${t.accent} 0 48px,transparent 48px);}
.card-studio-header--thin-line{border-bottom:1px solid ${t.hr};background:linear-gradient(to bottom,rgba(0,0,0,0.02),transparent);}`}
`.trim()

  return `<style>${css}</style>`
}

export function cardThemeToExportTheme(themeId: CardThemeId): CardExportTheme {
  const theme = getCardTheme(themeId)
  const t = theme.tokens
  const decor = theme.style.headerDecor ?? 'accent-strip'
  const isXhs = Boolean(theme.style.shellLayout)
  const useTopBar = !isXhs && (decor === 'none' || decor === 'thin-line')
  return {
    contentBg: isXhs ? t.exportBg : t.contentBg,
    footerDash: t.footerDash,
    brandColor: t.brandColor,
    pageColor: t.pageColor,
    accentBar: useTopBar ? t.accentBar : undefined,
    exportBg: t.exportBg,
  }
}
