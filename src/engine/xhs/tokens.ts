import {
  ASPECTS,
  CONTENT_FOOTER_BAND,
  FONT_STACK,
  PAD_BOTTOM,
  PAD_TOP,
  PAD_X,
  PIXEL_RATIO,
  TRANSPARENT_PX,
} from '@/engine/card-export/constants'
import { DEFAULT_XHS_BRAND } from '@/engine/card-export/brands'
import type { CardExportTheme } from '@/engine/card-export/types'

export {
  ASPECTS,
  PIXEL_RATIO,
  PAD_X,
  PAD_TOP,
  PAD_BOTTOM,
  CONTENT_FOOTER_BAND,
  FONT_STACK,
  TRANSPARENT_PX,
  DEFAULT_XHS_BRAND,
}

export const XHS = {
  bg: '#F7F2E8',
  card: '#FFFDF8',
  ink: '#1F1A17',
  inkSoft: '#5C5346',
  inkFaint: '#A89A86',
  dash: '#D9C9AC',
} as const

export const WARM_ACCENT = '#E67E22'
export const WARM_DARK = '#5C5346'

export const XHS_SLICE_THEME: CardExportTheme = {
  contentBg: '#ffffff',
  footerDash: XHS.dash,
  brandColor: XHS.ink,
  pageColor: XHS.inkFaint,
}
