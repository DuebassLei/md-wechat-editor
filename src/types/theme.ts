import {
  THEME_OPTIONS,
  getThemeCss,
  THEMES,
  getThemeTier,
  isProTheme,
  type ThemeTier,
  type ThemeOption,
} from '@/themes/index'

export { THEME_OPTIONS, getThemeCss, THEMES, getThemeTier, isProTheme, type ThemeTier, type ThemeOption }

export type ThemeId = (typeof THEME_OPTIONS)[number]['id']

const LEGACY_THEME_ALIASES: Record<string, ThemeId> = {
  rMarkdown: 'normal',
}

export function normalizeThemeId(themeId: string | null | undefined): ThemeId {
  const id = (themeId ?? 'normal').trim()
  if (LEGACY_THEME_ALIASES[id]) return LEGACY_THEME_ALIASES[id]
  if (THEME_OPTIONS.some((t) => t.id === id)) return id as ThemeId
  return 'normal'
}

export function getThemeName(themeId: string): string {
  return THEME_OPTIONS.find((t) => t.id === themeId)?.name ?? '默认主题'
}
