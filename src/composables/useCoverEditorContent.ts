import { computed, ref, watch } from 'vue'
import {
  DEFAULT_COVER_STATE,
  getAspectDefaults,
} from '@/engine/cover-editor/constants'
import { coverTemplateStyleFields } from '@/engine/cover-editor/coverTemplates'
import type { CoverAspect, CoverEditorState, CoverLayout, CoverLayoutPreset, CoverTemplate } from '@/engine/cover-editor/types'

const STORAGE_KEY = 'mdwe:cover-editor'

function loadFromStorage(): CoverEditorState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CoverEditorState>
      return { ...DEFAULT_COVER_STATE, ...parsed }
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_COVER_STATE }
}

function saveToStorage(state: CoverEditorState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

const state = ref<CoverEditorState>(loadFromStorage())
const activeTemplateId = ref('')

watch(state, (val) => saveToStorage(val), { deep: true })

function clearActiveTemplate() {
  activeTemplateId.value = ''
  if (state.value.layoutPreset !== 'default') {
    state.value.layoutPreset = 'default'
  }
}

export function useCoverEditorContent() {
  const title = computed({
    get: () => state.value.title,
    set: (v: string) => { state.value.title = v },
  })

  const keywords = computed({
    get: () => state.value.keywords,
    set: (v: string) => { state.value.keywords = v },
  })

  const fontFamily = computed({
    get: () => state.value.fontFamily,
    set: (v: string) => {
      clearActiveTemplate()
      state.value.fontFamily = v
    },
  })

  const titleFontSize = computed({
    get: () => state.value.titleFontSize,
    set: (v: number) => { state.value.titleFontSize = v },
  })

  const keywordsFontSize = computed({
    get: () => state.value.keywordsFontSize,
    set: (v: number) => { state.value.keywordsFontSize = v },
  })

  const titleColor = computed({
    get: () => state.value.titleColor,
    set: (v: string) => {
      clearActiveTemplate()
      state.value.titleColor = v
    },
  })

  const keywordsColor = computed({
    get: () => state.value.keywordsColor,
    set: (v: string) => {
      clearActiveTemplate()
      state.value.keywordsColor = v
    },
  })

  const layout = computed({
    get: () => state.value.layout,
    set: (v: CoverLayout) => {
      clearActiveTemplate()
      state.value.layout = v
    },
  })

  const layoutPreset = computed({
    get: () => state.value.layoutPreset,
    set: (v: CoverLayoutPreset) => {
      clearActiveTemplate()
      state.value.layoutPreset = v
    },
  })

  const aspect = computed({
    get: () => state.value.aspect,
    set: (v: CoverAspect) => {
      if (v === state.value.aspect) return
      clearActiveTemplate()
      const defaults = getAspectDefaults(v)
      state.value = {
        ...state.value,
        aspect: v,
        titleFontSize: defaults.titleFontSize,
        keywordsFontSize: defaults.keywordsFontSize,
      }
    },
  })

  const bgPresetId = computed({
    get: () => state.value.bgPresetId,
    set: (v: string) => {
      clearActiveTemplate()
      state.value.bgPresetId = v
    },
  })

  const customBgImage = computed({
    get: () => state.value.customBgImage,
    set: (v: string) => { state.value.customBgImage = v },
  })

  const overlayOpacity = computed({
    get: () => state.value.overlayOpacity,
    set: (v: number) => {
      clearActiveTemplate()
      state.value.overlayOpacity = v
    },
  })

  function setCustomBgFromFile(file: File) {
    clearActiveTemplate()
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        state.value.customBgImage = result
      }
    }
    reader.readAsDataURL(file)
  }

  function clearCustomBg() {
    state.value.customBgImage = ''
  }

  function resetAll() {
    state.value = { ...DEFAULT_COVER_STATE }
    activeTemplateId.value = ''
  }

  function applyTemplate(template: CoverTemplate) {
    activeTemplateId.value = template.id
    const aspectPatch = template.aspect
      ? { aspect: template.aspect, ...getAspectDefaults(template.aspect) }
      : {}
    const textPatch = template.defaultTitle || template.defaultKeywords
      ? {
          title: template.defaultTitle ?? state.value.title,
          keywords: template.defaultKeywords ?? state.value.keywords,
        }
      : {}
    state.value = {
      ...state.value,
      ...coverTemplateStyleFields(template),
      ...aspectPatch,
      ...textPatch,
      customBgImage: '',
    }
  }

  return {
    title,
    keywords,
    fontFamily,
    titleFontSize,
    keywordsFontSize,
    titleColor,
    keywordsColor,
    layout,
    layoutPreset,
    aspect,
    bgPresetId,
    customBgImage,
    overlayOpacity,
    activeTemplateId,
    setCustomBgFromFile,
    clearCustomBg,
    resetAll,
    applyTemplate,
    clearActiveTemplate,
  }
}
