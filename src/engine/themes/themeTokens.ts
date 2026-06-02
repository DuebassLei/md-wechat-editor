import {
  buildThemeColors,
  type ThemeColors,
} from '@/lib/r-markdown/themeColors'
import { getThemeSwatch } from '@/utils/themeSwatch'
import { normalizeThemeId, type ThemeId } from '@/types/theme'

/** 将 hex 加深，用于组件 secondary accent */
export function darkenHex(hex: string, amount = 0.12): string {
  const raw = hex.replace('#', '')
  if (raw.length !== 6) return hex
  const r = parseInt(raw.slice(0, 2), 16)
  const g = parseInt(raw.slice(2, 4), 16)
  const b = parseInt(raw.slice(4, 6), 16)
  const f = 1 - amount
  const clamp = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n * f)))
      .toString(16)
      .padStart(2, '0')
  return `#${clamp(r)}${clamp(g)}${clamp(b)}`
}

/**
 * 从文章主题 + 可选组件强调色覆盖，生成排版组件用的 ThemeColors。
 * componentAccent 为空时跟随主题色板（getThemeSwatch）。
 */
export function getThemeTokens(
  themeId: ThemeId | string,
  componentAccent?: string | null,
): ThemeColors {
  const id = normalizeThemeId(themeId)
  const accent = componentAccent?.trim() || getThemeSwatch(id)
  return buildThemeColors(accent, darkenHex(accent))
}
