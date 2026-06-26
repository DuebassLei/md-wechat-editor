export type CardThemeGroup =
  | 'light'
  | 'dark'
  | 'gradient'
  | 'morandi'
  | 'magazine'
  | 'xhs'
  | 'culture'
  | 'scrapbook'
  | 'modern'
  | 'formal'
  | 'cute'

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
  | 'zhuYinSeal'
  | 'deepLetter'
  | 'mintScrapbook'
  | 'peachScrapbook'
  | 'lavenderScrapbook'
  | 'skyScrapbook'
  | 'softRound'
  | 'freshBreeze'
  | 'formalGraphite'
  | 'formalNavy'
  | 'formalEditorial'
  | 'cuteBubble'
  | 'cuteMilkTea'
  | 'cuteStarDream'
  | 'cuteLemonFizz'
  | 'cuteMatchaCloud'
  | 'cuteBlueberryJelly'
  | 'cuteShuitunLulu'
  | 'techGrid'

export type CardH1Style = 'default' | 'center-line' | 'accent-bar' | 'highlight-marker' | 'serif-elegant'
export type CardH2Style =
  | 'border-left'
  | 'accent-underline'
  | 'pill'
  | 'pill-solid'
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

  /** h3 装饰样式 */
  h3Style?: 'none' | 'emoji' | 'symbol'
  /** 分割线样式 */
  hrStyle?: 'line' | 'stripes' | 'dots' | 'text'
  /** strong 样式 */
  strongStyle?: 'default' | 'highlight'
  /** 链接下划线样式 */
  linkUnderline?: 'solid' | 'wavy'
  /** 列表 marker 自定义内容，如 '🍡 ' */
  liMarker?: string
  /** blockquote 偏移阴影偏移量（px），默认 0 */
  bqShadowOffset?: number
  /** h1 旋转角度（deg），默认 0 */
  h1Rotate?: number
  /** 代码块样式 */
  preStyle?: 'default' | 'card'
  /** 表格圆角半径（px），默认 0 */
  tableRadius?: number
  /** 是否显示 h1/h3 的 prefix/suffix 装饰 */
  showHeadingDecor?: boolean
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
