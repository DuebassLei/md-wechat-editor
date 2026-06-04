import type { ThemeColors } from '@/engine/r-markdown/themeColors'
import { buildReadingStyleBlock } from '@/engine/card-export/readingStyles'

/** @deprecated 使用 buildReadingStyleBlock('xhs', colors) */
export function buildXhsReadingStyleBlock(colors?: ThemeColors): string {
  return buildReadingStyleBlock('xhs', colors)
}
