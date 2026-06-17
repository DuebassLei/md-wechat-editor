import type { ImageHostSettings, UploadImageResult } from '../image-pipeline/types'
import { uploadToImgbb } from './providers/imgbb'
import { uploadToCustomPost } from './providers/customPost'
import { uploadToGithub } from './providers/github'
import { uploadToSmms } from './providers/smms'

export async function uploadImage(
  blob: Blob,
  filename: string,
  settings: ImageHostSettings,
): Promise<UploadImageResult> {
  const file = new File([blob], filename, { type: blob.type || 'image/jpeg' })
  const provider = settings.defaultProviderId

  switch (provider) {
    case 'smms':
      return uploadToSmms(file, settings.smms)
    case 'imgbb':
      return uploadToImgbb(file, settings.imgbb)
    case 'custom':
      return uploadToCustomPost(file, settings.custom)
    case 'github':
      return uploadToGithub(file, settings.github)
    default:
      throw new Error('未知图床类型')
  }
}
