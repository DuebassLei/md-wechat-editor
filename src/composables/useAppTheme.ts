import { onMounted, ref } from 'vue'

export type AppThemeId = 'default' | 'eye-care' | 'violet'

const STORAGE_KEY = 'moyun-jianpai-app-theme'
const ORDER: AppThemeId[] = ['default', 'eye-care', 'violet']

const LABELS: Record<AppThemeId, string> = {
  default: '靛蓝',
  'eye-care': '护眼',
  violet: '紫韵',
}

export function useAppTheme() {
  const theme = ref<AppThemeId>('default')

  function apply(id: AppThemeId) {
    theme.value = id
    document.documentElement.setAttribute('data-app-theme', id === 'default' ? 'default' : id)
    localStorage.setItem(STORAGE_KEY, id)
  }

  function cycle() {
    const idx = ORDER.indexOf(theme.value)
    apply(ORDER[(idx + 1) % ORDER.length])
  }

  onMounted(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as AppThemeId | null
    if (saved && ORDER.includes(saved)) apply(saved)
    else apply('default')
  })

  return { theme, cycle, label: () => LABELS[theme.value] }
}
