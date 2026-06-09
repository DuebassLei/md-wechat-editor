<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  COVER_BG_PRESETS,
  COVER_FONT_OPTIONS,
} from '@/engine/cover-editor/constants'
import type { CoverLayout } from '@/engine/cover-editor/types'

const title = defineModel<string>('title', { required: true })
const keywords = defineModel<string>('keywords', { required: true })
const fontFamily = defineModel<string>('fontFamily', { required: true })
const titleFontSize = defineModel<number>('titleFontSize', { required: true })
const keywordsFontSize = defineModel<number>('keywordsFontSize', { required: true })
const titleColor = defineModel<string>('titleColor', { required: true })
const keywordsColor = defineModel<string>('keywordsColor', { required: true })
const layout = defineModel<CoverLayout>('layout', { required: true })
const bgPresetId = defineModel<string>('bgPresetId', { required: true })
const overlayOpacity = defineModel<number>('overlayOpacity', { required: true })

const props = defineProps<{
  customBgImage: string
  uploadLabel: string
}>()

const emit = defineEmits<{
  upload: [file: File]
  clearUpload: []
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

const layoutOptions: { value: CoverLayout; label: string }[] = [
  { value: 'center', label: '居中排版' },
  { value: 'left', label: '左上排版' },
]

const selectedFontClass = computed(() => {
  return COVER_FONT_OPTIONS.find((f) => f.value === fontFamily.value)?.className ?? ''
})

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) emit('upload', file)
}
</script>

<template>
  <aside class="cover-form flex min-h-0 flex-col overflow-y-auto border-r border-paper-line bg-paper-bright">
    <div class="card-header shrink-0">
      <span>设计选项</span>
    </div>

    <div class="space-y-4 p-4">
      <label class="block space-y-1.5">
        <span class="text-xs font-semibold text-ink-soft">封面标题</span>
        <textarea
          v-model="title"
          rows="3"
          class="input resize-y"
          placeholder="输入封面标题…"
        />
        <span class="text-[11px] text-ink-faint">按 Enter 换行</span>
      </label>

      <label class="block space-y-1.5">
        <span class="text-xs font-semibold text-ink-soft">关键词</span>
        <input
          v-model="keywords"
          type="text"
          class="input"
          placeholder="用空格分隔关键词"
        />
      </label>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label class="block space-y-1.5">
          <span class="text-xs font-semibold text-ink-soft">字体选择</span>
          <select v-model="fontFamily" class="input" :class="selectedFontClass">
            <option v-for="opt in COVER_FONT_OPTIONS" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </label>

        <label class="block space-y-1.5">
          <span class="text-xs font-semibold text-ink-soft">布局风格</span>
          <select v-model="layout" class="input">
            <option v-for="opt in layoutOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </label>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label class="block space-y-1.5">
          <span class="text-xs font-semibold text-ink-soft">标题字号</span>
          <input
            v-model.number="titleFontSize"
            type="number"
            min="12"
            max="120"
            step="2"
            class="input"
          />
        </label>

        <label class="block space-y-1.5">
          <span class="text-xs font-semibold text-ink-soft">关键词字号</span>
          <input
            v-model.number="keywordsFontSize"
            type="number"
            min="8"
            max="60"
            step="1"
            class="input"
          />
        </label>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <label class="block space-y-1.5">
          <span class="text-xs font-semibold text-ink-soft">标题颜色</span>
          <input v-model="titleColor" type="color" class="cover-color-input" />
        </label>

        <label class="block space-y-1.5">
          <span class="text-xs font-semibold text-ink-soft">关键词颜色</span>
          <input v-model="keywordsColor" type="color" class="cover-color-input" />
        </label>
      </div>

      <div class="space-y-2">
        <span class="text-xs font-semibold text-ink-soft">背景预设</span>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="preset in COVER_BG_PRESETS"
            :key="preset.id"
            type="button"
            class="cover-bg-thumb"
            :class="{ 'cover-bg-thumb--active': bgPresetId === preset.id && !customBgImage }"
            :style="{ background: preset.thumb }"
            :title="preset.label"
            @click="bgPresetId = preset.id; emit('clearUpload')"
          >
            <span class="sr-only">{{ preset.label }}</span>
          </button>
        </div>
      </div>

      <label class="block space-y-1.5">
        <span class="text-xs font-semibold text-ink-soft">遮罩浓度</span>
        <input
          v-model.number="overlayOpacity"
          type="range"
          min="0"
          max="0.6"
          step="0.05"
          class="w-full accent-cinnabar"
        />
        <span class="text-[11px] text-ink-faint">{{ Math.round(overlayOpacity * 100) }}%</span>
      </label>

      <div class="space-y-2">
        <span class="text-xs font-semibold text-ink-soft">自定义背景图</span>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="sr-only"
          @change="onFileChange"
        />
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="btn-secondary btn-sm" @click="fileInputRef?.click()">
            上传图片
          </button>
          <button
            v-if="customBgImage"
            type="button"
            class="btn-ghost btn-sm"
            @click="emit('clearUpload')"
          >
            清除
          </button>
        </div>
        <p v-if="uploadLabel" class="text-[11px] text-ink-muted">{{ uploadLabel }}</p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.cover-color-input {
  @apply h-10 w-full cursor-pointer rounded-[var(--radius-control)] border border-paper-line bg-paper-bright p-1;
}

.cover-bg-thumb {
  @apply relative aspect-[4/3] w-full overflow-hidden rounded-lg border-2 border-transparent transition-all duration-200;
  box-shadow: 0 1px 4px rgb(var(--color-shadow-ink) / 0.08);
}

.cover-bg-thumb:hover {
  @apply border-cinnabar/30;
  transform: translateY(-1px);
}

.cover-bg-thumb--active {
  @apply border-cinnabar ring-2 ring-cinnabar/20;
}
</style>
