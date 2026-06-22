import type { ThemeColors } from '@/lib/r-markdown/themeColors'

export type CardAspect = '3:4' | '1:1'

export interface CardMeta {
  title: string
  badge: string
  subtitle: string
  teaser: string
  hook: string
  chips: string[]
  brand: string
  charCount: number
  readMin: number
  /** Sky / MD2Card：封面背景图 URL */
  coverImage?: string
  /** Sky / MD2Card：overlay 叠图 | separate 图文分离 */
  coverLayout?: 'overlay' | 'separate'
  date?: string
}

export interface CardExportTheme {
  contentBg: string
  footerDash: string
  brandColor: string
  pageColor: string
  /** 导出 PNG 用的纯色底（html-to-image backgroundColor） */
  exportBg?: string
  /** 内容图顶部装饰条（微信绿等） */
  accentBar?: string
}

export interface ExportCard {
  id: string
  label: string
  kind: 'html' | 'image'
  html?: string
  src?: string
  /** Upload-optimized JPEG size in bytes; undefined in HD mode */
  uploadBytes?: number | null
}

export type ExportQualityMode = 'hd' | 'upload'

export type WechatTietuSkin = 'xhs' | 'wechat'

export type { ThemeColors }
