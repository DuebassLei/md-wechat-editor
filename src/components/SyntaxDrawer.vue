<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  MODULE_SYNTAX_SECTIONS,
  type ModuleSyntaxSection,
} from '@/constants/moduleSyntaxGuide'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  insert: [syntax: string]
  'open-module-picker': []
}>()

const search = ref('')
const expanded = ref<Set<string>>(new Set(['start', 'module', 'inline', 'images']))

const filteredSections = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return MODULE_SYNTAX_SECTIONS
  return MODULE_SYNTAX_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.syntax.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q),
    ),
  })).filter((s) => s.items.length > 0)
})

function close() {
  emit('update:open', false)
}

function toggleSection(id: string) {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}

function expandAll() {
  expanded.value = new Set(filteredSections.value.map((s) => s.id))
}

function collapseAll() {
  expanded.value = new Set()
}

async function copySyntax(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    showCopyHint('已复制到剪贴板')
  } catch {
    showCopyHint('复制失败，请检查浏览器权限')
  }
}

function insertSyntax(text: string) {
  emit('insert', text)
  showCopyHint('已插入到编辑器')
  close()
}

function openModulePicker() {
  close()
  emit('open-module-picker')
}

const copyHint = ref('')
let copyHintTimer: ReturnType<typeof setTimeout> | null = null

function showCopyHint(msg: string) {
  copyHint.value = msg
  if (copyHintTimer) clearTimeout(copyHintTimer)
  copyHintTimer = setTimeout(() => {
    copyHint.value = ''
  }, 1600)
}

function sectionLabel(section: ModuleSyntaxSection): string {
  return section.subtitle ? `${section.title} · ${section.subtitle}` : section.title
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="syntax-drawer-backdrop fixed inset-0 z-[280] flex items-end justify-center sm:items-center sm:p-4"
        role="presentation"
        @click.self="close"
      >
        <div
          class="syntax-drawer card relative flex max-h-[min(92vh,720px)] w-full flex-col overflow-hidden shadow-card-hover sm:max-w-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="syntax-drawer-title"
          @click.stop
        >
          <header class="flex shrink-0 items-start justify-between gap-3 border-b border-paper-line px-4 py-3 sm:px-5">
            <div class="min-w-0">
              <p id="syntax-drawer-title" class="text-base font-semibold text-ink">排版语法手册</p>
              <p class="mt-0.5 text-[11px] leading-relaxed text-ink-muted">
                ::: 排版模块 + 行内修饰；GFM 基础语法见编辑区工具栏
              </p>
            </div>
            <button
              type="button"
              class="btn-ghost btn-sm shrink-0 !px-2"
              aria-label="关闭语法手册"
              @click="close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div class="shrink-0 space-y-2 border-b border-paper-line px-4 py-2 sm:px-5">
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
                placeholder="搜索语法关键词…"
                autocomplete="off"
              >
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" class="chip-btn text-[10px]" @click="expandAll">全部展开</button>
              <button type="button" class="chip-btn text-[10px]" @click="collapseAll">全部收起</button>
            </div>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2 sm:px-4">
            <p v-if="filteredSections.length === 0" class="state-empty py-8 text-sm">未找到匹配语法</p>

            <div v-for="section in filteredSections" :key="section.id" class="syntax-drawer__section">
              <button
                type="button"
                class="syntax-drawer__section-toggle"
                :aria-expanded="expanded.has(section.id)"
                @click="toggleSection(section.id)"
              >
                <span class="text-sm font-semibold text-ink">{{ sectionLabel(section) }}</span>
                <span class="font-mono text-[10px] text-ink-faint">{{ section.items.length }}</span>
                <svg
                  class="syntax-drawer__chevron"
                  :class="{ 'syntax-drawer__chevron--open': expanded.has(section.id) }"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div v-show="expanded.has(section.id)" class="syntax-drawer__section-body space-y-2 pb-3">
                <article
                  v-for="(item, idx) in section.items"
                  :key="`${section.id}-${idx}`"
                  class="syntax-drawer__item"
                >
                  <p class="text-xs font-semibold text-ink">{{ item.title }}</p>
                  <p v-if="item.description" class="mt-0.5 text-[11px] leading-relaxed text-ink-muted">
                    {{ item.description }}
                  </p>
                  <div class="syntax-drawer__item-actions">
                    <button
                      type="button"
                      class="syntax-drawer__action syntax-drawer__action--primary"
                      :title="`插入：${item.title}`"
                      @click="insertSyntax(item.syntax)"
                    >
                      插入
                    </button>
                    <button
                      type="button"
                      class="syntax-drawer__code group"
                      :title="`复制：${item.title}`"
                      @click="copySyntax(item.syntax)"
                    >
                      <pre class="syntax-drawer__pre">{{ item.syntax }}</pre>
                      <span class="syntax-drawer__copy-hint">复制</span>
                    </button>
                  </div>
                  <p v-if="item.note" class="mt-1 text-[10px] text-ink-faint">{{ item.note }}</p>
                </article>
              </div>
            </div>
          </div>

          <footer class="shrink-0 space-y-2 border-t border-paper-line bg-paper-dim/50 px-4 py-2.5 sm:px-5">
            <button type="button" class="btn-secondary btn-sm w-full" @click="openModulePicker">
              打开排版组件
            </button>
            <p v-if="copyHint" class="text-center text-[11px] font-medium text-jade-dark" role="status">
              {{ copyHint }}
            </p>
            <p v-else class="text-center text-[10px] text-ink-faint">
              点「插入」写入编辑器；也可从排版组件选择 :::module 模块
            </p>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.syntax-drawer-backdrop {
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
}

.syntax-drawer {
  border-radius: var(--radius-card) var(--radius-card) 0 0;
}

@media (min-width: 640px) {
  .syntax-drawer {
    border-radius: var(--radius-card);
  }
}

.syntax-drawer__section-toggle {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.25rem;
  text-align: left;
  border-radius: 0.5rem;
  transition: background-color 0.15s;
}

.syntax-drawer__section-toggle:hover {
  background-color: color-mix(in srgb, var(--paper-dim, #f1f5f9) 90%, transparent);
}

.syntax-drawer__chevron {
  margin-left: auto;
  flex-shrink: 0;
  color: var(--ink-faint, #94a3b8);
  transition: transform 0.2s;
}

.syntax-drawer__chevron--open {
  transform: rotate(180deg);
}

.syntax-drawer__item-actions {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.375rem;
}

.syntax-drawer__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.35rem 0.5rem;
  font-size: 11px;
  font-weight: 600;
  border-radius: 0.5rem;
  border: 1px solid var(--paper-line, #e2e8f0);
  background: var(--paper-bright, #fff);
  color: var(--ink-soft, #334155);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.syntax-drawer__action--primary {
  border-color: rgb(99 102 241 / 0.35);
  background: rgb(99 102 241 / 0.08);
  color: var(--cinnabar-dark, #4338ca);
}

.syntax-drawer__action:hover {
  border-color: rgb(99 102 241 / 0.45);
  box-shadow: 0 0 0 2px rgb(99 102 241 / 0.08);
}

.syntax-drawer__code {
  position: relative;
  display: block;
  width: 100%;
  margin-top: 0.375rem;
  text-align: left;
  border-radius: 0.625rem;
  border: 1px solid var(--paper-line, #e2e8f0);
  background: var(--paper-dim, #f8fafc);
  padding: 0.5rem 0.625rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.syntax-drawer__code:hover {
  border-color: rgb(99 102 241 / 0.35);
  box-shadow: 0 0 0 2px rgb(99 102 241 / 0.08);
}

.syntax-drawer__pre {
  margin: 0;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 11px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--ink-soft, #334155);
}

.syntax-drawer__copy-hint {
  position: absolute;
  top: 0.35rem;
  right: 0.4rem;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-faint, #94a3b8);
  opacity: 0;
  transition: opacity 0.15s;
}

.syntax-drawer__code:hover .syntax-drawer__copy-hint,
.syntax-drawer__code:focus-visible .syntax-drawer__copy-hint {
  opacity: 1;
}
</style>
