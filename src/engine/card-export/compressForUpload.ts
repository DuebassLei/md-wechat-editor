import { encodePublishJpegFromDataUrl } from '@/engine/image-pipeline/encodePublishJpeg'
import { PUBLISH_MAX_BYTES } from '@/engine/image-pipeline/types'

export interface UploadCompressResult {
  dataUrl: string
  bytes: number
  ok: boolean
}

/** PNG dataURL → JPEG dataURL, target &lt; 1MB for WeChat uploadimg */
export async function compressPngDataUrlForUpload(pngDataUrl: string): Promise<UploadCompressResult> {
  const result = await encodePublishJpegFromDataUrl(pngDataUrl)
  return {
    dataUrl: result.dataUrl,
    bytes: result.bytes,
    ok: result.ok,
  }
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

export { PUBLISH_MAX_BYTES as MAX_BYTES }
