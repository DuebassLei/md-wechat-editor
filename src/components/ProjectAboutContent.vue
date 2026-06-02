<script setup lang="ts">
import { PRODUCT_TAGLINE } from '@/meta/productStats'
import { GITHUB_REPO_URL } from '@/meta/site'
</script>

<template>
  <div class="project-about space-y-5">
    <p class="text-sm leading-relaxed text-ink-soft">
      写好 Markdown，简排进公众号。支持常用 Markdown、{{ PRODUCT_TAGLINE }}，浏览器内完成预览与复制，无需登录。
    </p>

    <section class="card">
      <div class="card-header">核心能力</div>
      <ul class="card-body list-disc space-y-2 pl-5 text-sm text-ink-soft">
        <li>常用 Markdown + ::: 排版模块语法</li>
        <li>实时手机预览与主题切换</li>
        <li>一键复制 juice 内联 HTML，直接粘贴公众平台</li>
        <li>本地文档列表，支持导入/导出 .md</li>
        <li>界面配色 9 套强调色，支持浅色/深色/跟随系统，下拉即换</li>
      </ul>
    </section>

    <section class="card">
      <div class="card-header">使用步骤</div>
      <ol class="card-body list-decimal space-y-2 pl-5 text-sm text-ink-soft">
        <li>打开编辑器，输入或粘贴 Markdown</li>
        <li>通过「插入组件」添加 Hero、时间轴、FAQ 等模块</li>
        <li>切换排版主题，在右侧预览效果</li>
        <li>点击「复制公众号 HTML」</li>
        <li>
          登录
          <a
            href="https://mp.weixin.qq.com"
            class="text-cinnabar-dark underline"
            target="_blank"
            rel="noopener noreferrer"
          >微信公众平台</a>，在正文编辑器粘贴
        </li>
      </ol>
    </section>

    <section class="card">
      <div class="card-header">与墨韵 AI 写作平台</div>
      <p class="card-body text-sm text-ink-soft">
        本工具为纯排版工作室，不含 AI 写作、积分与云同步。若需选题、正文生成，请使用墨韵主站写作链路。
      </p>
    </section>

    <a
      class="btn-secondary btn-sm inline-flex"
      :href="GITHUB_REPO_URL"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub 源码
    </a>
  </div>
</template>
