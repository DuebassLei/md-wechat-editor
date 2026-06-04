import { computed, ref, watch } from 'vue'
import type { FontId } from '@/engine/handwriting/fontPresets'
import type { PaperId } from '@/engine/handwriting/paperPresets'
import { HANDWRITING_SAMPLE_TEXT } from '@/engine/handwriting/sampleText'
import {
  DEFAULT_TYPOGRAPHY,
  type HandwritingTypography,
} from '@/engine/handwriting/typographyDefaults'

export interface HandwritingContent {
  text: string
  paperId: PaperId
  paperStyleId: string
  fontId: FontId
  typography: HandwritingTypography
}

const STORAGE_KEY = 'handwriting-studio-content'

const DEFAULT_CONTENT: HandwritingContent = {
  text: HANDWRITING_SAMPLE_TEXT,
  paperId: 'ruled-white',
  paperStyleId: 'default',
  fontId: 'lxgw-wenkai',
  typography: { ...DEFAULT_TYPOGRAPHY },
}

function loadFromStorage(): HandwritingContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<HandwritingContent>
      return {
        ...DEFAULT_CONTENT,
        ...parsed,
        typography: { ...DEFAULT_TYPOGRAPHY, ...parsed.typography },
      }
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_CONTENT }
}

function saveToStorage(content: HandwritingContent): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
  } catch {
    // ignore
  }
}

const content = ref<HandwritingContent>(loadFromStorage())
watch(content, (val) => saveToStorage(val), { deep: true })

export function useHandwritingContent() {
  const text = computed({
    get: () => content.value.text,
    set: (v: string) => { content.value.text = v },
  })

  const paperId = computed({
    get: () => content.value.paperId,
    set: (v: PaperId) => { content.value.paperId = v },
  })

  const paperStyleId = computed({
    get: () => content.value.paperStyleId,
    set: (v: string) => { content.value.paperStyleId = v },
  })

  const fontId = computed({
    get: () => content.value.fontId,
    set: (v: FontId) => { content.value.fontId = v },
  })

  function loadSample() {
    content.value.text = HANDWRITING_SAMPLE_TEXT
  }

  function clearAll() {
    content.value = { ...DEFAULT_CONTENT }
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  function selectPaper(id: PaperId, styleId: string) {
    content.value.paperId = id
    content.value.paperStyleId = styleId
  }

  const typography = computed({
    get: () => content.value.typography,
    set: (v: HandwritingTypography) => { content.value.typography = v },
  })

  function patchTypography(patch: Partial<HandwritingTypography>) {
    content.value.typography = { ...content.value.typography, ...patch }
  }

  function resetTypography() {
    content.value.typography = { ...DEFAULT_TYPOGRAPHY }
  }

  return {
    text,
    paperId,
    paperStyleId,
    fontId,
    typography,
    loadSample,
    clearAll,
    selectPaper,
    patchTypography,
    resetTypography,
  }
}
