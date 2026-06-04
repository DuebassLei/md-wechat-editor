import type { CardAspect, CardMeta } from '@/engine/card-export/types'
import type { ThemeColors } from '@/lib/r-markdown/themeColors'

export type XhsAspect = CardAspect
export type XhsAccentMode = 'theme' | 'warm'

export type XhsMeta = CardMeta

export interface XhsCard {
  id: string
  label: string
  kind: 'html' | 'image'
  html?: string
  src?: string
}

export type { ThemeColors }
