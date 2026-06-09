<script setup lang="ts">
import { ref } from 'vue'
import { COVER_ASPECT_LABELS } from '@/engine/cover-editor/constants'
import type { CoverAspect } from '@/engine/cover-editor/types'

defineProps<{
  canExport: boolean
  exporting: boolean
  status: string
}>()

const emit = defineEmits<{
  export: []
  reset: []
}>()

const aspect = defineModel<CoverAspect>('aspect', { required: true })
const zoom = defineModel<number>('zoom', { default: 0.85 })

const zoomOptions = [
  { label: '50%', value: 0.5 },
  { label: '75%', value: 0.75 },
  { label: '85%', value: 0.85 },
  { label: '100%', value: 1 },
]

const aspectOptions = (Object.keys(COVER_ASPECT_LABELS) as CoverAspect[]).map((id) => ({
  id,
  label: COVER_ASPECT_LABELS[id],
}))
</script>

<template>
  <div class="cover-toolbar shrink-0 border-b border-paper-line bg-paper-bright px-4 py-2">
    <div class="flex flex-wrap items-center gap-2">
      <div class="segmented-control" role="tablist" aria-label="封面比例">
        <button
          v-for="opt in aspectOptions"
          :key="opt.id"
          type="button"
          class="segmented-control__tab"
          role="tab"
          :aria-selected="aspect === opt.id"
          @click="aspect = opt.id"
        >
          {{ opt.label }}
        </button>
      </div>

      <label class="flex items-center gap-1 text-xs text-ink-muted">
        <span>缩放</span>
        <select
          v-model.number="zoom"
          class="rounded-md border border-paper-line bg-paper px-2 py-1 text-sm text-ink"
        >
          <option v-for="opt in zoomOptions" :key="opt.label" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </label>

      <button type="button" class="btn-ghost btn-sm" @click="emit('reset')">
        重置
      </button>

      <button
        type="button"
        class="btn-primary btn-sm ml-auto"
        :disabled="!canExport || exporting"
        @click="emit('export')"
      >
        {{ exporting ? '导出中…' : '下载封面' }}
      </button>
    </div>

    <p v-if="status" class="mt-1 shrink-0 text-center text-xs text-cinnabar">{{ status }}</p>
  </div>
</template>
