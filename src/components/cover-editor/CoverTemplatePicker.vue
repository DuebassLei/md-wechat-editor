<script setup lang="ts">
import { computed } from 'vue'
import { COVER_TEMPLATES, COVER_TEMPLATE_GROUPS } from '@/engine/cover-editor/coverTemplates'
import { getBgPreset } from '@/engine/cover-editor/constants'
import type { CoverTemplate } from '@/engine/cover-editor/types'

const model = defineModel<string>('activeTemplateId', { default: '' })

const { sidebar = false } = defineProps<{
  /** 侧栏模式：单列布局，不重复显示标题 */
  sidebar?: boolean
}>()

const emit = defineEmits<{
  apply: [template: CoverTemplate]
}>()

const grouped = computed(() =>
  COVER_TEMPLATE_GROUPS
    .map((g) => ({
      ...g,
      templates: COVER_TEMPLATES.filter((t) => t.group === g.key),
    }))
    .filter((g) => g.templates.length > 0),
)

function select(template: CoverTemplate) {
  model.value = template.id
  emit('apply', template)
}

function previewStyle(template: CoverTemplate) {
  const bg = getBgPreset(template.bgPresetId)
  return {
    background: bg.background,
    '--tpl-title': template.titleColor,
    '--tpl-keywords': template.keywordsColor,
    '--tpl-overlay': String(template.overlayOpacity),
  } as Record<string, string>
}

function layoutClass(template: CoverTemplate) {
  return template.layout === 'left' ? 'cover-template-picker__mock--left' : ''
}
</script>

<template>
  <div class="cover-template-picker space-y-3">
    <div v-if="!sidebar">
      <h3 class="text-xs font-semibold text-ink-soft">快速模板</h3>
      <p class="mt-0.5 text-[11px] text-ink-faint">一键套用字体、配色与背景，再改标题即可导出</p>
    </div>

    <div class="space-y-4">
      <section v-for="g in grouped" :key="g.key">
        <h4 class="mb-2 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
          {{ g.label }}
        </h4>
        <div
          class="grid gap-2"
          :class="sidebar ? 'grid-cols-1' : 'grid-cols-2'"
          role="listbox"
          :aria-label="`${g.label}模板`"
        >
          <button
            v-for="tpl in g.templates"
            :key="tpl.id"
            type="button"
            class="cover-template-picker__card"
            role="option"
            :aria-selected="model === tpl.id"
            :title="tpl.desc"
            @click="select(tpl)"
          >
            <div
              class="cover-template-picker__preview aspect-[16/10]"
              :class="layoutClass(tpl)"
              :style="previewStyle(tpl)"
            >
              <div class="cover-template-picker__overlay" aria-hidden="true" />
              <div class="cover-template-picker__mock">
                <span class="cover-template-picker__title" />
                <span class="cover-template-picker__keywords" />
              </div>
            </div>
            <span class="cover-template-picker__label">{{ tpl.label }}</span>
            <span class="cover-template-picker__desc">{{ tpl.desc }}</span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.cover-template-picker__card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px;
  border-radius: 10px;
  border: 1px solid var(--color-paper-line, #e2e8f0);
  background: var(--color-paper-bright, #fff);
  cursor: pointer;
  text-align: left;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.cover-template-picker__card:hover {
  border-color: rgb(var(--cinnabar-rgb) / 0.45);
  box-shadow: 0 4px 14px rgb(var(--color-shadow-ink) / 0.08);
  transform: translateY(-1px);
}

.cover-template-picker__card[aria-selected='true'] {
  border-color: var(--color-cinnabar, #c45c4a);
  box-shadow:
    0 0 0 1px rgb(var(--cinnabar-rgb) / 0.35),
    0 6px 18px rgb(var(--cinnabar-rgb) / 0.12);
}

.cover-template-picker__preview {
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid rgb(var(--color-shadow-ink) / 0.06);
}

.cover-template-picker__overlay {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / var(--tpl-overlay, 0.2));
  pointer-events: none;
}

.cover-template-picker__mock {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 100%;
  padding: 8px;
}

.cover-template-picker__mock--left {
  align-items: flex-start;
  justify-content: flex-start;
  padding: 8px 10px;
}

.cover-template-picker__title {
  display: block;
  width: 58%;
  height: 6px;
  border-radius: 2px;
  background: var(--tpl-title);
  opacity: 0.92;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
}

.cover-template-picker__mock--left .cover-template-picker__title {
  width: 72%;
}

.cover-template-picker__keywords {
  display: block;
  width: 38%;
  height: 4px;
  border-radius: 2px;
  background: var(--tpl-keywords);
  opacity: 0.75;
}

.cover-template-picker__mock--left .cover-template-picker__keywords {
  width: 48%;
}

.cover-template-picker__label {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-ink, #1e293b);
  padding: 0 2px;
}

.cover-template-picker__desc {
  font-size: 10px;
  line-height: 1.25;
  color: var(--color-ink-faint, #94a3b8);
  padding: 0 2px 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cover-template-picker__card[aria-selected='true'] .cover-template-picker__label {
  color: var(--color-cinnabar, #c45c4a);
}
</style>
