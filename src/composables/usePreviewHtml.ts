import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import {
  buildWechatArticleHtml,
  OPEN_RENDER_ENTITLEMENTS,
  preloadLayoutRenderer,
  type ThemeId,
} from '@/engine'
import { resolveImageSourcesInHtml } from '@/engine/image-pipeline/resolveImageHtml'
import { resolveMarkdownForPreview } from '@/engine/image-pipeline/publishResolve'

const IMAGE_CHANGED_EVENT = 'mdwe:images-changed'

export function usePreviewHtml(markdown: Ref<string>, themeId: Ref<ThemeId>) {
  const html = ref('')
  const loading = ref(false)
  const error = ref('')

  let timer: ReturnType<typeof setTimeout> | null = null
  let seq = 0

  async function renderNow() {
    const id = ++seq
    loading.value = true
    error.value = ''
    try {
      preloadLayoutRenderer()
      const resolved = await resolveMarkdownForPreview(markdown.value)
      let result = await buildWechatArticleHtml(
        resolved,
        themeId.value,
        OPEN_RENDER_ENTITLEMENTS,
        null,
        { editorSyncAnchors: true },
      )
      result = await resolveImageSourcesInHtml(result)
      if (id === seq) html.value = result
    } catch (e) {
      if (id === seq) {
        error.value = e instanceof Error ? e.message : '预览渲染失败'
        html.value = ''
      }
    } finally {
      if (id === seq) loading.value = false
    }
  }

  function schedule() {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => void renderNow(), 280)
  }

  function onImagesChanged() {
    if (timer) clearTimeout(timer)
    void renderNow()
  }

  watch([markdown, themeId], schedule, { immediate: true })

  onMounted(() => {
    window.addEventListener(IMAGE_CHANGED_EVENT, onImagesChanged)
  })
  onUnmounted(() => {
    window.removeEventListener(IMAGE_CHANGED_EVENT, onImagesChanged)
    if (timer) clearTimeout(timer)
  })

  return { html, loading, error, refresh: renderNow }
}

export function notifyLocalImagesChanged(): void {
  window.dispatchEvent(new CustomEvent(IMAGE_CHANGED_EVENT))
}
