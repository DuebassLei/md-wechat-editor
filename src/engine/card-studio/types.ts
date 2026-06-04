import type { CardAspect } from '@/engine/card-export/types'
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
  singleCardMode: boolean
  includeCover: boolean
  brand: string
  previewWidth: number
}

export type { CardThemeId }
