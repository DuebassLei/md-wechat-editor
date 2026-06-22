<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AppShell from '@/components/AppShell.vue'
import CardMarkdownEditor from '@/components/card-studio/CardMarkdownEditor.vue'
import CardPreview from '@/components/card-studio/CardPreview.vue'
import CardStudioSettings from '@/components/card-studio/CardStudioSettings.vue'
import { useCardStudioContent } from '@/composables/useCardStudioContent'
import {
  buildZipBlob,
  dataUrlToBytes,
  downloadBlob,
} from '@/engine/card-export/downloadZip'
import { buildCardPages } from '@/engine/card-studio'
import { errText } from '@/engine/card-export/imageExport'
import type { CardPage } from '@/engine/card-studio/types'
import '@/styles/card-footer-fonts.css'

const {
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
  loadTemplate,
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

const BUILD_TIMEOUT_MS = 45_000
let debounceTimer: ReturnType<typeof setTimeout> | undefined
let buildToken = 0
let buildInflight = false

async function runBuild(token: number) {
  if (buildInflight) return

  if (!markdown.value.trim()) {
    pages.value = []
    hadModules.value = false
    building.value = false
    return
  }

  buildInflight = true
  building.value = true
  status.value = ''

  try {
    const result = await Promise.race([
      buildCardPages({
        markdown: markdown.value,
        themeId: themeId.value,
        aspect: aspect.value,
        splitMode: splitMode.value,
        includeCover: includeCover.value,
        showBrand: showBrand.value,
        showPageNumbers: showPageNumbers.value,
        overflowHidden: overflowHidden.value,
        brand: brand.value,
        previewWidth: previewWidth.value,
        richContent: richContent.value,
        purpose: 'preview',
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('预览生成超时，请刷新后重试')), BUILD_TIMEOUT_MS),
      ),
    ])
    if (token !== buildToken) return
    pages.value = result.pages
    hadModules.value = result.hadModules
    if (result.brand && !brand.value.trim()) brand.value = result.brand
    if (selectedIndex.value >= result.pages.length) selectedIndex.value = 0
  } catch (e) {
    if (token !== buildToken) return
    status.value = '预览失败：' + errText(e)
    pages.value = []
  } finally {
    buildInflight = false
    if (token !== buildToken) {
      void runBuild(buildToken)
    } else {
      building.value = false
    }
  }
}

function scheduleRegenerate() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    buildToken += 1
    void runBuild(buildToken)
  }, 300)
}

watch(
  [
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
  ],
  scheduleRegenerate,
)

onMounted(() => {
  ensureSampleIfEmpty()
  scheduleRegenerate()
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
      <div
        v-if="status"
        class="shrink-0 border-b border-paper-line bg-paper-bright px-4 py-1.5 text-xs text-ink-muted"
      >
        {{ status }}
        <button type="button" class="ml-3 text-ink-faint hover:text-ink" @click="onClear">清空</button>
      </div>

      <div class="card-studio-layout grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(360px,1.6fr)_minmax(320px,1.5fr)_300px] xl:grid-cols-[minmax(400px,1.7fr)_minmax(360px,1.6fr)_300px]">
        <CardMarkdownEditor
          v-model="markdown"
          :had-modules="hadModules"
          @template="loadTemplate"
        />
        <CardPreview
          v-model:zoom="zoom"
          :pages="pages"
          :aspect="aspect"
          :building="building"
          :selected-index="selectedIndex"
          :can-export="canExport"
          :busy="busy"
          @select="selectedIndex = $event"
          @export-all="exportAll"
          @export-one="exportOne"
        />
        <CardStudioSettings
          v-model:theme-id="themeId"
          v-model:aspect="aspect"
          v-model:split-mode="splitMode"
          v-model:include-cover="includeCover"
          v-model:show-brand="showBrand"
          v-model:show-page-numbers="showPageNumbers"
          v-model:overflow-hidden="overflowHidden"
          v-model:preview-width="previewWidth"
          v-model:brand="brand"
          v-model:rich-content="richContent"
        />
      </div>
    </div>
  </AppShell>
</template>
