<script setup lang="ts">
import type { LocalDoc } from '@/composables/useLocalDocs'

defineProps<{
  docs: LocalDoc[]
  activeId: string | null
  collapsed?: boolean
  mobile?: boolean
}>()

const emit = defineEmits<{
  create: []
  select: [id: string]
  delete: [id: string]
  rename: [id: string, title: string]
  export: [id: string]
  import: []
  'update:collapsed': [value: boolean]
  close: []
}>()

const renamingId = defineModel<string | null>('renamingId', { default: null })
const renameValue = defineModel<string>('renameValue', { default: '' })

function startRename(doc: LocalDoc) {
  renamingId.value = doc.id
  renameValue.value = doc.title
}

function commitRename(id: string) {
  emit('rename', id, renameValue.value)
  renamingId.value = null
}
</script>

<template>
  <div class="sidebar-body flex min-h-0 flex-1 flex-col">
    <div class="sidebar__head">
      <span v-if="!collapsed" class="text-sm font-semibold text-ink">文档</span>
      <div class="flex items-center gap-1">
        <button
          v-if="mobile"
          type="button"
          class="btn-ghost btn-sm"
          aria-label="关闭文档列表"
          @click="emit('close')"
        >
          关闭
        </button>
        <button
          v-else
          type="button"
          class="btn-ghost btn-sm"
          :aria-label="collapsed ? '展开侧栏' : '收起侧栏'"
          @click="emit('update:collapsed', !collapsed)"
        >
          {{ collapsed ? '»' : '«' }}
        </button>
      </div>
    </div>
    <template v-if="!collapsed">
      <button type="button" class="btn-primary btn-sm mx-3 mb-2 w-[calc(100%-1.5rem)]" @click="emit('create')">
        新建文档
      </button>
      <ul class="sidebar__list">
        <li v-for="doc in docs" :key="doc.id">
          <div
            class="doc-row"
            :class="{ 'doc-row--active': activeId === doc.id }"
            @click="emit('select', doc.id)"
          >
            <template v-if="renamingId === doc.id">
              <input
                v-model="renameValue"
                class="input py-1 text-xs"
                @keydown.enter="commitRename(doc.id)"
                @blur="commitRename(doc.id)"
                @click.stop
              >
            </template>
            <template v-else>
              <span class="min-w-0 flex-1 truncate">{{ doc.title }}</span>
              <button
                type="button"
                class="btn-ghost btn-sm shrink-0 px-1"
                aria-label="重命名"
                @click.stop="startRename(doc)"
              >
                改
              </button>
              <button
                type="button"
                class="btn-ghost btn-sm shrink-0 px-1 text-red-600"
                aria-label="删除"
                @click.stop="emit('delete', doc.id)"
              >
                删
              </button>
            </template>
          </div>
        </li>
      </ul>
      <p v-if="!docs.length" class="state-empty mx-3 text-xs">暂无文档，点击新建</p>
      <div v-if="activeId" class="sidebar__footer mx-3 mb-3 flex flex-wrap gap-1.5">
        <button type="button" class="btn-secondary btn-sm" @click="emit('export', activeId)">导出 .md</button>
        <button type="button" class="btn-secondary btn-sm" @click="emit('import')">导入 .md</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.sidebar__head {
  @apply flex items-center justify-between gap-2 border-b border-paper-line px-3 py-2;
}
.sidebar__list {
  @apply min-h-0 flex-1 overflow-y-auto px-1 py-2;
}
.sidebar__footer {
  @apply shrink-0 border-t border-paper-line pt-2;
}
</style>
