<script setup lang="ts">
defineProps<{
  tags: string[]
  skipped?: string[]
}>()

const emit = defineEmits<{
  migrate: []
  openSyntax: []
  dismiss: []
}>()
</script>

<template>
  <div
    class="legacy-syntax-banner"
    role="status"
  >
    <p class="legacy-syntax-banner__text">
      检测到旧版 XML 排版标签（{{ tags.join('、') || '未知' }}），预览可能异常。请改用
      <code class="legacy-syntax-banner__code">:::</code>
      围栏语法。
      <span v-if="skipped?.length" class="legacy-syntax-banner__skip">
        以下需手改：{{ skipped.join('、') }}。
      </span>
    </p>
    <div class="legacy-syntax-banner__actions">
      <button type="button" class="btn-primary btn-sm" @click="emit('migrate')">
        尝试自动转换
      </button>
      <button type="button" class="btn-secondary btn-sm" @click="emit('openSyntax')">
        语法手册
      </button>
      <button type="button" class="btn-ghost btn-sm" @click="emit('dismiss')">
        不再提示
      </button>
    </div>
  </div>
</template>

<style scoped>
.legacy-syntax-banner {
  @apply flex shrink-0 flex-col gap-2 border-b border-amber-200/80 bg-amber-50/90 px-3 py-2 sm:flex-row sm:items-center sm:justify-between;
}
.legacy-syntax-banner__text {
  @apply text-xs leading-relaxed text-amber-950;
}
.legacy-syntax-banner__code {
  @apply rounded bg-amber-100/80 px-1 py-0.5 font-mono text-[10px];
}
.legacy-syntax-banner__skip {
  @apply text-amber-800;
}
.legacy-syntax-banner__actions {
  @apply flex shrink-0 flex-wrap gap-1.5;
}
</style>
