import type { CardThemeDef } from '../types'

/** MD2Card「少数派」暗色风 */
export const minimalDark: CardThemeDef = {
  id: 'minimal-dark',
  label: '少数派暗',
  group: 'dark',
  desc: '深色底 · 珊瑚色强调 · 科技专栏',
  style: {
    h1Style: 'accent-bar',
    h2Style: 'accent-underline',
    headerDecor: 'accent-strip',
    olAccentNumbers: true,
    codeBordered: true,
    bgPattern: 'tech-grid',
    coverLayout: 'big-title',
    blockquoteStyle: 'highlight',
  },
  tokens: {
    contentBg: '#0d1117',
    exportBg: '#0d1117',
    ink: '#e6edf3',
    inkSoft: '#9aa8b3',
    accent: '#ff6b88',
    accentWeak: 'rgba(255,107,136,0.28)',
    link: '#ff6b88',
    codeBg: '#0b1220',
    preBg: '#0b1220',
    hr: '#262b33',
    tableBorder: '#262b33',
    tableHeadBg: '#0f141b',
    footerDash: '#262b33',
    brandColor: '#ff6b88',
    pageColor: '#6e7681',
    accentBar: '#ff6b88',
    contentPadX: 24,
    contentPadY: 20,
  },
}
