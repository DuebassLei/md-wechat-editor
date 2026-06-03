import { normalizeMarkdownContent } from '@/utils/normalizeMarkdownContent'
import { renderMarkdown } from '@/utils/renderMarkdown'
import { getThemeCss, normalizeThemeId, type ThemeId } from '@/types/theme'
import { buildWechatHtml } from '@/utils/wechatCopy'
import {
  buildAiIndigoPreambleHtml,
  extractAiIndigoArticleFromMarkdown,
} from '@/utils/wechatAiIndigoHero'
import {
  type RenderEntitlements,
  OPEN_RENDER_ENTITLEMENTS,
  resolveThemeForEntitlements,
} from '@/utils/renderEntitlements'
import type { ParseMarkdownOptions } from '@/lib/r-markdown/parseOptions'
import type { TemplateEntitlementMap } from '@/types/templateEntitlements'
import { markdownUsesLayoutModules } from '@/utils/detectLayoutModules'
import { juiceGfmThemeBlocks } from '@/utils/gfmThemeWrapper'
import { prepareWechatPasteHtml } from '@/utils/wechatPasteHtml'
import { annotateArticleHtmlForSync } from './editorSyncAnchors'

export type { RenderEntitlements }
export { stripEditorSyncAttributes } from './editorSyncAnchors'

export interface ArticleRenderOptions {
  /** 排版组件强调色；null/省略则跟随当前文章主题色板 */
  componentAccent?: string | null
  /** 仅 Studio 预览：写入 data-md-line-start；复制必须为 false/省略 */
  editorSyncAnchors?: boolean
}

type ParseLayoutMarkdownFn = (
  markdown: string,
  options?: ParseMarkdownOptions & { themeId?: ThemeId },
) => string

let layoutParserModule: { parseLayoutMarkdown: ParseLayoutMarkdownFn } | null = null
let layoutParserLoading: Promise<{ parseLayoutMarkdown: ParseLayoutMarkdownFn }> | null = null

async function loadLayoutParser(): Promise<ParseLayoutMarkdownFn> {
  if (layoutParserModule) return layoutParserModule.parseLayoutMarkdown
  layoutParserLoading ??= import('@/lib/r-markdown/parseLayoutMarkdown')
  layoutParserModule = await layoutParserLoading
  return layoutParserModule.parseLayoutMarkdown
}

/** 预加载排版解析器 chunk（正文含组件时） */
export function preloadLayoutRenderer(): void {
  void loadLayoutParser()
}

/** @deprecated 使用 preloadLayoutRenderer */
export function preloadThemeRenderer(_themeId?: ThemeId): void {
  preloadLayoutRenderer()
}

/** 正文是否需走富排版解析器（与主题无关） */
export function usesRichLayout(markdown: string): boolean {
  return markdownUsesLayoutModules(markdown)
}

async function renderAiIndigoExtras(
  markdown: string,
  parseOpts: ParseMarkdownOptions,
  themeId: ThemeId,
): Promise<string> {
  const { body, hero, tags, toc } = extractAiIndigoArticleFromMarkdown(markdown)
  let bodyHtml: string
  if (usesRichLayout(body)) {
    const parse = await loadLayoutParser()
    bodyHtml = parse(body, { ...parseOpts, themeId })
  } else {
    bodyHtml = renderMarkdown(body)
  }
  return buildAiIndigoPreambleHtml(hero, tags, toc) + bodyHtml
}

function buildParseOptions(
  entitlements: RenderEntitlements,
  templateEntitlements: TemplateEntitlementMap | null | undefined,
  renderOptions?: ArticleRenderOptions,
): ParseMarkdownOptions {
  return {
    layoutTier: entitlements.layoutTier,
    templateEntitlements: templateEntitlements ?? null,
    componentAccent: renderOptions?.componentAccent ?? null,
    editorSyncAnchors: renderOptions?.editorSyncAnchors ?? false,
  }
}

/** 主题相关 Markdown 预览 HTML（未做 juice 内联） */
export async function renderMarkdownWithThemeExtras(
  markdown: string,
  themeId: ThemeId,
  entitlements: RenderEntitlements = OPEN_RENDER_ENTITLEMENTS,
  templateEntitlements?: TemplateEntitlementMap | null,
  renderOptions?: ArticleRenderOptions,
): Promise<string> {
  const normalized = normalizeMarkdownContent(markdown)
  if (!normalized.trim()) return ''

  const maps = templateEntitlements ?? null
  const entitledTheme = normalizeThemeId(
    resolveThemeForEntitlements(themeId, entitlements, maps),
  )
  const parseOpts = buildParseOptions(entitlements, maps, renderOptions)

  if (entitledTheme === 'aiIndigo') {
    return renderAiIndigoExtras(normalized, parseOpts, entitledTheme)
  }

  if (usesRichLayout(normalized)) {
    const parse = await loadLayoutParser()
    return parse(normalized, { ...parseOpts, themeId: entitledTheme })
  }

  return renderMarkdown(normalized)
}

/** 富排版复制管线：保留内联样式，与官方编辑器一致 */
function buildRichLayoutWechatHtml(html: string): string {
  const body = prepareWechatPasteHtml(html)
  return (
    `<section style="background-color:#fff;color:#334155;padding:0;max-width:100%;` +
    `box-sizing:border-box;font-size:16px;line-height:1.75;word-break:break-word">${body}</section>`
  )
}

/**
 * 公众号成稿 HTML 唯一入口：预览、复制、发布草稿、导出均走此函数。
 * 富排版（含组件）走内联 HTML；纯 GFM 走 mdnice + juice。
 */
export async function buildWechatArticleHtml(
  markdown: string,
  themeId: ThemeId,
  entitlements: RenderEntitlements = OPEN_RENDER_ENTITLEMENTS,
  templateEntitlements?: TemplateEntitlementMap | null,
  renderOptions?: ArticleRenderOptions,
): Promise<string> {
  const maps = templateEntitlements ?? null
  const entitledTheme = normalizeThemeId(
    resolveThemeForEntitlements(themeId, entitlements, maps),
  )
  const markdownHtml = await renderMarkdownWithThemeExtras(
    markdown,
    entitledTheme,
    entitlements,
    maps,
    renderOptions,
  )

  let result: string
  if (usesRichLayout(markdown)) {
    const juiced = await juiceGfmThemeBlocks(markdownHtml, entitledTheme)
    result = buildRichLayoutWechatHtml(juiced)
  } else if (entitledTheme === 'aiIndigo') {
    const themeCss = getThemeCss('aiIndigo', '#nice')
    result = await buildWechatHtml(markdownHtml, themeCss)
  } else {
    const themeCss = getThemeCss(entitledTheme, '#nice')
    result = await buildWechatHtml(markdownHtml, themeCss)
  }

  if (renderOptions?.editorSyncAnchors) {
    result = annotateArticleHtmlForSync(markdown, result)
  }
  return result
}
