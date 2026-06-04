const MAX_BYTES = 1024 * 1024 - 1
const MIN_QUALITY = 0.5
const MAX_QUALITY = 0.92
const SCALE_STEPS = [1, 0.95, 0.9, 0.85]

export interface UploadCompressResult {
  dataUrl: string
  bytes: number
  ok: boolean
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('图片解码失败'))
    img.src = src
  })
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', quality)
  })
}

async function tryCompress(
  img: HTMLImageElement,
  scale: number,
): Promise<UploadCompressResult | null> {
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.drawImage(img, 0, 0, w, h)

  let lo = MIN_QUALITY
  let hi = MAX_QUALITY
  let best: { blob: Blob; dataUrl: string } | null = null

  for (let i = 0; i < 10; i++) {
    const q = (lo + hi) / 2
    const blob = await canvasToJpegBlob(canvas, q)
    if (!blob) break
    if (blob.size <= MAX_BYTES) {
      best = { blob, dataUrl: await blobToDataUrl(blob) }
      lo = q
    } else {
      hi = q
    }
  }

  if (!best) {
    const blob = await canvasToJpegBlob(canvas, MIN_QUALITY)
    if (!blob) return null
    const dataUrl = await blobToDataUrl(blob)
    return { dataUrl, bytes: blob.size, ok: blob.size <= MAX_BYTES }
  }

  return { dataUrl: best.dataUrl, bytes: best.blob.size, ok: true }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('读取 JPEG 失败'))
    reader.readAsDataURL(blob)
  })
}

/** PNG dataURL → JPEG dataURL, target &lt; 1MB for WeChat uploadimg */
export async function compressPngDataUrlForUpload(pngDataUrl: string): Promise<UploadCompressResult> {
  const img = await loadImage(pngDataUrl)
  for (const scale of SCALE_STEPS) {
    const result = await tryCompress(img, scale)
    if (result?.ok) return result
    if (result && scale === SCALE_STEPS[SCALE_STEPS.length - 1]) return result
  }
  return { dataUrl: pngDataUrl, bytes: MAX_BYTES + 1, ok: false }
}

export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function dataUrlByteSize(dataUrl: string): number {
  const comma = dataUrl.indexOf(',')
  const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl
  return Math.ceil((base64.length * 3) / 4)
}
