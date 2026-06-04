import { esc } from '@/lib/r-markdown/utils/helpers'
import type { CardMeta } from '@/engine/card-export/types'
import { ASPECTS, PAD_BOTTOM, PAD_TOP, PAD_X, WECHAT_TIETU, WECHAT_TIETU_ASPECT } from './tokens'

function titleHtml(title: string): string {
  return `<span style="color:${WECHAT_TIETU.ink}">${esc(title)}</span>`
}

function accentBar(w: number): string {
  return `<section style="position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,${WECHAT_TIETU.accent},#2dd36f)"></section>`
}

function wechatMark(): string {
  return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block"><rect x="3" y="3" width="18" height="18" rx="5" fill="${WECHAT_TIETU.accent}"/><path d="M8 10.5c0-1.1.9-2 2.2-2h3.6c1.3 0 2.2.9 2.2 2v.2c0 1-.7 1.8-1.7 2l2.2 2.3h-2.4l-1.8-1.9H10.2v1.9H8V10.5z" fill="#fff"/></svg>`
}

export function buildWechatCover(meta: CardMeta): string {
  const { w, h } = ASPECTS[WECHAT_TIETU_ASPECT]
  const innerW = w - PAD_X * 2

  let html = `<section style="position:relative;box-sizing:border-box;width:${w}px;height:${h}px;background:linear-gradient(165deg,#f0faf4 0%,#ffffff 42%,#ffffff 100%);padding:${PAD_TOP}px ${PAD_X}px ${PAD_BOTTOM}px;overflow:hidden;display:flex;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif">`

  html += accentBar(w)
  html += `<section style="position:absolute;top:22px;right:${PAD_X}px;opacity:0.9">${wechatMark()}</section>`

  if (meta.badge) {
    html += `<section style="flex-shrink:0;margin:0px 0px 14px"><span style="display:inline-block;padding:5px 14px;border-radius:999px;background:${WECHAT_TIETU.accent};color:#fff;font-size:13px;font-weight:800;line-height:1.35;letter-spacing:0.3px">${esc(meta.badge)}</span></section>`
  }

  html += `<h1 style="flex-shrink:0;margin:0px;font-size:34px;line-height:1.2;font-weight:900;letter-spacing:-0.5px;word-break:break-word">${titleHtml(meta.title || '未命名')}</h1>`
  html += `<section style="flex-shrink:0;margin:10px 0px 16px;width:${Math.min(innerW, 200)}px;height:4px;border-radius:2px;background:linear-gradient(90deg,${WECHAT_TIETU.accent},${WECHAT_TIETU.accent}44)"></section>`

  const sub = meta.subtitle || meta.teaser
  if (sub) {
    html += `<section style="flex:1 1 auto;min-height:0;overflow:hidden;margin:0px 0px 12px;padding:14px 16px;border-radius:12px;background:rgba(255,255,255,0.85);border:1px solid ${WECHAT_TIETU.dash};box-shadow:0 6px 20px rgba(7,193,96,0.08)">`
    html += `<p style="margin:0px;font-size:15.5px;line-height:1.7;color:${WECHAT_TIETU.inkSoft};font-weight:500">${esc(sub.slice(0, 140))}</p>`
    html += `</section>`
  }

  if (meta.hook) {
    html += `<section style="flex-shrink:0;margin:0px 0px 12px"><span style="display:inline-block;padding:8px 14px;border-radius:10px;background:${WECHAT_TIETU.ink};color:#fff;font-size:14px;font-weight:800;line-height:1.45">${esc(meta.hook)}</span></section>`
  }

  html += `<section style="flex-shrink:0;margin-top:auto;padding-top:14px;border-top:1.5px dashed ${WECHAT_TIETU.dash};display:flex;justify-content:space-between;align-items:center">`
  html += `<span style="font-size:12px;color:${WECHAT_TIETU.inkFaint};font-weight:700">${esc(`共 ${meta.charCount} 字 · 约 ${meta.readMin} 分钟`)}</span>`
  html += `<span style="font-size:13px;color:${WECHAT_TIETU.accent};font-weight:800">${esc('@' + meta.brand)}</span>`
  html += `</section>`

  html += `</section>`
  return html
}
