import { toPng } from 'html-to-image'
import { ASPECTS, CARD_BRAND_FONT, CONTENT_FOOTER_BAND, FOOTER_CONTENT_INSET, FONT_STACK } from './constants'
import { withDomExportLock } from './domExportLock'
import { htmlToImageOptions } from './imageExport'
import { createCardShell, getCardFrameSpec, type CardFrameId } from './cardFrames'
import type { CardAspect, CardExportTheme } from './types'

export type SlicePurpose = 'preview' | 'export'

const CARD_BRAND_FONT_URL = 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-web@1.7.0/style.css'
const CARD_BRAND_FONT_LINK_ID = 'mdwe-card-footer-fonts'

async function ensureCardFooterFonts(): Promise<void> {
  if (!document.getElementById(CARD_BRAND_FONT_LINK_ID)) {
    const link = document.createElement('link')
    link.id = CARD_BRAND_FONT_LINK_ID
    link.rel = 'stylesheet'
    link.href = CARD_BRAND_FONT_URL
    document.head.appendChild(link)
    await new Promise<void>((resolve) => {
      link.onload = () => resolve()
      link.onerror = () => resolve()
      setTimeout(resolve, 600)
    })
  }
  // 勿无限等待 document.fonts.ready（页面上其它字体加载失败时会卡死预览）
  if (document.fonts) {
    await Promise.race([
      document.fonts.ready,
      new Promise<void>((resolve) => setTimeout(resolve, 800)),
    ])
  }
}

function withAlpha(color: string, alpha: number): string {
  if (color.startsWith('rgba(')) return color
  if (color.startsWith('#') && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }
  return color
}

/** 正文区底部留白，避免与绝对定位底栏重叠 */
function applyContentFooterInset(wrap: HTMLElement, px: number): void {
  const reading =
    wrap.querySelector('.card-xhs-shell .card-reading') ??
    wrap.querySelector('.card-studio-shell .card-reading') ??
    (wrap.classList.contains('card-reading') ? wrap : null)
  if (reading instanceof HTMLElement) {
    reading.style.paddingBottom = `${px}px`
    reading.style.boxSizing = 'border-box'
  }
}

function createBrandFooterEl(brand: string, brandColor: string): HTMLSpanElement {
  const wrap = document.createElement('span')
  wrap.style.cssText = `display:inline-flex;align-items:baseline;gap:2px;color:${brandColor};line-height:1`
  const at = document.createElement('span')
  at.style.cssText = `font-family:${FONT_STACK};font-size:10px;font-weight:600;opacity:0.5;transform:translateY(-1px)`
  at.textContent = '@'
  const name = document.createElement('span')
  name.style.cssText =
    `font-family:${CARD_BRAND_FONT};font-size:14px;font-weight:700;letter-spacing:0.1em`
  name.textContent = brand
  wrap.append(at, name)
  return wrap
}

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
  /** 显示页脚页码（对齐 MD2Card） */
  showPageNumbers?: boolean
  /** 显示底栏品牌署名 */
  showBrand?: boolean
  /** 高度超出隐藏，不提示 overflow */
  overflowHidden?: boolean
  /** preview = 低分辨率快速预览；export = 1080px 导出（默认） */
  purpose?: SlicePurpose
  /** 每页截图完成时回调，用于渐进式预览 */
  onPage?: (dataUrl: string, pageIndex: number, total: number) => void
  signal?: AbortSignal
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

/** KaTeX / 表格等块的视觉底部常超出 offsetHeight，分页需额外留白 */
function blockVisualBottom(block: HTMLElement): number {
  let bottom = block.offsetTop + block.offsetHeight
  if (block.querySelector('.katex, .katex-display, mjx-container')) bottom += 14
  else if (block.tagName === 'TABLE') bottom += 8
  return bottom
}

/** 分页块：兼容 .card-studio-shell / .card-xhs-shell / .card-reading */
function paginateBlocks(wrap: HTMLElement): HTMLElement[] {
  const xhsShell = wrap.querySelector('.card-xhs-shell')
  const xhsReading = xhsShell?.querySelector('.card-xhs__inner > .card-reading')
  if (xhsReading) {
    return Array.from(xhsReading.children).filter(
      (n): n is HTMLElement => n instanceof HTMLElement && n.tagName !== 'STYLE',
    )
  }
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
  return withDomExportLock(() => sliceContentToDataUrlsInner(opts))
}

async function sliceContentToDataUrlsInner(opts: SliceContentOptions): Promise<SliceContentResult> {
  const {
    contentHtml,
    brand,
    aspect,
    previewContentWidth,
    theme,
    frameId = 'none',
    frameAccent = '#07c160',
    maxPages,
    showPageNumbers = true,
    showBrand = true,
    overflowHidden = false,
    purpose = 'export',
    onPage,
    signal,
  } = opts
  const base = ASPECTS[aspect]
  const nativeW = base.w * 3
  const refW = previewContentWidth > 80 ? previewContentWidth : 375
  const w = Math.round(refW)
  const h = Math.round((w * base.h) / base.w)
  const exportRatio = nativeW / w
  const pixelRatio = purpose === 'preview' ? 1 : exportRatio
  const pngOptions = {
    ...htmlToImageOptions,
    cacheBust: purpose === 'export',
  }
  const bg = theme.contentBg
  const pngBg = theme.exportBg ?? bg
  const isXhsShell = contentHtml.includes('card-xhs-shell')
  const padX = isXhsShell ? 0 : 20
  const hasChromeHeader = contentHtml.includes('card-studio-header')
  const padTop = isXhsShell ? 0 : hasChromeHeader ? 14 : 22
  const showFooterBrand = showBrand && brand.trim()
  const footerActive = showFooterBrand || showPageNumbers
  const footerBand = footerActive ? CONTENT_FOOTER_BAND : 0
  const contentInset = footerActive ? FOOTER_CONTENT_INSET : 0
  const fPage = 11

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
  wrap.style.cssText = isXhsShell
    ? `position:absolute;left:0;top:0;width:${cw}px;height:${rect.ch}px;box-sizing:border-box;overflow:hidden;`
    : `position:absolute;left:0;top:0;width:${cw}px;height:${rect.ch}px;box-sizing:border-box;` +
      `padding:${padTop}px ${padX}px 0;font-size:15px;line-height:1.8;color:rgb(51,51,51);overflow:hidden;`
  wrap.innerHTML = contentHtml
  if (!isXhsShell) wrap.classList.add('card-reading')
  applyContentFooterInset(wrap, contentInset)

  const footerBg = isXhsShell
    ? `linear-gradient(180deg,${withAlpha(surfaceBg, 0)} 0%,${withAlpha(surfaceBg, 0.96)} 45%,${surfaceBg} 100%)`
    : surfaceBg
  const footer = document.createElement('div')
  footer.style.cssText =
    `position:absolute;left:0;right:0;bottom:0;height:${footerBand}px;background:${footerBg};` +
    `box-sizing:border-box;padding:0 ${isXhsShell ? 16 : padX}px;z-index:8`
  const inner = document.createElement('div')
  inner.style.cssText =
    `height:100%;display:flex;align-items:center;` +
    `justify-content:${showFooterBrand && showPageNumbers ? 'space-between' : showPageNumbers ? 'flex-end' : 'flex-start'};` +
    `padding-top:6px;border-top:1px dashed ${theme.footerDash}`
  if (showFooterBrand) {
    inner.append(createBrandFooterEl(brand, theme.brandColor))
  }
  const pageEl = document.createElement('span')
  pageEl.style.cssText =
    `font-family:${FONT_STACK};font-size:${fPage}px;color:${theme.pageColor};font-weight:600;letter-spacing:0.04em;opacity:0.72`
  if (showPageNumbers) inner.append(pageEl)
  footer.append(inner)
  if (!footerActive) footer.style.display = 'none'

  if (theme.accentBar) {
    const bar = document.createElement('div')
    bar.style.cssText = `position:absolute;top:0;left:0;right:0;height:4px;background:${theme.accentBar};z-index:3`
    contentHost.append(bar)
  }

  contentHost.append(wrap, footer)
  hider.appendChild(frame)
  document.body.appendChild(hider)
  await ensureCardFooterFonts()
  await waitImages(frame)

  const topInset = isXhsShell ? 0 : padTop
  const budget = rect.ch - contentInset - topInset
  const blocks = paginateBlocks(wrap).filter(
    (b) => b.offsetHeight > 2 || (b.textContent?.trim()?.length ?? 0) > 0,
  )

  const pages: { startIdx: number; endIdx: number; top: number }[] = []
  let k = 0
  while (k < blocks.length) {
    const pageTop = blocks[k].offsetTop
    let j = k + 1
    while (j < blocks.length) {
      const bottom = blockVisualBottom(blocks[j])
      if (bottom - pageTop > budget) break
      j++
    }
    // 避免页末孤行标题：把标题挪到下一页，且每页至少保留 1 个块
    while (j - k > 1 && isHeadingBlock(blocks[j - 1])) j--
    if (j <= k) j = k + 1
    // 标题不与正文拆成两页（如「常用符号」+ 表格）
    if (j - k === 1 && isHeadingBlock(blocks[k]) && k + 1 < blocks.length) {
      j = k + 2
    }
    pages.push({ startIdx: k, endIdx: j, top: pageTop })
    k = j
  }

  const validPages = pages.filter((p) => p.endIdx > p.startIdx)
  if (!validPages.length && blocks.length) {
    validPages.push({ startIdx: 0, endIdx: blocks.length, top: blocks[0].offsetTop })
  }

  const totalPages = validPages.length
  const pageLimit = maxPages != null ? Math.max(1, maxPages) : totalPages
  const overflow = maxPages === 1 && totalPages > 1 && !overflowHidden
  const exportCount = Math.min(totalPages, pageLimit)
  const slices: string[] = []
  try {
    for (let i = 0; i < exportCount; i++) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
      const { startIdx, endIdx, top } = validPages[i]
      blocks.forEach((b, idx) => {
        b.style.visibility = idx >= startIdx && idx < endIdx ? 'visible' : 'hidden'
      })
      wrap.style.top = `${topInset - top}px`
      if (showPageNumbers) pageEl.textContent = `${i + 1} / ${exportCount}`
      const dataUrl = await toPng(frame, {
        ...pngOptions,
        pixelRatio,
        width: w,
        height: h,
        backgroundColor: exportBg,
      })
      slices.push(dataUrl)
      onPage?.(dataUrl, i, exportCount)
    }
  } finally {
    document.body.removeChild(hider)
  }
  return { dataUrls: slices, overflow }
}
