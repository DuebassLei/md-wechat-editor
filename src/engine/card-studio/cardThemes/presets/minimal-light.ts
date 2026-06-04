import type { CardThemeDef } from '../types'

/** MD2Card 默认「清爽知识卡」风格 */
export const minimalLight: CardThemeDef = {
  id: 'minimal-light',
  label: '清爽知识',
  group: 'light',
  desc: '白底居中标题 · 知识分享首选',
  style: {
    h1Style: 'center-line',
    h2Style: 'border-left',
    headerDecor: 'thin-line',
    codeBordered: true,
    bgPattern: 'none',
    coverLayout: 'classic',
    blockquoteStyle: 'bar',
  },
  tokens: {
    contentBg: '#ffffff',
    exportBg: '#ffffff',
    ink: '#1f2328',
    inkSoft: '#6e7781',
    accent: '#3b82f6',
    accentWeak: 'rgba(59,130,246,0.15)',
    link: '#3b82f6',
    codeBg: '#f6f8fa',
    preBg: '#f6f8fa',
    hr: '#d0d7de',
    tableBorder: '#d0d7de',
    tableHeadBg: '#fafbfc',
    footerDash: '#d0d7de',
    brandColor: '#3b82f6',
    pageColor: '#8b949e',
    accentBar: '#3b82f6',
    contentPadX: 20,
    contentPadY: 18,
  },
}
