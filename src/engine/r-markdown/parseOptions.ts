import type { LayoutTier } from '@/constants/layoutModules'
import type { ThemeColors } from '@/lib/r-markdown/themeColors'
import type { TemplateEntitlementMap } from '@/types/templateEntitlements'

export interface ParseMarkdownOptions {
  layoutTier: LayoutTier
  templateEntitlements?: TemplateEntitlementMap | null
  componentAccent?: string | null
  themeTokens?: ThemeColors
}

/** 墨韵简排：不展示锁定占位 */
export function guardLayoutModule(
  _moduleId?: string,
  _opts?: ParseMarkdownOptions,
): string | null {
  return null
}
