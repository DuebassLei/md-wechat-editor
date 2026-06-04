import { extractCardMeta } from '@/engine/card-export/extractMeta'
import { DEFAULT_XHS_BRAND } from './tokens'
import type { XhsMeta } from './types'

export function extractXhs(markdown: string): { meta: XhsMeta; contentMd: string } {
  return extractCardMeta(markdown, DEFAULT_XHS_BRAND)
}
