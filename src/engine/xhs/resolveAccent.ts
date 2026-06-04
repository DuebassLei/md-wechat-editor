import { buildThemeColors } from '@/lib/r-markdown/themeColors'
import type { ThemeColors } from '@/lib/r-markdown/themeColors'
import { getThemeTokens } from '@/engine/themes/themeTokens'
import type { ThemeId } from '@/types/theme'
import { WARM_ACCENT, WARM_DARK } from './tokens'
import type { XhsAccentMode } from './types'

export function resolveAccentColors(
  mode: XhsAccentMode,
  themeId: ThemeId | string,
): ThemeColors {
  if (mode === 'warm') {
    return buildThemeColors(WARM_ACCENT, WARM_DARK)
  }
  return getThemeTokens(themeId)
}
