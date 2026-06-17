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
import ImageHostSettingsDrawer from '@/components/ImageHostSettingsDrawer.vue'
import { useImageImport } from '@/composables/useImageImport'

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
  imageError: [message: string]
}>()

const hostRef = ref<HTMLElement | null>(null)
const pickerOpen = ref(false)
const syntaxOpen = ref(false)
const hostSettingsOpen = ref(false)
const insertHandler = ref<CodeMirrorInsertHandler | null>(null)
const editorView = shallowRef<EditorView | null>(null)
const localInputRef = ref<HTMLInputElement | null>(null)
const hostInputRef = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)

const { importing, importLocalFiles, uploadHostFiles } = useImageImport()

const toolbarActions = GFM_TOOLBAR_ACTIONS.filter((a) => a.id !== 'image')

function onImageFiles(files: File[], view: EditorView) {
  void handleLocalFiles(files, view)
}

useCodeMirrorMarkdown(model, hostRef, {
  placeholder: props.placeholder,
  fillHeight: props.fillHeight,
  onImageFiles,
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

function insertImageLink() {
  applyGfmToolbarAction(editorView.value, 'image')
}

async function handleLocalFiles(files: File[] | FileList, view?: EditorView | null) {
  try {
    await importLocalFiles(files, view ?? editorView.value, model.value)
  } catch (e) {
    const msg = e instanceof Error ? e.message : '导入失败'
    emit('imageError', msg)
  }
}

async function onLocalInput(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return
  await handleLocalFiles(files)
  input.value = ''
}

async function onHostInput(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return
  try {
    await uploadHostFiles(files, editorView.value)
  } catch (e) {
    const msg = e instanceof Error ? e.message : '上传失败'
    emit('imageError', msg)
  }
  input.value = ''
}

function onDragOver(e: DragEvent) {
  if (!e.dataTransfer?.types.includes('Files')) return
  e.preventDefault()
  dragOver.value = true
}

function onDragLeave() {
  dragOver.value = false
}

defineExpose({ insertAtCursor, openSyntaxDrawer: () => { syntaxOpen.value = true }, editorView })
</script>

<template>
  <div class="editor-wrap" :class="{ 'editor-wrap--fill': fillHeight }">
    <div class="editor-toolbar">
      <div class="editor-toolbar__chips">
        <button
          v-for="action in toolbarActions"
          :key="action.id"
          type="button"
          class="chip-btn shrink-0"
          :title="action.title"
          :aria-label="action.ariaLabel"
          @click="onGfmAction(action.id)"
        >
          {{ action.label }}
        </button>
        <button
          type="button"
          class="chip-btn shrink-0"
          title="从本机选择图片，压缩后插入"
          aria-label="本地插入图片"
          :disabled="importing"
          :aria-busy="importing"
          @click="localInputRef?.click()"
        >
          {{ importing ? '处理中…' : '本地插入' }}
        </button>
        <div class="relative shrink-0">
          <button
            type="button"
            class="chip-btn"
            title="上传到图床并插入链接"
            aria-label="上传图床"
            :disabled="importing"
            @click="hostInputRef?.click()"
          >
            上传图床
          </button>
          <button
            type="button"
            class="chip-btn chip-btn--caret"
            aria-label="图床设置"
            @click="hostSettingsOpen = true"
          >
            ▾
          </button>
        </div>
        <button
          type="button"
          class="chip-btn shrink-0"
          title="插入 Markdown 图片链接语法"
          aria-label="插入图片链接"
          @click="insertImageLink"
        >
          链接
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
    <div
      ref="hostRef"
      class="editor-host"
      :class="{ 'editor-host--drag': dragOver }"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="dragOver = false"
    >
      <div v-if="dragOver" class="editor-host__drop-hint">松开以上传图片</div>
    </div>
    <input
      ref="localInputRef"
      type="file"
      accept="image/*"
      multiple
      class="sr-only"
      @change="onLocalInput"
    >
    <input
      ref="hostInputRef"
      type="file"
      accept="image/*"
      multiple
      class="sr-only"
      @change="onHostInput"
    >
    <SyntaxDrawer
      v-model:open="syntaxOpen"
      @insert="onSyntaxInsert"
      @open-module-picker="pickerOpen = true"
    />
    <LayoutModulePicker v-model:open="pickerOpen" @insert="onModuleInsert" />
    <ImageHostSettingsDrawer v-model:open="hostSettingsOpen" />
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
  @apply relative min-h-0 flex-1 overflow-hidden;
}
.editor-host--drag {
  @apply ring-2 ring-inset ring-cinnabar/40;
}
.editor-host__drop-hint {
  @apply pointer-events-none absolute inset-x-0 bottom-4 z-10 mx-auto w-fit rounded-full bg-paper-bright/95 px-4 py-1.5 text-xs text-ink-muted shadow-sm;
}
.editor-wrap--fill .editor-host :deep(.cm-editor) {
  height: 100%;
}
.chip-btn--caret {
  @apply !px-1.5 !min-w-0;
}
.sr-only {
  @apply absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0;
  clip: rect(0, 0, 0, 0);
}
</style>
