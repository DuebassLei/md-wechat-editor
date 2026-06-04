import type { ThemeColors } from '@/engine/r-markdown/themeColors'
import { FONT_STACK } from './constants'

export type ReadingSkin = 'xhs' | 'wechat'

const LINK_FALLBACK = '#1e6bb8'

function readingPalette(skin: ReadingSkin, colors?: ThemeColors) {
  if (skin === 'wechat') {
    const accent = '#07c160'
    return {
      ink: '#1a1a1a',
      inkSoft: '#666666',
      link: accent,
      codeBg: 'rgba(7,193,96,0.1)',
      hr: '#e5e5e5',
      preBg: '#f5f5f5',
      tableBorder: '#e5e5e5',
      tableHeadBg: '#f5f5f5',
      h2Accent: accent,
    }
  }
  const accent = colors?.accent ?? LINK_FALLBACK
  return {
    ink: 'rgb(51,51,51)',
    inkSoft: 'rgb(92,83,70)',
    link: accent,
    codeBg: colors ? `rgba(${colors.rgb},0.08)` : 'rgba(27,31,35,0.05)',
    hr: '#d9c9ac',
    preBg: '#f6f3ee',
    tableBorder: '#e5dcc8',
    tableHeadBg: '#f6f3ee',
    h2Accent: accent,
  }
}

/** 贴图内容图 Markdown 排版（注入离屏 DOM，覆盖 Tailwind preflight） */
export function buildReadingStyleBlock(skin: ReadingSkin, colors?: ThemeColors): string {
  const p = readingPalette(skin, colors)
  const h2Extra =
    skin === 'wechat'
      ? `.card-reading h2{border-left:4px solid ${p.h2Accent};padding-left:12px;}`
      : ''

  const css = `
.card-reading{box-sizing:border-box;font-family:${FONT_STACK};font-size:15px;line-height:1.8;color:${p.ink};word-break:break-word;}
.card-reading p{margin:0;padding:8px 0;line-height:1.8;color:${p.ink};}
.card-reading h1,.card-reading h2,.card-reading h3,.card-reading h4,.card-reading h5,.card-reading h6{margin:20px 0 10px;font-weight:800;color:${p.ink};line-height:1.45;}
.card-reading h1{font-size:22px;}
.card-reading h2{font-size:19px;}
.card-reading h3{font-size:17px;}
.card-reading h4{font-size:16px;}
.card-reading h5,.card-reading h6{font-size:15px;}
${h2Extra}
.card-reading h1 .prefix,.card-reading h2 .prefix,.card-reading h3 .prefix,.card-reading h4 .prefix,.card-reading h5 .prefix,.card-reading h6 .prefix,
.card-reading h1 .suffix,.card-reading h2 .suffix,.card-reading h3 .suffix,.card-reading h4 .suffix,.card-reading h5 .suffix,.card-reading h6 .suffix{display:none;}
.card-reading h1 .content,.card-reading h2 .content,.card-reading h3 .content,.card-reading h4 .content{display:inline;}
.card-reading ul,.card-reading ol{margin:8px 0;padding-left:22px;}
.card-reading ul{list-style-type:disc;}
.card-reading ul ul{list-style-type:circle;}
.card-reading ol{list-style-type:decimal;}
.card-reading li{margin:4px 0;}
.card-reading li section{margin:0;line-height:1.8;color:${p.ink};}
.card-reading blockquote{display:block;margin:14px 0;padding:10px 14px 10px 16px;border-left:3px solid ${p.h2Accent};background:${skin === 'wechat' ? 'rgba(7,193,96,0.06)' : 'rgba(0,0,0,0.04)'};color:${p.inkSoft};border-radius:4px;}
.card-reading blockquote p{margin:0;padding:4px 0;color:${p.inkSoft};}
.card-reading a{color:${p.link};font-weight:700;text-decoration:none;border-bottom:1px solid ${p.link};}
.card-reading strong{font-weight:800;color:${p.ink};}
.card-reading em{font-style:italic;}
.card-reading del{text-decoration:line-through;color:${p.inkSoft};}
.card-reading hr{margin:12px 0;border:none;border-top:1px solid ${p.hr};}
.card-reading pre{margin:10px 0;padding:12px 14px;background:${p.preBg};border-radius:8px;overflow-x:auto;}
.card-reading pre code{display:block;font-size:13px;line-height:1.65;font-family:Consolas,Monaco,Menlo,monospace;color:${p.ink};}
.card-reading p code,.card-reading li code{font-size:14px;padding:2px 5px;border-radius:4px;background:${p.codeBg};color:${p.link};font-family:Consolas,Monaco,Menlo,monospace;}
.card-reading img{display:block;max-width:100%;height:auto;margin:12px auto;border-radius:6px;}
.card-reading table{border-collapse:collapse;margin:12px 0;width:100%;}
.card-reading table th,.card-reading table td{border:1px solid ${p.tableBorder};padding:6px 10px;font-size:14px;text-align:left;}
.card-reading table th{font-weight:800;background:${p.tableHeadBg};}
`.trim()

  return `<style>${css}</style>`
}
