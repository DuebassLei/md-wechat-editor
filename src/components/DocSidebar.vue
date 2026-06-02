<script setup lang="ts">
import { ref } from 'vue'
import DocSidebarBody from '@/components/DocSidebarBody.vue'
import type { LocalDoc } from '@/composables/useLocalDocs'

defineProps<{
  docs: LocalDoc[]
  activeId: string | null
  collapsed?: boolean
}>()

const mobileOpen = defineModel<boolean>('mobileOpen', { default: false })

const emit = defineEmits<{
  select: [id: string]
  create: []
  delete: [id: string]
  rename: [id: string, title: string]
  export: [id: string]
  import: [file: File]
  'update:collapsed': [value: boolean]
}>()

const renamingId = ref<string | null>(null)
const renameValue = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

function onSelect(id: string) {
  emit('select', id)
  mobileOpen.value = false
}

function triggerImport() {
  fileInputRef.value?.click()
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) emit('import', file)
  input.value = ''
}
</script>

<template>
  <aside class="sidebar hidden h-full lg:flex lg:flex-col" :class="{ 'sidebar--collapsed': collapsed }">
    <DocSidebarBody
      v-model:renaming-id="renamingId"
      v-model:rename-value="renameValue"
      :docs="docs"
      :active-id="activeId"
      :collapsed="collapsed"
      @create="emit('create')"
      @select="onSelect"
      @delete="emit('delete', $event)"
      @rename="(id, title) => emit('rename', id, title)"
      @export="emit('export', $event)"
      @import="triggerImport"
      @update:collapsed="emit('update:collapsed', $event)"
    />
  </aside>

  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="mobileOpen"
        class="doc-drawer-overlay lg:hidden"
        role="presentation"
        @click.self="mobileOpen = false"
      >
        <aside class="doc-drawer card" role="dialog" aria-label="文档列表" @click.stop>
          <DocSidebarBody
            v-model:renaming-id="renamingId"
            v-model:rename-value="renameValue"
            :docs="docs"
            :active-id="activeId"
            :collapsed="false"
            mobile
            @create="emit('create')"
            @select="onSelect"
            @delete="emit('delete', $event)"
            @rename="(id, title) => emit('rename', id, title)"
            @export="emit('export', $event)"
            @import="triggerImport"
            @close="mobileOpen = false"
          />
        </aside>
      </div>
    </Transition>
  </Teleport>

  <input
    ref="fileInputRef"
    type="file"
    accept=".md,.markdown,text/markdown"
    class="sr-only"
    @change="onFileChange"
  >
</template>

<style scoped>
.sidebar {
  @apply w-56 shrink-0 flex-col border-r border-paper-line bg-paper-bright/80;
}
.sidebar--collapsed {
  @apply w-12;
}
.doc-drawer-overlay {
  @apply fixed inset-0 z-[260] flex justify-start bg-ink/25;
}
.doc-drawer {
  @apply flex h-full w-[min(100%,18rem)] flex-col overflow-hidden shadow-card-hover;
}
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-enter-active .doc-drawer,
.drawer-leave-active .doc-drawer {
  transition: transform 0.2s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .doc-drawer,
.drawer-leave-to .doc-drawer {
  transform: translateX(-100%);
}
.sr-only {
  @apply absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0;
  clip: rect(0, 0, 0, 0);
}
</style>
