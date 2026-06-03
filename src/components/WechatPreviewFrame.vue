<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    html: string
    deviceShell?: boolean
    richLayout?: boolean
  }>(),
  { deviceShell: true, richLayout: false },
)

const rootRef = ref<HTMLElement | null>(null)
defineExpose({ rootEl: rootRef })
</script>

<template>
  <div ref="rootRef" class="preview-root" :class="{ 'preview-root--device': deviceShell }">
    <!-- 手机套壳：仿公众号阅读器，非厚重 iPhone 边框 -->
    <div v-if="deviceShell" class="wechat-shell">
      <div class="wechat-shell__frame">
        <div class="wechat-shell__status" aria-hidden="true">
          <span class="wechat-shell__time">9:41</span>
          <span class="wechat-shell__notch" />
          <span class="wechat-shell__signal">
            <span /><span /><span />
          </span>
        </div>
        <header class="wechat-shell__chrome">
          <span class="wechat-shell__nav-icon" aria-hidden="true">
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
              <path d="M8 2L2 8l6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="wechat-shell__nav-title">公众号</span>
          <span class="wechat-shell__nav-icon wechat-shell__nav-icon--right" aria-hidden="true">
            <svg width="18" height="4" viewBox="0 0 18 4" fill="currentColor" aria-hidden="true">
              <circle cx="2" cy="2" r="1.5" /><circle cx="9" cy="2" r="1.5" /><circle cx="16" cy="2" r="1.5" />
            </svg>
          </span>
        </header>
        <div class="wechat-shell__scroll">
          <article
            class="preview-body preview-body--shell"
            :class="{ 'preview-body--rich': richLayout }"
            v-html="html"
          />
        </div>
        <div class="wechat-shell__home" aria-hidden="true" />
      </div>
      <p class="wechat-shell__caption">375px 阅读宽度 · 接近微信内排版效果</p>
    </div>

    <!-- 平铺预览：占满预览区，便于查看宽版组件 -->
    <article
      v-else
      class="preview-body preview-body--flat"
      :class="{ 'preview-body--rich': richLayout }"
      v-html="html"
    />
  </div>
</template>

<style scoped>
.preview-root {
  @apply min-h-0;
}

.preview-root--device {
  @apply flex flex-col items-center justify-start px-2 py-3 sm:px-4;
}

.wechat-shell {
  @apply flex w-full max-w-[390px] flex-col items-center gap-2;
}

.wechat-shell__frame {
  @apply w-full overflow-hidden rounded-[1.35rem] border border-paper-line/90 bg-paper-bright;
  box-shadow:
    0 1px 2px rgb(var(--color-shadow-ink) / 0.04),
    0 12px 40px rgb(var(--color-shadow-ink) / 0.08),
    0 0 0 1px rgb(var(--paper-line-rgb) / 0.5);
}

.wechat-shell__status {
  @apply relative flex h-7 shrink-0 items-center justify-between bg-paper-bright px-5 text-[10px] font-semibold tracking-wide text-ink-muted;
}

.wechat-shell__time {
  @apply tabular-nums;
}

.wechat-shell__notch {
  @apply absolute left-1/2 top-0 h-[1.125rem] w-[5.5rem] -translate-x-1/2 rounded-b-2xl bg-ink/[0.06];
}

.wechat-shell__signal {
  @apply flex items-end gap-0.5;
}

.wechat-shell__signal span {
  @apply block w-[3px] rounded-sm bg-ink/25;
}

.wechat-shell__signal span:nth-child(1) {
  height: 4px;
}

.wechat-shell__signal span:nth-child(2) {
  height: 6px;
}

.wechat-shell__signal span:nth-child(3) {
  height: 8px;
}

.wechat-shell__chrome {
  @apply flex h-11 shrink-0 items-center border-b border-paper-line/80 bg-paper-bright px-3;
}

.wechat-shell__nav-icon {
  @apply flex w-8 shrink-0 items-center text-ink-muted;
}

.wechat-shell__nav-icon--right {
  @apply justify-end;
}

.wechat-shell__nav-title {
  @apply min-w-0 flex-1 truncate text-center text-[13px] font-medium text-ink;
}

.wechat-shell__scroll {
  @apply max-h-[min(62vh,580px)] min-h-[320px] overflow-y-auto bg-white px-3.5 py-3;
  -webkit-overflow-scrolling: touch;
}

.wechat-shell__home {
  @apply mx-auto mb-1.5 mt-1 h-1 w-[34%] max-w-[7rem] shrink-0 rounded-full bg-ink/10;
}

.wechat-shell__caption {
  @apply text-center text-[10px] text-ink-faint;
}

.preview-body {
  @apply text-[15px] leading-[1.75] text-ink-soft;
  word-break: break-word;
}

.preview-body--shell {
  @apply bg-white;
}

.preview-body--rich :deep(section) {
  max-width: 100%;
}

.preview-body :deep([data-md-sync].preview-sync-active) {
  outline: 2px solid rgb(var(--color-jade) / 0.55);
  outline-offset: 2px;
  border-radius: 4px;
  transition: outline-color 0.15s ease;
}

.preview-body--flat {
  @apply min-h-full w-full rounded-xl border border-paper-line/80 bg-paper-bright p-4 sm:p-5;
  box-shadow: inset 0 1px 0 rgb(var(--paper-bright-rgb));
}

.preview-root:not(.preview-root--device) {
  @apply h-full min-h-0 overflow-y-auto p-2 sm:p-3;
}
</style>
