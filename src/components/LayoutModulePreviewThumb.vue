<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { markPickerFirstThumb } from '@/observability/layoutModulePickerPerf'
import { scheduleModulePreview } from '@/composables/previewScheduler'
import { moduleThumbUrl } from '@/composables/moduleThumbUrl'

const props = withDefaults(
  defineProps<{
    moduleId: string
    liveActive?: boolean
    enableLive?: boolean
    session?: number
    locked?: boolean
  }>(),
  { liveActive: false, enableLive: true, session: 0, locked: false },
)

const html = ref('')
const loading = ref(false)
const failed = ref(false)
const staticFailed = ref(false)
let cancelled = false

const thumbSrc = computed(() => moduleThumbUrl(props.moduleId))

function onStaticLoad() {
  markPickerFirstThumb()
}

async function loadLive() {
  if (!props.enableLive || !props.liveActive || html.value) return
  const sessionAtStart = props.session
  loading.value = true
  failed.value = false
  try {
    const rendered = await scheduleModulePreview(props.moduleId)
    if (!cancelled && props.session === sessionAtStart) {
      html.value = rendered
    }
  } catch {
    if (!cancelled && props.session === sessionAtStart) failed.value = true
  } finally {
    if (!cancelled && props.session === sessionAtStart) loading.value = false
  }
}

watch(
  () => [props.liveActive, props.enableLive, props.moduleId] as const,
  ([live, enableLive]) => {
    if (live && enableLive) void loadLive()
  },
)

onBeforeUnmount(() => {
  cancelled = true
})
</script>

<template>
  <div
    class="layout-module-preview-thumb"
    :class="{ 'layout-module-preview-thumb--locked': locked }"
    aria-hidden="true"
  >
    <div
      v-if="loading && liveActive && enableLive && !html"
      class="layout-module-preview-thumb__skeleton"
    />
    <p v-else-if="failed && !html" class="layout-module-preview-thumb__fallback">预览加载失败</p>
    <div v-else-if="html" class="layout-module-preview-thumb__viewport">
      <article
        class="nice-markdown nice-markdown--rich-layout layout-module-preview-thumb__body"
        v-html="html"
      />
    </div>
    <div v-else class="layout-module-preview-thumb__viewport">
      <img
        v-if="!staticFailed"
        :src="thumbSrc"
        alt=""
        class="layout-module-preview-thumb__static"
        loading="lazy"
        decoding="async"
        @load="onStaticLoad"
        @error="staticFailed = true"
      >
      <div v-else class="layout-module-preview-thumb__skeleton layout-module-preview-thumb__skeleton--fallback" />
    </div>
  </div>
</template>

<style scoped>
.layout-module-preview-thumb {
  position: relative;
  flex-shrink: 0;
  margin-top: 0.25rem;
  height: 9.5rem;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid var(--paper-line, #e2e8f0);
  background: #fff;
}

.layout-module-preview-thumb::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1.25rem;
  background: linear-gradient(to bottom, rgb(255 255 255 / 0), rgb(255 255 255 / 0.92));
  pointer-events: none;
  z-index: 1;
}

.layout-module-preview-thumb--locked::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgb(255 255 255 / 0.42);
  pointer-events: none;
  z-index: 2;
}

.layout-module-preview-thumb__skeleton {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--paper-dim, #f1f5f9) 0%,
    var(--paper-bright, #fff) 50%,
    var(--paper-dim, #f1f5f9) 100%
  );
  background-size: 200% 100%;
  animation: layout-module-preview-shimmer 1.2s ease-in-out infinite;
}

.layout-module-preview-thumb__skeleton--fallback {
  animation: none;
  background: var(--paper-dim, #f1f5f9);
}

@keyframes layout-module-preview-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.layout-module-preview-thumb__viewport {
  width: 22.5rem;
  max-width: none;
  zoom: 0.52;
  transform-origin: top left;
  overflow: hidden;
  height: 9.5rem;
}

@supports not (zoom: 1) {
  .layout-module-preview-thumb__viewport {
    zoom: unset;
    width: 192%;
    transform: scale(0.52);
  }
}

.layout-module-preview-thumb__static {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: top center;
  pointer-events: none;
}

.layout-module-preview-thumb__body {
  width: 100%;
  pointer-events: none;
  padding: 0.375rem 0.625rem;
  box-sizing: border-box;
}

.layout-module-preview-thumb__fallback {
  margin: 0;
  padding: 0.5rem;
  font-size: 10px;
  color: var(--ink-faint, #94a3b8);
  text-align: center;
}
</style>
