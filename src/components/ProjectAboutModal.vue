<script setup lang="ts">
import ProjectAboutContent from '@/components/ProjectAboutContent.vue'

const open = defineModel<boolean>('open', { required: true })

function close() {
  open.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="project-about-backdrop fixed inset-0 z-[305] flex items-center justify-center p-3 sm:p-4"
        role="presentation"
        @click.self="close"
      >
        <div
          class="project-about-dialog card relative flex max-h-[min(calc(100dvh-1.5rem),640px)] w-full max-w-lg flex-col overflow-hidden shadow-card-hover"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-about-title"
          @click.stop
        >
          <header class="flex shrink-0 items-center justify-between gap-3 border-b border-paper-line px-4 py-3 sm:px-5">
            <div>
              <p id="project-about-title" class="text-base font-semibold text-ink">项目说明</p>
              <p class="mt-0.5 text-xs text-ink-muted">墨韵简排 · Markdown 微信排版工具</p>
            </div>
            <button type="button" class="btn-ghost btn-sm shrink-0 !px-2" aria-label="关闭" @click="close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
            <ProjectAboutContent />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.project-about-backdrop {
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
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
