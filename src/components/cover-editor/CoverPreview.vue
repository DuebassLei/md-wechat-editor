<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  COVER_PREVIEW_MAX_WIDTH,
  formatKeywords,
  getBgPreset,
  splitTitleLines,
} from '@/engine/cover-editor/constants'
import type { CoverAspect, CoverLayout } from '@/engine/cover-editor/types'

const props = defineProps<{
  title: string
  keywords: string
  fontFamily: string
  titleFontSize: number
  keywordsFontSize: number
  titleColor: string
  keywordsColor: string
  layout: CoverLayout
  aspect: CoverAspect
  bgPresetId: string
  customBgImage: string
  overlayOpacity: number
  zoom: number
}>()

const coverCanvasEl = ref<HTMLElement | null>(null)
defineExpose({ coverCanvasEl })

const aspectRatio = computed(() => {
  if (props.aspect === 'portrait') return '9 / 16'
  if (props.aspect === 'wechat') return '900 / 383'
  return '16 / 9'
})

const previewWidth = computed(() => COVER_PREVIEW_MAX_WIDTH[props.aspect])

const bgStyle = computed(() => {
  if (props.customBgImage) {
    return {
      backgroundImage: `url('${props.customBgImage}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  const preset = getBgPreset(props.bgPresetId)
  return { background: preset.background }
})

const titleLines = computed(() => splitTitleLines(props.title))
const keywordsText = computed(() => formatKeywords(props.keywords))

const isPortrait = computed(() => props.aspect === 'portrait')

const contentStyle = computed(() => ({
  fontFamily: props.fontFamily,
  justifyContent: props.layout === 'left' ? 'flex-start' : 'center',
  alignItems: props.layout === 'left' ? 'flex-start' : 'center',
  padding: props.layout === 'left'
    ? (isPortrait.value ? '3rem 2rem 2rem' : '2rem')
    : '2rem',
  textAlign: (props.layout === 'left' ? 'left' : 'center') as 'left' | 'center',
}))

const titleStyle = computed(() => ({
  fontSize: `${props.titleFontSize}px`,
  color: props.titleColor,
  fontFamily: props.fontFamily,
}))

const keywordsStyle = computed(() => ({
  fontSize: `${props.keywordsFontSize}px`,
  color: props.keywordsColor,
  fontFamily: props.fontFamily,
}))
</script>

<template>
  <section class="cover-preview flex min-h-0 flex-1 flex-col overflow-hidden bg-paper-dim/40">
    <div class="card-header shrink-0">
      <span>预览</span>
      <span class="text-xs font-normal text-ink-muted">实时渲染，导出为高清 PNG</span>
    </div>

    <div class="cover-preview__stage flex min-h-0 flex-1 items-center justify-center overflow-auto p-6">
      <div
        class="cover-preview__zoom"
        :style="{ transform: `scale(${zoom})`, transformOrigin: 'center center' }"
      >
        <div
          ref="coverCanvasEl"
          class="cover-canvas"
          :style="{ width: `${previewWidth}px`, aspectRatio }"
        >
          <div class="cover-canvas__bg" :style="bgStyle" />
          <div
            class="cover-canvas__overlay"
            :style="{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }"
          />
          <div class="cover-canvas__content" :style="contentStyle">
            <h2 class="cover-canvas__title" :style="titleStyle">
              <span v-for="(line, i) in titleLines" :key="i" class="cover-canvas__title-line">
                {{ line || ' ' }}
              </span>
            </h2>
            <p
              v-if="keywordsText"
              class="cover-canvas__keywords"
              :class="{ 'cover-canvas__keywords--badge': isPortrait }"
              :style="keywordsStyle"
            >
              {{ keywordsText }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cover-preview__stage {
  background:
    radial-gradient(circle at 20% 20%, rgb(var(--cinnabar-rgb) / 0.04), transparent 45%),
    radial-gradient(circle at 80% 80%, rgb(var(--paper-deep-rgb) / 0.08), transparent 40%);
}

.cover-canvas {
  @apply relative overflow-hidden rounded-2xl;
  box-shadow:
    0 8px 32px rgb(var(--color-shadow-ink) / 0.12),
    0 0 0 1px rgb(var(--color-shadow-ink) / 0.06);
}

.cover-canvas__bg,
.cover-canvas__overlay,
.cover-canvas__content {
  @apply absolute inset-0;
}

.cover-canvas__content {
  @apply flex flex-col;
  text-shadow: 0 2px 8px rgb(0 0 0 / 0.35);
}

.cover-canvas__title {
  @apply m-0 font-black leading-tight;
  word-break: break-word;
}

.cover-canvas__title-line {
  display: block;
}

.cover-canvas__keywords {
  @apply m-0 mt-4 font-medium opacity-90;
}

.cover-canvas__keywords--badge {
  @apply mt-6 inline-block rounded-lg px-4 py-2;
  background: rgb(0 0 0 / 0.28);
}
</style>
