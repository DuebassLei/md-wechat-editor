<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import {
  APP_THEME_OPTIONS,
  getAppThemeSwatch,
  useAppTheme,
  type AppThemeId,
} from '@/composables/useAppTheme'
import {
  COLOR_SCHEME_OPTIONS,
  useColorScheme,
  type ColorSchemeId,
} from '@/composables/useColorScheme'
import { useDismissible } from '@/composables/useDismissible'

const { theme, apply } = useAppTheme()
const { scheme, apply: applyScheme } = useColorScheme()
const open = ref(false)
const search = ref('')
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)

useDismissible(open, rootRef, [menuRef])

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return APP_THEME_OPTIONS
  return APP_THEME_OPTIONS.filter(
    (t) => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q),
  )
})

const menuStyle = ref<Record<string, string>>({})

function updateMenuPosition() {
  const el = triggerRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  menuStyle.value = {
    position: 'fixed',
    top: `${r.bottom + 6}px`,
    right: `${Math.max(8, window.innerWidth - r.right)}px`,
    width: '13rem',
    zIndex: '360',
  }
}

watch(open, async (isOpen) => {
  if (!isOpen) {
    window.removeEventListener('resize', updateMenuPosition)
    window.removeEventListener('scroll', updateMenuPosition, true)
    return
  }
  await nextTick()
  updateMenuPosition()
  window.addEventListener('resize', updateMenuPosition)
  window.addEventListener('scroll', updateMenuPosition, true)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateMenuPosition)
  window.removeEventListener('scroll', updateMenuPosition, true)
})

function swatchStyle(id: AppThemeId) {
  return { backgroundColor: getAppThemeSwatch(id) }
}

const currentName = computed(
  () => APP_THEME_OPTIONS.find((t) => t.id === theme.value)?.name ?? '靛蓝',
)

const schemeLabel = computed(
  () => COLOR_SCHEME_OPTIONS.find((o) => o.id === scheme.value)?.name ?? '跟随系统',
)
</script>

<template>
  <div ref="rootRef" class="app-theme-picker">
    <button
      ref="triggerRef"
      type="button"
      class="chip-btn inline-flex items-center gap-1.5"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-label="`界面配色 ${currentName}，外观 ${schemeLabel}`"
      @click="open = !open"
    >
      <span
        class="app-theme-swatch"
        :style="swatchStyle(theme)"
        aria-hidden="true"
      />
      <span class="min-w-0 truncate">配色 · {{ currentName }}</span>
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        ref="menuRef"
        class="app-theme-menu card"
        :style="menuStyle"
        role="dialog"
        aria-label="界面配色与外观"
      >
        <p class="app-theme-menu__heading">外观</p>
        <div class="app-theme-menu__scheme" role="group" aria-label="浅色或深色模式">
          <button
            v-for="o in COLOR_SCHEME_OPTIONS"
            :key="o.id"
            type="button"
            class="app-theme-menu__scheme-btn"
            :class="{ 'app-theme-menu__scheme-btn--active': scheme === o.id }"
            :aria-pressed="scheme === o.id"
            @click="applyScheme(o.id as ColorSchemeId)"
          >
            {{ o.name }}
          </button>
        </div>
        <p class="app-theme-menu__heading mt-2">强调色</p>
        <input
          v-model="search"
          class="input mb-2"
          type="search"
          placeholder="搜索配色…"
        >
        <ul class="app-theme-menu__list" role="listbox">
          <li v-for="t in filtered" :key="t.id">
            <button
              type="button"
              class="app-theme-menu__item"
              :class="{ 'app-theme-menu__item--active': theme === t.id }"
              role="option"
              :aria-selected="theme === t.id"
              @click="apply(t.id); open = false"
            >
              <span
                class="app-theme-swatch"
                :style="swatchStyle(t.id)"
                :title="t.name"
                aria-hidden="true"
              />
              <span class="app-theme-menu__label">{{ t.name }}</span>
            </button>
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.app-theme-picker {
  @apply relative;
}
.app-theme-swatch {
  @apply h-3 w-3 shrink-0 rounded-full border border-black/10;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.3);
}
.app-theme-menu {
  @apply max-h-[min(20rem,70vh)] overflow-auto p-2 shadow-card-hover;
  background-color: rgb(var(--paper-bright-rgb));
}
.app-theme-menu__heading {
  @apply px-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted;
}
.app-theme-menu__scheme {
  @apply mb-1 grid grid-cols-3 gap-0.5 rounded-lg border border-paper-line bg-paper-dim/80 p-0.5;
}
.app-theme-menu__scheme-btn {
  @apply whitespace-nowrap rounded-md px-1.5 py-1 text-center text-[11px] font-medium text-ink-muted transition-colors hover:text-ink;
}
.app-theme-menu__scheme-btn--active {
  @apply bg-paper-bright text-cinnabar-dark shadow-sm;
}
.app-theme-menu__list {
  @apply space-y-0.5;
}
.app-theme-menu__item {
  @apply flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-ink-soft hover:bg-paper-dim;
}
.app-theme-menu__item--active {
  @apply bg-cinnabar-light font-medium text-cinnabar-dark;
}
.app-theme-menu__label {
  @apply min-w-0 flex-1 truncate;
}
</style>
