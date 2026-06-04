import { toPng } from 'html-to-image'
import { ASPECTS, CONTENT_FOOTER_BAND, FONT_STACK } from './constants'
import { htmlToImageOptions } from './imageExport'
import { createCardShell, getCardFrameSpec, type CardFrameId } from './cardFrames'
import type { CardAspect, CardExportTheme } from './types'

export interface SliceContentOptions {
  contentHtml: string
  brand: string
  aspect: CardAspect
  previewContentWidth: number
  theme: CardExportTheme
  frameId?: CardFrameId
  frameAccent?: string
  /** 限制最大页数；1 = 单卡模式 */
  maxPages?: number
}

export interface SliceContentResult {
  dataUrls: string[]
  overflow: boolean
}

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

function isHeadingBlock(el: HTMLElement): boolean {
  return /^H[1-6]$/.test(el.tagName)
}

/** 分页块：兼容 .card-studio-shell / .card-reading，排除 <style> 与顶栏装饰 */
function paginateBlocks(wrap: HTMLElement): HTMLElement[] {
  const shell = wrap.querySelector(':scope > .card-studio-shell')
  const reading =
    shell?.querySelector(':scope > .card-reading') ??
    wrap.querySelector(':scope > .xhs-reading, :scope > .card-reading')
  const root = (reading as HTMLElement | null) ?? wrap
  return Array.from(root.children).filter(
    (n): n is HTMLElement =>
      n instanceof HTMLElement && n.tagName !== 'STYLE' && !n.classList.contains('card-studio-header'),
  )
}

export async function sliceContentToDataUrls(opts: SliceContentOptions): Promise<SliceContentResult> {
  const {
    contentHtml,
    brand,
    aspect,
    previewContentWidth,
    theme,
    frameId = 'none',
    frameAccent = '#07c160',
    maxPages,
  } = opts
  const base = ASPECTS[aspect]
  const nativeW = base.w * 3
  const refW = previewContentWidth > 80 ? previewContentWidth : 375
  const w = Math.round(refW)
  const h = Math.round((w * base.h) / base.w)
  const ratio = nativeW / w
  const bg = theme.contentBg
  const pngBg = theme.exportBg ?? bg
  const padX = 20
  const hasChromeHeader = contentHtml.includes('card-studio-header')
  const padTop = hasChromeHeader ? 14 : 22
  const footerBand = CONTENT_FOOTER_BAND
  const fBrand = 14
  const fPage = 13

  const hider = document.createElement('div')
  hider.style.cssText =
    'position:fixed;left:0;top:0;width:0;height:0;overflow:hidden;z-index:-1'

  const spec = getCardFrameSpec(frameId, frameAccent, bg)
  const { root: frame, contentHost, rect } = createCardShell(w, h, frameId, frameAccent, bg)
  frame.style.fontFamily = FONT_STACK
  const surfaceBg = spec?.cardBg ?? bg
  const exportBg = spec?.canvasBg ?? pngBg
  const cw = rect.cw

  const wrap = document.createElement('div')
  wrap.style.cssText =
    `position:absolute;left:0;top:0;width:${cw}px;box-sizing:border-box;` +
    `padding:${padTop}px ${padX}px 0;font-size:15px;line-height:1.8;color:rgb(51,51,51);overflow:hidden;`
  wrap.innerHTML = contentHtml
  wrap.classList.add('card-reading')

  const footer = document.createElement('div')
  footer.style.cssText =
    `position:absolute;left:0;right:0;bottom:0;height:${footerBand}px;background:${surfaceBg};` +
    `box-sizing:border-box;padding:0 ${padX}px;z-index:8`
  const inner = document.createElement('div')
  inner.style.cssText =
    `height:100%;display:flex;align-items:center;justify-content:space-between;` +
    `border-top:1.5px dashed ${theme.footerDash}`
  const brandEl = document.createElement('span')
  brandEl.style.cssText = `font-size:${fBrand}px;color:${theme.brandColor};font-weight:800`
  brandEl.textContent = '@' + brand
  const pageEl = document.createElement('span')
  pageEl.style.cssText = `font-size:${fPage}px;color:${theme.pageColor};font-weight:800;letter-spacing:0.5px`
  inner.append(brandEl, pageEl)
  footer.append(inner)

  if (theme.accentBar) {
    const bar = document.createElement('div')
    bar.style.cssText = `position:absolute;top:0;left:0;right:0;height:4px;background:${theme.accentBar};z-index:3`
    contentHost.append(bar)
  }

  contentHost.append(wrap, footer)
  hider.appendChild(frame)
  document.body.appendChild(hider)
  await waitImages(frame)

  const topInset = padTop
  const budget = rect.ch - footerBand - topInset
  const blocks = paginateBlocks(wrap).filter(
    (b) => b.offsetHeight > 2 || (b.textContent?.trim()?.length ?? 0) > 0,
  )

  const pages: { startIdx: number; endIdx: number; top: number }[] = []
  let k = 0
  while (k < blocks.length) {
    const pageTop = blocks[k].offsetTop
    let j = k + 1
    while (j < blocks.length) {
      const bottom = blocks[j].offsetTop + blocks[j].offsetHeight
      if (bottom - pageTop > budget) break
      j++
    }
    // 避免页末孤行标题：把标题挪到下一页，且每页至少保留 1 个块
    while (j - k > 1 && isHeadingBlock(blocks[j - 1])) j--
    if (j <= k) j = k + 1
    pages.push({ startIdx: k, endIdx: j, top: pageTop })
    k = j
  }

  const validPages = pages.filter((p) => p.endIdx > p.startIdx)
  if (!validPages.length && blocks.length) {
    validPages.push({ startIdx: 0, endIdx: blocks.length, top: blocks[0].offsetTop })
  }

  const totalPages = validPages.length
  const pageLimit = maxPages != null ? Math.max(1, maxPages) : totalPages
  const overflow = maxPages === 1 && totalPages > 1
  const exportCount = Math.min(totalPages, pageLimit)
  const slices: string[] = []
  try {
    for (let i = 0; i < exportCount; i++) {
      const { startIdx, endIdx, top } = validPages[i]
      blocks.forEach((b, idx) => {
        b.style.visibility = idx >= startIdx && idx < endIdx ? 'visible' : 'hidden'
      })
      wrap.style.top = `${topInset - top}px`
      pageEl.textContent = `${i + 1} / ${exportCount}`
      slices.push(
        await toPng(frame, {
          ...htmlToImageOptions,
          pixelRatio: ratio,
          width: w,
          height: h,
          backgroundColor: exportBg,
        }),
      )
    }
  } finally {
    document.body.removeChild(hider)
  }
  return { dataUrls: slices, overflow }
}
