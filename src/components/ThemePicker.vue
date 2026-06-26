<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  THEME_OPTIONS,
  getThemeName,
  getThemeSwatch,
  groupThemeOptions,
  type ThemeId,
} from '@/engine'
import { useDismissible } from '@/composables/useDismissible'

const model = defineModel<ThemeId>({ required: true })

const open = ref(false)
const search = ref('')
const rootRef = ref<HTMLElement | null>(null)

useDismissible(open, rootRef)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return THEME_OPTIONS
  return THEME_OPTIONS.filter(
    (t) =>
      t.name.toLowerCase().includes(q)
      || t.id.toLowerCase().includes(q)
      || (t.series?.toLowerCase().includes(q) ?? false)
      || (t.description?.toLowerCase().includes(q) ?? false),
  )
})

const grouped = computed(() => groupThemeOptions(filtered.value))

const totalCount = computed(() => THEME_OPTIONS.length)

function swatchStyle(themeId: string) {
  return { backgroundColor: getThemeSwatch(themeId) }
}

function pick(id: ThemeId) {
  model.value = id
  open.value = false
}
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      class="theme-trigger btn-secondary btn-sm"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span
        class="theme-swatch"
        :style="swatchStyle(model)"
        :title="getThemeName(model)"
        aria-hidden="true"
      />
      <span class="theme-trigger__label">主题：{{ getThemeName(model) }}</span>
    </button>
    <div v-if="open" class="theme-menu card">
      <div class="theme-menu__head">
        <input
          v-model="search"
          class="input"
          type="search"
          placeholder="搜索主题名、系列…"
        >
        <p class="theme-menu__meta">
          共 {{ totalCount }} 套 · {{ grouped.length }} 个分类
        </p>
      </div>
      <div class="theme-menu__scroll" role="listbox" :aria-label="`文章主题，共 ${totalCount} 套`">
        <section
          v-for="g in grouped"
          :key="g.label"
          class="theme-menu__group"
        >
          <h3 class="theme-menu__group-title">
            {{ g.label }}
            <span class="theme-menu__group-count">{{ g.themes.length }}</span>
          </h3>
          <ul class="theme-menu__list">
            <li v-for="t in g.themes" :key="t.id">
              <button
                type="button"
                class="theme-menu__item"
                :class="{ 'theme-menu__item--active': model === t.id }"
                role="option"
                :aria-selected="model === t.id"
                :title="t.description"
                @click="pick(t.id as ThemeId)"
              >
                <span
                  class="theme-swatch"
                  :style="swatchStyle(t.id)"
                  :title="t.name"
                  aria-hidden="true"
                />
                <span class="theme-menu__label">{{ t.name }}</span>
                <span v-if="t.isNew" class="theme-menu__badge">新</span>
              </button>
            </li>
          </ul>
        </section>
        <p v-if="grouped.length === 0" class="theme-menu__empty">
          没有匹配的主题
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-trigger {
  @apply inline-flex items-center gap-2;
}
.theme-trigger__label {
  @apply min-w-0 truncate;
}
.theme-swatch {
  @apply h-3.5 w-3.5 shrink-0 rounded border border-black/10 shadow-sm;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.25);
}
.theme-menu {
  @apply absolute right-0 top-full z-50 mt-1 flex w-72 flex-col bg-paper-bright p-0 shadow-card-hover;
  max-height: min(24rem, calc(100vh - 8rem));
}
.theme-menu__head {
  @apply shrink-0 space-y-1.5 border-b border-paper-line p-2;
}
.theme-menu__meta {
  @apply px-0.5 text-[11px] text-ink-faint;
}
.theme-menu__scroll {
  @apply min-h-0 flex-1 overflow-y-auto p-2;
}
.theme-menu__group + .theme-menu__group {
  @apply mt-3;
}
.theme-menu__group-title {
  @apply sticky top-0 z-[1] mb-1 flex items-center gap-1.5 bg-paper-bright/95 px-1 py-1 text-[11px] font-bold tracking-wide text-ink-faint backdrop-blur-sm;
}
.theme-menu__group-count {
  @apply rounded-full bg-paper-dim px-1.5 py-px text-[10px] font-semibold text-ink-soft;
}
.theme-menu__list {
  @apply space-y-0.5;
}
.theme-menu__item {
  @apply flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-ink-soft hover:bg-paper-dim;
}
.theme-menu__item--active {
  @apply bg-cinnabar-light font-medium text-cinnabar-dark;
}
.theme-menu__label {
  @apply min-w-0 flex-1 truncate;
}
.theme-menu__badge {
  @apply shrink-0 rounded px-1 py-px text-[10px] font-bold leading-none text-cinnabar-dark;
  background: rgb(220 38 38 / 0.1);
}
.theme-menu__empty {
  @apply py-6 text-center text-sm text-ink-faint;
}
</style>
