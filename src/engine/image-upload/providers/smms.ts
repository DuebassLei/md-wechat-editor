import type { UploadImageResult } from '../../image-pipeline/types'
import { parseUploadJsonUrl } from '../../image-pipeline/publishResolve'

export async function uploadToSmms(
  file: File,
  config: { token?: string },
): Promise<UploadImageResult> {
  const form = new FormData()
  form.append('smfile', file)

  const headers: Record<string, string> = {}
  const token = config.token?.trim()
  if (token) headers.Authorization = token

  const res = await fetch('https://smms.app/api/v2/upload', {
    method: 'POST',
    headers,
    body: form,
  })

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const msg =
      body && typeof body === 'object' && 'message' in body
        ? String((body as { message: string }).message)
        : `HTTP ${res.status}`
    throw new Error(`SM.MS 上传失败：${msg}`)
  }

  const url = parseUploadJsonUrl(body, 'data.url')
  if (!url) throw new Error('SM.MS 响应中未找到图片 URL')
  return { url, name: file.name }
}
