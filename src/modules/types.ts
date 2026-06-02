import type { LayoutModuleMeta } from '@/constants/layoutModules'
import type { Md2wechatModuleBody } from '@/lib/r-markdown/md2wechat-renderers/shared'
import type { ThemeColors } from '@/lib/r-markdown/themeColors'

export type ModuleRenderFn = (
  body: Md2wechatModuleBody,
  colors: ThemeColors,
  fullMd: string,
) => string

export type PluginFencedParseFn = (
  lines: string[],
  start: number,
  colors: ThemeColors,
) => { html: string; next: number } | null

export interface LayoutModulePlugin {
  id: string
  meta: LayoutModuleMeta
  snippet: (accent?: string) => string
  render?: ModuleRenderFn
  /** 墨韵 ::: 围栏扩展（如 :::engage），由插件注册后参与解析 */
  parseFenced?: PluginFencedParseFn
}
