import { getThemeTokens } from '@/themes/themeTokens'
import { normalizeThemeId, type ThemeId } from '@/types/theme'
import { prepareLayoutInput } from './prepareInput'
import { parseMarkdown } from './utils/markdownParser'
import type { ParseMarkdownOptions } from './parseOptions'

export type ParseLayoutMarkdownOptions = ParseMarkdownOptions & {
  themeId?: ThemeId
}

/** 将 Markdown（含 ::: 排版模块）渲染为公众号内联样式 HTML */
export function parseLayoutMarkdown(markdown: string, options?: ParseLayoutMarkdownOptions): string {
  if (!markdown?.trim()) return ''
  const themeId = normalizeThemeId(options?.themeId ?? 'normal')
  const tokens =
    options?.themeTokens ?? getThemeTokens(themeId, options?.componentAccent ?? null)
  return parseMarkdown(prepareLayoutInput(markdown), tokens, options)
}

/** @deprecated 使用 parseLayoutMarkdown */
export const parseRMarkdown = parseLayoutMarkdown

export type ParseRMarkdownOptions = ParseLayoutMarkdownOptions
