export type CardThemeGroup = 'light' | 'dark' | 'gradient' | 'morandi' | 'magazine' | 'xhs'

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
  | 'xhs-spring-outing'
  | 'xhs-notebook-dry'
  | 'xhs-browser-cta'
  | 'xhs-palm-editorial'
  | 'xhs-workplace'
  | 'xhs-media'
  | 'xhs-memphis'
  | 'xhs-scrapbook'
  | 'xhs-fashion-class'
  | 'xhs-job-checklist'
  | 'xhs-photo-notes'
  | 'xhs-outdoor-copy'
  | 'xhs-vintage-quote'
  | 'xhs-poetic-mist'
  | 'xhs-solar-science'
  | 'xhs-spring-art'

export type CardH1Style = 'default' | 'center-line' | 'accent-bar' | 'highlight-marker' | 'serif-elegant'
export type CardH2Style =
  | 'border-left'
  | 'accent-underline'
  | 'pill'
  | 'step-tag'
  | 'numbered-box'
  | 'bracket-square'

/** 顶栏装饰，对齐 MD2Card card-header */
export type CardHeaderDecor = 'accent-strip' | 'gradient-fade' | 'thin-line' | 'none'

/** Canva 小红书知识卡壳层版式（正文 + 封面共用） */
export type CardXhsShellLayout =
  | 'xhs-spring-outing'
  | 'xhs-notebook-dry'
  | 'xhs-browser-cta'
  | 'xhs-palm-editorial'
  | 'xhs-workplace'
  | 'xhs-media'
  | 'xhs-memphis'
  | 'xhs-scrapbook'
  | 'xhs-fashion-class'
  | 'xhs-job-checklist'
  | 'xhs-photo-notes'
  | 'xhs-outdoor-copy'
  | 'xhs-vintage-quote'
  | 'xhs-poetic-mist'
  | 'xhs-solar-science'
  | 'xhs-spring-art'

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
  | 'polka-dots'
  | 'fine-grid'
  | 'mountain-mist'
  | 'wave-ground'
  | 'dashed-frame'

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
  | CardXhsShellLayout

export type CardBlockquoteStyle = 'bar' | 'rounded' | 'bracket' | 'highlight' | 'literary'

export interface CardThemeStyleFlags {
  h1Style?: CardH1Style
  h2Style?: CardH2Style
  headerDecor?: CardHeaderDecor
  olAccentNumbers?: boolean
  codeBordered?: boolean
  bgPattern?: CardBgPattern
  coverLayout?: CardCoverLayout
  blockquoteStyle?: CardBlockquoteStyle
  /** Canva 小红书结构化壳层；设置后启用 cardXhsChrome */
  shellLayout?: CardXhsShellLayout
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
  /** 壳层内层卡片背景 */
  innerCardBg?: string
  /** 壳层边框色 */
  frameBorder?: string
}

export interface CardThemeDef {
  id: CardThemeId
  label: string
  group: CardThemeGroup
  desc: string
  tokens: CardThemeTokens
  style: CardThemeStyleFlags
}
