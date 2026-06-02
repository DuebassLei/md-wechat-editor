<script setup lang="ts">
import { ref, watch } from 'vue'
import { WECHAT_MP_PROMO } from '@/meta/site'
import { resolveWechatMpQrSrc } from '@/composables/useWechatMpQr'

const open = defineModel<boolean>('open', { required: true })

const promo = WECHAT_MP_PROMO
const promoLabel = `关注 ${promo.accountName}`
const qrSrc = resolveWechatMpQrSrc()
const loadError = ref(false)

watch(open, (isOpen) => {
  if (isOpen) loadError.value = false
})

function close() {
  open.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="wechat-qr-backdrop fixed inset-0 z-[310] flex items-center justify-center p-3 sm:p-4"
        role="presentation"
        @click.self="close"
      >
        <div
          class="wechat-qr-dialog card relative w-full max-w-xl overflow-hidden shadow-card-hover"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wechat-qr-title"
          @click.stop
        >
          <div class="wechat-qr-dialog__hero" aria-hidden="true">
            <div class="wechat-qr-dialog__hero-glow" />
            <pre class="wechat-qr-dialog__hero-code"><code><span class="tok-comment">// vibe coding session</span>
<span class="tok-keyword">const</span> stack = [<span class="tok-string">'Cursor'</span>, <span class="tok-string">'Agent'</span>, <span class="tok-string">'Flow'</span>]
<span class="tok-keyword">await</span> ship(<span class="tok-fn">buildWithAI</span>(stack))</code></pre>
          </div>

          <header class="wechat-qr-dialog__header">
            <div class="min-w-0 flex-1">
              <p class="wechat-qr-dialog__eyebrow">微信公众号 · AI 编程</p>
              <p id="wechat-qr-title" class="wechat-qr-dialog__title">{{ promoLabel }}</p>
              <p class="wechat-qr-dialog__tagline">{{ promo.tagline }}</p>
            </div>
            <button type="button" class="btn-ghost btn-sm shrink-0 !px-2" aria-label="关闭" @click="close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div class="wechat-qr-dialog__body">
            <div class="wechat-qr-dialog__qr-col">
              <div class="wechat-qr-dialog__frame">
                <img
                  v-if="!loadError"
                  :src="qrSrc"
                  alt=""
                  class="wechat-qr-dialog__img"
                  width="196"
                  height="196"
                  @error="loadError = true"
                >
                <div v-else class="wechat-qr-dialog__empty">
                  <p class="text-sm font-medium text-ink">暂未配置二维码</p>
                  <p class="mt-1 px-2 text-xs leading-relaxed text-ink-muted">
                    请将图片放到 public/wechat-mp-qr.png，或配置 VITE_WECHAT_MP_QR_URL
                  </p>
                </div>
              </div>
              <p class="wechat-qr-dialog__scan">微信扫一扫，即刻关注</p>
              <a
                v-if="promo.href"
                class="wechat-qr-dialog__link"
                :href="promo.href"
                target="_blank"
                rel="noopener noreferrer"
              >
                在浏览器中打开公众号
              </a>
            </div>

            <div class="wechat-qr-dialog__content">
              <p class="wechat-qr-dialog__intro">
                专注 AI 编程与 Vibe Coding：从 Cursor 工作流到 Agent 编排，把「写代码」变成「和 AI 一起 ship」。
              </p>

              <ul class="wechat-qr-dialog__topics" aria-label="内容方向">
                <li v-for="topic in promo.topics" :key="topic" class="wechat-qr-dialog__topic">
                  {{ topic }}
                </li>
              </ul>

              <div class="wechat-qr-dialog__benefits card">
                <p class="wechat-qr-dialog__benefits-title">关注后可获得</p>
                <ul class="wechat-qr-dialog__benefits-list">
                  <li v-for="item in promo.benefits" :key="item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <footer class="wechat-qr-dialog__footer">
            <span class="wechat-qr-dialog__footer-step">打开微信</span>
            <span class="wechat-qr-dialog__footer-arrow" aria-hidden="true">→</span>
            <span class="wechat-qr-dialog__footer-step">扫一扫</span>
            <span class="wechat-qr-dialog__footer-arrow" aria-hidden="true">→</span>
            <span class="wechat-qr-dialog__footer-step">关注 {{ promo.accountName }}</span>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.wechat-qr-backdrop {
  background: rgba(15, 23, 42, 0.52);
  backdrop-filter: blur(6px);
}

.wechat-qr-dialog__hero {
  @apply relative overflow-hidden border-b border-paper-line/80 px-4 py-3;
  background:
    linear-gradient(135deg, rgb(var(--cinnabar-light-rgb) / 0.75) 0%, rgb(var(--paper-bright-rgb) / 1) 55%);
}

.wechat-qr-dialog__hero-glow {
  @apply pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-70;
  background: radial-gradient(circle, rgb(var(--cinnabar-rgb) / 0.22), transparent 70%);
}

.wechat-qr-dialog__hero-code {
  @apply relative m-0 overflow-x-auto font-mono text-[11px] leading-relaxed sm:text-xs;
}

.wechat-qr-dialog__hero-code .tok-comment {
  color: rgb(var(--ink-faint-rgb));
}
.wechat-qr-dialog__hero-code .tok-keyword {
  color: rgb(var(--cinnabar-dark-rgb));
}
.wechat-qr-dialog__hero-code .tok-string {
  color: rgb(var(--jade-dark-rgb));
}
.wechat-qr-dialog__hero-code .tok-fn {
  color: rgb(var(--gold-dark-rgb));
}

.wechat-qr-dialog__header {
  @apply flex items-start justify-between gap-3 px-4 pb-3 pt-4 sm:px-5;
}

.wechat-qr-dialog__eyebrow {
  @apply text-[10px] font-bold uppercase tracking-[0.14em] text-cinnabar-dark;
}

.wechat-qr-dialog__title {
  @apply mt-1 text-lg font-semibold text-ink sm:text-xl;
}

.wechat-qr-dialog__tagline {
  @apply mt-1 text-xs leading-relaxed text-ink-muted sm:text-sm;
}

.wechat-qr-dialog__body {
  @apply grid gap-5 px-4 pb-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-start sm:gap-6 sm:px-5 sm:pb-5;
}

.wechat-qr-dialog__qr-col {
  @apply flex flex-col items-center text-center;
}

.wechat-qr-dialog__frame {
  @apply relative rounded-[var(--radius-control)] border border-paper-line bg-paper-bright p-2.5 shadow-card;
  width: 196px;
  height: 196px;
}

.wechat-qr-dialog__frame::before {
  content: '';
  @apply pointer-events-none absolute -inset-px rounded-[calc(var(--radius-control)+1px)] opacity-80;
  background: linear-gradient(
    135deg,
    rgb(var(--cinnabar-rgb) / 0.35) 0%,
    rgb(var(--jade-rgb) / 0.2) 50%,
    rgb(var(--gold-rgb) / 0.25) 100%
  );
  z-index: -1;
}

.wechat-qr-dialog__img {
  display: block;
  width: 180px;
  height: 180px;
  object-fit: contain;
}

.wechat-qr-dialog__empty {
  @apply flex h-[180px] w-[180px] flex-col items-center justify-center rounded-lg border border-dashed border-paper-deep bg-paper-dim/80;
}

.wechat-qr-dialog__scan {
  @apply mt-3 text-xs font-medium text-ink-soft;
}

.wechat-qr-dialog__link {
  @apply mt-2 text-xs font-medium text-cinnabar-dark underline underline-offset-2;
}

.wechat-qr-dialog__content {
  @apply min-w-0 space-y-4;
}

.wechat-qr-dialog__intro {
  @apply text-sm leading-relaxed text-ink-soft;
}

.wechat-qr-dialog__topics {
  @apply flex flex-wrap gap-2;
}

.wechat-qr-dialog__topic {
  @apply rounded-[var(--radius-pill)] border border-paper-line bg-paper-dim/80 px-2.5 py-1 text-[11px] font-medium text-ink-soft;
}

.wechat-qr-dialog__benefits {
  @apply overflow-hidden;
}

.wechat-qr-dialog__benefits-title {
  @apply border-b border-paper-line px-3 py-2 text-xs font-semibold text-ink;
}

.wechat-qr-dialog__benefits-list {
  @apply space-y-2.5 px-3 py-3;
}

.wechat-qr-dialog__benefits-list li {
  @apply flex items-start gap-2 text-xs leading-relaxed text-ink-soft;
}

.wechat-qr-dialog__benefits-list svg {
  @apply mt-0.5 shrink-0 text-jade-dark;
}

.wechat-qr-dialog__footer {
  @apply flex flex-wrap items-center justify-center gap-1.5 border-t border-paper-line bg-paper-dim/50 px-4 py-3 text-[11px] text-ink-muted sm:text-xs;
}

.wechat-qr-dialog__footer-step {
  @apply rounded-[var(--radius-pill)] bg-paper-bright px-2 py-1 font-medium text-ink-soft;
}

.wechat-qr-dialog__footer-arrow {
  @apply text-ink-faint;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
