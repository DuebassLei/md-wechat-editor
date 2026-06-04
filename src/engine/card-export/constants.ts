import type { CardAspect } from './types'

export const ASPECTS: Record<CardAspect, { w: number; h: number }> = {
  '3:4': { w: 360, h: 480 },
  '1:1': { w: 360, h: 360 },
}

export const PIXEL_RATIO = 3
export const PAD_X = 30
export const PAD_TOP = 32
export const PAD_BOTTOM = 24
export const CONTENT_FOOTER_BAND = 44

export const FONT_STACK = `-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif`

export const TRANSPARENT_PX =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

/** WeChat 贴图固定 3:4 */
export const WECHAT_TIETU_ASPECT: CardAspect = '3:4'
