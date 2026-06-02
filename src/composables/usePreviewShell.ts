import { ref, watch } from 'vue'

const STORAGE_KEY = 'moyun-jianpai-preview-shell'

function loadPreference(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === '0') return false
    if (raw === '1') return true
  } catch {
    /* ignore */
  }
  return true
}

/** 预览是否使用手机套壳（否则为平铺预览） */
export function usePreviewShell() {
  const deviceShell = ref(loadPreference())

  watch(deviceShell, (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
    } catch {
      /* ignore */
    }
  })

  return { deviceShell }
}
