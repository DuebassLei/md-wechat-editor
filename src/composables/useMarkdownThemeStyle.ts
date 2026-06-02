import { type MaybeRefOrGetter, onUnmounted, type Ref, toValue, watch } from 'vue'
import { getThemeCss } from '@/types/theme'
import { AWP_GFM_THEME_CLASS } from '@/utils/gfmThemeWrapper'

/** 将 mdnice 主题 CSS 注入 document.head，供 .nice-markdown 预览使用 */
export function useMarkdownThemeStyle(
  themeId: Ref<string>,
  usesRichLayoutSource?: MaybeRefOrGetter<boolean>,
  rootSelector = '.nice-markdown',
) {
  let themeStyleEl: HTMLStyleElement | null = null

  watch(
    [themeId, () => toValue(usesRichLayoutSource) ?? false],
    ([id, richLayout]) => {
      const scopedRoot = richLayout
        ? `${rootSelector} .${AWP_GFM_THEME_CLASS}`
        : rootSelector
      const css = getThemeCss(id, scopedRoot)

      if (!themeStyleEl) {
        themeStyleEl = document.createElement('style')
        themeStyleEl.setAttribute('data-moyun-md-theme', '')
        document.head.appendChild(themeStyleEl)
      }
      themeStyleEl.textContent = css
    },
    { immediate: true },
  )

  onUnmounted(() => {
    themeStyleEl?.remove()
    themeStyleEl = null
  })
}
