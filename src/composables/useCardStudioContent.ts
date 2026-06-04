import { computed, ref, watch } from 'vue'
import type { CardAspect } from '@/engine/card-export/types'
import { CARD_STUDIO_SAMPLE } from '@/engine/card-studio/sampleMarkdown'
import type { CardThemeId } from '@/engine/card-studio/cardThemes/types'

export interface CardStudioContent {
  markdown: string
  themeId: CardThemeId
  aspect: CardAspect
  singleCardMode: boolean
  includeCover: boolean
  brand: string
}

const STORAGE_KEY = 'mdwe:card-studio'
const ASPECT_KEY = 'mdwe:card-aspect'
const SINGLE_KEY = 'mdwe:card-single'
const COVER_KEY = 'mdwe:card-cover'

function loadAspect(): CardAspect {
  const raw = sessionStorage.getItem(ASPECT_KEY)
  return raw === '1:1' ? '1:1' : '3:4'
}

function loadSingle(): boolean {
  return sessionStorage.getItem(SINGLE_KEY) === '1'
}

function loadCover(): boolean {
  const raw = sessionStorage.getItem(COVER_KEY)
  return raw !== '0'
}

const DEFAULT_CONTENT: CardStudioContent = {
  markdown: '',
  themeId: 'minimal-light',
  aspect: loadAspect(),
  singleCardMode: loadSingle(),
  includeCover: loadCover(),
  brand: '',
}

function loadFromStorage(): CardStudioContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CardStudioContent>
      return {
        ...DEFAULT_CONTENT,
        ...parsed,
        aspect: loadAspect(),
        singleCardMode: loadSingle(),
        includeCover: loadCover(),
      }
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_CONTENT }
}

function saveToStorage(content: CardStudioContent): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        markdown: content.markdown,
        themeId: content.themeId,
        brand: content.brand,
      }),
    )
  } catch {
    // ignore
  }
}

const content = ref<CardStudioContent>(loadFromStorage())

watch(
  content,
  (val) => {
    saveToStorage(val)
    sessionStorage.setItem(ASPECT_KEY, val.aspect)
    sessionStorage.setItem(SINGLE_KEY, val.singleCardMode ? '1' : '0')
    sessionStorage.setItem(COVER_KEY, val.includeCover ? '1' : '0')
  },
  { deep: true },
)

export function useCardStudioContent() {
  const markdown = computed({
    get: () => content.value.markdown,
    set: (v: string) => { content.value.markdown = v },
  })

  const themeId = computed({
    get: () => content.value.themeId,
    set: (v: CardThemeId) => { content.value.themeId = v },
  })

  const aspect = computed({
    get: () => content.value.aspect,
    set: (v: CardAspect) => { content.value.aspect = v },
  })

  const singleCardMode = computed({
    get: () => content.value.singleCardMode,
    set: (v: boolean) => { content.value.singleCardMode = v },
  })

  const includeCover = computed({
    get: () => content.value.includeCover,
    set: (v: boolean) => { content.value.includeCover = v },
  })

  const brand = computed({
    get: () => content.value.brand,
    set: (v: string) => { content.value.brand = v },
  })

  function loadSample() {
    content.value.markdown = CARD_STUDIO_SAMPLE
  }

  function clearAll() {
    content.value = {
      ...DEFAULT_CONTENT,
      markdown: '',
      aspect: loadAspect(),
      singleCardMode: loadSingle(),
      includeCover: loadCover(),
    }
  }

  function ensureSampleIfEmpty() {
    if (!content.value.markdown.trim()) {
      loadSample()
    }
  }

  return {
    markdown,
    themeId,
    aspect,
    singleCardMode,
    includeCover,
    brand,
    loadSample,
    clearAll,
    ensureSampleIfEmpty,
  }
}
