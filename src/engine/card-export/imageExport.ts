import { TRANSPARENT_PX } from './constants'

export { TRANSPARENT_PX }

export function errText(e: unknown): string {
  if (e instanceof Error) return e.message
  if (typeof Event !== 'undefined' && e instanceof Event) {
    return '渲染失败（可能有图片加载不出来）'
  }
  return String(e)
}

export function onImageErrorHandler(e: Event | string): void {
  if (typeof e === 'string') return
  const t = e.target as HTMLImageElement | null
  if (t && 'src' in t) t.src = TRANSPARENT_PX
}

export const htmlToImageOptions = {
  skipFonts: true as const,
  cacheBust: true,
  imagePlaceholder: TRANSPARENT_PX,
  onImageErrorHandler,
}
