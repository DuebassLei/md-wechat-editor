import { readFencedModule } from '@/lib/r-markdown/utils/fencedModule'
import type { ThemeColors } from '@/lib/r-markdown/themeColors'
import { getRegisteredPlugin, hasRegisteredPlugin } from './registry'

const PLUGIN_ONLY_FENCED = new Set(['engage'])

function engageDisabledFallbackHtml(): string {
  return `<section style="margin:20px 0;padding:16px 12px;border:1px dashed #e2e8f0;border-radius:12px;background:#f8fafc;text-align:center;text-indent:0;">
<p style="margin:0;font-size:13px;line-height:1.5;color:#64748b;">文末互动 <code style="font-size:12px;">:::engage</code> 需启用 engage 插件后渲染。请在应用入口调用 <code style="font-size:12px;">registerEngagePlugin()</code>，或通过插件市场安装。</p>
</section>`
}

/** 解析仅由插件提供的 ::: 围栏模块（如 :::engage） */
export function tryParsePluginFencedModule(
  lines: string[],
  start: number,
  t: ThemeColors,
): { html: string; next: number } | null {
  const openMatch = lines[start]?.match(/^:::\s*([\w-]+)\b/i)
  if (!openMatch) return null

  const name = openMatch[1].toLowerCase()
  if (!PLUGIN_ONLY_FENCED.has(name) && !hasRegisteredPlugin(name)) return null

  const plugin = getRegisteredPlugin(name)
  if (plugin?.parseFenced) {
    return plugin.parseFenced(lines, start, t)
  }

  if (name === 'engage') {
    const fenced = readFencedModule(lines, start)
    if (!fenced) return null
    return { html: engageDisabledFallbackHtml(), next: fenced.next }
  }

  return null
}
