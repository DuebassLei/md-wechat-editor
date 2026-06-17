export const PUBLISH_MAX_BYTES = 1024 * 1024 - 1
export const PUBLISH_MAX_WIDTH = 1440
export const MAX_SOURCE_BYTES = 10 * 1024 * 1024
export const MAX_LOCAL_IMAGES = 20

export const IMAGE_TOKEN_PATTERN = 'IMG_\\d+_[a-z0-9]{6}'

export interface PublishJpegResult {
  blob: Blob
  dataUrl: string
  bytes: number
  width: number
  height: number
  ok: boolean
}

export interface StoredImage {
  token: string
  blob: Blob
  mime: 'image/jpeg'
  bytes: number
  alt: string
  createdAt: number
  /** 导入时生成的 data URL，resolve 时优先使用 */
  dataUrl: string
  publishedUrl?: string
  publishedProvider?: string
  publishedAt?: number
}

export type ImageHostProviderId = 'smms' | 'imgbb' | 'custom' | 'github'

export interface ImageHostSettings {
  defaultProviderId: ImageHostProviderId
  smms: { token?: string }
  imgbb: { apiKey: string }
  custom: {
    name: string
    uploadUrl: string
    fileField?: string
    tokenHeader?: string
    tokenValue?: string
    urlJsonPath?: string
  }
  github: {
    repo: string
    token: string
    branch: string
  }
}

export interface UploadImageResult {
  url: string
  name?: string
}
