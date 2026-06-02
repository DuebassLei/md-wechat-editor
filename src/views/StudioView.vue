<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppShell from '@/components/AppShell.vue'
import DocSidebar from '@/components/DocSidebar.vue'
import EditorWorkspace from '@/components/EditorWorkspace.vue'
import { useLocalDocs } from '@/composables/useLocalDocs'
import { STUDIO_SAMPLE_MARKDOWN } from '@/constants/studioSampleMarkdown'
import type { ThemeId } from '@/engine'
import { normalizeThemeId } from '@/types/theme'
import type { LocalDoc } from '@/composables/useLocalDocs'
import { extractMarkdownTitle, shouldAutoTitleDoc } from '@/meta/extractMarkdownTitle'

const {
  docs,
  activeId,
  persistError,
  createDoc,
  deleteDoc,
  restoreDoc,
  renameDoc,
  updateDoc,
  activeDoc,
  flushPersist,
} = useLocalDocs()

const sidebarCollapsed = ref(localStorage.getItem('moyun-jianpai-sidebar') === '1')
const mobileDocsOpen = ref(false)
const undoDelete = ref<{ snapshot: LocalDoc; index: number } | null>(null)
let undoTimer: ReturnType<typeof setTimeout> | null = null

const content = ref('')
const themeId = ref<ThemeId>('normal')

function syncFromActive() {
  const doc = activeDoc()
  if (doc) {
    content.value = doc.content
    themeId.value = normalizeThemeId(doc.themeId)
  } else {
    content.value = STUDIO_SAMPLE_MARKDOWN
    themeId.value = 'normal'
  }
}

watch(activeId, syncFromActive, { immediate: true })

let contentSaveTimer: ReturnType<typeof setTimeout> | null = null
watch([content, themeId], () => {
  const id = activeId.value
  if (!id) return
  if (contentSaveTimer) clearTimeout(contentSaveTimer)
  contentSaveTimer = setTimeout(() => {
    const doc = activeDoc()
    const patch: { content: string; themeId: ThemeId; title?: string } = {
      content: content.value,
      themeId: themeId.value,
    }
    if (doc && shouldAutoTitleDoc(doc.title)) {
      const autoTitle = extractMarkdownTitle(content.value)
      if (autoTitle) patch.title = autoTitle
    }
    updateDoc(id, patch)
    contentSaveTimer = null
  }, 400)
})

watch(sidebarCollapsed, (v) => {
  localStorage.setItem('moyun-jianpai-sidebar', v ? '1' : '0')
})

function onCreate() {
  const doc = createDoc()
  content.value = ''
  themeId.value = 'normal'
  activeId.value = doc.id
  mobileDocsOpen.value = false
}

function onSelect(id: string) {
  activeId.value = id
}

function onDelete(id: string) {
  if (!confirm('确定删除该文档？')) return
  const index = docs.value.findIndex((d) => d.id === id)
  const removed = deleteDoc(id)
  if (removed && index >= 0) {
    undoDelete.value = { snapshot: { ...removed }, index }
    if (undoTimer) clearTimeout(undoTimer)
    undoTimer = setTimeout(() => {
      undoDelete.value = null
    }, 8000)
  }
  syncFromActive()
}

function undoLastDelete() {
  if (!undoDelete.value) return
  restoreDoc(undoDelete.value.snapshot, undoDelete.value.index)
  undoDelete.value = null
  if (undoTimer) clearTimeout(undoTimer)
  syncFromActive()
}

function exportDoc(id: string) {
  const doc = docs.value.find((d) => d.id === id)
  if (!doc) return
  const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${doc.title.replace(/[\\/:*?"<>|]/g, '_') || 'document'}.md`
  a.click()
  URL.revokeObjectURL(url)
}

async function importDoc(file: File) {
  const text = await file.text()
  const doc = createDoc(file.name.replace(/\.(md|markdown)$/i, '') || '导入文档')
  content.value = text
  themeId.value = 'normal'
  updateDoc(doc.id, { content: text, themeId: 'normal' })
  mobileDocsOpen.value = false
}

onMounted(() => {
  if (!docs.value.length) {
    const doc = createDoc('入门草稿')
    doc.content = STUDIO_SAMPLE_MARKDOWN
    activeId.value = doc.id
    syncFromActive()
  }
})

onBeforeUnmount(() => {
  flushPersist()
})
</script>

<template>
  <AppShell studio>
    <div class="studio-layout">
      <DocSidebar
        v-model:mobile-open="mobileDocsOpen"
        :docs="docs"
        :active-id="activeId"
        :collapsed="sidebarCollapsed"
        @select="onSelect"
        @create="onCreate"
        @delete="onDelete"
        @rename="renameDoc"
        @export="exportDoc"
        @import="importDoc"
        @update:collapsed="sidebarCollapsed = $event"
      />
      <EditorWorkspace
        v-model="content"
        v-model:theme-id="themeId"
        @open-docs="mobileDocsOpen = true"
      />
    </div>
    <p v-if="persistError" class="studio-toast studio-toast--error">{{ persistError }}</p>
    <p v-if="undoDelete" class="studio-toast">
      已删除「{{ undoDelete.snapshot.title }}」
      <button type="button" class="studio-toast__action" @click="undoLastDelete">撤销</button>
    </p>
  </AppShell>
</template>

<style scoped>
.studio-layout {
  @apply flex min-h-0 flex-1 overflow-hidden;
}
.studio-toast {
  @apply fixed bottom-4 left-1/2 z-[320] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-xs text-white shadow-card-hover;
}
.studio-toast--error {
  @apply bg-red-700;
}
.studio-toast__action {
  @apply ml-2 underline;
}
</style>
