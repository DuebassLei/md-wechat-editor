import type { CardThemeDef } from '../types'

/** 冰蓝知识卡 · 小红书知识系列常见配色 */
export const oceanBlue: CardThemeDef = {
  id: 'ocean-blue',
  label: '冰蓝知识',
  group: 'gradient',
  desc: '浅蓝渐变 · 清爽教程风',
  style: {
    h1Style: 'accent-bar',
    h2Style: 'accent-underline',
    headerDecor: 'accent-strip',
    codeBordered: true,
    bgPattern: 'dot-grid',
    coverLayout: 'big-title',
    blockquoteStyle: 'highlight',
  },
  tokens: {
    contentBg: 'linear-gradient(165deg, #e0f2fe 0%, #f0f9ff 45%, #ffffff 100%)',
    exportBg: '#eef6fc',
    ink: '#0c4a6e',
    inkSoft: '#0369a1',
    accent: '#0284c7',
    accentWeak: 'rgba(2,132,199,0.18)',
    link: '#0284c7',
    codeBg: 'rgba(2,132,199,0.08)',
    preBg: '#e0f2fe',
    hr: '#bae6fd',
    tableBorder: '#bae6fd',
    tableHeadBg: '#e0f2fe',
    footerDash: '#7dd3fc',
    brandColor: '#0284c7',
    pageColor: '#64748b',
    accentBar: '#0284c7',
    contentPadX: 22,
    contentPadY: 20,
  },
}
