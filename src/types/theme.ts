import {
  THEME_OPTIONS,
  getThemeCss,
  groupThemeOptions,
  type ThemeTier,
  type ThemeOption,
  type ThemeGroup,
} from '@/themes/index'
import { getThemeSwatch } from '@/utils/themeSwatch'

export {
  THEME_OPTIONS,
  getThemeCss,
  getThemeSwatch,
  groupThemeOptions,
  type ThemeTier,
  type ThemeOption,
  type ThemeGroup,
}

export type ThemeId = (typeof THEME_OPTIONS)[number]['id']

export function normalizeThemeId(themeId: string | null | undefined): ThemeId {
  const id = (themeId ?? 'normal').trim()
  if (THEME_OPTIONS.some((t) => t.id === id)) return id as ThemeId
  return 'normal'
}

export function getThemeName(themeId: string): string {
  return THEME_OPTIONS.find((t) => t.id === themeId)?.name ?? '默认主题'
}
