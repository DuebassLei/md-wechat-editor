import type { LayoutModuleMeta } from '@/constants/layoutModules'
import type { Md2wechatModuleBody } from '@/lib/r-markdown/md2wechat-renderers/shared'
import type { ThemeColors } from '@/lib/r-markdown/themeColors'

export type ModuleRenderFn = (
  body: Md2wechatModuleBody,
  colors: ThemeColors,
  fullMd: string,
) => string

export interface LayoutModulePlugin {
  id: string
  meta: LayoutModuleMeta
  snippet: (accent?: string) => string
  render?: ModuleRenderFn
}
