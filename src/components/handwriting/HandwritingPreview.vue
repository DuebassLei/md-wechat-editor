<!-- src/components/handwriting/HandwritingPreview.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { FontId } from '@/engine/handwriting/fontPresets'
import { getFontPreset } from '@/engine/handwriting/fontPresets'
import type { PaperId } from '@/engine/handwriting/paperPresets'
import { getPaperStyle } from '@/engine/handwriting/paperPresets'
import type { HandwritingTypography } from '@/engine/handwriting/typographyDefaults'

const props = defineProps<{
  displayText: string
  paperId: PaperId
  paperStyleId: string
  fontId: FontId
  typography: HandwritingTypography
  zoom: number
}>()

const sheetEl = ref<HTMLElement | null>(null)

const paper = computed(() => getPaperStyle(props.paperId, props.paperStyleId))
const font = computed(() => getFontPreset(props.fontId))

const sheetStyle = computed(() => {
  const p = paper.value
  const t = props.typography
  const fontSize = font.value.fontSize + t.fontSizeAdjust
  const lineHeight = p.lineHeight * t.lineHeightScale
  return {
    width: '1080px',
    backgroundColor: p.backgroundColor,
    backgroundImage: p.backgroundImage,
    backgroundSize: p.backgroundSize,
    backgroundPosition: p.backgroundPosition,
    color: p.textColor,
    padding: `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`,
    lineHeight: `${lineHeight}px`,
    fontFamily: font.value.fontFamily,
    fontSize: `${fontSize}px`,
    letterSpacing: `${t.letterSpacing}em`,
    wordSpacing: `${t.wordSpacing}em`,
    transform: `scale(${props.zoom})`,
    transformOrigin: 'top center',
  }
})

defineExpose({ sheetEl })
</script>

<template>
  <div class="hw-preview flex min-h-0 flex-1 items-start justify-center overflow-auto bg-paper p-6">
    <div
      ref="sheetEl"
      class="hw-sheet shrink-0 whitespace-pre-wrap break-words shadow-md"
      :class="font.cssClass"
      :style="sheetStyle"
    >
      {{ displayText || '在此预览手写稿…' }}
    </div>
  </div>
</template>
