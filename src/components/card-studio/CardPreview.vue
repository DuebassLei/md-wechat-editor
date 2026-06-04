<script setup lang="ts">
import type { CardAspect } from '@/engine/card-export/types'
import type { CardPage } from '@/engine/card-studio/types'

defineProps<{
  pages: CardPage[]
  aspect: CardAspect
  zoom: number
  building: boolean
  selectedIndex: number
}>()

const emit = defineEmits<{
  select: [index: number]
}>()
</script>

<template>
  <main class="card-preview flex min-h-0 flex-col overflow-hidden bg-paper-dim/40">
    <div class="min-h-0 flex-1 overflow-y-auto p-6">
      <div v-if="building" class="flex h-40 items-center justify-center text-sm text-ink-muted">
        正在生成预览…
      </div>
      <div
        v-else-if="!pages.length"
        class="flex h-40 items-center justify-center text-sm text-ink-muted"
      >
        输入 Markdown 开始预览
      </div>
      <div v-else class="mx-auto flex max-w-md flex-col items-center gap-6">
        <article
          v-for="(page, idx) in pages"
          :key="page.id"
          class="card-preview__item w-full cursor-pointer"
          :class="{ 'card-preview__item--selected': selectedIndex === idx }"
          :style="{ transform: `scale(${zoom})`, transformOrigin: 'top center' }"
          @click="emit('select', idx)"
        >
          <div
            class="card-preview__frame overflow-hidden rounded-lg shadow-card transition-shadow"
            :class="[
              aspect === '1:1' ? 'aspect-square' : 'aspect-[3/4]',
              selectedIndex === idx ? 'ring-2 ring-jade ring-offset-2 ring-offset-paper-dim' : '',
            ]"
          >
            <img
              v-if="page.dataUrl"
              :src="page.dataUrl"
              :alt="page.label"
              class="h-full w-full object-cover object-top"
            >
          </div>
          <p class="mt-2 text-center text-xs text-ink-muted">
            <span
              v-if="page.kind === 'cover'"
              class="mr-1.5 inline-block rounded bg-cinnabar/10 px-1.5 py-0.5 text-[10px] font-bold text-cinnabar"
            >封面</span>
            {{ page.label }}
            <span v-if="page.kind === 'content' && page.totalInSegment > 1" class="text-ink-faint">
              · {{ page.pageIndex + 1 }}/{{ page.totalInSegment }}
            </span>
          </p>
          <p
            v-if="page.overflow"
            class="mt-1 rounded-md bg-red-50 px-2 py-1 text-center text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            内容超出单卡，请删减或关闭单卡模式
          </p>
        </article>
      </div>
    </div>
  </main>
</template>

<style scoped>
.card-preview__item + .card-preview__item {
  margin-top: 0;
}
</style>
