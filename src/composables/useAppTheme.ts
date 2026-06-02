import { onMounted, ref } from 'vue'

export const APP_THEME_OPTIONS = [
  { id: 'default', name: '靛蓝', swatch: 'rgb(99, 102, 241)' },
  { id: 'eye-care', name: '护眼', swatch: 'rgb(5, 150, 105)' },
  { id: 'violet', name: '紫韵', swatch: 'rgb(124, 58, 237)' },
  { id: 'ocean', name: '海蓝', swatch: 'rgb(14, 165, 233)' },
  { id: 'teal', name: '青岚', swatch: 'rgb(13, 148, 136)' },
  { id: 'rose', name: '绯红', swatch: 'rgb(244, 63, 94)' },
  { id: 'amber', name: '琥珀', swatch: 'rgb(217, 119, 6)' },
  { id: 'crimson', name: '朱砂', swatch: 'rgb(220, 38, 38)' },
  { id: 'slate', name: '素墨', swatch: 'rgb(71, 85, 105)' },
] as const

export type AppThemeId = (typeof APP_THEME_OPTIONS)[number]['id']

const STORAGE_KEY = 'moyun-jianpai-app-theme'

const theme = ref<AppThemeId>('default')
let hydrated = false

const labelById = Object.fromEntries(
  APP_THEME_OPTIONS.map((t) => [t.id, t.name]),
) as Record<AppThemeId, string>

export function isAppThemeId(id: string): id is AppThemeId {
  return APP_THEME_OPTIONS.some((t) => t.id === id)
}

export function getAppThemeSwatch(id: AppThemeId): string {
  return APP_THEME_OPTIONS.find((t) => t.id === id)?.swatch ?? APP_THEME_OPTIONS[0].swatch
}

export function applyAppTheme(id: AppThemeId) {
  theme.value = id
  document.documentElement.setAttribute('data-app-theme', id)
  localStorage.setItem(STORAGE_KEY, id)
}

export function initAppTheme() {
  if (typeof window === 'undefined') return
  if (hydrated) return
  hydrated = true
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && isAppThemeId(saved)) applyAppTheme(saved)
  else applyAppTheme('default')
}

export function useAppTheme() {
  onMounted(initAppTheme)

  function apply(id: AppThemeId) {
    applyAppTheme(id)
  }

  function label() {
    return labelById[theme.value]
  }

  return { theme, apply, label, options: APP_THEME_OPTIONS }
}
