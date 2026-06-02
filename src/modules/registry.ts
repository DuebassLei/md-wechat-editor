import { LAYOUT_MODULES, type LayoutModuleMeta } from '@/constants/layoutModules'
import { buildLayoutModuleSnippet } from '@/constants/layoutModuleSnippets'
import { renderDedicatedMd2wechatModule } from '@/lib/r-markdown/md2wechat-renderers/modules'
import type { Md2wechatModuleBody } from '@/lib/r-markdown/md2wechat-renderers/shared'
import type { ThemeColors } from '@/lib/r-markdown/themeColors'
import type { LayoutModulePlugin, ModuleRenderFn } from './types'

const plugins = new Map<string, LayoutModulePlugin>()

export function registerModule(plugin: LayoutModulePlugin): void {
  plugins.set(plugin.id, plugin)
}

export function hasRegisteredPlugin(id: string): boolean {
  return plugins.has(id)
}

export function getRegisteredPlugin(id: string): LayoutModulePlugin | undefined {
  return plugins.get(id)
}

export function listModules(): LayoutModuleMeta[] {
  const builtin = LAYOUT_MODULES
  const extra = [...plugins.values()]
    .filter((p) => !builtin.some((b) => b.id === p.id))
    .map((p) => p.meta)
  return [...builtin, ...extra]
}

export function getSnippet(id: string, accent?: string): string {
  const plugin = plugins.get(id)
  if (plugin) return plugin.snippet(accent ?? undefined)
  void accent
  return buildLayoutModuleSnippet(id)
}

export function renderModule(
  name: string,
  body: Md2wechatModuleBody,
  colors: ThemeColors,
  fullMd: string,
): string | null {
  const plugin = plugins.get(name)
  if (plugin?.render) return plugin.render(body, colors, fullMd)
  return renderDedicatedMd2wechatModule(name, body, colors, fullMd)
}

export function registerBuiltinModules(): void {
  for (const meta of LAYOUT_MODULES) {
    if (plugins.has(meta.id)) continue
    registerModule({
      id: meta.id,
      meta,
      snippet: () => buildLayoutModuleSnippet(meta.id),
    })
  }
}

export function registerModuleRenderer(id: string, render: ModuleRenderFn): void {
  const meta = LAYOUT_MODULES.find((m) => m.id === id)
  if (!meta) return
  registerModule({
    id,
    meta,
    snippet: () => buildLayoutModuleSnippet(id),
    render,
  })
}
