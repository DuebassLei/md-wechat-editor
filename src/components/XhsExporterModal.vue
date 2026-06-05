<script setup lang="ts">
/* eslint-disable vue/no-v-html -- cover HTML is generated from markdown meta in-engine */
import { computed, ref, watch, nextTick } from 'vue'
import { toPng } from 'html-to-image'
import {
  extractXhs,
  buildCover,
  prepareReadingHtml,
  sliceContentToDataUrls,
  resolveAccentColors,
  errText,
  htmlToImageOptions,
  type XhsAspect,
  type XhsAccentMode,
  type XhsCard,
} from '@/engine/xhs'
import { ASPECTS, PIXEL_RATIO, XHS } from '@/engine/xhs/tokens'
import {
  buildZipBlob,
  dataUrlToBytes,
  downloadBlob,
  xhsZipArchiveName,
} from '@/engine/xhs/downloadZip'
import type { ThemeId } from '@/types/theme'

const props = defineProps<{
  visible: boolean
  markdown: string
  themeId: ThemeId
  previewContentWidth: number
}>()

const emit = defineEmits<{
  close: []
}>()

const aspect = ref<XhsAspect>(
  (sessionStorage.getItem('mdwe:xhs-aspect') as XhsAspect) || '3:4',
)
const accentMode = ref<XhsAccentMode>(
  (sessionStorage.getItem('mdwe:xhs-accent') as XhsAccentMode) || 'theme',
)
const cards = ref<XhsCard[]>([])
const building = ref(false)
const slicing = ref(false)
const busy = ref(false)
const status = ref('')

let cardEls: (HTMLElement | null)[] = []
let genId = 0
let debounceTimer: ReturnType<typeof setTimeout> | undefined
let abortController: AbortController | null = null
const exportSlices = ref<string[] | null>(null)

type SliceCtx = {
  contentHtml: string
  brand: string
  aspect: XhsAspect
  previewContentWidth: number
}
let sliceCtx: SliceCtx | null = null

const canDownload = computed(
  () => !busy.value && !building.value && cards.value.length > 0,
)

const statusClass = computed(() => {
  if (!status.value) return 'text-ink-muted'
  if (status.value.includes('失败')) return 'text-red-600 dark:text-red-400'
  if (/已(导出|打包)/.test(status.value)) return 'text-jade-dark'
  return 'text-ink-muted'
})

function setRef(el: Element | null, idx: number) {
  cardEls[idx] = el as HTMLElement | null
}

function isAborted(e: unknown): boolean {
  return e instanceof DOMException && e.name === 'AbortError'
}

function scheduleGenerate() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    void generate()
  }, 300)
}

async function ensureExportSlices(): Promise<string[]> {
  if (exportSlices.value) return exportSlices.value
  if (!sliceCtx) return []
  status.value = '准备高清图…'
  const urls = await sliceContentToDataUrls({
    ...sliceCtx,
    purpose: 'export',
  })
  exportSlices.value = urls
  status.value = ''
  return urls
}

async function generate() {
  const id = ++genId
  abortController?.abort()
  const ac = new AbortController()
  abortController = ac

  building.value = true
  slicing.value = false
  exportSlices.value = null
  sliceCtx = null
  status.value = ''
  cardEls = []

  try {
    const { meta, contentMd } = extractXhs(props.markdown)
    const colors = resolveAccentColors(accentMode.value, props.themeId)
    const cover: XhsCard = {
      id: 'cover',
      label: '首图（大字报）',
      kind: 'html',
      html: buildCover(meta, aspect.value, colors),
    }
    const readingHtml = prepareReadingHtml(contentMd, { skin: 'xhs', colors })

    cards.value = [cover]
    await nextTick()
    if (id !== genId) return
    building.value = false

    if (readingHtml.trim()) {
      sliceCtx = {
        contentHtml: readingHtml,
        brand: meta.brand,
        aspect: aspect.value,
        previewContentWidth: props.previewContentWidth,
      }
      slicing.value = true
      try {
        const previewSlices: string[] = []
        await sliceContentToDataUrls({
          ...sliceCtx,
          purpose: 'preview',
          signal: ac.signal,
          onPage: (src, i) => {
            if (id !== genId) return
            previewSlices[i] = src
            cards.value = [
              cover,
              ...previewSlices
                .filter((s): s is string => Boolean(s))
                .map((s, j) => ({
                  id: `p${j}`,
                  label: `内容 ${j + 1}`,
                  kind: 'image' as const,
                  src: s,
                })),
            ]
          },
        })
      } finally {
        if (id === genId) slicing.value = false
      }
    }
  } catch (e) {
    if (isAborted(e) || id !== genId) return
    status.value = '生成失败：' + errText(e)
    cards.value = []
    building.value = false
    slicing.value = false
  }
}

async function cardDataUrl(idx: number): Promise<string> {
  const card = cards.value[idx]
  if (card.kind === 'image') {
    const urls = await ensureExportSlices()
    const src = urls[idx - 1]
    if (!src) throw new Error('内容图未就绪')
    return src
  }
  const node = cardEls[idx]?.firstElementChild as HTMLElement | undefined
  if (!node) throw new Error('卡片节点丢失')
  const { w, h } = ASPECTS[aspect.value]
  return toPng(node, {
    ...htmlToImageOptions,
    pixelRatio: PIXEL_RATIO,
    width: w,
    height: h,
    backgroundColor: XHS.bg,
  })
}

function fileName(idx: number): string {
  const date = new Date().toISOString().slice(0, 10)
  const tag = idx === 0 ? '00_cover' : String(idx).padStart(2, '0')
  return `xhs_${date}_${tag}.png`
}

function triggerDownload(dataUrl: string, name: string) {
  const a = document.createElement('a')
  a.download = name
  a.href = dataUrl
  a.click()
}

async function downloadOne(idx: number) {
  if (busy.value) return
  busy.value = true
  try {
    triggerDownload(await cardDataUrl(idx), fileName(idx))
  } catch (e) {
    status.value = '导出失败：' + errText(e)
  } finally {
    busy.value = false
  }
}

async function downloadAll() {
  if (!canDownload.value) return
  busy.value = true
  try {
    for (let i = 0; i < cards.value.length; i++) {
      status.value = `导出中 ${i + 1}/${cards.value.length}…`
      triggerDownload(await cardDataUrl(i), fileName(i))
      await new Promise((r) => setTimeout(r, 180))
    }
    status.value = `已导出 ${cards.value.length} 张`
  } catch (e) {
    status.value = '导出失败：' + errText(e)
  } finally {
    busy.value = false
  }
}

async function downloadZip() {
  if (!canDownload.value) return
  busy.value = true
  try {
    const files: Record<string, Uint8Array> = {}
    for (let i = 0; i < cards.value.length; i++) {
      status.value = `打包中 ${i + 1}/${cards.value.length}…`
      files[fileName(i)] = dataUrlToBytes(await cardDataUrl(i))
    }
    downloadBlob(buildZipBlob(files), xhsZipArchiveName())
    status.value = `已打包 ZIP（${cards.value.length} 张）`
  } catch (e) {
    status.value = '打包失败：' + errText(e)
  } finally {
    busy.value = false
  }
}

function setAspect(a: XhsAspect) {
  if (aspect.value === a) return
  aspect.value = a
  sessionStorage.setItem('mdwe:xhs-aspect', a)
  if (props.visible) scheduleGenerate()
}

function setAccentMode(m: XhsAccentMode) {
  if (accentMode.value === m) return
  accentMode.value = m
  sessionStorage.setItem('mdwe:xhs-accent', m)
  if (props.visible) scheduleGenerate()
}

function close() {
  emit('close')
}

watch(
  () => props.visible,
  (v) => {
    if (v) void generate()
  },
)
watch(
  () => [props.markdown, props.themeId, props.previewContentWidth],
  () => {
    if (props.visible) scheduleGenerate()
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="xhs-modal">
      <div
        v-if="visible"
        class="xhs-backdrop fixed inset-0 z-[310] flex items-center justify-center p-3 sm:p-4"
        role="presentation"
        @click.self="close"
      >
        <div
          class="card relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden shadow-card-hover"
          role="dialog"
          aria-modal="true"
          aria-labelledby="xhs-export-title"
          @click.stop
        >
          <header class="shrink-0 border-b border-paper-line px-4 py-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h2 id="xhs-export-title" class="text-sm font-semibold text-ink">
                  导出小红书图
                </h2>
                <p class="mt-0.5 text-xs text-ink-muted">
                  大字报首图 + 自动分页内容图 · 1080px 宽 PNG
                </p>
              </div>
              <button
                type="button"
                class="btn-ghost btn-sm shrink-0 !px-2"
                aria-label="关闭"
                @click="close"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-medium text-ink-muted">比例</span>
                <div class="segmented-control" role="tablist" aria-label="图片比例">
                  <button
                    type="button"
                    class="segmented-control__tab"
                    role="tab"
                    :aria-selected="aspect === '3:4'"
                    @click="setAspect('3:4')"
                  >
                    3:4
                  </button>
                  <button
                    type="button"
                    class="segmented-control__tab"
                    role="tab"
                    :aria-selected="aspect === '1:1'"
                    @click="setAspect('1:1')"
                  >
                    1:1
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-medium text-ink-muted">首图配色</span>
                <div class="segmented-control" role="tablist" aria-label="首图配色">
                  <button
                    type="button"
                    class="segmented-control__tab"
                    role="tab"
                    :aria-selected="accentMode === 'theme'"
                    @click="setAccentMode('theme')"
                  >
                    跟随主题
                  </button>
                  <button
                    type="button"
                    class="segmented-control__tab"
                    role="tab"
                    :aria-selected="accentMode === 'warm'"
                    @click="setAccentMode('warm')"
                  >
                    暖橙
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div class="min-h-0 flex-1 overflow-auto bg-paper-dim/40 p-4">
            <p v-if="building && !cards.length" class="state-empty">生成预览中…</p>
            <div
              v-else-if="cards.length"
              class="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2"
            >
              <article
                v-for="(c, idx) in cards"
                :key="c.id"
                class="flex w-full max-w-[360px] flex-col gap-2"
              >
                <div
                  class="overflow-hidden rounded-[var(--radius-card)] border border-paper-line/90 bg-paper-bright shadow-card"
                >
                  <div
                    v-if="c.kind === 'html'"
                    :ref="(el) => setRef(el as Element | null, idx)"
                    class="xhs-frame"
                    v-html="c.html"
                  />
                  <!-- eslint-disable-next-line vue/html-self-closing -->
                  <img v-else class="xhs-frame xhs-frame--img block w-full" :src="c.src" alt="">
                </div>
                <div class="flex items-center justify-between gap-2 px-0.5">
                  <span class="text-xs font-medium text-ink-soft">{{ c.label }}</span>
                  <button
                    type="button"
                    class="btn-ghost btn-sm !px-2.5"
                    :disabled="busy"
                    @click="downloadOne(idx)"
                  >
                    下载
                  </button>
                </div>
              </article>
            </div>
            <p v-if="slicing" class="mt-4 text-center text-xs text-ink-muted">内容分页中…</p>
            <p v-else-if="!building && !cards.length" class="state-empty">暂无卡片，请检查文稿后重试</p>
          </div>

          <footer class="shrink-0 border-t border-paper-line px-4 py-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <p
                class="min-w-0 flex-1 text-xs"
                :class="statusClass"
                role="status"
                aria-live="polite"
              >
                {{ status || (building && !cards.length ? '生成中…' : cards.length ? `共 ${cards.length} 张` : '') }}
              </p>
              <div class="flex shrink-0 flex-wrap justify-end gap-2">
                <button
                  type="button"
                  class="btn-secondary btn-sm"
                  :disabled="!canDownload"
                  @click="downloadAll"
                >
                  逐张下载
                </button>
                <button
                  type="button"
                  class="btn-primary btn-sm"
                  :disabled="!canDownload"
                  @click="downloadZip"
                >
                  下载 ZIP（{{ cards.length }}）
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.xhs-backdrop {
  background: rgb(15 23 42 / 0.45);
  backdrop-filter: blur(2px);
}

.xhs-frame {
  width: 360px;
  max-width: 100%;
  line-height: 0;
}

.xhs-frame--img {
  height: auto;
}

.xhs-modal-enter-active,
.xhs-modal-leave-active {
  transition: opacity 0.18s ease;
}

.xhs-modal-enter-from,
.xhs-modal-leave-to {
  opacity: 0;
}

.xhs-modal-enter-active .card,
.xhs-modal-leave-active .card {
  transition: transform 0.18s ease;
}

.xhs-modal-enter-from .card,
.xhs-modal-leave-to .card {
  transform: scale(0.98) translateY(4px);
}
</style>
