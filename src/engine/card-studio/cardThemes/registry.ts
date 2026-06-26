import type { CardThemeDef, CardThemeId } from './types'
import { minimalLight } from './presets/minimal-light'
import { minimalDark } from './presets/minimal-dark'
import { warmPaper } from './presets/warm-paper'
import { oceanBlue } from './presets/ocean-blue'
import { forestGreen } from './presets/forest-green'
import { sunsetGradient } from './presets/sunset-gradient'
import { monoCode } from './presets/mono-code'
import { noteYellow } from './presets/note-yellow'
import { morandiGray } from './presets/morandi-gray'
import { morandiRose } from './presets/morandi-rose'
import { morandiSage } from './presets/morandi-sage'
import { magazineMinimal } from './presets/magazine-minimal'
import { magazineSerif } from './presets/magazine-serif'
import { quoteGold } from './presets/quote-gold'
import { XHS_CANVA_THEMES } from './presets/xhs-canva'
import { WECHAT_DRAFT_CARD_THEMES } from './presets/wechat-drafts'

export type { CardThemeDef, CardThemeId, CardThemeGroup, CardThemeTokens, CardHeaderDecor } from './types'

export const CARD_THEMES: CardThemeDef[] = [
  ...XHS_CANVA_THEMES,
  ...WECHAT_DRAFT_CARD_THEMES,
  minimalLight,
  oceanBlue,
  forestGreen,
  sunsetGradient,
  noteYellow,
  warmPaper,
  morandiGray,
  morandiRose,
  morandiSage,
  magazineMinimal,
  magazineSerif,
  minimalDark,
  monoCode,
  quoteGold,
]

export const CARD_THEME_IDS = CARD_THEMES.map((t) => t.id)

const MAP = new Map<CardThemeId, CardThemeDef>(CARD_THEMES.map((t) => [t.id, t]))

export function getCardTheme(id: CardThemeId): CardThemeDef {
  return MAP.get(id) ?? MAP.get('minimal-light')!
}
