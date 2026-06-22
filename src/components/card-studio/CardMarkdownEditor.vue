<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type { EditorView } from '@codemirror/view'
import { useCodeMirrorMarkdown } from '@/composables/useCodeMirrorMarkdown'
import { applyGfmToolbarAction } from '@/composables/useMarkdownInsert'
import { GFM_TOOLBAR_ACTIONS, type GfmToolbarActionId } from '@/composables/gfmToolbarActions'
import { CARD_SYNTAX_SECTIONS } from '@/engine/card-studio/cardSyntaxGuide'
import {
  CARD_STUDIO_TEMPLATES,
  type CardStudioTemplateId,
} from '@/engine/card-studio/cardStudioTemplates'

const model = defineModel<string>({ required: true })

defineProps<{
  hadModules: boolean
}>()

const emit = defineEmits<{
  template: [id: CardStudioTemplateId]
}>()

const host = ref<HTMLElement | null>(null)
const helpOpen = ref(false)
const editorView = shallowRef<EditorView | null>(null)
const templatePick = ref<CardStudioTemplateId | ''>('')

const toolbarActions = GFM_TOOLBAR_ACTIONS
const sceneTemplates = CARD_STUDIO_TEMPLATES

useCodeMirrorMarkdown(model, host, {
  placeholder: '在此输入 Markdown…',
  fillHeight: true,
  onCreate(_handler, view) {
    editorView.value = view
  },
})

function onAction(id: GfmToolbarActionId) {
  applyGfmToolbarAction(editorView.value, id)
}

function onTemplatePick() {
  const id = templatePick.value
  if (!id) return
  emit('template', id)
  templatePick.value = ''
}
</script>

<template>
  <aside class="flex min-h-0 flex-col border-r border-paper-line bg-paper-bright">
    <div v-if="hadModules" class="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
      检测到排版模块（:::），已降级为普通 Markdown 显示。
    </div>

    <div class="flex flex-wrap items-center gap-0.5 border-b border-paper-line px-2 py-1.5">
      <button
        v-for="action in toolbarActions"
        :key="action.id"
        type="button"
        class="card-editor-toolbar__btn"
        :title="action.title"
        @click="onAction(action.id)"
      >
        {{ action.label }}
      </button>
      <div class="ml-auto flex items-center gap-1">
        <label class="sr-only" for="card-scene-template">场景模板</label>
        <select
          id="card-scene-template"
          v-model="templatePick"
          class="card-editor-template-select"
          @change="onTemplatePick"
        >
          <option value="" disabled selected>场景模板</option>
          <option
            v-for="tpl in sceneTemplates"
            :key="tpl.id"
            :value="tpl.id"
            :title="tpl.desc"
          >
            {{ tpl.label }}
          </option>
        </select>
        <button type="button" class="btn-ghost btn-sm" @click="helpOpen = !helpOpen">
          {{ helpOpen ? '收起语法' : '语法' }}
        </button>
      </div>
    </div>

    <div
      v-if="helpOpen"
      class="max-h-56 overflow-y-auto border-b border-paper-line bg-paper px-4 py-3 text-xs leading-relaxed text-ink-soft"
    >
      <section v-for="section in CARD_SYNTAX_SECTIONS" :key="section.title" class="mb-3 last:mb-0">
        <h3 class="mb-1 font-semibold text-ink">{{ section.title }}</h3>
        <div v-for="item in section.items" :key="item.title" class="mb-2 last:mb-0">
          <p class="font-medium text-ink">{{ item.title }}</p>
          <pre class="mt-0.5 overflow-x-auto rounded bg-paper-line/40 px-2 py-1 text-[10px] text-ink-muted">{{ item.syntax }}</pre>
          <p v-if="item.note" class="mt-0.5 text-[10px] text-ink-faint">{{ item.note }}</p>
        </div>
      </section>
    </div>

    <div ref="host" class="min-h-0 flex-1 overflow-hidden" />
  </aside>
</template>

<style scoped>
.card-editor-toolbar__btn {
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-ink-muted, #64748b);
  cursor: pointer;
}

.card-editor-toolbar__btn:hover {
  border-color: var(--color-paper-line, #e2e8f0);
  background: var(--color-paper-dim, #f8fafc);
  color: var(--color-ink, #1e293b);
}

.card-editor-template-select {
  max-width: 108px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--color-paper-line, #e2e8f0);
  background: var(--color-paper-bright, #fff);
  padding: 0 6px;
  font-size: 11px;
  color: var(--color-ink-muted, #64748b);
  cursor: pointer;
}

.card-editor-template-select:hover {
  border-color: var(--color-jade, #0d9488);
  color: var(--color-ink, #1e293b);
}
</style>
