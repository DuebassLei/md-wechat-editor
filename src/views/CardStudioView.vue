<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AppShell from '@/components/AppShell.vue'
import CardMarkdownEditor from '@/components/card-studio/CardMarkdownEditor.vue'
import CardPreview from '@/components/card-studio/CardPreview.vue'
import CardStudioToolbar from '@/components/card-studio/CardStudioToolbar.vue'
import CardThemePicker from '@/components/card-studio/CardThemePicker.vue'
import { useCardStudioContent } from '@/composables/useCardStudioContent'
import {
  buildZipBlob,
  dataUrlToBytes,
  downloadBlob,
} from '@/engine/card-export/downloadZip'
import { buildCardPages } from '@/engine/card-studio'
import { errText } from '@/engine/card-export/imageExport'
import type { CardPage } from '@/engine/card-studio/types'

const {
  markdown,
  themeId,
  aspect,
  singleCardMode,
  includeCover,
  brand,
  loadSample,
  clearAll,
  ensureSampleIfEmpty,
} = useCardStudioContent()

const pages = ref<CardPage[]>([])
const building = ref(false)
const hadModules = ref(false)
const busy = ref(false)
const status = ref('')
const zoom = ref(0.8)
const selectedIndex = ref(0)

const canExport = computed(() => !busy.value && !building.value && pages.value.length > 0)

let debounceTimer: ReturnType<typeof setTimeout> | undefined

async function regenerate() {
  if (!markdown.value.trim()) {
    pages.value = []
    hadModules.value = false
    return
  }
  building.value = true
  status.value = ''
  try {
    const result = await buildCardPages({
      markdown: markdown.value,
      themeId: themeId.value,
      aspect: aspect.value,
      singleCardMode: singleCardMode.value,
      includeCover: includeCover.value,
      brand: brand.value,
      previewWidth: 360,
    })
    pages.value = result.pages
    hadModules.value = result.hadModules
    if (result.brand && !brand.value.trim()) brand.value = result.brand
    if (selectedIndex.value >= result.pages.length) selectedIndex.value = 0
  } catch (e) {
    status.value = '预览失败：' + errText(e)
    pages.value = []
  } finally {
    building.value = false
  }
}

function scheduleRegenerate() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { void regenerate() }, 300)
}

watch([markdown, themeId, aspect, singleCardMode, includeCover, brand], scheduleRegenerate, { deep: true })

onMounted(() => {
  ensureSampleIfEmpty()
  void regenerate()
})

function cardFileName(page: CardPage): string {
  const date = new Date().toISOString().slice(0, 10)
  const tag = page.kind === 'cover' ? '00_cover' : String(page.globalIndex + 1).padStart(2, '0')
  return `card_${date}_${tag}.png`
}

function zipArchiveName(): string {
  return `cards_${new Date().toISOString().slice(0, 10)}.zip`
}

function triggerDownload(dataUrl: string, name: string) {
  const a = document.createElement('a')
  a.download = name
  a.href = dataUrl
  a.click()
}

async function exportOne() {
  const page = pages.value[selectedIndex.value]
  if (!page?.dataUrl || busy.value) return
  busy.value = true
  try {
    triggerDownload(page.dataUrl, cardFileName(page))
    status.value = '已导出单张 PNG'
  } finally {
    busy.value = false
  }
}

async function exportAll() {
  if (!canExport.value) return
  busy.value = true
  try {
    const files: Record<string, Uint8Array> = {}
    pages.value.forEach((page, i) => {
      if (page.dataUrl) {
        const name =
          page.kind === 'cover'
            ? '00_cover.png'
            : `${String(i + 1).padStart(2, '0')}.png`
        files[name] = dataUrlToBytes(page.dataUrl)
      }
    })
    downloadBlob(buildZipBlob(files), zipArchiveName())
    status.value = `已打包 ${pages.value.length} 张`
  } catch (e) {
    status.value = '导出失败：' + errText(e)
  } finally {
    busy.value = false
  }
}

function onClear() {
  if (confirm('确定清空所有内容与设置？')) {
    clearAll()
    pages.value = []
    hadModules.value = false
    status.value = ''
  }
}
</script>

<template>
  <AppShell studio>
    <div class="flex min-h-0 flex-1 flex-col">
      <CardStudioToolbar
        v-model:aspect="aspect"
        v-model:single-card-mode="singleCardMode"
        v-model:include-cover="includeCover"
        v-model:zoom="zoom"
        :can-export="canExport"
        :busy="busy"
        :page-count="pages.length"
        :status="status"
        @export-all="exportAll"
        @export-one="exportOne"
        @clear="onClear"
      />
      <div class="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)_minmax(300px,360px)]">
        <CardMarkdownEditor
          v-model="markdown"
          :had-modules="hadModules"
          @sample="loadSample"
        />
        <CardPreview
          :pages="pages"
          :aspect="aspect"
          :zoom="zoom"
          :building="building"
          :selected-index="selectedIndex"
          @select="selectedIndex = $event"
        />
        <CardThemePicker v-model="themeId" class="min-h-0 overflow-hidden border-l border-paper-line" />
      </div>
    </div>
  </AppShell>
</template>
