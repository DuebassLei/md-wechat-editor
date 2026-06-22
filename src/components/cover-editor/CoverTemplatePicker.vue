<script setup lang="ts">
import { computed } from 'vue'
import CoverXhsLayout from '@/components/cover-editor/CoverXhsLayout.vue'
import {
  COVER_TEMPLATES,
  COVER_TEMPLATE_GROUPS,
  filterCoverTemplatesByAspect,
  getCoverTemplateSubgroup,
  XHS_SUBGROUP_ORDER,
} from '@/engine/cover-editor/coverTemplates'
import { COVER_ASPECT_LABELS, getBgPreset } from '@/engine/cover-editor/constants'
import type { CoverAspect, CoverTemplate } from '@/engine/cover-editor/types'

interface TemplateSubgroup {
  label: string
  templates: CoverTemplate[]
}

interface TemplateGroup {
  key: string
  label: string
  templates: CoverTemplate[]
  subgroups: TemplateSubgroup[] | null
}

const model = defineModel<string>('activeTemplateId', { default: '' })

const { sidebar = false, aspect = 'landscape' } = defineProps<{
  /** 侧栏模式：单列布局，不重复显示标题 */
  sidebar?: boolean
  /** 当前封面比例，仅展示匹配比例的模板 */
  aspect?: CoverAspect
}>()

const emit = defineEmits<{
  apply: [template: CoverTemplate]
}>()

const aspectFiltered = computed(() => filterCoverTemplatesByAspect(COVER_TEMPLATES, aspect))

const grouped = computed((): TemplateGroup[] =>
  COVER_TEMPLATE_GROUPS
    .map((g) => {
      const templates = aspectFiltered.value.filter((t) => t.group === g.key)
      const subgroupLabels = templates
        .map((t) => getCoverTemplateSubgroup(t.id))
        .filter((label): label is string => Boolean(label))
      const hasSubgroups = subgroupLabels.length > 0

      if (!hasSubgroups) {
        return { ...g, templates, subgroups: null }
      }

      const map = new Map<string, CoverTemplate[]>()
      for (const t of templates) {
        const label = getCoverTemplateSubgroup(t.id) ?? '其他'
        if (!map.has(label)) map.set(label, [])
        map.get(label)!.push(t)
      }

      const order = Array.from(map.keys()).sort((a, b) => {
        const ia = XHS_SUBGROUP_ORDER.indexOf(a as typeof XHS_SUBGROUP_ORDER[number])
        const ib = XHS_SUBGROUP_ORDER.indexOf(b as typeof XHS_SUBGROUP_ORDER[number])
        if (ia === -1 && ib === -1) return a.localeCompare(b)
        if (ia === -1) return 1
        if (ib === -1) return -1
        return ia - ib
      })

      return {
        ...g,
        templates: [],
        subgroups: order.map((label) => ({
          label,
          templates: map.get(label) ?? [],
        })),
      }
    })
    .filter((g) => g.templates.length > 0 || (g.subgroups?.length ?? 0) > 0),
)

const previewAspectRatio = computed(() => {
  if (aspect === 'portrait') return '9 / 16'
  if (aspect === 'wechat') return '900 / 383'
  return '16 / 9'
})

const emptyHint = computed(() => `当前比例「${COVER_ASPECT_LABELS[aspect]}」暂无模板`)

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

function isXhsPresetTemplate(template: CoverTemplate) {
  return template.layoutPreset != null && template.layoutPreset !== 'default'
}

function previewTitleLines(template: CoverTemplate) {
  if (template.defaultTitle) return template.defaultTitle.split('\n')
  return ['标题']
}

function previewKeywordsText(template: CoverTemplate) {
  return template.defaultKeywords ?? ''
}

function miniTitleStyle(template: CoverTemplate) {
  return {
    fontSize: '7px',
    color: template.titleColor,
    fontFamily: template.fontFamily,
  }
}

function miniKeywordsStyle(template: CoverTemplate) {
  return {
    fontSize: '5px',
    color: template.keywordsColor,
    fontFamily: template.fontFamily,
  }
}
</script>

<template>
  <div class="cover-template-picker space-y-3">
    <div v-if="!sidebar">
      <h3 class="text-xs font-semibold text-ink-soft">快速模板</h3>
      <p class="mt-0.5 text-[11px] text-ink-faint">一键套用字体、配色与背景，再改标题即可导出</p>
    </div>

    <p v-if="grouped.length === 0" class="text-center text-[11px] text-ink-faint py-6">
      {{ emptyHint }}
    </p>

    <div v-else class="space-y-4">
      <section v-for="g in grouped" :key="g.key">
        <h4 class="mb-2 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
          {{ g.label }}
        </h4>

        <template v-if="g.subgroups">
          <div v-for="sub in g.subgroups" :key="`${g.key}-${sub.label}`" class="mb-3 last:mb-0">
            <p class="mb-1.5 text-[10px] font-semibold text-ink-muted">{{ sub.label }}</p>
            <div
              class="grid gap-2"
              :class="sidebar ? 'grid-cols-1' : 'grid-cols-2'"
              role="listbox"
              :aria-label="`${g.label} ${sub.label}模板`"
            >
              <button
                v-for="tpl in sub.templates"
                :key="tpl.id"
                type="button"
                class="cover-template-picker__card"
                role="option"
                :aria-selected="model === tpl.id"
                :title="tpl.desc"
                @click="select(tpl)"
              >
                <div
                  class="cover-template-picker__preview"
                  :class="[
                    layoutClass(tpl),
                    isXhsPresetTemplate(tpl) ? 'cover-template-picker__preview--xhs' : '',
                  ]"
                  :style="isXhsPresetTemplate(tpl)
                    ? { aspectRatio: previewAspectRatio }
                    : { ...previewStyle(tpl), aspectRatio: previewAspectRatio }"
                >
                  <CoverXhsLayout
                    v-if="isXhsPresetTemplate(tpl)"
                    :preset="tpl.layoutPreset!"
                    :title-lines="previewTitleLines(tpl)"
                    :keywords-text="previewKeywordsText(tpl)"
                    :title-style="miniTitleStyle(tpl)"
                    :keywords-style="miniKeywordsStyle(tpl)"
                    mini
                  />
                  <template v-else>
                    <div class="cover-template-picker__overlay" aria-hidden="true" />
                    <div class="cover-template-picker__mock">
                      <span class="cover-template-picker__title" />
                      <span class="cover-template-picker__keywords" />
                    </div>
                  </template>
                </div>
                <span class="cover-template-picker__label">{{ tpl.label }}</span>
                <span class="cover-template-picker__desc">{{ tpl.desc }}</span>
              </button>
            </div>
          </div>
        </template>

        <div
          v-else
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
              class="cover-template-picker__preview"
              :class="layoutClass(tpl)"
              :style="{ ...previewStyle(tpl), aspectRatio: previewAspectRatio }"
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

.cover-template-picker__preview--xhs {
  background: transparent;
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
