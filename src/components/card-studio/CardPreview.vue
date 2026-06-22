<script setup lang="ts">
import type { CardAspect } from '@/engine/card-export/types'
import { CARD_ZOOM_OPTIONS } from '@/engine/card-studio/constants'
import type { CardPage } from '@/engine/card-studio/types'

defineProps<{
  pages: CardPage[]
  aspect: CardAspect
  zoom: number
  building: boolean
  selectedIndex: number
  canExport: boolean
  busy: boolean
}>()

const emit = defineEmits<{
  select: [index: number]
  exportAll: []
  exportOne: []
}>()

const zoom = defineModel<number>('zoom', { default: 0.8 })
</script>

<template>
  <main class="card-preview flex min-h-0 flex-col overflow-hidden">
    <div class="card-preview__toolbar flex shrink-0 items-center justify-between border-b border-paper-line/60 bg-[#1e1e1e] px-4 py-2">
      <span class="text-xs text-white/60">
        <template v-if="building">正在生成预览…</template>
        <template v-else-if="pages.length">{{ pages.length }} 张卡片</template>
        <template v-else>实时预览</template>
      </span>
      <div class="flex items-center gap-2">
        <label class="flex items-center gap-1.5 text-xs text-white/60">
          缩放
          <select
            v-model.number="zoom"
            class="rounded border-white/10 bg-white/10 px-2 py-1 text-xs text-white"
          >
            <option v-for="opt in CARD_ZOOM_OPTIONS" :key="opt.label" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </label>
        <button
          type="button"
          class="rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/15 disabled:opacity-40"
          :disabled="!canExport || busy"
          @click="emit('exportOne')"
        >
          导出当前
        </button>
        <button
          type="button"
          class="rounded-md bg-jade px-2.5 py-1 text-xs font-semibold text-white hover:bg-jade-dark disabled:opacity-40"
          :disabled="!canExport || busy"
          @click="emit('exportAll')"
        >
          导出 ZIP
        </button>
      </div>
    </div>

    <div class="card-preview__canvas min-h-0 flex-1 overflow-y-auto p-6">
      <div
        v-if="building && !pages.length"
        class="flex h-64 items-center justify-center text-sm text-white/50"
      >
        正在渲染卡片…
      </div>
      <div
        v-else-if="!pages.length"
        class="flex h-64 items-center justify-center text-sm text-white/50"
      >
        输入 Markdown 开始预览
      </div>
      <template v-else>
        <p v-if="building" class="mb-3 text-center text-xs text-white/45">正在更新预览…</p>
        <div class="mx-auto flex max-w-lg flex-col items-center">
          <article
            class="card-preview__main w-full cursor-default"
            :class="[aspect === '1:1' ? 'aspect-square' : 'aspect-[3/4]']"
            :style="{ transform: `scale(${zoom})`, transformOrigin: 'top center' }"
          >
            <div
              class="card-preview__frame h-full w-full overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10"
            >
              <img
                v-if="pages[selectedIndex]?.dataUrl"
                :src="pages[selectedIndex].dataUrl"
                :alt="pages[selectedIndex].label"
                class="h-full w-full object-cover object-top"
              >
            </div>
          </article>

          <p
            v-if="pages[selectedIndex]?.overflow"
            class="mt-3 w-full rounded-md bg-amber-500/15 px-3 py-2 text-center text-xs text-amber-200"
          >
            内容超出单卡，请删减或切换「自动拆分」模式
          </p>

          <p class="mt-3 text-center text-xs text-white/50">
            <span
              v-if="pages[selectedIndex]?.kind === 'cover'"
              class="mr-1.5 inline-block rounded bg-cinnabar/80 px-1.5 py-0.5 text-[10px] font-bold text-white"
            >封面</span>
            {{ pages[selectedIndex]?.label }}
            <span
              v-if="pages[selectedIndex]?.kind === 'content' && pages[selectedIndex].totalInSegment > 1"
              class="text-white/35"
            >
              · {{ pages[selectedIndex].pageIndex + 1 }}/{{ pages[selectedIndex].totalInSegment }}
            </span>
          </p>
        </div>

        <div
          v-if="pages.length > 1"
          class="mx-auto mt-6 flex max-w-full gap-2 overflow-x-auto pb-2"
        >
          <button
            v-for="(page, idx) in pages"
            :key="page.id"
            type="button"
            class="card-preview__thumb shrink-0"
            :class="{ 'card-preview__thumb--active': selectedIndex === idx }"
            @click="emit('select', idx)"
          >
            <img
              v-if="page.dataUrl"
              :src="page.dataUrl"
              :alt="page.label"
              class="h-full w-full object-cover object-top"
            >
            <span v-if="page.kind === 'cover'" class="card-preview__thumb-tag">封面</span>
          </button>
        </div>
      </template>
    </div>
  </main>
</template>

<style scoped>
.card-preview {
  background: #141414;
}

.card-preview__canvas {
  background:
    radial-gradient(circle at 20% 20%, rgb(255 255 255 / 0.03), transparent 40%),
    radial-gradient(circle at 80% 80%, rgb(13 148 136 / 0.06), transparent 35%),
    #141414;
}

.card-preview__thumb {
  position: relative;
  width: 56px;
  height: 74px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  opacity: 0.65;
  transition: opacity 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}

.card-preview__thumb:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.card-preview__thumb--active {
  border-color: var(--color-jade, #0d9488);
  opacity: 1;
}

.card-preview__thumb-tag {
  position: absolute;
  left: 2px;
  top: 2px;
  border-radius: 4px;
  background: rgb(220 38 38 / 0.85);
  padding: 1px 4px;
  font-size: 8px;
  font-weight: 700;
  color: #fff;
}
</style>
