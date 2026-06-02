<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import {
  LAYOUT_MODULES,
  type LayoutCategory,
  type LayoutModuleMeta,
} from '@/constants/layoutModules'
import { layoutModulesByCategory } from '@/constants/layoutModuleSnippets'
import { listModules, getSnippet } from '@/modules'
import { preloadLayoutModulePreviewRenderer } from '@/composables/layoutModulePreview'
import { resetPreviewScheduler } from '@/composables/previewScheduler'
import { useMarkdownThemeStyle } from '@/composables/useMarkdownThemeStyle'
import {
  installPickerPerfGlobal,
  isPickerPerfEnabled,
  markPickerFirstPaint,
  markPickerInteractive,
  markPickerOpenStart,
  startPickerScrollFpsSample,
} from '@/observability/layoutModulePickerPerf'
import LayoutModulePreviewThumb from '@/components/LayoutModulePreviewThumb.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  insert: [snippet: string, module: LayoutModuleMeta]
}>()

const DEFAULT_EXPANDED: LayoutCategory[] = ['opening', 'extension']
const search = ref('')
const expanded = ref(new Set<LayoutCategory>(DEFAULT_EXPANDED))
const copyHint = ref('')
const hoveredId = ref<string | null>(null)
const previewSession = ref(0)
const scrollRef = ref<HTMLElement | null>(null)
const flatBackdrop = ref(false)
const enableLive = ref(true)

const pickerThemeId = ref('normal')
useMarkdownThemeStyle(pickerThemeId, ref(true), '.layout-module-preview-thumb__body')

const visible = computed(() => {
  const q = search.value.trim().toLowerCase()
  let list = listModules()
  if (q) {
    list = list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.syntax?.toLowerCase().includes(q) ?? false),
    )
  }
  return list
})

const grouped = computed(() => layoutModulesByCategory(visible.value))

type PickerRow =
  | { kind: 'header'; key: string; category: LayoutCategory; label: string; count: number }
  | { kind: 'card'; key: string; mod: LayoutModuleMeta }

const rows = computed<PickerRow[]>(() => {
  const out: PickerRow[] = []
  for (const group of grouped.value) {
    out.push({
      kind: 'header',
      key: `h-${group.category}`,
      category: group.category,
      label: group.label,
      count: group.items.length,
    })
    if (isOpen(group.category)) {
      for (const mod of group.items) {
        out.push({ kind: 'card', key: `c-${mod.id}`, mod })
      }
    }
  }
  return out
})

/** 固定行高：禁止 measureElement，避免 live 预览撑高导致虚拟列表错位 */
const HEADER_ROW_HEIGHT_PX = 48
const CARD_ROW_HEIGHT_PX = 252

const virtualizer = useVirtualizer(
  computed(() => ({
    count: rows.value.length,
    getScrollElement: () => scrollRef.value,
    getItemKey: (index) => rows.value[index]?.key ?? String(index),
    estimateSize: (index) =>
      rows.value[index]?.kind === 'header' ? HEADER_ROW_HEIGHT_PX : CARD_ROW_HEIGHT_PX,
    overscan: 4,
  })),
)

const virtualRows = computed(() => virtualizer.value.getVirtualItems())

/** 虚拟列表当前挂载的卡片：滚动进视口后预加载 live 预览，避免静态缩略图只显示上半截 */
const visibleModuleIds = computed(() => {
  const ids = new Set<string>()
  for (const vItem of virtualRows.value) {
    const row = getRow(vItem.index)
    if (row?.kind === 'card') ids.add(row.mod.id)
  }
  return ids
})

watch(
  () => search.value.trim(),
  (q) => {
    if (q) expanded.value = new Set(grouped.value.map((g) => g.category))
  },
)

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      markPickerOpenStart()
      preloadLayoutModulePreviewRenderer()
      await nextTick()
      markPickerFirstPaint()
      markPickerInteractive()
      const body = scrollRef.value
      if (body && isPickerPerfEnabled()) startPickerScrollFpsSample(body)
    } else {
      previewSession.value++
      hoveredId.value = null
      resetPreviewScheduler()
    }
  },
)

onMounted(() => {
  installPickerPerfGlobal()
  flatBackdrop.value =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(hover: none)').matches
  enableLive.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

function close() {
  emit('update:open', false)
}

function toggleSection(id: LayoutCategory) {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}

function expandAll() {
  expanded.value = new Set(grouped.value.map((g) => g.category))
}

function collapseAll() {
  expanded.value = new Set()
}

function isOpen(category: LayoutCategory) {
  return expanded.value.has(category)
}

function onSelect(mod: LayoutModuleMeta) {
  emit('insert', getSnippet(mod.id), mod)
  copyHint.value = `已插入「${mod.name}」`
  setTimeout(() => {
    copyHint.value = ''
  }, 1600)
  close()
}

function getRow(index: number): PickerRow | undefined {
  return rows.value[index]
}

function rowStyle(start: number, _size: number, kind: PickerRow['kind']): Record<string, string> {
  const heightPx = kind === 'header' ? HEADER_ROW_HEIGHT_PX : CARD_ROW_HEIGHT_PX
  return {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: `${heightPx}px`,
    boxSizing: 'border-box',
    transform: `translateY(${start}px)`,
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="layout-module-picker-backdrop fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4"
        :class="{ 'layout-module-picker-backdrop--flat': flatBackdrop }"
        role="presentation"
        @click.self="close"
      >
        <div
          class="layout-module-picker card relative flex min-h-0 w-full max-h-[min(calc(100dvh-1.5rem),760px)] flex-col overflow-hidden shadow-card-hover sm:max-w-3xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="layout-module-picker-title"
          @click.stop
        >
          <header class="flex shrink-0 items-start justify-between gap-3 border-b border-paper-line px-4 py-3 sm:px-5">
            <div class="min-w-0">
              <p id="layout-module-picker-title" class="text-base font-semibold text-ink">插入排版组件</p>
              <p class="mt-0.5 text-[11px] leading-relaxed text-ink-muted">
                使用
                <code class="rounded bg-paper-dim px-1 py-0.5 font-mono text-[10px]">:::module</code>
                结构化语法，点击即插入光标处
              </p>
            </div>
            <button type="button" class="btn-ghost btn-sm shrink-0 !px-2" aria-label="关闭" @click="close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div class="shrink-0 border-b border-paper-line px-4 py-2 sm:px-5">
            <div class="relative">
              <svg
                class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path stroke-linecap="round" d="M20 20l-3-3" />
              </svg>
              <input
                v-model="search"
                type="search"
                class="input w-full py-1.5 pl-8 text-sm"
                placeholder="搜索组件：对比、时间线、FAQ…"
                autocomplete="off"
              >
            </div>
            <div class="mt-2 flex flex-wrap items-center gap-2">
              <button type="button" class="chip-btn text-[10px]" @click="expandAll">全部展开</button>
              <button type="button" class="chip-btn text-[10px]" @click="collapseAll">全部收起</button>
              <span class="text-[10px] text-ink-faint">列表内自动加载预览，悬停可优先刷新</span>
            </div>
          </div>

          <div
            ref="scrollRef"
            class="layout-module-picker__body min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2 sm:px-4"
          >
            <p v-if="grouped.length === 0" class="state-empty py-8 text-sm">未找到匹配组件</p>

            <div
              v-else
              class="layout-module-picker__virtual"
              :style="{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }"
            >
              <template v-for="vItem in virtualRows" :key="getRow(vItem.index)?.key ?? vItem.index">
                <div
                  v-if="getRow(vItem.index)?.kind === 'header'"
                  class="layout-module-picker__section layout-module-picker__section--virtual"
                  :class="{
                    'layout-module-picker__section--open': isOpen((getRow(vItem.index) as Extract<PickerRow, { kind: 'header' }>).category),
                  }"
                  :style="rowStyle(vItem.start, vItem.size, 'header')"
                >
                  <button
                    type="button"
                    class="layout-module-picker__section-toggle"
                    :aria-expanded="isOpen((getRow(vItem.index) as Extract<PickerRow, { kind: 'header' }>).category)"
                    @click="toggleSection((getRow(vItem.index) as Extract<PickerRow, { kind: 'header' }>).category)"
                  >
                    <span
                      class="layout-module-picker__chevron-box"
                      :class="{
                        'layout-module-picker__chevron-box--open': isOpen(
                          (getRow(vItem.index) as Extract<PickerRow, { kind: 'header' }>).category,
                        ),
                      }"
                      aria-hidden="true"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6" />
                      </svg>
                    </span>
                    <span class="layout-module-picker__section-label">{{
                      (getRow(vItem.index) as Extract<PickerRow, { kind: 'header' }>).label
                    }}</span>
                    <span class="layout-module-picker__count">{{
                      (getRow(vItem.index) as Extract<PickerRow, { kind: 'header' }>).count
                    }}</span>
                    <span class="layout-module-picker__hint">
                      {{
                        isOpen((getRow(vItem.index) as Extract<PickerRow, { kind: 'header' }>).category)
                          ? '收起'
                          : '展开'
                      }}
                    </span>
                  </button>
                </div>

                <button
                  v-else-if="getRow(vItem.index)?.kind === 'card'"
                  type="button"
                  class="layout-module-card layout-module-card--virtual"
                  :style="rowStyle(vItem.start, vItem.size, 'card')"
                  :aria-label="(getRow(vItem.index) as Extract<PickerRow, { kind: 'card' }>).mod.name"
                  @click="onSelect((getRow(vItem.index) as Extract<PickerRow, { kind: 'card' }>).mod)"
                  @mouseenter="hoveredId = (getRow(vItem.index) as Extract<PickerRow, { kind: 'card' }>).mod.id"
                  @mouseleave="hoveredId = null"
                  @focusin="hoveredId = (getRow(vItem.index) as Extract<PickerRow, { kind: 'card' }>).mod.id"
                  @focusout="hoveredId = null"
                >
                  <span class="layout-module-card__head">
                    <span class="layout-module-card__name">{{
                      (getRow(vItem.index) as Extract<PickerRow, { kind: 'card' }>).mod.name
                    }}</span>
                  </span>
                  <span class="layout-module-card__desc">{{
                    (getRow(vItem.index) as Extract<PickerRow, { kind: 'card' }>).mod.description
                  }}</span>
                  <code class="layout-module-card__syntax">
                    {{
                      (getRow(vItem.index) as Extract<PickerRow, { kind: 'card' }>).mod.alias ??
                        `:::${(getRow(vItem.index) as Extract<PickerRow, { kind: 'card' }>).mod.id}`
                    }}
                  </code>
                  <LayoutModulePreviewThumb
                    :module-id="(getRow(vItem.index) as Extract<PickerRow, { kind: 'card' }>).mod.id"
                    :live-active="
                      visibleModuleIds.has((getRow(vItem.index) as Extract<PickerRow, { kind: 'card' }>).mod.id) ||
                        hoveredId === (getRow(vItem.index) as Extract<PickerRow, { kind: 'card' }>).mod.id
                    "
                    :enable-live="enableLive"
                    :session="previewSession"
                  />
                </button>
              </template>
            </div>
          </div>

          <footer class="shrink-0 border-t border-paper-line bg-paper-dim/50 px-4 py-2.5 text-center sm:px-5">
            <p v-if="copyHint" class="text-[11px] font-medium text-jade-dark" role="status">{{ copyHint }}</p>
            <p v-else class="text-[10px] text-ink-faint">
              共 {{ LAYOUT_MODULES.length }} 种模块 · 可见卡片自动加载排版预览
            </p>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.layout-module-picker-backdrop {
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
}

.layout-module-picker-backdrop--flat {
  backdrop-filter: none;
  background: rgba(15, 23, 42, 0.55);
}

.layout-module-picker__body {
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}

.layout-module-picker__virtual {
  width: 100%;
}

.layout-module-picker__section--virtual {
  margin-bottom: 0;
  padding-bottom: 0.25rem;
}

.layout-module-card--virtual {
  margin-bottom: 0;
  overflow: hidden;
  padding-bottom: calc(0.625rem + 0.5rem);
}

.layout-module-card--virtual .layout-module-card__head,
.layout-module-card--virtual .layout-module-card__desc,
.layout-module-card--virtual .layout-module-card__syntax {
  flex-shrink: 0;
}

.layout-module-picker__section {
  overflow: hidden;
  border-radius: var(--radius-control);
  border: 1px solid rgb(var(--paper-line-rgb) / 1);
  background: rgb(var(--paper-bright-rgb) / 1);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.layout-module-picker__section--open {
  border-color: rgb(var(--cinnabar-rgb) / 0.4);
  box-shadow:
    0 0 0 1px rgb(var(--cinnabar-rgb) / 0.12),
    0 2px 8px rgb(var(--color-shadow-ink) / 0.06);
}

.layout-module-picker__section-toggle {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  text-align: left;
  border: none;
  background: rgb(var(--paper-dim-rgb) / 1);
  cursor: pointer;
  transition: background-color 0.15s;
}

.layout-module-picker__section--open .layout-module-picker__section-toggle {
  background: rgb(var(--cinnabar-light-rgb) / 0.85);
  border-bottom: 1px solid rgb(var(--paper-line-rgb) / 1);
}

.layout-module-picker__section-toggle:hover {
  background: rgb(var(--cinnabar-light-rgb) / 0.55);
}

.layout-module-picker__section-toggle:focus-visible {
  outline: 2px solid rgb(var(--cinnabar-rgb) / 0.45);
  outline-offset: -2px;
}

.layout-module-picker__chevron-box {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.625rem;
  height: 1.625rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(var(--paper-deep-rgb) / 1);
  background: rgb(var(--paper-bright-rgb) / 1);
  color: rgb(var(--cinnabar-dark-rgb) / 1);
  transition: transform 0.2s ease, background-color 0.15s;
}

.layout-module-picker__chevron-box--open {
  transform: rotate(90deg);
  background: rgb(var(--cinnabar-light-rgb) / 1);
  border-color: rgb(var(--cinnabar-rgb) / 0.35);
}

.layout-module-picker__section-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--ink-rgb) / 1);
}

.layout-module-picker__count {
  min-width: 1.25rem;
  padding: 0.125rem 0.375rem;
  font-size: 10px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: center;
  border-radius: var(--radius-pill);
  background: rgb(var(--paper-bright-rgb) / 1);
  border: 1px solid rgb(var(--paper-line-rgb) / 1);
  color: rgb(var(--ink-muted-rgb) / 1);
}

.layout-module-picker__section--open .layout-module-picker__count {
  background: rgb(var(--cinnabar-rgb) / 0.12);
  border-color: rgb(var(--cinnabar-rgb) / 0.25);
  color: rgb(var(--cinnabar-dark-rgb) / 1);
}

.layout-module-picker__hint {
  margin-left: auto;
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgb(var(--ink-faint-rgb) / 1);
}

.layout-module-picker__section--open .layout-module-picker__hint {
  color: rgb(var(--cinnabar-dark-rgb) / 1);
}

.layout-module-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.25rem;
  padding: 0.625rem 0.75rem;
  text-align: left;
  border-radius: var(--radius-control);
  border: 1px solid var(--paper-line, #e2e8f0);
  background: var(--paper-bright, #fff);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.layout-module-card:hover {
  border-color: rgb(99 102 241 / 0.35);
  box-shadow: 0 0 0 2px rgb(99 102 241 / 0.08);
}

.layout-module-card__head {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.layout-module-card__name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ink, #0f172a);
}

.layout-module-card__desc {
  font-size: 11px;
  line-height: 1.45;
  color: var(--ink-muted, #64748b);
}

.layout-module-card__syntax {
  font-family: ui-monospace, monospace;
  font-size: 10px;
  color: var(--cinnabar-dark, #4338ca);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
