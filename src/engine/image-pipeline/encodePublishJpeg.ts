import { PUBLISH_MAX_BYTES, PUBLISH_MAX_WIDTH, type PublishJpegResult } from './types'

const MIN_QUALITY = 0.5
const MAX_QUALITY = 0.92
const SCALE_STEPS = [1, 0.95, 0.9, 0.85]

function loadImageElement(src: string): Promise<HTMLImageElement> {
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

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('读取 JPEG 失败'))
    reader.readAsDataURL(blob)
  })
}

function drawScaledImage(
  source: CanvasImageSource,
  srcWidth: number,
  srcHeight: number,
  scale: number,
): HTMLCanvasElement | null {
  const maxScale = Math.min(1, PUBLISH_MAX_WIDTH / srcWidth)
  const ratio = Math.min(maxScale, scale)
  const w = Math.max(1, Math.round(srcWidth * ratio))
  const h = Math.max(1, Math.round(srcHeight * ratio))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(source, 0, 0, w, h)
  return canvas
}

async function encodeCanvasToPublishJpeg(canvas: HTMLCanvasElement): Promise<PublishJpegResult | null> {
  let lo = MIN_QUALITY
  let hi = MAX_QUALITY
  let best: { blob: Blob; dataUrl: string } | null = null

  for (let i = 0; i < 10; i++) {
    const q = (lo + hi) / 2
    const blob = await canvasToJpegBlob(canvas, q)
    if (!blob) break
    if (blob.size <= PUBLISH_MAX_BYTES) {
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
    return {
      blob,
      dataUrl,
      bytes: blob.size,
      width: canvas.width,
      height: canvas.height,
      ok: blob.size <= PUBLISH_MAX_BYTES,
    }
  }

  return {
    blob: best.blob,
    dataUrl: best.dataUrl,
    bytes: best.blob.size,
    width: canvas.width,
    height: canvas.height,
    ok: true,
  }
}

async function encodeBitmap(bitmap: ImageBitmap, scale: number): Promise<PublishJpegResult | null> {
  const canvas = drawScaledImage(bitmap, bitmap.width, bitmap.height, scale)
  if (!canvas) return null
  return encodeCanvasToPublishJpeg(canvas)
}

export async function encodePublishJpegFromFile(file: File): Promise<PublishJpegResult> {
  if (file.type === 'image/svg+xml') {
    throw new Error('不支持 SVG，请使用 PNG 或 JPEG')
  }

  let bitmap: ImageBitmap | null = null
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    for (const scale of SCALE_STEPS) {
      const result = await encodeBitmap(bitmap, scale)
      if (result?.ok) return result
      if (result && scale === SCALE_STEPS[SCALE_STEPS.length - 1]) return result
    }
    throw new Error('图片过大，请裁剪后重试')
  } catch {
    const dataUrl = await blobToDataUrl(file)
    const img = await loadImageElement(dataUrl)
    for (const scale of SCALE_STEPS) {
      const canvas = drawScaledImage(img, img.naturalWidth, img.naturalHeight, scale)
      if (!canvas) continue
      const result = await encodeCanvasToPublishJpeg(canvas)
      if (result?.ok) return result
      if (result && scale === SCALE_STEPS[SCALE_STEPS.length - 1]) return result
    }
    throw new Error('图片过大，请裁剪后重试')
  } finally {
    bitmap?.close()
  }
}

export async function encodePublishJpegFromDataUrl(dataUrl: string): Promise<PublishJpegResult> {
  const img = await loadImageElement(dataUrl)
  for (const scale of SCALE_STEPS) {
    const canvas = drawScaledImage(img, img.naturalWidth, img.naturalHeight, scale)
    if (!canvas) continue
    const result = await encodeCanvasToPublishJpeg(canvas)
    if (result?.ok) return result
    if (result && scale === SCALE_STEPS[SCALE_STEPS.length - 1]) return result
  }
  return {
    blob: new Blob(),
    dataUrl,
    bytes: PUBLISH_MAX_BYTES + 1,
    width: 0,
    height: 0,
    ok: false,
  }
}
