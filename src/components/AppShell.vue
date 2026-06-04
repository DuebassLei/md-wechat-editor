<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppStudioNav from '@/components/AppStudioNav.vue'
import AppThemePicker from '@/components/AppThemePicker.vue'
import { GITHUB_REPO_URL, WECHAT_MP_PROMO } from '@/meta/site'
import WechatMpQrModal from '@/components/WechatMpQrModal.vue'

const promo = WECHAT_MP_PROMO
const promoLabel = promo.accountName
const qrOpen = ref(false)
const route = useRoute()
const isAbout = computed(() => route.name === 'about')

defineProps<{
  studio?: boolean
}>()
</script>

<template>
  <div class="app-canvas" :class="{ 'app-canvas--studio': studio }">
    <header class="app-header" :class="{ 'app-header--has-promo': promo.enabled }">
      <RouterLink to="/" class="app-header__brand">
        <span class="seal-mark" aria-hidden="true">简</span>
        <span class="app-header__titles">
          <span class="app-header__name">墨韵简排</span>
          <span class="app-header__tagline">Markdown 微信排版工具</span>
        </span>
      </RouterLink>

      <AppStudioNav class="app-header__nav" />

      <button
        v-if="promo.enabled"
        type="button"
        class="app-header__promo app-header__promo--link"
        :aria-label="`${promoLabel}，${promo.hint}，点击查看二维码`"
        @click="qrOpen = true"
      >
        <span class="app-header__promo-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4v-4z"
            />
          </svg>
        </span>
        <span class="app-header__promo-text">
          <span class="app-header__promo-eyebrow">AI 编程 · Vibe Coding</span>
          <span class="app-header__promo-title">{{ promoLabel }}</span>
          <span class="app-header__promo-hint">{{ promo.hint }}</span>
        </span>
        <span class="app-header__promo-cta" aria-hidden="true">扫码关注</span>
      </button>

      <WechatMpQrModal v-model:open="qrOpen" />

      <div class="app-header__actions">
        <AppThemePicker />
        <RouterLink v-if="isAbout" to="/" class="btn-primary btn-sm no-underline">打开编辑器</RouterLink>
        <a
          class="app-header__github chip-btn inline-flex items-center gap-1.5 no-underline"
          :href="GITHUB_REPO_URL"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="在 GitHub 查看源码"
          title="GitHub 开源仓库"
        >
          <svg
            class="app-header__github-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"
            />
          </svg>
          <span class="app-header__github-label">GitHub</span>
        </a>
      </div>
    </header>
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-header {
  @apply relative z-40 grid shrink-0 items-center gap-x-3 gap-y-2 border-b border-paper-line/90 bg-paper-bright/95 px-4 py-3 backdrop-blur-sm;
  isolation: isolate;
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-areas: 'brand nav actions';
}

.app-header--has-promo {
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  grid-template-areas: 'brand nav promo actions';
}

.app-header__nav {
  grid-area: nav;
  @apply min-w-0 justify-self-center px-1;
}

@media (max-width: 767px) {
  .app-header {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'brand actions'
      'nav nav';
  }

  .app-header--has-promo {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      'brand actions'
      'nav promo';
  }

  .app-header__nav {
    @apply justify-self-stretch overflow-x-auto pb-0.5;
  }

  .app-header__titles {
    @apply hidden sm:flex;
  }
}

.app-header__promo {
  @apply flex min-w-0 items-center gap-2 rounded-[var(--radius-control)] border px-2.5 py-1.5 text-left no-underline;
  grid-area: promo;
  justify-self: end;
  max-width: 18rem;
  width: auto;
  border-color: rgb(var(--cinnabar-rgb) / 0.22);
  background: linear-gradient(
    135deg,
    rgb(var(--cinnabar-light-rgb) / 0.65) 0%,
    rgb(var(--paper-bright-rgb) / 0.95) 55%,
    rgb(var(--paper-dim-rgb) / 0.5) 100%
  );
  box-shadow: 0 1px 0 rgb(var(--paper-bright-rgb) / 0.8) inset;
}

@media (max-width: 1100px) {
  .app-header__promo-hint,
  .app-header__promo-eyebrow {
    @apply hidden;
  }

  .app-header__promo {
    max-width: 14rem;
  }
}

@media (max-width: 767px) {
  .app-header__promo {
    max-width: none;
    @apply flex-1 justify-self-stretch;
  }

  .app-header__promo-text {
    @apply min-w-0;
  }

  .app-header__promo-title {
    @apply text-xs;
  }

  .app-header__promo-cta {
    @apply hidden;
  }
}

.app-header__promo--link {
  @apply cursor-pointer border-0 transition-shadow duration-200;
  font: inherit;
  color: inherit;
}

.app-header__promo--link:hover {
  border-color: rgb(var(--cinnabar-rgb) / 0.38);
  box-shadow: 0 0 0 2px rgb(var(--cinnabar-rgb) / 0.1);
}

.app-header__promo--link:focus-visible {
  @apply outline-none ring-2 ring-cinnabar/35 ring-offset-2 ring-offset-paper-bright;
}

.app-header__promo-icon {
  @apply flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-cinnabar-dark;
  background: rgb(var(--paper-bright-rgb) / 0.9);
  border: 1px solid rgb(var(--cinnabar-rgb) / 0.15);
}

.app-header__promo-text {
  @apply flex min-w-0 flex-1 flex-col gap-0.5;
}

.app-header__promo-eyebrow {
  @apply text-[10px] font-bold uppercase tracking-[0.12em] text-cinnabar-dark/80;
}

.app-header__promo-title {
  @apply truncate text-sm font-semibold leading-tight text-ink;
}

.app-header__promo-hint {
  @apply truncate text-[11px] text-ink-muted;
}

.app-header__promo-cta {
  @apply shrink-0 rounded-[var(--radius-pill)] px-2.5 py-1 text-[10px] font-bold text-white;
  background: linear-gradient(
    135deg,
    var(--color-btn-primary-from) 0%,
    var(--color-btn-primary-mid) 55%,
    var(--color-btn-primary-to) 100%
  );
}

.app-header__brand {
  grid-area: brand;
  @apply flex min-w-0 items-center gap-3 no-underline;
}
.app-header__titles {
  @apply flex min-w-0 flex-col;
}
.app-header__name {
  @apply text-base font-semibold tracking-tight text-ink;
}
.app-header__tagline {
  @apply text-xs text-ink-muted;
}
.app-header__actions {
  @apply flex flex-wrap items-center justify-end gap-2;
  grid-area: actions;
}
.app-header__github {
  @apply shrink-0 font-semibold text-ink-soft;
  box-shadow: 0 1px 2px rgb(var(--color-shadow-ink) / 0.04);
}

.app-header__github:hover {
  @apply text-cinnabar-dark;
  box-shadow: 0 2px 8px rgb(var(--cinnabar-rgb) / 0.12);
}

.app-header__github:focus-visible {
  @apply outline-none ring-2 ring-cinnabar/35 ring-offset-2 ring-offset-paper-bright;
}

.app-header__github-icon {
  display: block;
  flex-shrink: 0;
}

.app-header__github-label {
  @apply text-xs leading-none;
}

@media (max-width: 480px) {
  .app-header__github-label {
    @apply sr-only;
  }

  .app-header__github {
    @apply px-2;
  }
}
.app-main {
  @apply flex min-h-0 flex-1 flex-col;
}
.app-canvas--studio .app-main {
  @apply overflow-hidden;
}
</style>
