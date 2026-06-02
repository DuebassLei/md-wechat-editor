<script setup lang="ts">
import { ref, watch } from 'vue'
import { WECHAT_MP_PROMO } from '@/meta/site'
import { resolveWechatMpQrSrc } from '@/composables/useWechatMpQr'

const open = defineModel<boolean>('open', { required: true })

const promo = WECHAT_MP_PROMO
const promoLabel = `关注 ${promo.accountName} 公众号`
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
        class="wechat-qr-backdrop fixed inset-0 z-[310] flex items-center justify-center p-4"
        role="presentation"
        @click.self="close"
      >
        <div
          class="wechat-qr-dialog card relative w-full max-w-sm overflow-hidden shadow-card-hover"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wechat-qr-title"
          @click.stop
        >
          <header class="flex items-start justify-between gap-3 border-b border-paper-line px-4 py-3">
            <div class="min-w-0">
              <p id="wechat-qr-title" class="text-base font-semibold text-ink">{{ promoLabel }}</p>
              <p class="mt-0.5 text-xs text-ink-muted">微信扫一扫，接收 {{ promo.hint }}</p>
            </div>
            <button type="button" class="btn-ghost btn-sm shrink-0 !px-2" aria-label="关闭" @click="close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div class="px-4 py-5 pb-6 text-center">
            <div class="wechat-qr-dialog__frame mx-auto">
              <img
                v-if="!loadError"
                :src="qrSrc"
                alt=""
                class="wechat-qr-dialog__img"
                width="200"
                height="200"
                @error="loadError = true"
              >
              <div v-else class="wechat-qr-dialog__empty">
                <p class="text-sm font-medium text-ink">暂未配置二维码</p>
                <p class="mt-1 text-xs text-ink-muted">
                  请将图片放到 public/wechat-mp-qr.png，或配置 VITE_WECHAT_MP_QR_URL
                </p>
              </div>
            </div>
            <p class="mt-4 text-xs text-ink-muted">打开微信 → 扫一扫 → 识别二维码</p>
            <a
              v-if="promo.href"
              class="mt-3 inline-block text-xs font-medium text-cinnabar-dark underline underline-offset-2"
              :href="promo.href"
              target="_blank"
              rel="noopener noreferrer"
            >
              在浏览器中打开公众号
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.wechat-qr-backdrop {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
}

.wechat-qr-dialog__frame {
  width: 200px;
  height: 200px;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid var(--paper-line, #e2e8f0);
  background: #fff;
  box-shadow: 0 4px 20px rgb(15 23 42 / 0.08);
}

.wechat-qr-dialog__img {
  display: block;
  width: 180px;
  height: 180px;
  object-fit: contain;
}

.wechat-qr-dialog__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  border-radius: 8px;
  border: 1px dashed var(--paper-deep, #cbd5e1);
  background: var(--paper-dim, #f8fafc);
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
