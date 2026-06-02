<script setup lang="ts">
import { computed, ref } from 'vue'
import { THEME_OPTIONS, getThemeName, getThemeSwatch, type ThemeId } from '@/engine'
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
    (t) => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q),
  )
})

function swatchStyle(themeId: string) {
  return { backgroundColor: getThemeSwatch(themeId) }
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
      <input v-model="search" class="input mb-2" type="search" placeholder="搜索主题…">
      <ul class="theme-menu__list" role="listbox">
        <li v-for="t in filtered" :key="t.id">
          <button
            type="button"
            class="theme-menu__item"
            :class="{ 'theme-menu__item--active': model === t.id }"
            role="option"
            :aria-selected="model === t.id"
            @click="model = t.id as ThemeId; open = false"
          >
            <span
              class="theme-swatch"
              :style="swatchStyle(t.id)"
              :title="t.name"
              aria-hidden="true"
            />
            <span class="theme-menu__label">{{ t.name }}</span>
          </button>
        </li>
      </ul>
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
  @apply absolute right-0 top-full z-50 mt-1 max-h-64 w-64 overflow-auto bg-paper-bright p-2 shadow-card-hover;
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
</style>
