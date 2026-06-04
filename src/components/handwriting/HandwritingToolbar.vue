<script setup lang="ts">
import { ref } from 'vue'
import {
  downloadHandwritingBlob,
  exportHandwritingToBlob,
} from '@/engine/handwriting/exportHandwriting'

const props = defineProps<{
  sheetEl: HTMLElement | null
  paperName: string
  canExport: boolean
}>()

const emit = defineEmits<{
  clear: []
}>()

const zoom = defineModel<number>('zoom', { default: 0.5 })

const toast = ref('')
const exporting = ref(false)

const zoomOptions = [
  { label: '25%', value: 0.25 },
  { label: '50%', value: 0.5 },
  { label: '75%', value: 0.75 },
  { label: '100%', value: 1 },
]

function showToast(msg: string) {
  toast.value = msg
  window.setTimeout(() => {
    toast.value = ''
  }, 4000)
}

async function exportPng() {
  const el = props.sheetEl
  if (!el) {
    showToast('导出失败：预览未就绪')
    return
  }

  exporting.value = true
  const prevTransform = el.style.transform
  el.style.transform = 'none'

  try {
    const blob = await exportHandwritingToBlob(el)
    if (!blob) {
      showToast('导出失败：无法生成图片')
      return
    }
    downloadHandwritingBlob(blob, props.paperName)
  } catch {
    showToast('导出失败，请重试')
  } finally {
    el.style.transform = prevTransform
    exporting.value = false
  }
}
</script>

<template>
  <div class="handwriting-toolbar shrink-0 border-b border-paper-line bg-paper-bright px-4 py-2">
    <div class="flex flex-wrap items-center gap-2">
      <label class="flex items-center gap-1 text-xs text-ink-muted">
        <span class="sr-only">缩放</span>
        <select
          v-model.number="zoom"
          class="rounded-md border border-paper-line bg-paper px-2 py-1 text-sm text-ink"
        >
          <option v-for="opt in zoomOptions" :key="opt.label" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </label>

      <button type="button" class="btn-ghost btn-sm" @click="emit('clear')">
        清空内容
      </button>

      <button
        type="button"
        class="btn-primary btn-sm ml-auto"
        :disabled="!canExport || exporting"
        @click="exportPng"
      >
        {{ exporting ? '导出中…' : '导出 PNG' }}
      </button>
    </div>

    <p v-if="toast" class="mt-1 shrink-0 text-center text-xs text-cinnabar">{{ toast }}</p>
  </div>
</template>
