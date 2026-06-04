export type CardThemeGroup = 'light' | 'dark' | 'gradient' | 'morandi' | 'magazine'

export type CardThemeId =
  | 'minimal-light'
  | 'minimal-dark'
  | 'warm-paper'
  | 'ocean-blue'
  | 'forest-green'
  | 'sunset-gradient'
  | 'mono-code'
  | 'note-yellow'
  | 'morandi-gray'
  | 'morandi-rose'
  | 'morandi-sage'
  | 'magazine-minimal'
  | 'magazine-serif'
  | 'quote-gold'

export type CardH1Style = 'default' | 'center-line' | 'accent-bar'
export type CardH2Style = 'border-left' | 'accent-underline'

/** 顶栏装饰，对齐 MD2Card card-header */
export type CardHeaderDecor = 'accent-strip' | 'gradient-fade' | 'thin-line' | 'none'

/** 正文背景图案 — 对齐小红书知识卡常见纹理 */
export type CardBgPattern =
  | 'none'
  | 'dot-grid'
  | 'notebook-lines'
  | 'paper-grain'
  | 'bloom'
  | 'macaron-dots'
  | 'tech-grid'
  | 'film-grain'
  | 'color-block'
  | 'soft-wash'

/** 封面首图版式 */
export type CardCoverLayout =
  | 'classic'
  | 'big-title'
  | 'split-block'
  | 'sticker'
  | 'magazine'
  | 'journal'
  | 'newspaper'
  | 'gold-quote'

export type CardBlockquoteStyle = 'bar' | 'rounded' | 'bracket' | 'highlight'

export interface CardThemeStyleFlags {
  h1Style?: CardH1Style
  h2Style?: CardH2Style
  headerDecor?: CardHeaderDecor
  olAccentNumbers?: boolean
  codeBordered?: boolean
  bgPattern?: CardBgPattern
  coverLayout?: CardCoverLayout
  blockquoteStyle?: CardBlockquoteStyle
}

export interface CardThemeTokens {
  contentBg: string
  exportBg: string
  ink: string
  inkSoft: string
  accent: string
  accentWeak: string
  link: string
  codeBg: string
  preBg: string
  hr: string
  tableBorder: string
  tableHeadBg: string
  footerDash: string
  brandColor: string
  pageColor: string
  headingFont?: string
  bodyFont?: string
  blockquoteBg?: string
  /** 旧版顶条；有 headerDecor 时由顶栏替代 */
  accentBar?: string
  chipBg?: string
  chipBorder?: string
  chipInk?: string
  coverBg?: string
  contentPadX?: number
  contentPadY?: number
}

export interface CardThemeDef {
  id: CardThemeId
  label: string
  group: CardThemeGroup
  desc: string
  tokens: CardThemeTokens
  style: CardThemeStyleFlags
}
