<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type { EditorView } from '@codemirror/view'
import {
  useCodeMirrorMarkdown,
  type CodeMirrorInsertHandler,
} from '@/composables/useCodeMirrorMarkdown'
import { applyGfmToolbarAction } from '@/composables/useMarkdownInsert'
import { GFM_TOOLBAR_ACTIONS, type GfmToolbarActionId } from '@/composables/gfmToolbarActions'
import type { LayoutModuleMeta } from '@/constants/layoutModules'
import LayoutModulePicker from '@/components/LayoutModulePicker.vue'
import SyntaxDrawer from '@/components/SyntaxDrawer.vue'

const model = defineModel<string>({ required: true })

const props = withDefaults(
  defineProps<{
    placeholder?: string
    fillHeight?: boolean
  }>(),
  { placeholder: '在此输入 Markdown…', fillHeight: true },
)

const emit = defineEmits<{
  moduleInserted: [module: LayoutModuleMeta]
}>()

const hostRef = ref<HTMLElement | null>(null)
const pickerOpen = ref(false)
const syntaxOpen = ref(false)
const insertHandler = ref<CodeMirrorInsertHandler | null>(null)
const editorView = shallowRef<EditorView | null>(null)

useCodeMirrorMarkdown(model, hostRef, {
  placeholder: props.placeholder,
  fillHeight: props.fillHeight,
  onCreate(handler, view) {
    insertHandler.value = handler
    editorView.value = view
  },
})

function insertAtCursor(text: string) {
  if (!text) return
  const handler = insertHandler.value
  const view = editorView.value
  if (handler && view) {
    handler.insertAtCursor(text)
    return
  }
  model.value += text
}

function onGfmAction(id: GfmToolbarActionId) {
  applyGfmToolbarAction(editorView.value, id)
}

function onModuleInsert(snippet: string, mod: LayoutModuleMeta) {
  insertAtCursor(snippet)
  emit('moduleInserted', mod)
}

function onSyntaxInsert(syntax: string) {
  insertAtCursor(syntax)
}

function openModulePickerFromSyntax() {
  pickerOpen.value = true
}

function openSyntaxDrawer() {
  syntaxOpen.value = true
}

defineExpose({ insertAtCursor, openSyntaxDrawer, editorView })
</script>

<template>
  <div class="editor-wrap" :class="{ 'editor-wrap--fill': fillHeight }">
    <div class="editor-toolbar">
      <div class="editor-toolbar__chips">
        <button
          v-for="action in GFM_TOOLBAR_ACTIONS"
          :key="action.id"
          type="button"
          class="chip-btn shrink-0"
          :title="action.title"
          :aria-label="action.ariaLabel"
          @click="onGfmAction(action.id)"
        >
          {{ action.label }}
        </button>
      </div>
      <div class="editor-toolbar__actions">
        <button type="button" class="btn-secondary btn-sm shrink-0" @click="syntaxOpen = true">
          语法手册
        </button>
        <button type="button" class="btn-primary btn-sm shrink-0" @click="pickerOpen = true">
          插入组件
        </button>
      </div>
    </div>
    <div ref="hostRef" class="editor-host" />
    <SyntaxDrawer
      v-model:open="syntaxOpen"
      @insert="onSyntaxInsert"
      @open-module-picker="openModulePickerFromSyntax"
    />
    <LayoutModulePicker v-model:open="pickerOpen" @insert="onModuleInsert" />
  </div>
</template>

<style scoped>
.editor-wrap {
  @apply flex min-h-0 flex-col;
}
.editor-wrap--fill {
  @apply h-full;
}
.editor-toolbar {
  @apply flex shrink-0 flex-wrap items-center gap-2 border-b border-paper-line px-2 py-2 sm:px-3;
}
.editor-toolbar__chips {
  @apply flex min-w-0 flex-1 items-center gap-1 overflow-x-auto;
  scrollbar-width: thin;
}
.editor-toolbar__actions {
  @apply flex shrink-0 items-center gap-1.5;
}
.editor-host {
  @apply min-h-0 flex-1 overflow-hidden;
}
.editor-wrap--fill .editor-host :deep(.cm-editor) {
  height: 100%;
}
</style>
