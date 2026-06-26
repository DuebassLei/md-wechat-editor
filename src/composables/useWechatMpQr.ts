import { resolvePublicAsset, WECHAT_MP_PROMO } from '@/meta/site'

/** 公众号二维码图片地址：环境变量优先，否则 public/wechat-mp-qr.png */
export function resolveWechatMpQrSrc(): string {
  if (WECHAT_MP_PROMO.qrCodeUrl) return WECHAT_MP_PROMO.qrCodeUrl
  return resolvePublicAsset('wechat-mp-qr.png')
}

/** 小程序码图片地址：环境变量优先，否则 public/miniprogram_logo.jpg */
export function resolveMiniprogramQrSrc(): string {
  if (WECHAT_MP_PROMO.miniprogramQrCodeUrl) return WECHAT_MP_PROMO.miniprogramQrCodeUrl
  return resolvePublicAsset('miniprogram_logo.jpg')
}

/** 支付宝打赏二维码：环境变量优先，否则 public/alipay-donation-qr.png */
export function resolveAlipayDonationQrSrc(): string {
  if (WECHAT_MP_PROMO.alipayDonationQrUrl) return WECHAT_MP_PROMO.alipayDonationQrUrl
  return resolvePublicAsset('alipay-donation-qr.png')
}

/** 微信打赏二维码：环境变量优先，否则 public/wechat-donation-qr.png */
export function resolveWechatDonationQrSrc(): string {
  if (WECHAT_MP_PROMO.wechatDonationQrUrl) return WECHAT_MP_PROMO.wechatDonationQrUrl
  return resolvePublicAsset('wechat-donation-qr.png')
}
