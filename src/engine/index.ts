export {
  buildWechatArticleHtml,
  renderMarkdownWithThemeExtras,
  preloadLayoutRenderer,
  usesRichLayout,
  stripEditorSyncAttributes,
  type ArticleRenderOptions,
  type RenderEntitlements,
} from '@/utils/wechatArticleHtml'

export { OPEN_RENDER_ENTITLEMENTS } from '@/utils/renderEntitlements'
export { markdownUsesLayoutModules } from '@/utils/detectLayoutModules'
export {
  THEME_OPTIONS,
  normalizeThemeId,
  getThemeName,
  getThemeSwatch,
  type ThemeId,
} from '@/types/theme'
