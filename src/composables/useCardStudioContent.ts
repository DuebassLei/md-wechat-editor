import { computed, ref, watch } from 'vue'
import type { CardAspect } from '@/engine/card-export/types'
import type { CardSplitMode } from '@/engine/card-studio/constants'
import {
  CARD_STUDIO_DEFAULT_TEMPLATE_ID,
  getCardStudioTemplate,
  type CardStudioTemplateId,
} from '@/engine/card-studio/cardStudioTemplates'
import { CARD_THEME_IDS } from '@/engine/card-studio/cardThemes/registry'
import type { CardThemeId } from '@/engine/card-studio/cardThemes/types'

export interface CardStudioContent {
  markdown: string
  themeId: CardThemeId
  aspect: CardAspect
  splitMode: CardSplitMode
  includeCover: boolean
  showBrand: boolean
  showPageNumbers: boolean
  overflowHidden: boolean
  previewWidth: number
  brand: string
  richContent: boolean
}

const STORAGE_KEY = 'mdwe:card-studio'
const ASPECT_KEY = 'mdwe:card-aspect'
const SPLIT_KEY = 'mdwe:card-split'
const COVER_KEY = 'mdwe:card-cover'
const PAGE_NUM_KEY = 'mdwe:card-page-num'
const SHOW_BRAND_KEY = 'mdwe:card-show-brand'
const OVERFLOW_KEY = 'mdwe:card-overflow'
const WIDTH_KEY = 'mdwe:card-preview-width'
const RICH_KEY = 'mdwe:card-rich'

function loadAspect(): CardAspect {
  const raw = sessionStorage.getItem(ASPECT_KEY)
  return raw === '1:1' ? '1:1' : '3:4'
}

function loadSplitMode(): CardSplitMode {
  const raw = sessionStorage.getItem(SPLIT_KEY)
  if (raw === 'noSplit' || raw === 'autoSplit' || raw === 'hrSplit') return raw
  // 兼容旧版单卡开关
  return sessionStorage.getItem('mdwe:card-single') === '1' ? 'noSplit' : 'autoSplit'
}

function loadCover(): boolean {
  return sessionStorage.getItem(COVER_KEY) !== '0'
}

function loadShowPageNumbers(): boolean {
  return sessionStorage.getItem(PAGE_NUM_KEY) !== '0'
}

function loadShowBrand(): boolean {
  return sessionStorage.getItem(SHOW_BRAND_KEY) !== '0'
}

function loadOverflowHidden(): boolean {
  return sessionStorage.getItem(OVERFLOW_KEY) === '1'
}

function loadPreviewWidth(): number {
  const raw = Number(sessionStorage.getItem(WIDTH_KEY))
  return raw > 200 && raw < 600 ? raw : 360
}

function loadRichContent(): boolean {
  return sessionStorage.getItem(RICH_KEY) === '1'
}

const DEFAULT_CONTENT: CardStudioContent = {
  markdown: '',
  themeId: 'minimal-light',
  aspect: loadAspect(),
  splitMode: loadSplitMode(),
  includeCover: loadCover(),
  showBrand: loadShowBrand(),
  showPageNumbers: loadShowPageNumbers(),
  overflowHidden: loadOverflowHidden(),
  previewWidth: loadPreviewWidth(),
  brand: '',
  richContent: loadRichContent(),
}

function loadFromStorage(): CardStudioContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CardStudioContent>
      const themeId =
        parsed.themeId && CARD_THEME_IDS.includes(parsed.themeId)
          ? parsed.themeId
          : DEFAULT_CONTENT.themeId
      return {
        ...DEFAULT_CONTENT,
        ...parsed,
        themeId,
        aspect: loadAspect(),
        splitMode: loadSplitMode(),
        includeCover: loadCover(),
        showBrand: loadShowBrand(),
        showPageNumbers: loadShowPageNumbers(),
        overflowHidden: loadOverflowHidden(),
        previewWidth: loadPreviewWidth(),
        richContent: loadRichContent(),
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
    sessionStorage.setItem(SPLIT_KEY, val.splitMode)
    sessionStorage.setItem(COVER_KEY, val.includeCover ? '1' : '0')
    sessionStorage.setItem(SHOW_BRAND_KEY, val.showBrand ? '1' : '0')
    sessionStorage.setItem(PAGE_NUM_KEY, val.showPageNumbers ? '1' : '0')
    sessionStorage.setItem(OVERFLOW_KEY, val.overflowHidden ? '1' : '0')
    sessionStorage.setItem(WIDTH_KEY, String(val.previewWidth))
    sessionStorage.setItem(RICH_KEY, val.richContent ? '1' : '0')
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

  const splitMode = computed({
    get: () => content.value.splitMode,
    set: (v: CardSplitMode) => { content.value.splitMode = v },
  })

  const includeCover = computed({
    get: () => content.value.includeCover,
    set: (v: boolean) => { content.value.includeCover = v },
  })

  const showBrand = computed({
    get: () => content.value.showBrand,
    set: (v: boolean) => { content.value.showBrand = v },
  })

  const showPageNumbers = computed({
    get: () => content.value.showPageNumbers,
    set: (v: boolean) => { content.value.showPageNumbers = v },
  })

  const overflowHidden = computed({
    get: () => content.value.overflowHidden,
    set: (v: boolean) => { content.value.overflowHidden = v },
  })

  const previewWidth = computed({
    get: () => content.value.previewWidth,
    set: (v: number) => { content.value.previewWidth = v },
  })

  const brand = computed({
    get: () => content.value.brand,
    set: (v: string) => { content.value.brand = v },
  })

  const richContent = computed({
    get: () => content.value.richContent,
    set: (v: boolean) => { content.value.richContent = v },
  })

  function loadTemplate(id: CardStudioTemplateId = CARD_STUDIO_DEFAULT_TEMPLATE_ID) {
    const template = getCardStudioTemplate(id)
    if (!template) return
    content.value.markdown = template.markdown
    content.value.themeId = template.themeId
    content.value.splitMode = template.splitMode
    content.value.includeCover = template.includeCover
    if (template.richContent !== undefined) {
      content.value.richContent = template.richContent
    }
  }

  function loadSample() {
    loadTemplate(CARD_STUDIO_DEFAULT_TEMPLATE_ID)
  }

  function clearAll() {
    content.value = {
      ...DEFAULT_CONTENT,
      markdown: '',
      aspect: loadAspect(),
      splitMode: loadSplitMode(),
      includeCover: loadCover(),
      showBrand: loadShowBrand(),
      showPageNumbers: loadShowPageNumbers(),
      overflowHidden: loadOverflowHidden(),
      previewWidth: loadPreviewWidth(),
      richContent: loadRichContent(),
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
    splitMode,
    includeCover,
    showBrand,
    showPageNumbers,
    overflowHidden,
    previewWidth,
    brand,
    richContent,
    loadSample,
    loadTemplate,
    clearAll,
    ensureSampleIfEmpty,
  }
}
