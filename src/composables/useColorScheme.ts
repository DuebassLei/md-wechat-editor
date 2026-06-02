import { computed, onMounted, ref } from 'vue'

export type ColorSchemeId = 'light' | 'dark' | 'system'

export const COLOR_SCHEME_OPTIONS = [
  { id: 'light' as const, name: '浅色' },
  { id: 'dark' as const, name: '深色' },
  { id: 'system' as const, name: '跟随系统' },
]

const STORAGE_KEY = 'moyun-jianpai-color-scheme'

const scheme = ref<ColorSchemeId>('system')
let hydrated = false
let listenerAttached = false
let media: MediaQueryList | null = null

function resolveScheme(): 'light' | 'dark' {
  if (scheme.value === 'system') {
    return media?.matches ? 'dark' : 'light'
  }
  return scheme.value
}

export function applyColorScheme(id?: ColorSchemeId) {
  if (id) scheme.value = id
  document.documentElement.setAttribute('data-color-scheme', resolveScheme())
  localStorage.setItem(STORAGE_KEY, scheme.value)
}

function onSystemChange() {
  if (scheme.value === 'system') applyColorScheme()
}

export function initColorScheme() {
  if (typeof window === 'undefined') return
  if (!media) media = window.matchMedia('(prefers-color-scheme: dark)')
  if (!hydrated) {
    hydrated = true
    const saved = localStorage.getItem(STORAGE_KEY) as ColorSchemeId | null
    if (saved && COLOR_SCHEME_OPTIONS.some((o) => o.id === saved)) scheme.value = saved
  }
  if (!listenerAttached) {
    listenerAttached = true
    media.addEventListener('change', onSystemChange)
  }
  applyColorScheme()
}

export function useColorScheme() {
  onMounted(initColorScheme)

  const resolved = computed(() => resolveScheme())

  return { scheme, resolved, apply: applyColorScheme, options: COLOR_SCHEME_OPTIONS }
}
