import { ref, watch } from 'vue'
import type { ImageHostProviderId, ImageHostSettings } from '@/engine/image-pipeline/types'

const STORAGE_KEY = 'mdwe:image-host'

export const DEFAULT_IMAGE_HOST_SETTINGS: ImageHostSettings = {
  defaultProviderId: 'smms',
  smms: { token: '' },
  imgbb: { apiKey: '' },
  custom: {
    name: '自定义',
    uploadUrl: '',
    fileField: 'file',
    tokenHeader: '',
    tokenValue: '',
    urlJsonPath: 'data.url',
  },
  github: {
    repo: '',
    token: '',
    branch: 'main',
  },
}

function loadSettings(): ImageHostSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_IMAGE_HOST_SETTINGS }
    const parsed = JSON.parse(raw) as Partial<ImageHostSettings>
    return {
      ...DEFAULT_IMAGE_HOST_SETTINGS,
      ...parsed,
      smms: { ...DEFAULT_IMAGE_HOST_SETTINGS.smms, ...parsed.smms },
      imgbb: { ...DEFAULT_IMAGE_HOST_SETTINGS.imgbb, ...parsed.imgbb },
      custom: { ...DEFAULT_IMAGE_HOST_SETTINGS.custom, ...parsed.custom },
      github: { ...DEFAULT_IMAGE_HOST_SETTINGS.github, ...parsed.github },
    }
  } catch {
    return { ...DEFAULT_IMAGE_HOST_SETTINGS }
  }
}

const settings = ref<ImageHostSettings>(loadSettings())

watch(
  settings,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    } catch {
      // ignore quota
    }
  },
  { deep: true },
)

export function useImageHostSettings() {
  function setProvider(id: ImageHostProviderId) {
    settings.value.defaultProviderId = id
  }

  return {
    settings,
    setProvider,
  }
}
