<script setup lang="ts">
import { computed } from 'vue'
import { CARD_THEMES } from '@/engine/card-studio/cardThemes/registry'
import type { CardThemeGroup, CardThemeId } from '@/engine/card-studio/cardThemes/types'

const model = defineModel<CardThemeId>({ required: true })

const groups: { key: CardThemeGroup; label: string }[] = [
  { key: 'xhs', label: '小红书 Canva' },
  { key: 'light', label: '浅色' },
  { key: 'gradient', label: '渐变' },
  { key: 'morandi', label: '莫兰迪' },
  { key: 'magazine', label: '杂志' },
  { key: 'dark', label: '深色' },
]

const grouped = computed(() =>
  groups
    .map((g) => ({
      ...g,
      themes: CARD_THEMES.filter((t) => t.group === g.key),
    }))
    .filter((g) => g.themes.length > 0),
)

function select(id: CardThemeId) {
  model.value = id
}

function previewVars(theme: (typeof CARD_THEMES)[0]) {
  const t = theme.tokens
  return {
    '--pv-bg': t.exportBg,
    '--pv-ink': t.ink,
    '--pv-muted': t.inkSoft,
    '--pv-accent': t.accent,
    '--pv-line': t.hr,
    '--pv-soft': t.codeBg,
  } as Record<string, string>
}

function h1Class(theme: (typeof CARD_THEMES)[0]) {
  if (theme.style.h1Style === 'center-line') return 'card-theme-picker__h1--center'
  if (theme.style.h1Style === 'accent-bar') return 'card-theme-picker__h1--bar'
  return ''
}

function patternClass(theme: (typeof CARD_THEMES)[0]) {
  const p = theme.style.bgPattern ?? 'none'
  return p !== 'none' ? `card-theme-picker__preview--${p}` : ''
}

function barClass(theme: (typeof CARD_THEMES)[0]) {
  return `card-theme-picker__bar--${theme.style.headerDecor ?? 'accent-strip'}`
}

function coverHint(theme: (typeof CARD_THEMES)[0]) {
  if (theme.group === 'xhs') return 'Canva 精选'
  const layout = theme.style.coverLayout ?? 'classic'
  const labels: Record<string, string> = {
    classic: '经典',
    'big-title': '大字报',
    'split-block': '色块分割',
    sticker: '贴纸手账',
    magazine: '杂志',
    journal: '便签线',
    newspaper: '报纸',
    'gold-quote': '金句',
  }
  return labels[layout] ?? layout
}
</script>

<template>
  <div class="card-theme-picker flex min-h-0 flex-col">
    <div class="card-theme-picker__head px-4 pt-4 pb-2">
      <h2 class="text-sm font-semibold text-ink">主题商店</h2>
      <p class="mt-0.5 text-[11px] leading-snug text-ink-faint">30 套 · 含 16 套 Canva 小红书精选主题</p>
    </div>
    <div class="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
      <section v-for="g in grouped" :key="g.key">
        <h3 class="mb-2.5 px-1 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
          {{ g.label }}
        </h3>
        <div class="grid grid-cols-2 gap-3 xl:grid-cols-2" role="listbox" :aria-label="`${g.label}主题`">
          <button
            v-for="theme in g.themes"
            :key="theme.id"
            type="button"
            class="card-theme-picker__card"
            role="option"
            :aria-selected="model === theme.id"
            :title="theme.desc"
            @click="select(theme.id)"
          >
            <div
              class="card-theme-picker__preview aspect-[3/4]"
              :class="patternClass(theme)"
              :style="previewVars(theme)"
            >
              <span class="card-theme-picker__bar" :class="barClass(theme)" aria-hidden="true" />
              <div class="card-theme-picker__mock">
                <span class="card-theme-picker__h1" :class="h1Class(theme)" />
                <span class="card-theme-picker__line card-theme-picker__line--wide" />
                <span class="card-theme-picker__line" />
                <span class="card-theme-picker__line card-theme-picker__line--short" />
                <span class="card-theme-picker__pill" />
              </div>
            </div>
            <span class="card-theme-picker__label">{{ theme.label }}</span>
            <span class="card-theme-picker__desc">{{ theme.desc }} · {{ coverHint(theme) }}</span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.card-theme-picker__card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 5px;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid var(--color-paper-line, #e2e8f0);
  background: var(--color-paper-bright, #fff);
  cursor: pointer;
  text-align: left;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.card-theme-picker__card:hover {
  border-color: rgb(13 148 136 / 0.45);
  box-shadow: 0 6px 20px rgb(15 23 42 / 0.08);
  transform: translateY(-1px);
}

.card-theme-picker__card[aria-selected='true'] {
  border-color: var(--color-jade, #0d9488);
  box-shadow:
    0 0 0 1px rgb(13 148 136 / 0.35),
    0 8px 24px rgb(13 148 136 / 0.12);
}

.card-theme-picker__preview {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: var(--pv-bg);
  border: 1px solid rgb(15 23 42 / 0.06);
  box-shadow: 0 1px 2px rgb(31 35 40 / 0.04), 0 6px 16px rgb(66 74 83 / 0.06);
}

.card-theme-picker__bar {
  display: block;
  height: 3px;
  background: linear-gradient(90deg, var(--pv-accent) 0 40px, transparent 40px);
}

.card-theme-picker__bar--gradient-fade {
  background: linear-gradient(to bottom, rgb(0 0 0 / 0.04), transparent),
    linear-gradient(90deg, var(--pv-accent) 0 28px, transparent 28px);
  border-bottom: 1px solid var(--pv-line);
  height: 4px;
}

.card-theme-picker__bar--thin-line {
  background: linear-gradient(to bottom, rgb(0 0 0 / 0.04), transparent);
  border-bottom: 1px solid var(--pv-line);
}

.card-theme-picker__bar--none {
  display: none;
}

/* 缩略图纹理预览 */
.card-theme-picker__preview--dot-grid {
  background-image: radial-gradient(circle, color-mix(in srgb, var(--pv-accent) 25%, transparent) 0.6px, transparent 0.6px);
  background-size: 8px 8px;
  background-color: var(--pv-bg);
}

.card-theme-picker__preview--notebook-lines {
  background-image: repeating-linear-gradient(0deg, transparent, transparent 11px, rgb(0 0 0 / 0.06) 11px, rgb(0 0 0 / 0.06) 12px);
  background-color: var(--pv-bg);
}

.card-theme-picker__preview--paper-grain {
  background-image: repeating-linear-gradient(45deg, transparent, transparent 1px, rgb(0 0 0 / 0.02) 1px, rgb(0 0 0 / 0.02) 2px);
  background-color: var(--pv-bg);
}

.card-theme-picker__preview--bloom {
  background-image: radial-gradient(circle at 15% 20%, color-mix(in srgb, var(--pv-accent) 18%, transparent), transparent 55%);
  background-color: var(--pv-bg);
}

.card-theme-picker__preview--macaron-dots {
  background-image: radial-gradient(circle at 20% 25%, color-mix(in srgb, var(--pv-accent) 40%, transparent) 2px, transparent 2px),
    radial-gradient(circle at 75% 70%, rgb(245 183 177 / 0.45) 2px, transparent 2px);
  background-color: var(--pv-bg);
}

.card-theme-picker__preview--tech-grid {
  background-image: linear-gradient(color-mix(in srgb, var(--pv-accent) 10%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--pv-accent) 10%, transparent) 1px, transparent 1px);
  background-size: 10px 10px;
  background-color: var(--pv-bg);
}

.card-theme-picker__preview--film-grain {
  background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgb(0 0 0 / 0.03) 2px, rgb(0 0 0 / 0.03) 3px);
  background-color: var(--pv-bg);
}

.card-theme-picker__preview--color-block::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 35%;
  height: 30%;
  background: color-mix(in srgb, var(--pv-accent) 14%, transparent);
  border-bottom-left-radius: 8px;
  pointer-events: none;
}

.card-theme-picker__preview--soft-wash {
  background-image: radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--pv-accent) 10%, transparent), transparent 50%);
  background-color: var(--pv-bg);
}

.card-theme-picker__mock {
  padding: 8px 9px 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
  z-index: 1;
}

.card-theme-picker__h1 {
  display: block;
  height: 7px;
  width: 65%;
  margin: 2px 0 4px;
  background: var(--pv-ink);
  border-radius: 2px;
  opacity: 0.85;
}

.card-theme-picker__h1--center {
  width: 72%;
  margin-left: auto;
  margin-right: auto;
}

.card-theme-picker__h1--bar {
  margin-left: 10px;
  box-shadow: -10px 0 0 0 var(--pv-accent);
}

.card-theme-picker__line {
  display: block;
  height: 4px;
  border-radius: 2px;
  background: var(--pv-muted);
  opacity: 0.35;
  width: 100%;
}

.card-theme-picker__line--wide {
  width: 92%;
}

.card-theme-picker__line--short {
  width: 58%;
}

.card-theme-picker__pill {
  display: block;
  height: 10px;
  width: 40%;
  margin-top: 2px;
  border-radius: 4px;
  background: var(--pv-soft);
  border: 1px solid var(--pv-line);
}

.card-theme-picker__label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-ink, #1e293b);
  padding: 0 2px;
}

.card-theme-picker__desc {
  font-size: 10px;
  line-height: 1.25;
  color: var(--color-ink-faint, #94a3b8);
  padding: 0 2px 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-theme-picker__card[aria-selected='true'] .card-theme-picker__label {
  color: var(--color-jade-dark, #0f766e);
}
</style>
