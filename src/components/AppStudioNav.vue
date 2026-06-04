<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

type NavRoute = 'studio' | 'cards' | 'handwriting' | 'about'

interface NavItem {
  to: string
  route: NavRoute
  label: string
  shortLabel: string
  icon: 'editor' | 'cards' | 'handwriting' | 'about'
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', route: 'studio', label: '排版编辑', shortLabel: '编辑', icon: 'editor' },
  { to: '/cards', route: 'cards', label: '知识卡片', shortLabel: '卡片', icon: 'cards' },
  { to: '/handwriting', route: 'handwriting', label: '手写创意稿', shortLabel: '手写', icon: 'handwriting' },
  { to: '/about', route: 'about', label: '产品介绍', shortLabel: '介绍', icon: 'about' },
]

const route = useRoute()

const activeRoute = computed(() => route.name as NavRoute | undefined)

function isActive(item: NavItem): boolean {
  return activeRoute.value === item.route
}
</script>

<template>
  <nav class="studio-nav" aria-label="工作室导航">
    <div class="studio-nav__track" role="tablist">
      <RouterLink
        v-for="item in NAV_ITEMS"
        :key="item.route"
        :to="item.to"
        class="studio-nav__item"
        role="tab"
        :title="item.label"
        :aria-selected="isActive(item)"
        :aria-current="isActive(item) ? 'page' : undefined"
      >
        <span class="studio-nav__icon" aria-hidden="true">
          <svg v-if="item.icon === 'editor'" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M4 14.5V16h1.5L14 7.5 12.5 6 4 14.5z" stroke-linejoin="round" />
            <path d="M11 5l2 2" stroke-linecap="round" />
          </svg>
          <svg v-else-if="item.icon === 'cards'" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6">
            <rect x="3" y="4" width="11" height="13" rx="1.5" />
            <path d="M7 4V3.5A1.5 1.5 0 018.5 2h8A1.5 1.5 0 0118 3.5v11A1.5 1.5 0 0116.5 16H16" stroke-linecap="round" />
          </svg>
          <svg v-else-if="item.icon === 'handwriting'" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M3 17h14" stroke-linecap="round" />
            <path d="M12.5 3.5l4 4L7 17H3v-4L12.5 3.5z" stroke-linejoin="round" />
          </svg>
          <svg v-else viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6">
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 9v4.5M10 6.5v.01" stroke-linecap="round" />
          </svg>
        </span>
        <span class="studio-nav__label">{{ item.label }}</span>
        <span class="studio-nav__label studio-nav__label--short">{{ item.shortLabel }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.studio-nav {
  @apply flex justify-center;
}

.studio-nav__track {
  @apply inline-flex max-w-full items-center gap-0.5 rounded-[var(--radius-pill)] border border-paper-line/90 p-1;
  background: linear-gradient(
    180deg,
    rgb(var(--paper-bright-rgb) / 0.92) 0%,
    rgb(var(--paper-dim-rgb) / 0.75) 100%
  );
  box-shadow:
    0 1px 0 rgb(var(--paper-bright-rgb) / 0.95) inset,
    0 4px 16px rgb(var(--color-shadow-ink) / 0.04);
}

.studio-nav__item {
  @apply relative inline-flex min-w-0 items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1.5 text-xs font-medium no-underline transition-all duration-200;
  color: rgb(var(--ink-muted-rgb));
}

.studio-nav__item:hover {
  @apply text-ink-soft;
  background: rgb(var(--paper-bright-rgb) / 0.65);
}

.studio-nav__item:focus-visible {
  @apply outline-none ring-2 ring-cinnabar/30 ring-offset-2 ring-offset-paper-bright;
}

.studio-nav__item[aria-selected='true'] {
  @apply font-semibold text-cinnabar-dark;
  background: rgb(var(--paper-bright-rgb));
  box-shadow:
    0 1px 2px rgb(var(--color-shadow-ink) / 0.06),
    0 0 0 1px rgb(var(--cinnabar-rgb) / 0.08);
}

.studio-nav__item[aria-selected='true']::after {
  content: '';
  @apply absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-cinnabar;
}

.studio-nav__icon {
  @apply flex h-4 w-4 shrink-0 items-center justify-center opacity-80;
}

.studio-nav__item[aria-selected='true'] .studio-nav__icon {
  @apply text-cinnabar opacity-100;
}

.studio-nav__icon svg {
  @apply h-full w-full;
}

.studio-nav__label--short {
  @apply hidden;
}

@media (max-width: 900px) {
  .studio-nav__label {
    @apply hidden;
  }

  .studio-nav__label--short {
    @apply inline;
  }

  .studio-nav__item {
    @apply px-2.5;
  }
}

@media (max-width: 520px) {
  .studio-nav__track {
    @apply gap-0 p-0.5;
  }

  .studio-nav__label--short {
    @apply hidden;
  }

  .studio-nav__item {
    @apply px-2;
  }
}
</style>
