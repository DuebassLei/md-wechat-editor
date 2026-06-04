export interface FrameRect {
  pl: number
  pr: number
  pt: number
  pb: number
  cw: number
  ch: number
}

/** 与 engine/xhs/tokens 对齐的小红书卡片美学 */
export const XHS = {
  canvas: '#F7F2E8',
  canvasDeep: '#F0E8DA',
  card: '#FFFDF8',
  cardWhite: '#FFFFFF',
  ink: '#1F1A17',
  inkSoft: '#5C5346',
  inkFaint: '#A89A86',
  dash: '#D9C9AC',
  line: '#E8DFD0',
  shadow:
    '0 14px 44px rgba(31, 26, 23, 0.08), 0 4px 14px rgba(31, 26, 23, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
  shadowSoft: '0 10px 32px rgba(31, 26, 23, 0.06), 0 2px 8px rgba(31, 26, 23, 0.03)',
  radius: 22,
  radiusMd: 18,
  radiusSm: 14,
  inset: 0.042,
  insetMd: 0.048,
  insetLg: 0.052,
} as const

export function xhsShadowAccent(accent: string): string {
  return `0 16px 40px ${accent}24, 0 6px 18px rgba(31, 26, 23, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.92)`
}

export function xhsCanvasBase(accent: string): string {
  return [
    `radial-gradient(ellipse 85% 65% at 12% 8%, ${accent}14 0%, transparent 55%)`,
    `radial-gradient(ellipse 70% 55% at 92% 88%, ${accent}10 0%, transparent 50%)`,
    `linear-gradient(168deg, ${XHS.canvas} 0%, #FAF6EF 48%, ${XHS.canvasDeep} 100%)`,
  ].join(', ')
}

export function xhsCanvasWarm(accent: string): string {
  return [
    `radial-gradient(circle at 78% 18%, ${accent}18 0%, transparent 42%)`,
    `radial-gradient(circle at 18% 82%, #F5D0C5 0%, transparent 38%)`,
    xhsCanvasBase(accent),
  ].join(', ')
}

export function xhsCanvasMist(): string {
  return [
    'linear-gradient(165deg, #F5F8F6 0%, #EEF4F0 100%)',
    'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.9) 0%, transparent 60%)',
  ].join(', ')
}

export function xhsCanvasDusk(accent: string): string {
  return [
    `radial-gradient(ellipse 80% 50% at 50% 0%, ${accent}28 0%, transparent 60%)`,
    'linear-gradient(175deg, #3D3548 0%, #2A2435 55%, #1F1B28 100%)',
  ].join(', ')
}

export function xhsCanvasLatte(): string {
  return 'linear-gradient(165deg, #F5EDE4 0%, #EBE0D4 50%, #E6D9C8 100%)'
}

/** 画布光斑 */
export function xhsBloomDecor(rect: FrameRect, accent: string): string {
  const { pl, pt, cw, ch } = rect
  const r = pl + cw
  const b = pt + ch
  return `<section aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;z-index:1">
    <section style="position:absolute;left:${pl - 24}px;top:${pt - 20}px;width:110px;height:110px;border-radius:50%;background:radial-gradient(circle,${accent}22 0%,transparent 68%);filter:blur(6px)"></section>
    <section style="position:absolute;left:${r - 70}px;top:${b - 90}px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,#F5D0C533 0%,transparent 70%);filter:blur(8px)"></section>
  </section>`
}

export function xhsStarSvg(size: number, accent: string): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${accent}" xmlns="http://www.w3.org/2000/svg" style="display:block;opacity:0.85"><path d="M12 0 C13 7 17 11 24 12 C17 13 13 17 12 24 C11 17 7 13 0 12 C7 11 11 7 12 0Z"/></svg>`
}

export function xhsSwooshSvg(width: number, accent: string): string {
  const w = Math.min(width, 200)
  return `<svg width="${w}" height="12" viewBox="0 0 ${w} 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block"><path d="M2 8 C ${w * 0.22} 2, ${w * 0.42} 11, ${w * 0.62} 6 S ${w * 0.86} 2, ${w - 2} 7" stroke="${accent}" stroke-width="3" stroke-linecap="round" opacity="0.9"/></svg>`
}

export function xhsTopAccentBar(accent: string): string {
  return `<section aria-hidden="true" style="position:absolute;top:0;left:0;right:0;height:4px;z-index:5;background:linear-gradient(90deg,${accent},${accent}99);border-radius:22px 22px 0 0"></section>`
}

export function xhsCardStars(rect: FrameRect, accent: string): string {
  return `<section aria-hidden="true" style="position:absolute;right:14px;top:12px;z-index:5;pointer-events:none">${xhsStarSvg(16, accent)}</section>
    <section aria-hidden="true" style="position:absolute;left:12px;bottom:52px;z-index:5;opacity:0.7;pointer-events:none">${xhsStarSvg(10, accent)}</section>`
}

export function xhsCardSwoosh(cw: number, accent: string): string {
  return `<section aria-hidden="true" style="position:absolute;left:16px;top:14px;z-index:5;pointer-events:none">${xhsSwooshSvg(cw * 0.35, accent)}</section>`
}

export function xhsInnerWash(accent: string): string {
  return `<section aria-hidden="true" style="position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:3;background:radial-gradient(ellipse 90% 60% at 100% 0%,${accent}08 0%,transparent 55%),radial-gradient(ellipse 70% 50% at 0% 100%,#F5D0C508 0%,transparent 50%)"></section>`
}

export function xhsPillTag(accent: string, text = 'NOTE'): string {
  return `<section aria-hidden="true" style="position:absolute;left:14px;top:14px;z-index:5;padding:4px 10px;border-radius:999px;background:${accent};color:#fff;font-size:9px;font-weight:800;letter-spacing:0.08em;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;box-shadow:0 4px 12px ${accent}44;pointer-events:none">${text}</section>`
}

export function xhsSoftTape(rect: FrameRect, accent: string): string {
  const { pl, pt, cw } = rect
  const tape = (l: number, t: number, deg: number) =>
    `<section style="position:absolute;left:${l}px;top:${t}px;width:48px;height:12px;border-radius:2px;background:linear-gradient(90deg,${accent}55,${accent}33);opacity:0.75;transform:rotate(${deg}deg);box-shadow:0 1px 3px rgba(31,26,23,0.08)"></section>`
  return `<section aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;z-index:3">${tape(pl + cw * 0.2, pt - 5, -6)}${tape(pl + cw * 0.55, pt - 3, 5)}</section>`
}

export function xhsSeal(rect: FrameRect, accent: string): string {
  const x = rect.pl + rect.cw - 50
  const y = rect.pt + 14
  return `<section aria-hidden="true" style="position:absolute;left:${x}px;top:${y}px;width:42px;height:42px;border-radius:50%;border:1.5px dashed ${accent}88;display:flex;align-items:center;justify-content:center;transform:rotate(-14deg);opacity:0.5;z-index:3;pointer-events:none">
    <span style="font-size:8px;font-weight:800;color:${accent};letter-spacing:0.05em">RED</span>
  </section>`
}

export function xhsNotebookLines(h: number, rect: FrameRect): string {
  const marginX = Math.round(rect.pl * 0.42)
  return `<section aria-hidden="true" style="position:absolute;left:${marginX}px;top:0;width:1.5px;height:${h}px;background:#E8B4B4;opacity:0.55;z-index:2"></section>
    <section aria-hidden="true" style="position:absolute;left:0;top:${rect.pt}px;right:0;height:${rect.ch}px;background:repeating-linear-gradient(0deg,transparent,transparent 24px,${XHS.line} 24px,${XHS.line} 25px);opacity:0.45;z-index:1;pointer-events:none"></section>`
}

export function xhsTicketTear(w: number, rect: FrameRect): string {
  const dash = XHS.dash
  const y = rect.pt + rect.ch - 18
  const notch = 5
  return `<section aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;z-index:2">
    <section style="position:absolute;left:${rect.pl - notch}px;top:${y}px;width:${notch * 2}px;height:${notch * 2}px;border-radius:50%;background:${XHS.canvasDeep}"></section>
    <section style="position:absolute;left:${w - rect.pr - notch}px;top:${y}px;width:${notch * 2}px;height:${notch * 2}px;border-radius:50%;background:${XHS.canvasDeep}"></section>
    <section style="position:absolute;left:${rect.pl + 8}px;right:${rect.pr + 8}px;top:${y + 8}px;height:1px;background:repeating-linear-gradient(90deg,${dash} 0,${dash} 5px,transparent 5px,transparent 10px)"></section>
  </section>`
}

export function xhsDotGrid(): string {
  return [
    xhsCanvasBase('#A89A86'),
    'radial-gradient(circle, #D9C9AC 0.6px, transparent 0.6px)',
  ].join(', ')
}

export function xhsFilmFrame(w: number, h: number): string {
  const band = Math.round(w * 0.07)
  return `<section aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;z-index:2">
    <section style="position:absolute;left:0;top:0;bottom:0;width:${band}px;background:linear-gradient(90deg,#3D3548,#2A2435)"></section>
    <section style="position:absolute;right:0;top:0;bottom:0;width:${band}px;background:linear-gradient(270deg,#3D3548,#2A2435)"></section>
    <section style="position:absolute;left:${band}px;right:${band}px;top:0;height:3px;background:${XHS.dash};opacity:0.4"></section>
    <section style="position:absolute;left:${band}px;right:${band}px;bottom:0;height:3px;background:${XHS.dash};opacity:0.4"></section>
  </section>`
}

export function xhsMacaronDots(rect: FrameRect, accent: string): string {
  const colors = [accent, '#F5B7B1', '#AED6F1', '#F9E79F']
  return `<section aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;z-index:1">${colors
    .map((c, i) => {
      const x = rect.pl + (i % 2) * (rect.cw * 0.65) + 8
      const y = rect.pt + Math.floor(i / 2) * (rect.ch * 0.7) + 6
      return `<section style="position:absolute;left:${x}px;top:${y}px;width:6px;height:6px;border-radius:50%;background:${c};opacity:0.45"></section>`
    })
    .join('')}</section>`
}

export function xhsSoftSketchBorder(cw: number, ch: number): string {
  const d = `M 10 8 Q 6 6 8 18 L 8 ${ch - 16} Q 6 ${ch - 4} 18 ${ch - 8} L ${cw - 14} ${ch - 6} Q ${cw - 4} ${ch - 10} ${cw - 8} 20 L ${cw - 6} 10 Q ${cw - 2} 4 ${cw - 16} 8 Z`
  return `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:6;overflow:visible"><path d="${d}" fill="none" stroke="${XHS.inkSoft}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/></svg>`
}
