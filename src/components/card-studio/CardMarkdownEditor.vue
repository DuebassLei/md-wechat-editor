<script setup lang="ts">
import { ref } from 'vue'
import { useCodeMirrorMarkdown } from '@/composables/useCodeMirrorMarkdown'

const model = defineModel<string>({ required: true })

defineProps<{
  hadModules: boolean
}>()

const emit = defineEmits<{
  sample: []
}>()

const host = ref<HTMLElement | null>(null)
const helpOpen = ref(false)

useCodeMirrorMarkdown(model, host, {
  placeholder: '在此输入 Markdown…',
  fillHeight: true,
})
</script>

<template>
  <aside class="flex min-h-0 flex-col border-l border-paper-line bg-paper-bright">
    <div v-if="hadModules" class="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
      检测到排版模块（:::），已降级为普通 Markdown 显示。
    </div>
    <div class="flex items-center justify-between gap-2 border-b border-paper-line px-4 py-2">
      <span class="text-xs font-medium uppercase tracking-wide text-ink-muted">Markdown</span>
      <div class="flex gap-2">
        <button type="button" class="btn-ghost btn-sm" @click="emit('sample')">加载示例</button>
        <button type="button" class="btn-ghost btn-sm" @click="helpOpen = !helpOpen">
          {{ helpOpen ? '收起' : '语法' }}
        </button>
      </div>
    </div>
    <div v-if="helpOpen" class="border-b border-paper-line bg-paper px-4 py-3 text-xs leading-relaxed text-ink-soft">
      <p class="mb-1 font-medium text-ink">支持</p>
      <p>标题、列表、引用、粗斜体、代码、表格、任务列表、图片、链接</p>
      <p class="mt-2 mb-1 font-medium text-ink">封面首图（YAML）</p>
      <p><code class="rounded bg-paper-line/60 px-1">title</code>、<code class="rounded bg-paper-line/60 px-1">badge</code>、<code class="rounded bg-paper-line/60 px-1">subtitle</code>、<code class="rounded bg-paper-line/60 px-1">chips</code></p>
      <p class="mt-2 mb-1 font-medium text-ink">手动断页</p>
      <p><code class="rounded bg-paper-line/60 px-1">---</code> 或 <code class="rounded bg-paper-line/60 px-1">:::page</code> 独占一行</p>
    </div>
    <div ref="host" class="min-h-0 flex-1 overflow-hidden" />
  </aside>
</template>
