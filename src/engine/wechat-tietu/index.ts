import { extractCardMeta } from '@/engine/card-export/extractMeta'
import {
  wrapHtmlWithFrame,
  resolveFrameAccent,
  type CardFrameId,
} from '@/engine/card-export/cardFrames'
import { sliceContentToDataUrls } from '@/engine/card-export/sliceContent'
import { buildCover as buildXhsCover } from '@/engine/xhs/buildCover'
import { prepareReadingHtml } from '@/engine/xhs/prepareReading'
import { resolveAccentColors } from '@/engine/xhs/resolveAccent'
import type { ThemeId } from '@/types/theme'
import { buildWechatCover } from './buildCover'
import { ASPECTS } from '@/engine/card-export/constants'
import { XHS } from '@/engine/xhs/tokens'
import {
  DEFAULT_WECHAT_TIETU_BRAND,
  WECHAT_TIETU_ASPECT,
  WECHAT_SLICE_THEME,
  XHS_SKIN_SLICE_THEME,
} from './tokens'
import type { CardMeta, WechatTietuSkin } from '@/engine/card-export/types'

export { buildWechatCover } from './buildCover'
export {
  DEFAULT_WECHAT_TIETU_BRAND,
  WECHAT_TIETU_ASPECT,
  WECHAT_TIETU,
  WECHAT_SLICE_THEME,
} from './tokens'
export type { WechatTietuSkin, CardMeta, ExportCard, ExportQualityMode } from '@/engine/card-export/types'
export {
  errText,
  htmlToImageOptions,
  compressPngDataUrlForUpload,
  formatByteSize,
  dataUrlByteSize,
  buildZipBlob,
  dataUrlToBytes,
  downloadBlob,
  wechatTietuZipArchiveName,
  ASPECTS,
  PIXEL_RATIO,
} from '@/engine/card-export'
export { prepareReadingHtml } from '@/engine/xhs/prepareReading'
export {
  CARD_FRAMES,
  parseStoredFrame,
  resolveFrameAccent,
  type CardFrameId,
} from '@/engine/card-export/cardFrames'

export function extractWechatTietu(markdown: string): { meta: CardMeta; contentMd: string } {
  return extractCardMeta(markdown, DEFAULT_WECHAT_TIETU_BRAND)
}

export function sliceThemeForSkin(skin: WechatTietuSkin) {
  return skin === 'wechat' ? WECHAT_SLICE_THEME : XHS_SKIN_SLICE_THEME
}

export function buildCoverForSkin(
  meta: CardMeta,
  skin: WechatTietuSkin,
  themeId: ThemeId,
  frameId: CardFrameId = 'none',
): string {
  const { w, h } = ASPECTS[WECHAT_TIETU_ASPECT]
  const accent = resolveFrameAccent(skin, themeId)
  let html: string
  if (skin === 'wechat') html = buildWechatCover(meta)
  else {
    const colors = resolveAccentColors('theme', themeId)
    html = buildXhsCover(meta, WECHAT_TIETU_ASPECT, colors)
  }
  const contentBg = skin === 'wechat' ? '#ffffff' : XHS.bg
  return wrapHtmlWithFrame(html, w, h, frameId, accent, contentBg)
}

export async function sliceWechatTietuContent(opts: {
  contentHtml: string
  brand: string
  skin: WechatTietuSkin
  previewContentWidth: number
  frameId?: CardFrameId
  themeId?: ThemeId | string
  purpose?: 'preview' | 'export'
  onPage?: (dataUrl: string, pageIndex: number, total: number) => void
  signal?: AbortSignal
}): Promise<string[]> {
  const frameId = opts.frameId ?? 'none'
  const themeId = opts.themeId ?? 'normal'
  const { dataUrls } = await sliceContentToDataUrls({
    contentHtml: opts.contentHtml,
    brand: opts.brand,
    aspect: WECHAT_TIETU_ASPECT,
    previewContentWidth: opts.previewContentWidth,
    theme: sliceThemeForSkin(opts.skin),
    frameId,
    frameAccent: resolveFrameAccent(opts.skin, themeId),
    purpose: opts.purpose,
    onPage: opts.onPage,
    signal: opts.signal,
  })
  return dataUrls
}

export function wechatTietuFileName(idx: number, quality: 'hd' | 'upload', date?: string): string {
  const d = date ?? new Date().toISOString().slice(0, 10)
  const tag = idx === 0 ? '00_cover' : String(idx).padStart(2, '0')
  const ext = quality === 'upload' ? 'jpg' : 'png'
  return `wechat_tietu_${d}_${tag}.${ext}`
}
