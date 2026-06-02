import { normalizeMarkdownContent } from '@/utils/normalizeMarkdownContent'
import { renderMarkdown } from '@/utils/renderMarkdown'
import { getThemeCss, normalizeThemeId, type ThemeId } from '@/types/theme'
import { buildWechatHtml } from '@/utils/wechatCopy'
import { buildAiIndigoCtaHtml, resolveAiIndigoCta } from '@/utils/wechatAiIndigoCta'
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

export type { RenderEntitlements }

export interface ArticleRenderOptions {
  /** 排版组件强调色；null/省略则跟随当前文章主题色板 */
  componentAccent?: string | null
}

type ParseLayoutMarkdownFn = (
  markdown: string,
  options?: ParseMarkdownOptions & { themeId?: ThemeId },
) => string

let layoutParserModule: { parseLayoutMarkdown: ParseLayoutMarkdownFn } | null = null
let layoutParserLoading: Promise<{ parseLayoutMarkdown: ParseLayoutMarkdownFn }> | null = null

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

function parseFrontmatterForCta(markdown: string): Record<string, string> {
  const fmMatch = markdown.trimStart().match(FRONTMATTER_RE)
  if (!fmMatch) return {}
  const out: Record<string, string> = {}
  for (const line of fmMatch[1].split('\n')) {
    const m = line.match(/^([\w-]+):\s*(.+)$/)
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
  return out
}

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
  const cta = resolveAiIndigoCta(parseFrontmatterForCta(markdown))
  let bodyHtml: string
  if (usesRichLayout(body)) {
    const parse = await loadLayoutParser()
    bodyHtml = parse(body, { ...parseOpts, themeId })
  } else {
    bodyHtml = renderMarkdown(body)
  }
  const ctaHtml = cta ? buildAiIndigoCtaHtml(cta) : ''
  return buildAiIndigoPreambleHtml(hero, tags, toc) + bodyHtml + ctaHtml
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

  if (usesRichLayout(markdown)) {
    const juiced = await juiceGfmThemeBlocks(markdownHtml, entitledTheme)
    return buildRichLayoutWechatHtml(juiced)
  }

  if (entitledTheme === 'aiIndigo') {
    const themeCss = getThemeCss('aiIndigo', '#nice')
    return await buildWechatHtml(markdownHtml, themeCss)
  }

  const themeCss = getThemeCss(entitledTheme, '#nice')
  return await buildWechatHtml(markdownHtml, themeCss)
}
