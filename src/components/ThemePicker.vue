<script setup lang="ts">
import { computed, ref } from 'vue'
import { THEME_OPTIONS, getThemeName, type ThemeId } from '@/engine'
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
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      class="btn-secondary btn-sm"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="open = !open"
    >
      主题：{{ getThemeName(model) }}
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
            {{ t.name }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.theme-menu {
  @apply absolute right-0 top-full z-50 mt-1 max-h-64 w-56 overflow-auto p-2 shadow-card-hover;
}
.theme-menu__list {
  @apply space-y-0.5;
}
.theme-menu__item {
  @apply w-full rounded-lg px-2 py-1.5 text-left text-sm text-ink-soft hover:bg-paper-dim;
}
.theme-menu__item--active {
  @apply bg-cinnabar-light font-medium text-cinnabar-dark;
}
</style>
