<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppShell from '@/components/AppShell.vue'
import ProductIntroSections from '@/components/ProductIntroSections.vue'
import { APP_THEME_OPTIONS } from '@/composables/useAppTheme'
import { LAYOUT_MODULE_COUNT, PRODUCT_TAGLINE, THEME_COUNT } from '@/meta/productStats'
import { GITHUB_REPO_URL } from '@/meta/site'

const heroVisible = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    heroVisible.value = true
  })
})

function scrollToFeatures() {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}

const stats = [
  { value: String(LAYOUT_MODULE_COUNT), label: '排版组件' },
  { value: String(THEME_COUNT), label: '排版主题' },
  { value: String(APP_THEME_OPTIONS.length), label: '界面配色' },
] as const

const highlights = [
  {
    title: '常用 Markdown',
    desc: '标题、列表、表格、任务列表、代码块等写作语法完整支持，与主流编辑器写法一致。',
    icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  },
  {
    title: '::: 排版围栏',
    desc: 'Hero、步骤、对比、时间轴、CTA、FAQ 等组件开箱即用，点击「插入组件」即可写入光标。',
    icon: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z',
  },
  {
    title: '实时手机预览',
    desc: '多套排版主题实时切换，右侧手机框预览，所见即所得，不用反复粘贴到公众号试错。',
    icon: 'M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z M12 18h.01',
  },
  {
    title: '一键复制 HTML',
    desc: '经 juice 内联样式，直接粘贴微信公众平台正文编辑器，排版不丢、样式不乱。',
    icon: 'M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2 M9 2h6v4H9V2z',
  },
  {
    title: '本地文档管理',
    desc: '文稿保存在浏览器本地，支持导入/导出 .md，草稿与版本完全自控，无需登录。',
    icon: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z',
  },
  {
    title: '语法手册内置',
    desc: '应用内可查全量模块说明，与引擎保持同步，不必翻外部文档或记复杂语法。',
    icon: 'M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z',
  },
] as const
</script>

<template>
  <AppShell>
    <div class="intro-page">
      <section class="intro-hero" aria-labelledby="intro-hero-title">
        <div class="intro-hero__glow" aria-hidden="true" />
        <div
          class="intro-hero__inner"
          :class="{ 'intro-hero__inner--visible': heroVisible }"
        >
          <div class="intro-hero__copy">
            <p class="intro-hero__eyebrow">Markdown 微信排版工作室</p>
            <h1 id="intro-hero-title" class="intro-hero__title">
              写好 Markdown，<br class="sm:hidden">简排进公众号
            </h1>
            <p class="intro-hero__lead">
              纯前端排版工具：在浏览器里写完、预览、复制内联 HTML，粘贴到微信公众平台即可发布。
              支持 {{ PRODUCT_TAGLINE }}，无需登录。
            </p>
            <div class="intro-hero__actions">
              <RouterLink to="/" class="btn-primary btn-sm sm:px-5 sm:py-2.5 sm:text-sm">
                打开编辑器
              </RouterLink>
              <button type="button" class="btn-secondary btn-sm sm:px-5 sm:py-2.5 sm:text-sm" @click="scrollToFeatures">
                了解功能
              </button>
            </div>
            <dl class="intro-stats">
              <div v-for="item in stats" :key="item.label" class="intro-stats__item">
                <dt class="intro-stats__value">{{ item.value }}</dt>
                <dd class="intro-stats__label">{{ item.label }}</dd>
              </div>
            </dl>
          </div>

          <div class="intro-hero__preview" aria-hidden="true">
            <div class="intro-preview-card">
              <div class="intro-preview-card__chrome">
                <span /><span /><span />
                <span class="intro-preview-card__title">studio.md</span>
              </div>
              <pre class="intro-preview-card__code"><code><span class="tok-meta">---</span>
<span class="tok-key">badge:</span> GUIDE
<span class="tok-key">title:</span> 文章主标题
<span class="tok-key">subtitle:</span> 一句话说明
<span class="tok-meta">---</span>

<span class="tok-heading">## 正文从这里开始</span>

<span class="tok-accent">:::hero</span> 封面模块
<span class="tok-accent">:::steps</span> 步骤说明
<span class="tok-bold">**重点内容**</span> 一键复制 HTML</code></pre>
              <div class="intro-preview-card__phone">
                <div class="intro-preview-card__phone-notch" />
                <div class="intro-preview-card__phone-body">
                  <div class="intro-preview-card__phone-line intro-preview-card__phone-line--wide" />
                  <div class="intro-preview-card__phone-line" />
                  <div class="intro-preview-card__phone-line" />
                  <div class="intro-preview-card__phone-block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="intro-section" aria-labelledby="features-title">
        <div class="intro-section__head">
          <h2 id="features-title" class="intro-section__title">核心能力</h2>
          <p class="intro-section__desc">从技术博客到产品推文，常用排版场景都能覆盖。</p>
        </div>
        <ul class="intro-features">
          <li v-for="item in highlights" :key="item.title" class="intro-features__item card">
            <span class="intro-features__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
              </svg>
            </span>
            <h3 class="intro-features__title">{{ item.title }}</h3>
            <p class="intro-features__text">{{ item.desc }}</p>
          </li>
        </ul>
      </section>

      <ProductIntroSections />

      <section class="intro-cta" aria-labelledby="cta-title">
        <div class="intro-cta__inner card">
          <h2 id="cta-title" class="intro-cta__title">准备好出稿了吗？</h2>
          <p class="intro-cta__desc">打开排版工作室，写完即复制，粘贴到公众平台正文编辑器。</p>
          <div class="intro-cta__actions">
            <RouterLink to="/" class="btn-primary">打开编辑器</RouterLink>
            <a
              class="btn-secondary"
              :href="GITHUB_REPO_URL"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub 源码
            </a>
          </div>
        </div>
      </section>
    </div>
  </AppShell>
</template>

<style scoped>
.intro-page {
  @apply flex flex-col;
}

.intro-hero {
  @apply relative overflow-hidden border-b border-paper-line/80;
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgb(var(--cinnabar-light-rgb) / 0.9), transparent 70%),
    linear-gradient(180deg, rgb(var(--paper-bright-rgb) / 1) 0%, rgb(var(--paper-rgb) / 1) 100%);
}

.intro-hero__glow {
  @apply pointer-events-none absolute inset-x-0 top-0 h-64 opacity-60;
  background: radial-gradient(circle at 70% 20%, rgb(var(--cinnabar-rgb) / 0.12), transparent 55%);
}

.intro-hero__inner {
  @apply relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-20;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.55s ease,
    transform 0.55s ease;
}

.intro-hero__inner--visible {
  opacity: 1;
  transform: translateY(0);
}

.intro-hero__eyebrow {
  @apply mb-3 text-xs font-bold uppercase tracking-[0.14em] text-cinnabar-dark;
}

.intro-hero__title {
  @apply text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.65rem];
}

.intro-hero__lead {
  @apply mt-4 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base;
}

.intro-hero__actions {
  @apply mt-6 flex flex-wrap items-center gap-3;
}

.intro-stats {
  @apply mt-8 grid grid-cols-3 gap-3 sm:gap-4;
}

.intro-stats__item {
  @apply rounded-[var(--radius-control)] border border-paper-line/90 bg-paper-bright/80 px-3 py-3 text-center backdrop-blur-sm sm:px-4;
}

.intro-stats__value {
  @apply text-2xl font-bold tabular-nums text-cinnabar-dark sm:text-3xl;
}

.intro-stats__label {
  @apply mt-1 text-xs text-ink-muted;
}

.intro-hero__preview {
  @apply mx-auto w-full max-w-md lg:max-w-none;
}

.intro-preview-card {
  @apply relative overflow-hidden rounded-[var(--radius-card)] border border-paper-line/90 bg-paper-bright shadow-card-hover;
  transform: perspective(900px) rotateY(-6deg) rotateX(4deg);
}

.intro-preview-card__chrome {
  @apply flex items-center gap-1.5 border-b border-paper-line bg-paper-dim/70 px-3 py-2;
}

.intro-preview-card__chrome span:first-child,
.intro-preview-card__chrome span:nth-child(2),
.intro-preview-card__chrome span:nth-child(3) {
  @apply h-2.5 w-2.5 rounded-full;
}

.intro-preview-card__chrome span:first-child {
  background: #f87171;
}
.intro-preview-card__chrome span:nth-child(2) {
  background: #fbbf24;
}
.intro-preview-card__chrome span:nth-child(3) {
  background: #34d399;
}

.intro-preview-card__title {
  @apply ml-2 font-mono text-[11px] text-ink-muted;
}

.intro-preview-card__code {
  @apply overflow-hidden p-4 font-mono text-[11px] leading-relaxed sm:text-xs;
}

.intro-preview-card__code .tok-meta {
  color: rgb(var(--ink-faint-rgb));
}
.intro-preview-card__code .tok-key {
  color: rgb(var(--cinnabar-dark-rgb));
}
.intro-preview-card__code .tok-heading {
  color: rgb(var(--ink-rgb));
  font-weight: 600;
}
.intro-preview-card__code .tok-accent {
  color: rgb(var(--jade-dark-rgb));
}
.intro-preview-card__code .tok-bold {
  color: rgb(var(--gold-dark-rgb));
}

.intro-preview-card__phone {
  @apply absolute -bottom-3 -right-3 w-[38%] min-w-[7rem] rounded-[1.1rem] border border-paper-line bg-paper-bright p-1.5 shadow-card;
}

.intro-preview-card__phone-notch {
  @apply mx-auto mb-1 h-1 w-8 rounded-full bg-paper-deep;
}

.intro-preview-card__phone-body {
  @apply space-y-1.5 rounded-xl bg-paper-dim/80 p-2;
}

.intro-preview-card__phone-line {
  @apply h-1.5 rounded-full bg-paper-deep/80;
}

.intro-preview-card__phone-line--wide {
  @apply w-3/4 bg-cinnabar/30;
}

.intro-preview-card__phone-block {
  @apply mt-2 h-8 rounded-md bg-cinnabar-light/80;
}

.intro-section {
  @apply mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16;
}

.intro-section__head {
  @apply mb-8 max-w-2xl;
}

.intro-section__title {
  @apply text-2xl font-bold tracking-tight text-ink sm:text-3xl;
}

.intro-section__desc {
  @apply mt-2 text-sm text-ink-muted sm:text-base;
}

.intro-features {
  @apply grid gap-4 sm:grid-cols-2 lg:grid-cols-3;
}

.intro-features__item {
  @apply flex h-full flex-col gap-2 p-5 transition-shadow duration-200 hover:shadow-card-hover;
}

.intro-features__icon {
  @apply flex h-10 w-10 items-center justify-center rounded-xl text-cinnabar-dark;
  background: rgb(var(--cinnabar-light-rgb) / 0.85);
}

.intro-features__title {
  @apply text-base font-semibold text-ink;
}

.intro-features__text {
  @apply text-sm leading-relaxed text-ink-soft;
}

.intro-cta {
  @apply mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 sm:pb-16;
}

.intro-cta__inner {
  @apply flex flex-col items-center gap-4 px-6 py-10 text-center sm:px-10;
  background:
    linear-gradient(135deg, rgb(var(--cinnabar-light-rgb) / 0.55) 0%, rgb(var(--paper-bright-rgb) / 1) 55%);
}

.intro-cta__title {
  @apply text-xl font-bold text-ink sm:text-2xl;
}

.intro-cta__desc {
  @apply max-w-lg text-sm text-ink-soft sm:text-base;
}

.intro-cta__actions {
  @apply mt-2 flex flex-wrap items-center justify-center gap-3;
}
</style>
