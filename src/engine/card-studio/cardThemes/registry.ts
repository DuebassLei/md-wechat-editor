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

export type { CardThemeDef, CardThemeId, CardThemeGroup, CardThemeTokens, CardHeaderDecor } from './types'

export const CARD_THEMES: CardThemeDef[] = [
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
