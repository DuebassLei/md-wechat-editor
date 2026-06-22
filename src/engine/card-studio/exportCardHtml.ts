import { toPng } from 'html-to-image'
import { ASPECTS, PIXEL_RATIO } from '@/engine/card-export/constants'
import { withDomExportLock } from '@/engine/card-export/domExportLock'
import { htmlToImageOptions } from '@/engine/card-export/imageExport'
import type { SlicePurpose } from '@/engine/card-export/sliceContent'
import type { CardAspect } from '@/engine/card-export/types'

function waitImages(el: HTMLElement): Promise<void> {
  const imgs = Array.from(el.querySelectorAll('img'))
  if (!imgs.length) return Promise.resolve()
  return new Promise((resolve) => {
    let done = 0
    const tick = () => {
      done += 1
      if (done >= imgs.length) resolve()
    }
    setTimeout(resolve, 4000)
    for (const img of imgs) {
      if (img.complete) tick()
      else {
        img.onload = tick
        img.onerror = tick
      }
    }
  })
}

function resolveExportTarget(host: HTMLElement): HTMLElement {
  const scoped = host.querySelector(
    ':scope > .card-studio-cover, :scope > .card-xhs-shell',
  )
  if (scoped instanceof HTMLElement) return scoped
  for (const child of host.children) {
    if (child instanceof HTMLElement && child.tagName !== 'STYLE') return child
  }
  return host
}

/** 将完整卡片 HTML（封面或单页）导出为 PNG data URL */
export async function exportCardHtmlToDataUrl(
  html: string,
  aspect: CardAspect,
  previewContentWidth: number,
  backgroundColor: string,
  purpose: SlicePurpose = 'export',
): Promise<string> {
  return withDomExportLock(() => exportCardHtmlToDataUrlInner(html, aspect, previewContentWidth, backgroundColor, purpose))
}

async function exportCardHtmlToDataUrlInner(
  html: string,
  aspect: CardAspect,
  previewContentWidth: number,
  backgroundColor: string,
  purpose: SlicePurpose = 'export',
): Promise<string> {
  const base = ASPECTS[aspect]
  const nativeW = base.w * PIXEL_RATIO
  const refW = previewContentWidth > 80 ? previewContentWidth : 375
  const w = Math.round(refW)
  const h = Math.round((w * base.h) / base.w)
  const ratio = purpose === 'preview' ? 1 : nativeW / w

  const hider = document.createElement('div')
  hider.style.cssText =
    'position:fixed;left:0;top:0;width:0;height:0;overflow:hidden;z-index:-1'

  const host = document.createElement('div')
  host.style.cssText = `width:${w}px;height:${h}px;position:relative;overflow:hidden;background:${backgroundColor}`
  host.innerHTML = html

  hider.appendChild(host)
  document.body.appendChild(hider)
  await waitImages(host)

  try {
    const target = resolveExportTarget(host)
    return await toPng(target, {
      ...htmlToImageOptions,
      pixelRatio: ratio,
      width: w,
      height: h,
      backgroundColor,
    })
  } finally {
    document.body.removeChild(hider)
  }
}
