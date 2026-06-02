import { WECHAT_MP_PROMO } from '@/meta/site'

/** 公众号二维码图片地址：环境变量优先，否则 public/wechat-mp-qr.png */
export function resolveWechatMpQrSrc(): string {
  if (WECHAT_MP_PROMO.qrCodeUrl) return WECHAT_MP_PROMO.qrCodeUrl
  const base = import.meta.env.BASE_URL
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}wechat-mp-qr.png`
}
