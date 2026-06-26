export {
  buildWechatArticleHtml,
  renderMarkdownWithThemeExtras,
  preloadLayoutRenderer,
  usesRichLayout,
  stripEditorSyncAttributes,
  type ArticleRenderOptions,
  type RenderEntitlements,
} from '@/utils/wechatArticleHtml'

export { buildJuejinArticleHtml } from '@/utils/juejinArticleHtml'
export { buildZhihuArticleHtml } from '@/utils/zhihuArticleHtml'

export { OPEN_RENDER_ENTITLEMENTS } from '@/utils/renderEntitlements'
export { markdownUsesLayoutModules } from '@/utils/detectLayoutModules'
export {
  THEME_OPTIONS,
  normalizeThemeId,
  getThemeName,
  getThemeSwatch,
  groupThemeOptions,
  type ThemeId,
  type ThemeGroup,
} from '@/types/theme'

export { buildPlatformMarkdown } from '@/engine/export/platformMarkdown'
export { copyPlainText } from '@/utils/platformCopy'
export type { PlatformTarget, PlatformExportResult, ConversionReport } from '@/engine/export/types'
