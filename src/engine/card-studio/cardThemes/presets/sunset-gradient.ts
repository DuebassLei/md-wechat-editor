import type { CardThemeDef } from '../types'

/** 梦幻渐变 · MD2Card 暖色社交风 */
export const sunsetGradient: CardThemeDef = {
  id: 'sunset-gradient',
  label: '梦幻暮光',
  group: 'gradient',
  desc: '橙粉渐变 · 吸睛封面感',
  style: {
    h1Style: 'accent-bar',
    h2Style: 'accent-underline',
    headerDecor: 'accent-strip',
    olAccentNumbers: true,
    codeBordered: true,
    bgPattern: 'macaron-dots',
    coverLayout: 'sticker',
    blockquoteStyle: 'highlight',
  },
  tokens: {
    contentBg: 'linear-gradient(155deg, #fff1f2 0%, #ffe4e6 35%, #fce7f3 70%, #fdf4ff 100%)',
    exportBg: '#fff5f7',
    ink: '#881337',
    inkSoft: '#9f1239',
    accent: '#e11d48',
    accentWeak: 'rgba(225,29,72,0.16)',
    link: '#e11d48',
    codeBg: 'rgba(225,29,72,0.08)',
    preBg: '#fff1f2',
    hr: '#fecdd3',
    tableBorder: '#fecdd3',
    tableHeadBg: '#fff1f2',
    footerDash: '#fda4af',
    brandColor: '#e11d48',
    pageColor: '#9ca3af',
    accentBar: '#e11d48',
    contentPadX: 22,
    contentPadY: 20,
  },
}
