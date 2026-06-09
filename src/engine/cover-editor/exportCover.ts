import { toBlob } from 'html-to-image'
import { COVER_EXPORT_SIZES } from './constants'
import type { CoverAspect } from './types'

export async function exportCoverToBlob(root: HTMLElement, aspect: CoverAspect): Promise<Blob | null> {
  const { w, h } = COVER_EXPORT_SIZES[aspect]
  return toBlob(root, {
    width: w,
    height: h,
    pixelRatio: 2,
    cacheBust: true,
    skipFonts: false,
  })
}

export function downloadCoverBlob(blob: Blob, aspect: CoverAspect) {
  const date = new Date().toISOString().slice(0, 10)
  const tag = aspect === 'wechat' ? 'wechat' : aspect
  const filename = `封面-${tag}-${date}.png`
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
