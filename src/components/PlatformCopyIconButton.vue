<script setup lang="ts">
import { computed } from 'vue'

export type PlatformCopyIcon = 'wechat' | 'wechat-tietu' | 'juejin' | 'zhihu' | 'csdn' | 'xhs'

const props = defineProps<{
  platform: PlatformCopyIcon
  loading?: boolean
  disabled?: boolean
  title: string
}>()

defineEmits<{ click: [] }>()

const useImgIcon = computed(
  () =>
    props.platform === 'wechat'
    || props.platform === 'juejin'
    || props.platform === 'zhihu'
    || props.platform === 'csdn',
)

const iconSrc = computed(() => {
  if (props.platform === 'wechat') {
    return `${import.meta.env.BASE_URL}platform-icons/wechat-white.svg`
  }
  return `${import.meta.env.BASE_URL}platform-icons/${props.platform}.svg`
})

const btnClass = computed(() => {
  const base = 'btn btn-sm platform-copy-icon-btn'
  if (props.platform === 'wechat' || props.platform === 'wechat-tietu') {
    return `${base} platform-copy-icon-btn--wechat`
  }
  if (props.platform === 'xhs') {
    return `${base} platform-copy-icon-btn--xhs`
  }
  return `${base} btn-secondary platform-copy-icon-btn--brand`
})

const iconClass = computed(() => {
  const base = 'platform-copy-icon-btn__icon'
  if (props.platform === 'wechat' || props.platform === 'wechat-tietu') {
    return `${base} platform-copy-icon-btn__icon--wechat`
  }
  if (props.platform === 'xhs') return `${base} platform-copy-icon-btn__icon--xhs`
  return base
})
</script>

<template>
  <button
    type="button"
    :class="btnClass"
    :disabled="disabled || loading"
    :title="loading ? '处理中…' : title"
    :aria-label="loading ? '处理中…' : title"
    :aria-busy="loading"
    @click="$emit('click')"
  >
    <img
      v-if="!loading && useImgIcon"
      :src="iconSrc"
      :class="iconClass"
      alt=""
      draggable="false"
    >
    <!-- 小红书：全红底 + 白字，与左侧微信绿底对称 -->
    <svg
      v-else-if="!loading && platform === 'xhs'"
      :class="iconClass"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <text
        x="12"
        y="15.2"
        text-anchor="middle"
        fill="#FFFFFF"
        font-size="6.2"
        font-weight="700"
        font-family="PingFang SC, Microsoft YaHei, sans-serif"
      >
        小红书
      </text>
    </svg>
    <!-- 贴图：绿底 + 四宫格（多图消息），与微信对话气泡区分 -->
    <svg
      v-else-if="!loading && platform === 'wechat-tietu'"
      :class="iconClass"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="7" height="7" rx="1.6" fill="#FFFFFF" />
      <rect x="13" y="4" width="7" height="7" rx="1.6" fill="#FFFFFF" />
      <rect x="4" y="13" width="7" height="7" rx="1.6" fill="#FFFFFF" />
      <rect x="13" y="13" width="7" height="7" rx="1.6" fill="#FFFFFF" />
    </svg>
    <svg
      v-else
      class="platform-copy-icon-btn__icon platform-copy-icon-btn__icon--spin"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="28 10" />
    </svg>
  </button>
</template>

<style scoped>
.platform-copy-icon-btn {
  @apply !px-2 !py-2;
}

.platform-copy-icon-btn--wechat {
  border-color: #06ae56;
  background: #07c160;
  color: #fff;
  box-shadow: 0 1px 4px rgb(7 193 96 / 0.35);
}

.platform-copy-icon-btn--wechat:hover:not(:disabled) {
  background: #06ae56;
  border-color: #059c4d;
}

.platform-copy-icon-btn--xhs {
  border-color: #e01e3c;
  background: #ff2442;
  color: #fff;
  box-shadow: 0 1px 4px rgb(255 36 66 / 0.35);
}

.platform-copy-icon-btn--xhs:hover:not(:disabled) {
  background: #e01e3c;
  border-color: #c91936;
}

.platform-copy-icon-btn--wechat:disabled,
.platform-copy-icon-btn--xhs:disabled {
  @apply opacity-50;
}

.platform-copy-icon-btn--brand:disabled {
  @apply opacity-50;
}

.platform-copy-icon-btn--brand {
  @apply border-paper-deep bg-paper-bright shadow-sm;
}

.platform-copy-icon-btn--brand:hover:not(:disabled) {
  @apply border-paper-deep bg-paper-dim;
}

.platform-copy-icon-btn__icon {
  @apply block h-[18px] w-[18px] object-contain;
}

.platform-copy-icon-btn__icon--wechat,
.platform-copy-icon-btn__icon--xhs {
  @apply h-5 w-5;
}

.platform-copy-icon-btn--wechat .platform-copy-icon-btn__icon--spin {
  @apply text-white;
}

.platform-copy-icon-btn--xhs .platform-copy-icon-btn__icon--spin {
  @apply text-white;
}

.platform-copy-icon-btn--brand .platform-copy-icon-btn__icon--spin {
  @apply text-ink-muted;
}

.platform-copy-icon-btn__icon--spin {
  animation: platform-copy-spin 0.75s linear infinite;
}

@keyframes platform-copy-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
