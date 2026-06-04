<script setup lang="ts">
import { computed } from 'vue'
import type { ConversionReport, PlatformTarget } from '@/engine'

const props = defineProps<{
  platform: PlatformTarget
  sourceExcerpt: string
  previewMarkdown: string
  report: ConversionReport
  emptyPreview: boolean
}>()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{ confirm: [] }>()

const platformLabel = computed(() => (props.platform === 'juejin' ? '掘金' : 'CSDN'))

const entrySummary = computed(() => {
  const counts = new Map<string, number>()
  for (const e of props.report.entries) {
    counts.set(e.moduleId, (counts.get(e.moduleId) ?? 0) + 1)
  }
  return [...counts.entries()].map(([id, n]) => (n > 1 ? `${id}×${n}` : id)).join('、')
})

function close() {
  open.value = false
}

function onConfirm() {
  emit('confirm')
  open.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="platform-copy-backdrop fixed inset-0 z-[310] flex items-center justify-center p-3 sm:p-4"
        role="presentation"
        @click.self="close"
      >
        <div
          class="platform-copy-dialog card relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden shadow-card-hover"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="'platform-copy-title'"
          @click.stop
        >
          <header class="flex shrink-0 items-start justify-between gap-3 border-b border-paper-line px-4 py-3">
            <div class="min-w-0">
              <p id="platform-copy-title" class="text-sm font-semibold text-ink">
                复制到{{ platformLabel }} — 排版组件将转换
              </p>
              <p v-if="report.entries.length" class="mt-1 text-xs text-ink-muted">
                共转换 {{ report.entries.length }} 个组件：{{ entrySummary }}
              </p>
            </div>
            <button type="button" class="btn-ghost btn-sm shrink-0 !px-2" aria-label="关闭" @click="close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div class="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-auto p-4 lg:grid-cols-2">
            <section class="min-h-0">
              <p class="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-muted">原文摘要</p>
              <pre class="platform-copy-pre">{{ sourceExcerpt }}</pre>
            </section>
            <section class="min-h-0">
              <p class="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-muted">降级预览</p>
              <pre class="platform-copy-pre">{{ previewMarkdown }}</pre>
            </section>
          </div>

          <footer class="shrink-0 border-t border-paper-line px-4 py-3">
            <ul v-if="report.warnings.length" class="mb-3 space-y-1 text-xs text-amber-800 dark:text-amber-200">
              <li v-for="(w, i) in report.warnings" :key="i">· {{ w }}</li>
            </ul>
            <p v-if="emptyPreview" class="mb-3 text-xs text-red-600">降级结果为空，无法复制</p>
            <div class="flex justify-end gap-2">
              <button type="button" class="btn-ghost btn-sm" @click="close">取消</button>
              <button type="button" class="btn-primary btn-sm" :disabled="emptyPreview" @click="onConfirm">
                确认复制
              </button>
            </div>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.platform-copy-backdrop {
  background: rgb(15 23 42 / 0.45);
  backdrop-filter: blur(2px);
}
.platform-copy-pre {
  @apply max-h-64 overflow-auto rounded-lg border border-paper-line bg-paper-dim/50 p-3 text-[11px] leading-relaxed text-ink;
  white-space: pre-wrap;
  word-break: break-word;
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
