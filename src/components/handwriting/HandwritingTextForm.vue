<!-- src/components/handwriting/HandwritingTextForm.vue -->
<script setup lang="ts">
import { computed } from 'vue'

const MAX_LEN = 5000

const props = defineProps<{ text: string }>()
const emit = defineEmits<{
  'update:text': [value: string]
  sample: []
}>()

const len = computed(() => props.text.length)
const overLimit = computed(() => len.value >= MAX_LEN)
</script>

<template>
  <aside class="flex min-h-0 flex-col gap-4 border-l border-paper-line bg-paper-bright p-5 overflow-y-auto">
    <div>
      <label for="hw-text" class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
        文本内容
      </label>
      <p class="mb-2 text-xs text-ink-faint">
        模拟错别字：<code class="rounded bg-paper-line/50 px-1">{田气=&gt;天气}</code>
      </p>
      <textarea
        id="hw-text"
        :value="text"
        :maxlength="MAX_LEN"
        rows="16"
        placeholder="输入要誊写的文字…"
        class="w-full resize-y rounded-lg border border-paper-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-cinnabar focus:outline-none focus:ring-1 focus:ring-cinnabar/30"
        @input="emit('update:text', ($event.target as HTMLTextAreaElement).value)"
      />
      <p class="mt-1 text-right text-xs" :class="overLimit ? 'text-cinnabar' : 'text-ink-faint'">
        {{ len }} / {{ MAX_LEN }}
      </p>
    </div>

    <button type="button" class="btn-ghost btn-sm w-full" @click="emit('sample')">
      试试示例文案
    </button>

    <p class="text-xs leading-relaxed text-ink-faint">
      隐私说明：内容仅保存在本机浏览器，不会上传服务器。
    </p>
  </aside>
</template>
