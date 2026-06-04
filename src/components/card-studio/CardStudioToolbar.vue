<script setup lang="ts">
import type { CardAspect } from '@/engine/card-export/types'

defineProps<{
  canExport: boolean
  busy: boolean
  pageCount: number
  status: string
}>()

const emit = defineEmits<{
  exportAll: []
  exportOne: []
  clear: []
}>()

const aspect = defineModel<CardAspect>('aspect', { required: true })
const singleCardMode = defineModel<boolean>('singleCardMode', { required: true })
const includeCover = defineModel<boolean>('includeCover', { required: true })
const zoom = defineModel<number>('zoom', { default: 0.8 })

const zoomOptions = [
  { label: '40%', value: 0.4 },
  { label: '60%', value: 0.6 },
  { label: '80%', value: 0.8 },
  { label: '100%', value: 1 },
]
</script>

<template>
  <div class="card-studio-toolbar shrink-0 border-b border-paper-line bg-paper-bright px-4 py-2">
    <div class="flex flex-wrap items-center gap-2">
      <label class="flex items-center gap-1.5 text-xs text-ink-muted">
        比例
        <select
          v-model="aspect"
          class="rounded-md border border-paper-line bg-paper px-2 py-1 text-sm text-ink"
        >
          <option value="3:4">3:4</option>
          <option value="1:1">1:1</option>
        </select>
      </label>

      <label class="flex cursor-pointer items-center gap-1.5 text-xs text-ink-muted">
        <input v-model="includeCover" type="checkbox" class="rounded border-paper-line">
        封面首图
      </label>

      <label class="flex cursor-pointer items-center gap-1.5 text-xs text-ink-muted">
        <input v-model="singleCardMode" type="checkbox" class="rounded border-paper-line">
        单卡模式
      </label>

      <label class="flex items-center gap-1.5 text-xs text-ink-muted">
        缩放
        <select
          v-model.number="zoom"
          class="rounded-md border border-paper-line bg-paper px-2 py-1 text-sm text-ink"
        >
          <option v-for="opt in zoomOptions" :key="opt.label" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </label>

      <span v-if="pageCount > 0" class="text-xs text-ink-faint">{{ pageCount }} 张</span>

      <div class="ml-auto flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="btn-ghost btn-sm"
          :disabled="!canExport || busy"
          @click="emit('exportOne')"
        >
          导出当前
        </button>
        <button
          type="button"
          class="btn-primary btn-sm"
          :disabled="!canExport || busy"
          @click="emit('exportAll')"
        >
          导出 ZIP
        </button>
        <button type="button" class="btn-ghost btn-sm" @click="emit('clear')">清空</button>
      </div>
    </div>
    <p v-if="status" class="mt-1 text-xs text-ink-muted">{{ status }}</p>
  </div>
</template>
