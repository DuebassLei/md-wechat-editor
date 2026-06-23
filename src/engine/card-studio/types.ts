import type { CardAspect } from '@/engine/card-export/types'
import type { SlicePurpose } from '@/engine/card-export/sliceContent'
import type { CardSplitMode } from './constants'
import type { CardThemeId } from './cardThemes/types'

export type CardPageKind = 'cover' | 'content'

export interface CardSegment {
  index: number
  markdown: string
}

export interface CardPage {
  id: string
  kind: CardPageKind
  label: string
  segmentIndex: number
  pageIndex: number
  totalInSegment: number
  globalIndex: number
  html: string
  dataUrl?: string
  overflow?: boolean
}

export interface BuildCardPagesOptions {
  markdown: string
  themeId: CardThemeId
  aspect: CardAspect
  splitMode: CardSplitMode
  includeCover: boolean
  brand: string
  previewWidth: number
  showBrand?: boolean
  showPageNumbers?: boolean
  overflowHidden?: boolean
  /** 增强模式：JSX 样式 / font / LaTeX（对齐 MD2Card mdxMode） */
  richContent?: boolean
  /** preview = 低分辨率快速预览；export = 高清导出 */
  purpose?: SlicePurpose
}

export type { CardThemeId }
