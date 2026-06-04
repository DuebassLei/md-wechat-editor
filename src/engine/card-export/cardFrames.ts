import { resolveAccentColors } from '@/engine/xhs/resolveAccent'
import type { ThemeId } from '@/types/theme'
import {
  XHS,
  xhsBloomDecor,
  xhsCanvasBase,
  xhsCanvasDusk,
  xhsCanvasLatte,
  xhsCanvasMist,
  xhsCanvasWarm,
  xhsCardStars,
  xhsCardSwoosh,
  xhsDotGrid,
  xhsFilmFrame,
  xhsInnerWash,
  xhsMacaronDots,
  xhsNotebookLines,
  xhsPillTag,
  xhsSeal,
  xhsShadowAccent,
  xhsSoftSketchBorder,
  xhsSoftTape,
  xhsTicketTear,
  xhsTopAccentBar,
} from './cardFrameXhs'
import type { WechatTietuSkin } from './types'

export type CardFrameId =
  | 'none'
  | 'soft'
  | 'wechat'
  | 'ticket'
  | 'polaroid'
  | 'glow'
  | 'classic'
  | 'sketch'
  | 'comic'
  | 'sticker'
  | 'lineart'
  | 'notebook'
  | 'watercolor'
  | 'crayon'
  | 'pixel'
  | 'chalk'
  | 'stamp'
  | 'tape'
  | 'neon'
  | 'film'

export interface CardFrameDef {
  id: CardFrameId
  label: string
  desc: string
}

export interface CardFrameGroup {
  label: string
  ids: CardFrameId[]
}

export const CARD_FRAME_GROUPS: CardFrameGroup[] = [
  { label: '小红书经典', ids: ['none', 'soft', 'sticker', 'watercolor', 'classic'] },
  { label: '温柔氛围', ids: ['lineart', 'polaroid', 'chalk', 'notebook', 'glow'] },
  { label: '活力个性', ids: ['wechat', 'comic', 'sketch', 'crayon', 'tape', 'stamp'] },
  { label: '质感创意', ids: ['ticket', 'pixel', 'neon', 'film'] },
]

export const CARD_FRAMES: CardFrameDef[] = [
  { id: 'none', label: '沉浸全幅', desc: '无外边距，内容铺满' },
  { id: 'soft', label: '奶油留白', desc: '小红书经典暖米底 + 浮卡' },
  { id: 'sticker', label: '柔光贴纸', desc: '主题晕染 + 白卡描边' },
  { id: 'watercolor', label: '融光晕染', desc: '多色光斑 + 纸感卡片' },
  { id: 'classic', label: '杂志复古', desc: '纸色底 + 暖金细框' },
  { id: 'lineart', label: '极简弧线', desc: '细线框 + 品牌弧线' },
  { id: 'polaroid', label: '相册留白', desc: '上下宽留白像晒图' },
  { id: 'chalk', label: '抹茶雾面', desc: '浅绿雾底 + 白卡' },
  { id: 'notebook', label: '莫兰迪笔记', desc: '淡线稿纸 + 边距线' },
  { id: 'glow', label: '暮色氛围', desc: '深紫暮光 + 主题光晕' },
  { id: 'wechat', label: '清新绿调', desc: '薄荷底（微信皮肤）' },
  { id: 'comic', label: '元气星芒', desc: '星标点缀 + 柔和阴影' },
  { id: 'sketch', label: '手帐铅笔', desc: '淡铅笔线 + 暖纸' },
  { id: 'crayon', label: '马卡龙点', desc: '奶油底 + 彩点' },
  { id: 'tape', label: '和纸手账', desc: '淡彩胶带角' },
  { id: 'stamp', label: '羊绒印章', desc: '羊皮纸 + 圆印' },
  { id: 'ticket', label: '票根撕边', desc: '虚线卡 + 撕边齿' },
  { id: 'pixel', label: '细腻格纹', desc: '暖米点阵底' },
  { id: 'neon', label: '星河夜幕', desc: '夜色底 + 星光卡' },
  { id: 'film', label: '电影取景', desc: '深色画幅条' },
]

/** 相对画布宽高的留白比例（0–1），留出可见「卡片底板」 */
export interface CardFrameInsets {
  top: number
  right: number
  bottom: number
  left: number
}

export interface CardFrameSpec {
  canvasBg: string
  cardBg: string
  insets: CardFrameInsets
  radius: number
  border: string
  shadow: string
  cardOverflow?: 'hidden' | 'visible'
  cardTopBar?: (accent: string) => string
  cardDecor?: (w: number, h: number, rect: CardFrameRect, accent: string) => string
  canvasDecor?: (w: number, h: number, rect: CardFrameRect, accent: string) => string
}

export interface CardFrameRect {
  pl: number
  pr: number
  pt: number
  pb: number
  cw: number
  ch: number
}

const FRAME_MAP = new Map(CARD_FRAMES.map((f) => [f.id, f]))

export function getCardFrame(id: CardFrameId): CardFrameDef {
  return FRAME_MAP.get(id) ?? FRAME_MAP.get('none')!
}

export function parseStoredFrame(raw: string | null, fallback: CardFrameId = 'soft'): CardFrameId {
  if (raw && FRAME_MAP.has(raw as CardFrameId)) return raw as CardFrameId
  return fallback
}

export function resolveFrameAccent(skin: WechatTietuSkin, themeId: ThemeId | string): string {
  if (skin === 'wechat') return '#07c160'
  return resolveAccentColors('theme', themeId).accent
}

const U = (n: number): CardFrameInsets => ({ top: n, right: n, bottom: n, left: n })

/** 通用小红书浮卡基底 */
function xhsFloatCard(accent: string, contentBg: string, extra?: Partial<CardFrameSpec>): CardFrameSpec {
  return {
    canvasBg: xhsCanvasBase(accent),
    cardBg: contentBg === '#ffffff' ? XHS.cardWhite : XHS.card,
    insets: U(XHS.inset),
    radius: XHS.radius,
    border: `1px solid ${XHS.line}`,
    shadow: XHS.shadow,
    canvasDecor: (_w, _h, rect, a) => xhsBloomDecor(rect, a),
    ...extra,
  }
}

export function getCardFrameSpec(
  frameId: CardFrameId,
  accent: string,
  contentBg: string,
): CardFrameSpec | null {
  if (frameId === 'none') return null

  const cardSurface = contentBg === '#ffffff' || contentBg === '#fff' ? XHS.cardWhite : XHS.card

  switch (frameId) {
    case 'soft':
      return xhsFloatCard(accent, contentBg, {
        cardDecor: (_w, _h, rect, a) => xhsInnerWash(a) + xhsCardSwoosh(rect.cw, a),
      })

    case 'sticker':
      return {
        canvasBg: xhsCanvasWarm(accent),
        cardBg: XHS.cardWhite,
        insets: U(XHS.insetMd),
        radius: XHS.radius,
        border: `2px solid ${XHS.cardWhite}`,
        shadow: xhsShadowAccent(accent),
        canvasDecor: (_w, _h, rect, a) => xhsBloomDecor(rect, a),
        cardDecor: (_w, _h, _rect, a) =>
          xhsInnerWash(a) +
          `<section aria-hidden="true" style="position:absolute;left:14px;top:14px;width:40px;height:11px;border-radius:999px;background:linear-gradient(90deg,rgba(255,255,255,0.95),transparent);z-index:5;pointer-events:none"></section>`,
      }

    case 'watercolor':
      return {
        canvasBg: xhsCanvasWarm(accent),
        cardBg: 'rgba(255,253,248,0.96)',
        insets: U(XHS.insetMd),
        radius: XHS.radius,
        border: `1px solid ${accent}33`,
        shadow: xhsShadowAccent(accent),
        canvasDecor: (_w, _h, rect, a) => xhsBloomDecor(rect, a),
        cardDecor: (_w, _h, _rect, a) => xhsInnerWash(a),
      }

    case 'classic':
      return {
        canvasBg: xhsCanvasLatte(),
        cardBg: XHS.card,
        insets: U(XHS.insetMd),
        radius: XHS.radiusSm,
        border: `2px solid ${XHS.dash}`,
        shadow: `${XHS.shadowSoft}, inset 0 0 0 1px rgba(255,255,255,0.8)`,
        cardDecor: () =>
          `<section aria-hidden="true" style="position:absolute;inset:10px;border:1px solid ${XHS.dash};border-radius:10px;pointer-events:none;z-index:4;opacity:0.7"></section>`,
      }

    case 'lineart':
      return {
        canvasBg: xhsCanvasBase(accent),
        cardBg: XHS.cardWhite,
        insets: U(XHS.inset),
        radius: XHS.radiusMd,
        border: `1px solid ${XHS.dash}`,
        shadow: XHS.shadowSoft,
        cardDecor: (_w, _h, rect, a) =>
          xhsCardSwoosh(rect.cw, a) +
          `<section aria-hidden="true" style="position:absolute;inset:12px;border:1px solid ${XHS.line};border-radius:12px;pointer-events:none;z-index:4"></section>`,
        canvasDecor: (_w, _h, rect, a) => xhsBloomDecor(rect, a),
      }

    case 'polaroid':
      return {
        canvasBg: xhsCanvasBase(accent),
        cardBg: XHS.cardWhite,
        insets: { top: 0.028, right: 0.038, bottom: 0.095, left: 0.038 },
        radius: XHS.radiusSm,
        border: 'none',
        shadow: XHS.shadow,
        canvasDecor: (_w, _h, rect, a) => xhsBloomDecor(rect, a) + xhsCardStars(rect, a),
      }

    case 'chalk':
      return {
        canvasBg: xhsCanvasMist(),
        cardBg: cardSurface,
        insets: U(XHS.insetMd),
        radius: XHS.radius,
        border: `1px solid #D4E4DA`,
        shadow: XHS.shadowSoft,
        canvasDecor: (_w, _h, rect, a) => xhsBloomDecor(rect, a),
        cardDecor: (_w, _h, _rect, a) => xhsInnerWash(a),
      }

    case 'notebook':
      return {
        canvasBg: [xhsCanvasBase(accent), `repeating-linear-gradient(0deg,transparent,transparent 26px,${XHS.line} 26px,${XHS.line} 27px)`].join(', '),
        cardBg: XHS.card,
        insets: { top: 0.038, right: 0.044, bottom: 0.044, left: 0.072 },
        radius: XHS.radiusSm,
        border: `1px solid ${XHS.line}`,
        shadow: XHS.shadowSoft,
        canvasDecor: (_w, h, rect) => xhsNotebookLines(h, rect),
      }

    case 'glow':
      return {
        canvasBg: xhsCanvasDusk(accent),
        cardBg: cardSurface,
        insets: U(XHS.insetMd),
        radius: XHS.radius,
        border: `1px solid ${accent}44`,
        shadow: `0 0 0 1px ${accent}33, 0 20px 48px rgba(0,0,0,0.28), 0 8px 24px ${accent}22`,
        canvasDecor: (_w, _h, rect, a) => xhsBloomDecor(rect, a),
        cardDecor: (_w, _h, rect, a) => xhsCardStars(rect, a) + xhsInnerWash(a),
      }

    case 'wechat':
      return {
        canvasBg: `linear-gradient(168deg, #E8F8EF 0%, #F5FBF7 50%, ${XHS.canvas} 100%)`,
        cardBg: XHS.cardWhite,
        insets: U(XHS.insetMd),
        radius: XHS.radius,
        border: `1px solid ${accent}44`,
        shadow: `0 14px 36px ${accent}20, ${XHS.shadowSoft}`,
        cardTopBar: xhsTopAccentBar,
        canvasDecor: (_w, _h, rect, a) => xhsBloomDecor(rect, a),
        cardDecor: (_w, _h, _rect, a) => xhsInnerWash(a),
      }

    case 'comic':
      return {
        canvasBg: xhsCanvasWarm(accent),
        cardBg: XHS.cardWhite,
        insets: U(XHS.insetMd),
        radius: XHS.radius,
        border: `2px solid ${accent}55`,
        shadow: `0 10px 28px ${accent}20, ${XHS.shadowSoft}`,
        canvasDecor: (_w, _h, rect, a) => xhsBloomDecor(rect, a),
        cardDecor: (_w, _h, rect, a) => xhsCardStars(rect, a) + xhsPillTag(accent, 'GO'),
      }

    case 'sketch':
      return {
        canvasBg: xhsCanvasBase(accent),
        cardBg: XHS.card,
        insets: U(XHS.insetLg),
        radius: XHS.radius,
        border: 'none',
        cardOverflow: 'visible',
        shadow: XHS.shadowSoft,
        cardDecor: (_w, _h, rect) => xhsSoftSketchBorder(rect.cw, rect.ch),
        canvasDecor: (_w, _h, rect, a) => xhsBloomDecor(rect, a),
      }

    case 'crayon':
      return {
        canvasBg: xhsCanvasWarm(accent),
        cardBg: XHS.card,
        insets: U(XHS.insetMd),
        radius: XHS.radius,
        border: `1.5px solid ${accent}44`,
        shadow: xhsShadowAccent(accent),
        canvasDecor: (_w, _h, rect, a) => xhsMacaronDots(rect, a),
        cardDecor: (_w, _h, _rect, a) => xhsInnerWash(a),
      }

    case 'tape':
      return {
        canvasBg: xhsCanvasLatte(),
        cardBg: XHS.card,
        insets: U(XHS.inset),
        radius: XHS.radiusMd,
        border: `1px solid ${XHS.line}`,
        shadow: XHS.shadow,
        canvasDecor: (_w, _h, rect, a) => xhsSoftTape(rect, a),
        cardDecor: (_w, _h, rect, a) => xhsCardSwoosh(rect.cw, a),
      }

    case 'stamp':
      return {
        canvasBg: [
          'linear-gradient(#F8F2E8, #F2EBDF)',
          'repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(168,154,134,0.05) 4px,rgba(168,154,134,0.05) 5px)',
        ].join(', '),
        cardBg: XHS.card,
        insets: U(XHS.insetMd),
        radius: XHS.radiusSm,
        border: `1.5px solid ${accent}55`,
        shadow: XHS.shadowSoft,
        canvasDecor: (_w, _h, rect, a) => xhsSeal(rect, a),
        cardDecor: (_w, _h, _rect, a) =>
          `<section aria-hidden="true" style="position:absolute;left:16px;bottom:16px;right:16px;height:1px;background:repeating-linear-gradient(90deg,${a}44 0,${a}44 4px,transparent 4px,transparent 8px);z-index:4"></section>`,
      }

    case 'ticket':
      return {
        canvasBg: xhsCanvasBase(accent),
        cardBg: XHS.card,
        insets: U(XHS.insetMd),
        radius: XHS.radiusMd,
        border: `1.5px dashed ${XHS.dash}`,
        shadow: XHS.shadowSoft,
        canvasDecor: (w, _h, rect) => xhsTicketTear(w, rect),
      }

    case 'pixel':
      return {
        canvasBg: xhsDotGrid(),
        cardBg: XHS.cardWhite,
        insets: U(XHS.inset),
        radius: XHS.radius,
        border: `1px solid ${XHS.dash}`,
        shadow: XHS.shadow,
        canvasDecor: (_w, _h, rect, a) => xhsBloomDecor(rect, a),
      }

    case 'neon':
      return {
        canvasBg: xhsCanvasDusk(accent),
        cardBg: cardSurface,
        insets: U(XHS.insetMd),
        radius: XHS.radius,
        border: `1px solid ${accent}55`,
        shadow: `0 0 24px ${accent}33, 0 16px 40px rgba(0,0,0,0.25)`,
        canvasDecor: (w, h, rect, a) => {
          const stars = Array.from({ length: 8 }, (_, i) => {
            const x = (i * 47 + 12) % w
            const y = (i * 31 + 8) % Math.round(h * 0.45)
            return `<section style="position:absolute;left:${x}px;top:${y}px;width:2px;height:2px;border-radius:50%;background:${i % 2 ? '#fff' : a};opacity:0.5"></section>`
          }).join('')
          return `<section aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;z-index:1">${stars}</section>${xhsBloomDecor(rect, a)}`
        },
        cardDecor: (_w, _h, rect, a) => xhsCardStars(rect, a),
      }

    case 'film':
      return {
        canvasBg: 'linear-gradient(180deg, #3D3548 0%, #2A2435 100%)',
        cardBg: cardSurface,
        insets: { top: 0.038, right: 0.088, bottom: 0.038, left: 0.088 },
        radius: XHS.radiusSm,
        border: `1px solid ${XHS.dash}`,
        shadow: '0 12px 36px rgba(0,0,0,0.35), inset 0 0 40px rgba(0,0,0,0.15)',
        canvasDecor: (w, h) => xhsFilmFrame(w, h),
        cardDecor: () =>
          `<section aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;z-index:4;background:radial-gradient(ellipse at 50% 50%,transparent 40%,rgba(31,26,23,0.12) 100%)"></section>`,
      }

    default:
      return null
  }
}

export function resolveCardFrameRect(w: number, h: number, spec: CardFrameSpec): CardFrameRect {
  const pl = Math.round(w * spec.insets.left)
  const pr = Math.round(w * spec.insets.right)
  const pt = Math.round(h * spec.insets.top)
  const pb = Math.round(h * spec.insets.bottom)
  return { pl, pr, pt, pb, cw: w - pl - pr, ch: h - pt - pb }
}

function cardShellStyle(spec: CardFrameSpec, rect: CardFrameRect): string {
  const parts = [
    'position:absolute',
    'box-sizing:border-box',
    `overflow:${spec.cardOverflow ?? 'hidden'}`,
    `left:${rect.pl}px`,
    `top:${rect.pt}px`,
    `width:${rect.cw}px`,
    `height:${rect.ch}px`,
    `background:${spec.cardBg}`,
    `border-radius:${spec.radius}px`,
  ]
  if (spec.border && spec.border !== 'none') parts.push(`border:${spec.border}`)
  if (spec.shadow) parts.push(`box-shadow:${spec.shadow}`)
  return parts.join(';')
}

function canvasStyle(w: number, h: number, canvasBg: string): string {
  return `position:relative;box-sizing:border-box;width:${w}px;height:${h}px;overflow:hidden;background:${canvasBg}`
}

export function wrapHtmlWithFrame(
  innerHtml: string,
  w: number,
  h: number,
  frameId: CardFrameId,
  accent: string,
  contentBg = '#ffffff',
): string {
  const spec = getCardFrameSpec(frameId, accent, contentBg)
  if (!spec) return innerHtml

  const rect = resolveCardFrameRect(w, h, spec)
  const scale = rect.cw / w
  const topBar = spec.cardTopBar?.(accent) ?? ''
  const cardDecor = spec.cardDecor?.(w, h, rect, accent) ?? ''
  const decor = spec.canvasDecor?.(w, h, rect, accent) ?? ''

  return (
    `<section style="${canvasStyle(w, h, spec.canvasBg)}">` +
    `<section style="${cardShellStyle(spec, rect)}">` +
    topBar +
    cardDecor +
    `<section style="width:${w}px;height:${h}px;transform:scale(${scale});transform-origin:top left">${innerHtml}</section>` +
    `</section>${decor}</section>`
  )
}

export interface CardShellElements {
  root: HTMLElement
  contentHost: HTMLElement
  rect: CardFrameRect
}

export function createCardShell(
  w: number,
  h: number,
  frameId: CardFrameId,
  accent: string,
  contentBg: string,
): CardShellElements {
  const root = document.createElement('div')
  root.style.cssText = `position:relative;width:${w}px;height:${h}px;overflow:hidden;box-sizing:border-box;background:${contentBg}`

  const spec = getCardFrameSpec(frameId, accent, contentBg)
  if (!spec) {
    return {
      root,
      contentHost: root,
      rect: { pl: 0, pr: 0, pt: 0, pb: 0, cw: w, ch: h },
    }
  }

  const rect = resolveCardFrameRect(w, h, spec)
  root.style.background = spec.canvasBg

  const card = document.createElement('div')
  card.style.cssText = cardShellStyle(spec, rect)

  if (spec.cardTopBar) {
    const barWrap = document.createElement('div')
    barWrap.innerHTML = spec.cardTopBar(accent)
    const bar = barWrap.firstElementChild
    if (bar) card.appendChild(bar)
  }

  if (spec.cardDecor) {
    const decorWrap = document.createElement('div')
    decorWrap.innerHTML = spec.cardDecor(w, h, rect, accent)
    while (decorWrap.firstElementChild) card.appendChild(decorWrap.firstElementChild)
  }

  root.appendChild(card)

  if (spec.canvasDecor) {
    const decorWrap = document.createElement('div')
    decorWrap.innerHTML = spec.canvasDecor(w, h, rect, accent)
    const decor = decorWrap.firstElementChild
    if (decor) root.appendChild(decor)
  }

  return { root, contentHost: card, rect }
}
