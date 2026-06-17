import { encodePublishJpegFromFile } from './encodePublishJpeg'
import { saveStoredImage } from './imageStore'
import { buildLocalImageUrl, createImageToken } from './imageTokens'
import { MAX_LOCAL_IMAGES, MAX_SOURCE_BYTES } from './types'

function altFromFilename(name: string): string {
  const base = name.replace(/\.[^.]+$/, '').trim()
  return base || '图片'
}

export interface LocalImageImportResult {
  markdown: string
  token: string
}

function escapeMarkdownAlt(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\[/g, '\\[').replace(/\]/g, '\\]')
}

export async function importLocalImage(
  file: File,
  currentTokenCount: number,
): Promise<LocalImageImportResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('请选择图片文件')
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('原图不能超过 10MB')
  }
  if (currentTokenCount >= MAX_LOCAL_IMAGES) {
    throw new Error(`最多插入 ${MAX_LOCAL_IMAGES} 张本地图片`)
  }

  const encoded = await encodePublishJpegFromFile(file)
  if (!encoded.ok) {
    throw new Error('图片过大，请裁剪后重试')
  }

  const token = createImageToken()
  const alt = escapeMarkdownAlt(altFromFilename(file.name))

  await saveStoredImage({
    token,
    blob: encoded.blob,
    mime: 'image/jpeg',
    bytes: encoded.bytes,
    alt,
    createdAt: Date.now(),
    dataUrl: encoded.dataUrl,
  })

  const url = buildLocalImageUrl(token)
  return {
    markdown: `![${alt}](${url})`,
    token,
  }
}
