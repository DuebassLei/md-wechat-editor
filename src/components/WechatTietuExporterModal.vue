<script setup lang="ts">
/* eslint-disable vue/no-v-html -- cover HTML is generated from markdown meta in-engine */
import { computed, ref, watch, nextTick } from 'vue'
import { toPng } from 'html-to-image'
import {
  extractWechatTietu,
  buildCoverForSkin,
  prepareReadingHtml,
  sliceWechatTietuContent,
  errText,
  htmlToImageOptions,
  compressPngDataUrlForUpload,
  formatByteSize,
  dataUrlByteSize,
  buildZipBlob,
  dataUrlToBytes,
  downloadBlob,
  wechatTietuZipArchiveName,
  wechatTietuFileName,
  ASPECTS,
  PIXEL_RATIO,
  WECHAT_TIETU_ASPECT,
  type ExportCard,
  type ExportQualityMode,
  type WechatTietuSkin,
  parseStoredFrame,
  resolveFrameAccent,
  type CardFrameId,
} from '@/engine/wechat-tietu'
import { XHS } from '@/engine/xhs/tokens'
import { resolveAccentColors } from '@/engine/xhs/resolveAccent'
import CardFramePicker from '@/components/CardFramePicker.vue'
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

const skin = ref<WechatTietuSkin>(
  (sessionStorage.getItem('mdwe:wechat-tietu-skin') as WechatTietuSkin) || 'wechat',
)
const quality = ref<ExportQualityMode>(
  (sessionStorage.getItem('mdwe:wechat-tietu-quality') as ExportQualityMode) || 'hd',
)
const cardFrame = ref<CardFrameId>(
  parseStoredFrame(sessionStorage.getItem('mdwe:wechat-tietu-frame'), 'soft'),
)

const frameAccent = computed(() => resolveFrameAccent(skin.value, props.themeId))
const cards = ref<ExportCard[]>([])
const building = ref(false)
const busy = ref(false)
const status = ref('')

let cardEls: (HTMLElement | null)[] = []

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

function coverBg(): string {
  return skin.value === 'wechat' ? '#ffffff' : XHS.bg
}

async function refreshUploadSizes() {
  if (quality.value !== 'upload') {
    cards.value = cards.value.map((c) => ({ ...c, uploadBytes: undefined }))
    return
  }
  const next = [...cards.value]
  for (let i = 0; i < next.length; i++) {
    const c = next[i]
    try {
      const png = await cardPngDataUrl(i)
      const r = await compressPngDataUrlForUpload(png)
      next[i] = { ...c, uploadBytes: r.bytes }
    } catch {
      next[i] = { ...c, uploadBytes: null }
    }
  }
  cards.value = next
}

async function generate() {
  building.value = true
  status.value = ''
  try {
    const { meta, contentMd } = extractWechatTietu(props.markdown)
    const cover: ExportCard = {
      id: 'cover',
      label: '首图',
      kind: 'html',
      html: buildCoverForSkin(meta, skin.value, props.themeId, cardFrame.value),
    }
    const readingHtml = prepareReadingHtml(contentMd, {
      skin: skin.value,
      colors: skin.value === 'xhs' ? resolveAccentColors('theme', props.themeId) : undefined,
    })
    const slices = readingHtml.trim()
      ? await sliceWechatTietuContent({
          contentHtml: readingHtml,
          brand: meta.brand,
          skin: skin.value,
          previewContentWidth: props.previewContentWidth,
          frameId: cardFrame.value,
          themeId: props.themeId,
        })
      : []

    cardEls = []
    cards.value = [
      cover,
      ...slices.map((src, i) => ({
        id: `p${i}`,
        label: `内容 ${i + 1}`,
        kind: 'image' as const,
        src,
      })),
    ]
    await nextTick()
    await refreshUploadSizes()
  } catch (e) {
    status.value = '生成失败：' + errText(e)
  } finally {
    building.value = false
  }
}

async function cardPngDataUrl(idx: number): Promise<string> {
  const card = cards.value[idx]
  if (card.kind === 'image' && card.src) return card.src
  const node = cardEls[idx]?.firstElementChild as HTMLElement | undefined
  if (!node) throw new Error('卡片节点丢失')
  const { w, h } = ASPECTS[WECHAT_TIETU_ASPECT]
  return toPng(node, {
    ...htmlToImageOptions,
    pixelRatio: PIXEL_RATIO,
    width: w,
    height: h,
    backgroundColor: coverBg(),
  })
}

async function cardExportDataUrl(idx: number): Promise<string> {
  const png = await cardPngDataUrl(idx)
  if (quality.value === 'hd') return png
  const r = await compressPngDataUrlForUpload(png)
  if (!r.ok) throw new Error(`第 ${idx + 1} 张无法压到 1MB 以内`)
  return r.dataUrl
}

function sizeLabel(card: ExportCard): string {
  if (quality.value === 'hd') {
    if (card.kind === 'image' && card.src) return formatByteSize(dataUrlByteSize(card.src))
    return ''
  }
  if (card.uploadBytes == null) return '超限 ⚠'
  const ok = card.uploadBytes <= 1024 * 1024 - 1
  return `${formatByteSize(card.uploadBytes)}${ok ? ' ✓' : ' ⚠'}`
}

function canDownloadCard(idx: number): boolean {
  if (quality.value === 'hd') return true
  const b = cards.value[idx]?.uploadBytes
  return b != null && b <= 1024 * 1024 - 1
}

function triggerDownload(dataUrl: string, name: string) {
  const a = document.createElement('a')
  a.download = name
  a.href = dataUrl
  a.click()
}

async function downloadOne(idx: number) {
  if (busy.value || !canDownloadCard(idx)) return
  busy.value = true
  try {
    triggerDownload(await cardExportDataUrl(idx), wechatTietuFileName(idx, quality.value))
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
      if (!canDownloadCard(i)) continue
      status.value = `导出中 ${i + 1}/${cards.value.length}…`
      triggerDownload(await cardExportDataUrl(i), wechatTietuFileName(i, quality.value))
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
      if (!canDownloadCard(i)) {
        status.value = `第 ${i + 1} 张超限，已跳过打包`
        continue
      }
      status.value = `打包中 ${i + 1}/${cards.value.length}…`
      files[wechatTietuFileName(i, quality.value)] = dataUrlToBytes(await cardExportDataUrl(i))
    }
    if (!Object.keys(files).length) {
      status.value = '没有可打包的图片（存在超限）'
      return
    }
    downloadBlob(buildZipBlob(files), wechatTietuZipArchiveName())
    status.value = `已打包 ZIP（${Object.keys(files).length} 张）`
  } catch (e) {
    status.value = '打包失败：' + errText(e)
  } finally {
    busy.value = false
  }
}

function setSkin(s: WechatTietuSkin) {
  if (skin.value === s) return
  skin.value = s
  sessionStorage.setItem('mdwe:wechat-tietu-skin', s)
  if (props.visible) void generate()
}

function onFrameChange() {
  if (props.visible) void generate()
}

function setQuality(q: ExportQualityMode) {
  if (quality.value === q) return
  quality.value = q
  sessionStorage.setItem('mdwe:wechat-tietu-quality', q)
  if (props.visible) void refreshUploadSizes()
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
  () => [props.markdown, props.themeId, props.previewContentWidth, skin.value, cardFrame.value],
  () => {
    if (props.visible) void generate()
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="wt-modal">
      <div
        v-if="visible"
        class="wt-backdrop fixed inset-0 z-[310] flex items-center justify-center p-3 sm:p-4"
        role="presentation"
        @click.self="close"
      >
        <div
          class="card relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden shadow-card-hover"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wt-export-title"
          @click.stop
        >
          <header class="shrink-0 border-b border-paper-line px-4 py-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h2 id="wt-export-title" class="text-sm font-semibold text-ink">
                  导出微信贴图
                </h2>
                <p class="mt-0.5 text-xs text-ink-muted">
                  图片消息 3:4 · 1080×1440 · 首图 + 自动分页
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
                <span class="text-[11px] font-medium text-ink-muted">皮肤</span>
                <div class="segmented-control" role="tablist" aria-label="视觉皮肤">
                  <button
                    type="button"
                    class="segmented-control__tab"
                    role="tab"
                    :aria-selected="skin === 'wechat'"
                    @click="setSkin('wechat')"
                  >
                    微信风
                  </button>
                  <button
                    type="button"
                    class="segmented-control__tab"
                    role="tab"
                    :aria-selected="skin === 'xhs'"
                    @click="setSkin('xhs')"
                  >
                    小红书风
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-medium text-ink-muted">画质</span>
                <div class="segmented-control" role="tablist" aria-label="导出画质">
                  <button
                    type="button"
                    class="segmented-control__tab"
                    role="tab"
                    :aria-selected="quality === 'hd'"
                    @click="setQuality('hd')"
                  >
                    高清 PNG
                  </button>
                  <button
                    type="button"
                    class="segmented-control__tab"
                    role="tab"
                    :aria-selected="quality === 'upload'"
                    @click="setQuality('upload')"
                  >
                    上传 ≤1MB
                  </button>
                </div>
              </div>
            </div>

            <CardFramePicker
              v-model="cardFrame"
              class="mt-3"
              label="卡片样式"
              :accent="frameAccent"
              storage-key="mdwe:wechat-tietu-frame"
              @change="onFrameChange"
            />
          </header>

          <div class="min-h-0 flex-1 overflow-auto bg-paper-dim/40 p-4">
            <p v-if="building" class="state-empty">生成预览中…</p>
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
                    class="wt-frame"
                    v-html="c.html"
                  />
                  <!-- eslint-disable-next-line vue/html-self-closing -->
                  <img v-else class="wt-frame wt-frame--img block w-full" :src="c.src" alt="">
                </div>
                <div class="flex items-center justify-between gap-2 px-0.5">
                  <div class="min-w-0">
                    <span class="text-xs font-medium text-ink-soft">{{ c.label }}</span>
                    <span
                      v-if="sizeLabel(c)"
                      class="ml-2 text-[10px] text-ink-muted"
                    >{{ sizeLabel(c) }}</span>
                  </div>
                  <button
                    type="button"
                    class="btn-ghost btn-sm !px-2.5"
                    :disabled="busy || !canDownloadCard(idx)"
                    @click="downloadOne(idx)"
                  >
                    下载
                  </button>
                </div>
              </article>
            </div>
            <p v-else class="state-empty">暂无卡片，请检查文稿后重试</p>
          </div>

          <footer class="shrink-0 border-t border-paper-line px-4 py-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <p
                class="min-w-0 flex-1 text-xs"
                :class="statusClass"
                role="status"
                aria-live="polite"
              >
                {{ status || (building ? '生成中…' : cards.length ? `共 ${cards.length} 张` : '') }}
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
.wt-backdrop {
  background: rgb(15 23 42 / 0.45);
  backdrop-filter: blur(2px);
}

.wt-frame {
  position: relative;
  width: 360px;
  max-width: 100%;
  line-height: 0;
  overflow: hidden;
}

.wt-frame--img {
  height: auto;
}

.wt-modal-enter-active,
.wt-modal-leave-active {
  transition: opacity 0.18s ease;
}

.wt-modal-enter-from,
.wt-modal-leave-to {
  opacity: 0;
}

.wt-modal-enter-active .card,
.wt-modal-leave-active .card {
  transition: transform 0.18s ease;
}

.wt-modal-enter-from .card,
.wt-modal-leave-to .card {
  transform: scale(0.98) translateY(4px);
}
</style>
