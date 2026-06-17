import { getStoredImage, updatePublishedUrl } from './imageStore'
import {
  listImageTokensInMarkdown,
  replaceTokenWithUrl,
  resolveImageTokens,
} from './imageTokens'
import type { ImageHostSettings } from './types'
import { uploadImage } from '../image-upload/uploadImage'

export interface PublishResolveResult {
  markdown: string
  uploaded: number
  failed: string[]
}

function getJsonPath(obj: unknown, path: string): unknown {
  const parts = path.split('.').filter(Boolean)
  let cur: unknown = obj
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[p]
  }
  return cur
}

async function uploadBlobForPublish(
  blob: Blob,
  filename: string,
  settings: ImageHostSettings,
): Promise<string> {
  const result = await uploadImage(blob, filename, settings)
  return result.url
}

export async function publishMarkdownWithHostUrls(
  markdown: string,
  settings: ImageHostSettings,
  options?: { useCache?: boolean },
): Promise<PublishResolveResult> {
  const tokens = listImageTokensInMarkdown(markdown)
  if (!tokens.length) {
    return { markdown, uploaded: 0, failed: [] }
  }

  let result = markdown
  let uploaded = 0
  const failed: string[] = []

  for (const token of tokens) {
    const record = await getStoredImage(token)
    if (!record) {
      failed.push(token)
      continue
    }

    if (options?.useCache && record.publishedUrl) {
      result = replaceTokenWithUrl(result, token, record.publishedUrl)
      continue
    }

    try {
      const url = await uploadBlobForPublish(
        record.blob,
        `${record.alt || token}.jpg`,
        settings,
      )
      await updatePublishedUrl(token, url, settings.defaultProviderId)
      result = replaceTokenWithUrl(result, token, url)
      uploaded++
    } catch {
      failed.push(token)
    }
  }

  return { markdown: result, uploaded, failed }
}

export async function resolveMarkdownForPreview(markdown: string): Promise<string> {
  return resolveImageTokens(markdown)
}

export function isImageHostConfigured(settings: ImageHostSettings): boolean {
  const id = settings.defaultProviderId
  if (id === 'smms') return true
  if (id === 'imgbb') return Boolean(settings.imgbb.apiKey?.trim())
  if (id === 'github') {
    return Boolean(settings.github.repo?.trim() && settings.github.token?.trim())
  }
  if (id === 'custom') return Boolean(settings.custom.uploadUrl?.trim())
  return false
}

export function parseUploadJsonUrl(body: unknown, path?: string): string | null {
  const candidates = path
    ? [getJsonPath(body, path)]
    : [
        getJsonPath(body, 'data.url'),
        getJsonPath(body, 'url'),
        getJsonPath(body, 'data.image.url'),
        getJsonPath(body, 'data.display_url'),
      ]
  for (const c of candidates) {
    if (typeof c === 'string' && /^https?:\/\//i.test(c)) return c
  }
  return null
}
