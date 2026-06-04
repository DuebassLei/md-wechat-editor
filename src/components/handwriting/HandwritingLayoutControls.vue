<script setup lang="ts">
import type { HandwritingTypography } from '@/engine/handwriting/typographyDefaults'
import { TYPOGRAPHY_LIMITS } from '@/engine/handwriting/typographyDefaults'

defineProps<{
  typography: HandwritingTypography
}>()

const emit = defineEmits<{
  patch: [patch: Partial<HandwritingTypography>]
  reset: []
}>()

function onRange(key: keyof HandwritingTypography, value: string) {
  emit('patch', { [key]: Number(value) })
}

function formatLetterSpacing(v: number): string {
  return v === 0 ? '默认' : `${v > 0 ? '+' : ''}${v.toFixed(2)}em`
}

function formatLineHeight(v: number): string {
  return v === 1 ? '默认' : `${Math.round(v * 100)}%`
}
</script>

<template>
  <section class="shrink-0 border-t border-paper-line bg-paper-bright p-4">
    <div class="mb-3 flex items-center justify-between">
      <p class="text-xs font-medium uppercase tracking-wide text-ink-muted">排版调节</p>
      <button
        type="button"
        class="text-[10px] text-ink-faint underline-offset-2 hover:text-cinnabar hover:underline"
        @click="emit('reset')"
      >
        重置
      </button>
    </div>

    <div class="space-y-3">
      <label class="block">
        <span class="mb-1 flex justify-between text-xs text-ink-muted">
          <span>字号</span>
          <span class="tabular-nums text-ink-faint">
            {{ typography.fontSizeAdjust === 0 ? '默认' : `${typography.fontSizeAdjust > 0 ? '+' : ''}${typography.fontSizeAdjust}px` }}
          </span>
        </span>
        <input
          type="range"
          class="hw-range w-full"
          :min="TYPOGRAPHY_LIMITS.fontSizeAdjust.min"
          :max="TYPOGRAPHY_LIMITS.fontSizeAdjust.max"
          :step="TYPOGRAPHY_LIMITS.fontSizeAdjust.step"
          :value="typography.fontSizeAdjust"
          @input="onRange('fontSizeAdjust', ($event.target as HTMLInputElement).value)"
        >
      </label>

      <label class="block">
        <span class="mb-1 flex justify-between text-xs text-ink-muted">
          <span>字间距</span>
          <span class="tabular-nums text-ink-faint">{{ formatLetterSpacing(typography.letterSpacing) }}</span>
        </span>
        <input
          type="range"
          class="hw-range w-full"
          :min="TYPOGRAPHY_LIMITS.letterSpacing.min"
          :max="TYPOGRAPHY_LIMITS.letterSpacing.max"
          :step="TYPOGRAPHY_LIMITS.letterSpacing.step"
          :value="typography.letterSpacing"
          @input="onRange('letterSpacing', ($event.target as HTMLInputElement).value)"
        >
      </label>

      <label class="block">
        <span class="mb-1 flex justify-between text-xs text-ink-muted">
          <span>行距</span>
          <span class="tabular-nums text-ink-faint">{{ formatLineHeight(typography.lineHeightScale) }}</span>
        </span>
        <input
          type="range"
          class="hw-range w-full"
          :min="TYPOGRAPHY_LIMITS.lineHeightScale.min"
          :max="TYPOGRAPHY_LIMITS.lineHeightScale.max"
          :step="TYPOGRAPHY_LIMITS.lineHeightScale.step"
          :value="typography.lineHeightScale"
          @input="onRange('lineHeightScale', ($event.target as HTMLInputElement).value)"
        >
      </label>

      <label class="block">
        <span class="mb-1 flex justify-between text-xs text-ink-muted">
          <span>词间距</span>
          <span class="tabular-nums text-ink-faint">
            {{ typography.wordSpacing === 0 ? '默认' : `${typography.wordSpacing.toFixed(2)}em` }}
          </span>
        </span>
        <input
          type="range"
          class="hw-range w-full"
          :min="TYPOGRAPHY_LIMITS.wordSpacing.min"
          :max="TYPOGRAPHY_LIMITS.wordSpacing.max"
          :step="TYPOGRAPHY_LIMITS.wordSpacing.step"
          :value="typography.wordSpacing"
          @input="onRange('wordSpacing', ($event.target as HTMLInputElement).value)"
        >
      </label>
    </div>
  </section>
</template>

<style scoped>
.hw-range {
  @apply h-1.5 cursor-pointer appearance-none rounded-full bg-paper-line;
}

.hw-range::-webkit-slider-thumb {
  @apply h-3.5 w-3.5 appearance-none rounded-full bg-cinnabar shadow-sm;
}

.hw-range::-moz-range-thumb {
  @apply h-3.5 w-3.5 rounded-full border-0 bg-cinnabar shadow-sm;
}
</style>
