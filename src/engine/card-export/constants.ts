import type { CardAspect } from './types'

export const ASPECTS: Record<CardAspect, { w: number; h: number }> = {
  '3:4': { w: 360, h: 480 },
  '1:1': { w: 360, h: 360 },
}

export const PIXEL_RATIO = 3
export const PAD_X = 30
export const PAD_TOP = 32
export const PAD_BOTTOM = 24
/** 卡片底栏高度（品牌 + 页码） */
export const CONTENT_FOOTER_BAND = 34
/** 正文与底栏之间的安全间距 */
export const FOOTER_SAFE_GAP = 20
/** 正文区域底部预留（底栏 + 间距） */
export const FOOTER_CONTENT_INSET = CONTENT_FOOTER_BAND + FOOTER_SAFE_GAP

export const FONT_STACK = `-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif`
/** 底栏品牌署名：楷体艺术字 */
export const CARD_BRAND_FONT = `'LXGW WenKai','STKaiti','KaiTi',serif`

export const TRANSPARENT_PX =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

/** WeChat 贴图固定 3:4 */
export const WECHAT_TIETU_ASPECT: CardAspect = '3:4'
