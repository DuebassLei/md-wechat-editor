<script setup lang="ts">
import { GITHUB_REPO_URL } from '@/meta/site'

const audiences = [
  {
    title: '技术 / 产品公众号',
    desc: '用熟悉的 Markdown 写作，输出符合公众号样式的排版，少在编辑器里手工调格式。',
  },
  {
    title: '自媒体创作者',
    desc: 'Hero、时间轴、对比、FAQ 等组件开箱即用，专注内容而不是样式细节。',
  },
  {
    title: '团队内容协作',
    desc: '本地文档列表，支持导入/导出 .md，草稿与版本完全自控。',
  },
] as const

const steps = [
  '打开编辑器，输入或粘贴 Markdown',
  '通过「插入组件」添加 Hero、时间轴、FAQ 等模块',
  '切换排版主题，在右侧预览效果',
  '点击「复制公众号 HTML」',
  '登录微信公众平台，在正文编辑器粘贴发布',
] as const
</script>

<template>
  <div class="intro-sections">
    <section class="intro-block" aria-labelledby="audience-title">
      <div class="intro-block__head">
        <h2 id="audience-title" class="intro-block__title">适合谁用</h2>
      </div>
      <ul class="intro-audience">
        <li v-for="item in audiences" :key="item.title" class="intro-audience__item card">
          <h3 class="intro-audience__title">{{ item.title }}</h3>
          <p class="intro-audience__text">{{ item.desc }}</p>
        </li>
      </ul>
    </section>

    <section class="intro-block" aria-labelledby="steps-title">
      <div class="intro-block__head">
        <h2 id="steps-title" class="intro-block__title">五分钟上手</h2>
        <p class="intro-block__desc">从 Markdown 到公众号正文，流程清晰可重复。</p>
      </div>
      <ol class="intro-steps card">
        <li v-for="(step, index) in steps" :key="step" class="intro-steps__item">
          <span class="intro-steps__index" aria-hidden="true">{{ index + 1 }}</span>
          <span class="intro-steps__text">
            <template v-if="index === 4">
              登录
              <a
                href="https://mp.weixin.qq.com"
                class="text-cinnabar-dark underline"
                target="_blank"
                rel="noopener noreferrer"
              >微信公众平台</a>，在正文编辑器粘贴发布
            </template>
            <template v-else>{{ step }}</template>
          </span>
        </li>
      </ol>
    </section>

    <section class="intro-block" aria-labelledby="platform-title">
      <div class="intro-note card">
        <h2 id="platform-title" class="intro-note__title">与墨韵 AI 写作平台</h2>
        <p class="intro-note__text">
          本工具为纯排版工作室，不含 AI 写作、积分与云同步。若需选题、正文生成，请使用墨韵主站写作链路；写完后回到此处完成「最后一公里」排版与出稿。
        </p>
        <a
          class="btn-ghost btn-sm mt-3 inline-flex"
          :href="GITHUB_REPO_URL"
          target="_blank"
          rel="noopener noreferrer"
        >
          查看 GitHub 源码
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.intro-sections {
  @apply mx-auto w-full max-w-6xl space-y-12 px-4 sm:space-y-16 sm:px-6;
}

.intro-block__head {
  @apply mb-6;
}

.intro-block__title {
  @apply text-2xl font-bold tracking-tight text-ink sm:text-3xl;
}

.intro-block__desc {
  @apply mt-2 text-sm text-ink-muted sm:text-base;
}

.intro-audience {
  @apply grid gap-4 md:grid-cols-3;
}

.intro-audience__item {
  @apply p-5;
}

.intro-audience__title {
  @apply text-base font-semibold text-ink;
}

.intro-audience__text {
  @apply mt-2 text-sm leading-relaxed text-ink-soft;
}

.intro-steps {
  @apply divide-y divide-paper-line overflow-hidden;
}

.intro-steps__item {
  @apply flex items-start gap-4 px-4 py-4 sm:px-5;
}

.intro-steps__index {
  @apply flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white;
  background: linear-gradient(
    135deg,
    var(--color-btn-primary-from) 0%,
    var(--color-btn-primary-to) 100%
  );
}

.intro-steps__text {
  @apply pt-0.5 text-sm leading-relaxed text-ink-soft;
}

.intro-note {
  @apply p-5 sm:p-6;
}

.intro-note__title {
  @apply text-base font-semibold text-ink;
}

.intro-note__text {
  @apply mt-2 text-sm leading-relaxed text-ink-soft;
}
</style>
