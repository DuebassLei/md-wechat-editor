import type { UploadImageResult } from '../../image-pipeline/types'
import { parseUploadJsonUrl } from '../../image-pipeline/publishResolve'

export async function uploadToCustomPost(
  file: File,
  config: {
    uploadUrl: string
    fileField?: string
    tokenHeader?: string
    tokenValue?: string
    urlJsonPath?: string
  },
): Promise<UploadImageResult> {
  const uploadUrl = config.uploadUrl?.trim()
  if (!uploadUrl) throw new Error('请先在设置中配置自定义上传地址')

  const form = new FormData()
  form.append(config.fileField?.trim() || 'file', file)

  const headers: Record<string, string> = {}
  const headerName = config.tokenHeader?.trim()
  const headerValue = config.tokenValue?.trim()
  if (headerName && headerValue) headers[headerName] = headerValue

  const res = await fetch(uploadUrl, { method: 'POST', headers, body: form })
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(`自定义图床上传失败：HTTP ${res.status}`)
  }

  const url = parseUploadJsonUrl(body, config.urlJsonPath?.trim() || undefined)
  if (!url) throw new Error('自定义图床响应中未找到图片 URL')
  return { url, name: file.name }
}
