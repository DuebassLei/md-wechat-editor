import type { UploadImageResult } from '../../image-pipeline/types'
import { parseUploadJsonUrl } from '../../image-pipeline/publishResolve'

export async function uploadToImgbb(
  file: File,
  config: { apiKey: string },
): Promise<UploadImageResult> {
  const apiKey = config.apiKey?.trim()
  if (!apiKey) throw new Error('请先在设置中配置 ImgBB API Key')

  const form = new FormData()
  form.append('image', file)

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    body: form,
  })

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const msg =
      body && typeof body === 'object' && 'error' in body
        ? String((body as { error?: { message?: string } }).error?.message ?? res.status)
        : `HTTP ${res.status}`
    throw new Error(`ImgBB 上传失败：${msg}`)
  }

  const url =
    parseUploadJsonUrl(body, 'data.url') ?? parseUploadJsonUrl(body, 'data.display_url')
  if (!url) throw new Error('ImgBB 响应中未找到图片 URL')
  return { url, name: file.name }
}
