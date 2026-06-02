import type { LayoutModuleMeta } from '@/constants/layoutModules'
import { Engage_DA01 } from '@/lib/r-markdown/editor-components/Engage_DA01'
import { Engage_DA02 } from '@/lib/r-markdown/editor-components/Engage_DA02'
import { readFencedModule } from '@/lib/r-markdown/utils/fencedModule'
import type { ThemeColors } from '@/lib/r-markdown/themeColors'
import { registerModule } from '../registry'
import type { LayoutModulePlugin } from '../types'

const ENGAGE_META: LayoutModuleMeta = {
  id: 'engage',
  name: '互动引导',
  alias: ':::engage',
  category: 'extension',
  tier: 'advanced',
  bodyFormat: 'fenced',
  syntax: ':::engage',
  description: '点赞/在看引导卡（插件）',
}

function parseEngageFenced(
  lines: string[],
  start: number,
  t: ThemeColors,
): { html: string; next: number } | null {
  const fenced = readFencedModule(lines, start)
  if (!fenced || fenced.name !== 'engage') return null
  const { attrs, next } = fenced
  if (attrs.type && attrs.type.toUpperCase() === 'DA02') {
    return { html: Engage_DA02.render(attrs, '', t), next }
  }
  return { html: Engage_DA01.render(attrs, '', t), next }
}

const engagePlugin: LayoutModulePlugin = {
  id: 'engage',
  meta: ENGAGE_META,
  snippet: () => `:::engage
title: 感谢阅读，欢迎点赞转发！
label: THANKS FOR READING
:::

`,
  parseFenced: parseEngageFenced,
}

/** 注册文末互动 engage 插件（核心包默认不调用，需在应用入口显式启用） */
export function registerEngagePlugin(): void {
  registerModule(engagePlugin)
}
