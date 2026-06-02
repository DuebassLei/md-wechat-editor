import { LAYOUT_MODULE_THUMB_VERSION } from '@/constants/layoutModules'

export function moduleThumbUrl(moduleId: string): string {
  const base = import.meta.env.BASE_URL
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}module-thumbs/${moduleId}@${LAYOUT_MODULE_THUMB_VERSION}.png`
}
