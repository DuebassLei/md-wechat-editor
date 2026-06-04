import { toBlob } from 'html-to-image'

export const HANDWRITING_EXPORT_WIDTH = 1080

export async function exportHandwritingToBlob(root: HTMLElement): Promise<Blob | null> {
  const height = root.scrollHeight
  return toBlob(root, {
    width: HANDWRITING_EXPORT_WIDTH,
    height,
    pixelRatio: 2,
    cacheBust: true,
    skipFonts: false,
  })
}

export function downloadHandwritingBlob(blob: Blob, paperName: string) {
  const date = new Date().toISOString().slice(0, 10)
  const filename = `手写稿-${paperName}-${date}.png`
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
