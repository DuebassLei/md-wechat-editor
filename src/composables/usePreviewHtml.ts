import { ref, watch, type Ref } from 'vue'
import {
  buildWechatArticleHtml,
  OPEN_RENDER_ENTITLEMENTS,
  preloadLayoutRenderer,
  type ThemeId,
} from '@/engine'

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
      const result = await buildWechatArticleHtml(
        markdown.value,
        themeId.value,
        OPEN_RENDER_ENTITLEMENTS,
        null,
        { editorSyncAnchors: true },
      )
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

  watch([markdown, themeId], schedule, { immediate: true })

  return { html, loading, error, refresh: renderNow }
}
