import { getStoredImage, listAllStoredTokens, deleteStoredImage } from './imageStore'
import { IMAGE_TOKEN_PATTERN } from './types'

export const IMAGE_TOKEN_RE = new RegExp(IMAGE_TOKEN_PATTERN, 'g')

const MDWE_IMG_RE = new RegExp(`mdwe-img:(${IMAGE_TOKEN_PATTERN})`, 'g')

const LEGACY_DATA_TOKEN_RE = new RegExp(
  `data:image\\/([^;"]+);base64,(${IMAGE_TOKEN_PATTERN})`,
  'g',
)

export function createImageToken(): string {
  return `IMG_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/** 正文中的本地图引用（非真实 data URL，预览前需 resolve） */
export function buildLocalImageUrl(token: string): string {
  return `mdwe-img:${token}`
}

export function countImageTokens(markdown: string): number {
  return listImageTokensInMarkdown(markdown).length
}

export function listImageTokensInMarkdown(markdown: string): string[] {
  const set = new Set<string>()
  let m: RegExpExecArray | null

  const mdweRe = new RegExp(MDWE_IMG_RE.source, 'g')
  while ((m = mdweRe.exec(markdown)) !== null) {
    set.add(m[1])
  }

  const legacyRe = new RegExp(LEGACY_DATA_TOKEN_RE.source, 'g')
  while ((m = legacyRe.exec(markdown)) !== null) {
    set.add(m[2])
  }

  return [...set]
}

async function dataUrlForRecord(record: Awaited<ReturnType<typeof getStoredImage>>): Promise<string | null> {
  if (!record) return null
  if (record.dataUrl) return record.dataUrl
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('读取图片失败'))
    reader.readAsDataURL(record.blob)
  })
}

export async function resolveImageTokens(markdown: string): Promise<string> {
  const tokens = listImageTokensInMarkdown(markdown)
  if (!tokens.length) return markdown

  let result = markdown

  for (const token of tokens) {
    const record = await getStoredImage(token)
    const dataUrl = await dataUrlForRecord(record)
    if (!dataUrl) continue

    const mdweNeedle = `mdwe-img:${token}`
    const legacyRe = new RegExp(`data:image\\/([^;"]+);base64,${token}`, 'g')

    result = result.split(mdweNeedle).join(dataUrl)
    result = result.replace(legacyRe, dataUrl)
  }

  return result
}

export async function cleanupUnusedImageTokens(markdown: string): Promise<void> {
  const inUse = new Set(listImageTokensInMarkdown(markdown))
  const all = await listAllStoredTokens()
  for (const token of all) {
    if (!inUse.has(token)) {
      await deleteStoredImage(token)
    }
  }
}

export function replaceTokenWithUrl(markdown: string, token: string, url: string): string {
  let result = markdown.split(`mdwe-img:${token}`).join(url)
  result = result.replace(
    new RegExp(`data:image\\/([^;"]+);base64,${token}`, 'g'),
    url,
  )
  return result
}

/** 将旧版伪 data URL 正文迁移为 mdwe-img 引用 */
export function migrateLegacyImageUrls(markdown: string): string {
  const re = new RegExp(LEGACY_DATA_TOKEN_RE.source, 'g')
  return markdown.replace(re, (_m, _mime: string, token: string) => `mdwe-img:${token}`)
}
