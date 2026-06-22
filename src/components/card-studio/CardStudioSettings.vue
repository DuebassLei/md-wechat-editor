<script setup lang="ts">
import type { CardAspect } from '@/engine/card-export/types'
import {
  CARD_SIZE_PRESETS,
  CARD_SPLIT_MODES,
  CARD_THEME_RECOMMENDATIONS,
  type CardSplitMode,
} from '@/engine/card-studio/constants'
import type { CardThemeId } from '@/engine/card-studio/cardThemes/types'
import CardThemePicker from '@/components/card-studio/CardThemePicker.vue'

const themeId = defineModel<CardThemeId>('themeId', { required: true })
const aspect = defineModel<CardAspect>('aspect', { required: true })
const splitMode = defineModel<CardSplitMode>('splitMode', { required: true })
const includeCover = defineModel<boolean>('includeCover', { required: true })
const showBrand = defineModel<boolean>('showBrand', { required: true })
const showPageNumbers = defineModel<boolean>('showPageNumbers', { required: true })
const overflowHidden = defineModel<boolean>('overflowHidden', { required: true })
const previewWidth = defineModel<number>('previewWidth', { required: true })
const brand = defineModel<string>('brand', { required: true })
const richContent = defineModel<boolean>('richContent', { required: true })

function applySizePreset(preset: (typeof CARD_SIZE_PRESETS)[number]) {
  aspect.value = preset.aspect
  previewWidth.value = preset.previewWidth
}
</script>

<template>
  <aside class="card-studio-settings flex min-h-0 flex-col border-l border-paper-line bg-paper-bright">
    <div class="shrink-0 space-y-4 border-b border-paper-line px-4 py-4">
      <div>
        <h2 class="text-sm font-semibold text-ink">卡片设置</h2>
        <p class="mt-0.5 text-[11px] text-ink-faint">对齐 MD2Card 编辑器布局与拆分逻辑</p>
      </div>

      <div>
        <p class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">拆分模式</p>
        <div class="grid grid-cols-3 gap-1.5">
          <button
            v-for="mode in CARD_SPLIT_MODES"
            :key="mode.id"
            type="button"
            class="card-studio-settings__mode"
            :class="{ 'card-studio-settings__mode--active': splitMode === mode.id }"
            :title="mode.desc"
            @click="splitMode = mode.id"
          >
            {{ mode.label }}
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <label class="flex cursor-pointer items-center justify-between text-xs text-ink-muted">
          <span>封面首图</span>
          <input v-model="includeCover" type="checkbox" class="rounded border-paper-line">
        </label>
        <label class="flex cursor-pointer items-center justify-between text-xs text-ink-muted">
          <span>高度超出隐藏</span>
          <input v-model="overflowHidden" type="checkbox" class="rounded border-paper-line">
        </label>
        <label class="flex cursor-pointer items-center justify-between text-xs text-ink-muted">
          <span>增强模式（MDX）</span>
          <input v-model="richContent" type="checkbox" class="rounded border-paper-line">
        </label>
        <p class="text-[10px] leading-relaxed text-ink-faint">
          LaTeX 公式、JSX 行内样式、font 标签
        </p>
      </div>

      <details class="group text-xs">
        <summary class="cursor-pointer font-semibold text-ink-soft">主题场景对照</summary>
        <ul class="mt-2 space-y-1.5 text-[11px] leading-relaxed text-ink-muted">
          <li v-for="rec in CARD_THEME_RECOMMENDATIONS" :key="rec.scene">
            {{ rec.scene }}
            <span class="text-ink-faint">（{{ rec.md2card }}）</span>
            →
            <button
              type="button"
              class="font-semibold text-jade hover:underline"
              @click="themeId = rec.themeId as CardThemeId"
            >
              {{ rec.themeId }}
            </button>
          </li>
        </ul>
      </details>

      <div>
        <p class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">尺寸</p>
        <div class="grid grid-cols-2 gap-1.5">
          <button
            v-for="preset in CARD_SIZE_PRESETS"
            :key="preset.label"
            type="button"
            class="card-studio-settings__size"
            :class="{
              'card-studio-settings__size--active':
                aspect === preset.aspect && previewWidth === preset.previewWidth,
            }"
            @click="applySizePreset(preset)"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <div>
        <p class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">底栏显示</p>
        <div class="space-y-2">
          <label class="flex cursor-pointer items-center justify-between text-xs text-ink-muted">
            <span>品牌署名</span>
            <input v-model="showBrand" type="checkbox" class="rounded border-paper-line">
          </label>
          <label class="flex cursor-pointer items-center justify-between text-xs text-ink-muted">
            <span>页码</span>
            <input v-model="showPageNumbers" type="checkbox" class="rounded border-paper-line">
          </label>
        </div>
        <label class="mt-2 block text-xs text-ink-muted">
          署名文案
          <input
            v-model="brand"
            type="text"
            placeholder="墨韵简排"
            :disabled="!showBrand"
            class="mt-1 w-full rounded-md border border-paper-line bg-paper px-2.5 py-1.5 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
        </label>
      </div>
    </div>

    <CardThemePicker v-model="themeId" class="min-h-0 flex-1 overflow-hidden" />
  </aside>
</template>

<style scoped>
.card-studio-settings__mode,
.card-studio-settings__size {
  border-radius: 8px;
  border: 1px solid var(--color-paper-line, #e2e8f0);
  background: var(--color-paper, #fff);
  padding: 6px 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-ink-muted, #64748b);
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
}

.card-studio-settings__mode:hover,
.card-studio-settings__size:hover {
  border-color: rgb(13 148 136 / 0.45);
  color: var(--color-ink, #1e293b);
}

.card-studio-settings__mode--active,
.card-studio-settings__size--active {
  border-color: var(--color-jade, #0d9488);
  background: rgb(13 148 136 / 0.08);
  color: var(--color-jade-dark, #0f766e);
}

.card-studio-settings__size {
  text-align: left;
  padding: 6px 8px;
  line-height: 1.3;
}
</style>
