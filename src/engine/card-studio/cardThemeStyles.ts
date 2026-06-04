import { FONT_STACK } from '@/engine/card-export/constants'
import type { CardExportTheme } from '@/engine/card-export/types'
import { hexAlpha, patternRules } from './cardThemePatterns'
import { getCardTheme } from './cardThemes/registry'
import type { CardBlockquoteStyle, CardThemeId } from './cardThemes/types'

function blockquoteRules(style: CardBlockquoteStyle, t: ReturnType<typeof getCardTheme>['tokens']): string {
  const bqBg = t.blockquoteBg ?? t.accentWeak
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
.card-reading blockquote{display:block;margin:14px 0;padding:12px 16px;border:1.5px solid ${t.hr};border-left:4px solid ${t.accent};background:${bqBg};color:${t.inkSoft};border-radius:12px;}
.card-reading blockquote p{margin:0;padding:4px 0;color:${t.inkSoft};}
`
    default:
      return `
.card-reading blockquote{display:block;margin:14px 0;padding:10px 14px;border-left:4px solid ${t.accent};background:${bqBg};color:${t.inkSoft};border-radius:8px;}
.card-reading blockquote p{margin:0;padding:4px 0;color:${t.inkSoft};}
`
  }
}

function h1Rules(
  h1Style: 'default' | 'center-line' | 'accent-bar',
  t: ReturnType<typeof getCardTheme>['tokens'],
  headingFont: string,
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
  return `${base}
.card-reading h1{font-size:22px;font-weight:800;margin:8px 0 14px;}
`
}

function h2Rules(
  h2Style: 'border-left' | 'accent-underline',
  t: ReturnType<typeof getCardTheme>['tokens'],
  headingFont: string,
): string {
  if (h2Style === 'accent-underline') {
    return `
.card-reading h2{font-family:${headingFont};margin:18px 0 10px;font-size:16px;line-height:1.4;font-weight:700;color:${t.ink};padding-bottom:6px;border-bottom:2px solid ${t.accentWeak};border-left:none;padding-left:0;}
`
  }
  return `
.card-reading h2{font-family:${headingFont};margin:20px 0 10px;font-size:18px;line-height:1.4;font-weight:600;color:${t.ink};border-left:3px solid ${t.hr};padding-left:10px;}
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
  const linkUnderline = hexAlpha(t.link, 0.4)
  const readingBg = pattern !== 'none' ? 'transparent' : t.contentBg

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

  const css = `
.card-reading{box-sizing:border-box;font-family:${bodyFont};font-size:15px;line-height:1.75;color:${t.ink};word-break:break-word;background:${readingBg};letter-spacing:.02em;}
.card-reading p{margin:10px 0;color:${t.ink};}
.card-reading p+p{margin-top:10px;}
${h1Rules(h1Style, t, headingFont)}
.card-reading h3,.card-reading h4,.card-reading h5,.card-reading h6{font-family:${headingFont};margin:16px 0 8px;font-weight:700;color:${t.ink};line-height:1.45;}
.card-reading h3{font-size:17px;}
.card-reading h4{font-size:16px;}
.card-reading h5,.card-reading h6{font-size:15px;}
${h2Rules(h2Style, t, headingFont)}
.card-reading h1 .prefix,.card-reading h2 .prefix,.card-reading h3 .prefix,.card-reading h4 .prefix,.card-reading h5 .prefix,.card-reading h6 .prefix,
.card-reading h1 .suffix,.card-reading h2 .suffix,.card-reading h3 .suffix,.card-reading h4 .suffix,.card-reading h5 .suffix,.card-reading h6 .suffix{display:none;}
.card-reading h1 .content,.card-reading h2 .content,.card-reading h3 .content,.card-reading h4 .content{display:inline;}
.card-reading ul{margin:8px 0 12px;padding-left:1.2em;list-style:disc;}
.card-reading ul ul{list-style-type:circle;}
${olRules}
.card-reading li{margin:4px 0;}
.card-reading li section{margin:0;line-height:1.75;color:${t.ink};}
${blockquoteRules(bqStyle, t)}
.card-reading a{color:${t.link};text-decoration:none;border-bottom:1px solid ${linkUnderline};font-weight:600;}
.card-reading strong,.card-reading b{font-weight:700;color:${t.ink};}
.card-reading em,.card-reading i{font-style:italic;color:${t.inkSoft};}
.card-reading del{text-decoration:line-through;color:${t.inkSoft};}
.card-reading hr{border:none;border-top:1px solid ${t.hr};margin:18px 0;}
.card-reading pre{margin:12px 0;padding:14px 16px;background:${t.preBg};border-radius:10px;overflow-x:auto;overflow-wrap:break-word;max-width:100%;box-sizing:border-box;${codeBorder}}
.card-reading pre code{display:block;font-size:13px;line-height:1.6;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:${t.ink};background:transparent;border:0;padding:0;white-space:pre-wrap;word-break:break-all;overflow-wrap:anywhere;}
.card-reading p code,.card-reading li code{font-size:85%;padding:.12em .38em;border-radius:6px;background:${t.codeBg};color:${t.link};font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;word-break:break-all;${codeBorder}}
.card-reading img{display:block;max-width:100%;height:auto;margin:12px auto;border-radius:10px;border:1px solid ${t.tableBorder};}
.card-reading table{width:100%;border-collapse:collapse;margin:12px 0;font-size:15px;}
.card-reading table th,.card-reading table td{border:1px solid ${t.tableBorder};padding:8px 10px;text-align:left;}
.card-reading table th{font-weight:600;background:${t.tableHeadBg};border-bottom:2px solid ${t.tableBorder};}
.card-reading input[type="checkbox"]{margin-right:6px;accent-color:${t.accent};}
.card-studio-shell{box-sizing:border-box;background:${t.contentBg};position:relative;overflow:hidden;}
.card-studio-shell > .card-reading,.card-studio-shell > .card-studio-header{position:relative;z-index:1;}
${pattern !== 'none' ? patternRules(pattern, t.accent, t.hr) : ''}
.card-studio-header{flex-shrink:0;height:12px;box-sizing:border-box;}
.card-studio-header--none{display:none;}
.card-studio-header--accent-strip{border-bottom:1px solid ${t.hr};background:linear-gradient(90deg,${t.accent} 0 64px,transparent 64px);}
.card-studio-header--gradient-fade{border-bottom:1px solid ${t.hr};background:linear-gradient(to bottom,rgba(0,0,0,0.03),transparent),linear-gradient(90deg,${t.accent} 0 48px,transparent 48px);}
.card-studio-header--thin-line{border-bottom:1px solid ${t.hr};background:linear-gradient(to bottom,rgba(0,0,0,0.02),transparent);}
`.trim()

  return `<style>${css}</style>`
}

export function cardThemeToExportTheme(themeId: CardThemeId): CardExportTheme {
  const theme = getCardTheme(themeId)
  const t = theme.tokens
  const decor = theme.style.headerDecor ?? 'accent-strip'
  const useTopBar = decor === 'none' || decor === 'thin-line'
  return {
    contentBg: t.contentBg,
    footerDash: t.footerDash,
    brandColor: t.brandColor,
    pageColor: t.pageColor,
    accentBar: useTopBar ? t.accentBar : undefined,
    exportBg: t.exportBg,
  }
}
