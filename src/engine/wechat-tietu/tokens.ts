import { ASPECTS, PAD_BOTTOM, PAD_TOP, PAD_X, WECHAT_TIETU_ASPECT } from '@/engine/card-export/constants'
import { DEFAULT_WECHAT_TIETU_BRAND } from '@/engine/card-export/brands'
import type { CardExportTheme } from '@/engine/card-export/types'

export { ASPECTS, PAD_X, PAD_TOP, PAD_BOTTOM, WECHAT_TIETU_ASPECT, DEFAULT_WECHAT_TIETU_BRAND }

export const WECHAT_TIETU = {
  bg: '#ffffff',
  ink: '#1a1a1a',
  inkSoft: '#666666',
  inkFaint: '#999999',
  dash: '#e5e5e5',
  accent: '#07c160',
} as const

export const WECHAT_SLICE_THEME: CardExportTheme = {
  contentBg: '#ffffff',
  footerDash: WECHAT_TIETU.dash,
  brandColor: WECHAT_TIETU.accent,
  pageColor: WECHAT_TIETU.inkFaint,
  accentBar: WECHAT_TIETU.accent,
}

export const XHS_SKIN_SLICE_THEME: CardExportTheme = {
  contentBg: '#ffffff',
  footerDash: '#D9C9AC',
  brandColor: '#1F1A17',
  pageColor: '#A89A86',
}
