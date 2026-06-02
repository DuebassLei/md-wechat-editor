import type { LayoutModuleMeta } from '@/constants/layoutModules'
import { registerModule } from '../registry'
import type { LayoutModulePlugin } from '../types'

const AI_INDIGO_HERO_META: LayoutModuleMeta = {
  id: 'ai-indigo-hero',
  name: 'AI 靛紫文首',
  category: 'opening',
  tier: 'advanced',
  bodyFormat: 'fields',
  syntax: '--- frontmatter ---',
  description: '文首 YAML：封面眉题/主副标题/标签（仅 AI 靛紫主题读取）',
}

const aiIndigoHeroPlugin: LayoutModulePlugin = {
  id: 'ai-indigo-hero',
  meta: AI_INDIGO_HERO_META,
  snippet: () => `---
heroTag: 眉题
heroTitle: 主标题
heroSubtitle: 副标题说明
heroTags: 标签一, 标签二, 标签三
---

`,
}

/** 注册 AI 靛紫文首 YAML 插入片段（默认随模块注册表启用） */
export function registerAiIndigoHeroPlugin(): void {
  registerModule(aiIndigoHeroPlugin)
}
