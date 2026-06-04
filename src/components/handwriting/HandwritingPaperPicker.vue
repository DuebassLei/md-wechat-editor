<script setup lang="ts">
import { computed } from 'vue'
import type { FontId } from '@/engine/handwriting/fontPresets'
import { FONT_PRESETS } from '@/engine/handwriting/fontPresets'
import type { PaperId } from '@/engine/handwriting/paperPresets'
import { getPaperPreset, PAPER_PRESETS } from '@/engine/handwriting/paperPresets'

const props = defineProps<{
  paperId: PaperId
  paperStyleId: string
  fontId: FontId
}>()

const emit = defineEmits<{
  selectPaper: [paperId: PaperId, styleId: string]
  selectFont: [fontId: FontId]
}>()

const currentPaper = computed(() => getPaperPreset(props.paperId))

function onSelectPaper(id: PaperId) {
  if (id === props.paperId) return
  const preset = getPaperPreset(id)
  emit('selectPaper', id, preset.styles[0].id)
}

function onSelectStyle(styleId: string) {
  emit('selectPaper', props.paperId, styleId)
}
</script>

<template>
  <aside class="flex min-h-0 flex-col bg-paper-bright p-4 overflow-y-auto">
    <section class="mb-5">
      <p class="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">纸张模板</p>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="paper in PAPER_PRESETS"
          :key="paper.id"
          type="button"
          class="rounded-md px-2 py-1 text-xs transition-colors"
          :class="
            paperId === paper.id
              ? 'bg-cinnabar text-white'
              : 'bg-paper text-ink-muted hover:bg-paper-line/60'
          "
          @click="onSelectPaper(paper.id)"
        >
          {{ paper.name }}
        </button>
      </div>
    </section>

    <section v-if="currentPaper.styles.length > 1" class="mb-5">
      <p class="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">纸张样式</p>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="style in currentPaper.styles"
          :key="style.id"
          type="button"
          class="rounded-md px-2 py-1 text-xs transition-colors"
          :class="
            paperStyleId === style.id
              ? 'bg-cinnabar text-white'
              : 'bg-paper text-ink-muted hover:bg-paper-line/60'
          "
          @click="onSelectStyle(style.id)"
        >
          {{ style.name }}
        </button>
      </div>
    </section>

    <section class="mb-5 min-h-0 flex-1 overflow-y-auto">
      <p class="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">字体风格</p>
      <div class="space-y-2">
        <button
          v-for="font in FONT_PRESETS"
          :key="font.id"
          type="button"
          class="w-full rounded-lg border p-2 text-left transition-all"
          :class="
            fontId === font.id
              ? 'border-cinnabar bg-cinnabar/5 shadow-sm'
              : 'border-paper-line hover:border-cinnabar/40'
          "
          @click="emit('selectFont', font.id)"
        >
          <span class="text-xs font-medium text-ink">{{ font.name }}</span>
        </button>
      </div>
    </section>
  </aside>
</template>
