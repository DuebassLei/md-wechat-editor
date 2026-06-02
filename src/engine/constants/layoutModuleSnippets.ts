import type { LayoutCategory, LayoutModuleMeta } from '@/constants/layoutModules'
import { LAYOUT_MODULES } from '@/constants/layoutModules'

/** 模块分类中文标签（组件选择器分组） */
export const LAYOUT_CATEGORY_LABELS: Record<LayoutCategory, string> = {
  opening: '开篇',
  judgment: '观点判断',
  infographic: '信息图表',
  evidence: '证据引用',
  conversion: '转化收尾',
  brand: '品牌作者',
  readability: '可读性',
  extension: '排版扩展',
}

/** 组件选择器分组顺序 */
export const LAYOUT_CATEGORY_ORDER: LayoutCategory[] = [
  'infographic',
  'opening',
  'judgment',
  'evidence',
  'conversion',
  'readability',
  'brand',
  'extension',
]

const SNIPPET_BUILDERS: Record<string, () => string> = {
  compare: () => `:::compare 方案 A | 方案 B
✘ 旧方案缺点 | 每次都要手工调格式
✔ 新方案优点 | 一键生成专业排版
:::

`,
  timeline: () => `:::timeline
2024-01 | 项目启动 | 完成立项与团队组建
2024-06 | 一期上线 | 核心功能发布
2024-12 | 用户增长 | 突破 10 万阅读
:::

`,
  steps: () => `:::steps label="HOW IT WORKS" title="流程说明" hint="左右滑动" active="2"
输入 | 收集素材与资料
整理 | 结构化大纲与要点
输出 | 生成排版成品
:::

`,
  'compare-rich': () => `:::compare left-label="BEFORE" left-title="旧版" right-label="AFTER" right-title="新版"
---left---
左侧 Markdown 正文
---right---
右侧 Markdown 正文
:::

`,
  hero: () => `:::hero
eyebrow: 深度观察
title: 文章主标题
subtitle: 一句话副标题，说明读者收益
chips: 标签一|标签二|标签三
:::

`,
  'label-title': () => `:::label-title
eyebrow: CHAPTER
title: 章节标签标题
subtitle: 副标题说明
:::

`,
  part: () => `:::part
num: 02
title: 系列第二篇
subtitle: 连载 / 分篇标识
:::

`,
  toc: () => `:::toc
开篇导读 | 为什么值得读
核心观点 | 三个关键判断
行动建议 | 读完怎么做
:::

`,
  quote: () => `:::quote
title: 专家观点
body: 排版不是装饰，而是让读者更快抓住结构。
author: 墨韵简排
:::

`,
  infographic: () => `:::infographic
title: 信息图标题
body: 用结构化块呈现复杂信息，适合数据与流程说明。
:::

`,
  pricing: () => `:::pricing
基础版 | 免费 | 核心排版
专业版 | ¥99/月 | 全部主题与模块
:::

`,
  people: () => `:::people
张三 | 产品负责人 | 负责选题与结构
李四 | 主笔 | 负责正文与排版
:::

`,
  verdict: () => `:::verdict
title: 核心结论
body: 用一两句话给出你的判断与立场。
:::

`,
  faq: () => `:::faq[常见问题]
模块只能在某个主题里用吗？ | 不是，各排版主题下均可解析。
为什么推荐 ::: 语法？ | 结构清晰，适合公众号快速排版。
:::

`,
  metrics: () => `:::metrics
阅读量 | 12.8万 | 较上月 +32%
完读率 | 68% | 行业均值 45%
转发数 | 2,400 | 单篇最高记录
:::

`,
  cards: () => `:::cards
要点一 | 核心优势 | 一句话说明价值
要点二 | 使用场景 | 适合哪类读者
要点三 | 行动建议 | 读完可以做什么
:::

`,
  callout: () => `:::callout
title: 操作提示
body: 支持 TIP / NOTE / WARNING 等语义，也可用 GFM 引用语法。
:::

`,
  cta: () => `:::cta label="GET STARTED" title="准备好开始了吗？" button="立即行动"
:::

`,
  lead: () => `:::lead
带左侧色条的导语段落，适合章节开篇或承上启下。
:::

`,
  statement: () => `:::statement
这是一段居中的金句强调，适合核心观点。
:::

`,
  'p-title': () => `:::p-title
num: 01
title: 章节标题
subtitle: SECTION · 副标题
level: 1
:::

`,
  checklist: () => `:::checklist
确认选题与受众定位
准备 3～5 个核心论据
插入至少一个排版模块增强可读性
:::

`,
  'myth-fact': () => `:::myth-fact
误区：排版越花哨越好 | 事实：结构清晰比装饰更重要
:::

`,
  summary: () => `:::summary
highlight: 一句话回顾全文
body: 补充 2～3 个可带走的要点。
:::

`,
  engage: () => `:::engage
title: 感谢阅读，欢迎点赞转发！
label: THANKS FOR READING
:::

`,
  gallery: () => `:::gallery
![图1](https://picsum.photos/400/200?random=1), ![图2](https://picsum.photos/400/200?random=2)
:::

`,
  badges: () => `:::badges tone="accent"
Vue|TypeScript|公众号排版
:::

`,
  'reading-path': () => `:::reading-path
:::

`,
  breaking: () => `:::breaking
badge: NEW
title: 突发摘要标题
subtitle: 一句话说明背景
chips: 高效|美观
正文摘要段落，适合快讯或更新说明。
:::

`,
  'case-flow': () => `:::case-flow
- [案例 01] 标题：详细说明与结果
- [案例 02] 标题：详细说明与结果
:::

`,
  'title-da01': () => `:::title-da01
title: 经典标题样式
:::

`,
}

function genericModuleSnippet(mod: LayoutModuleMeta): string {
  if (mod.bodyFormat === 'fields') {
    return `:::${mod.id}
title: ${mod.name}标题
body: ${mod.description}
:::

`
  }
  if (mod.bodyFormat === 'rows') {
    return `:::${mod.id}
示例项 A | 说明文字
示例项 B | 说明文字
:::

`
  }
  if (mod.bodyFormat === 'fenced') {
    return `:::${mod.id}
${mod.description}
:::

`
  }
  return `:::${mod.id}
title: ${mod.name}标题
body: ${mod.description}
:::

`
}

/** 生成可插入编辑器的模块 Markdown 片段 */
export function buildLayoutModuleSnippet(moduleId: string): string {
  const mod = LAYOUT_MODULES.find((m) => m.id === moduleId)
  if (!mod) return ''
  const builder = SNIPPET_BUILDERS[moduleId]
  return builder ? builder() : genericModuleSnippet(mod)
}

/** 按分类分组的模块列表（供选择器渲染） */
export function layoutModulesByCategory(
  modules: LayoutModuleMeta[],
): { category: LayoutCategory; label: string; items: LayoutModuleMeta[] }[] {
  const map = new Map<LayoutCategory, LayoutModuleMeta[]>()
  for (const mod of modules) {
    const list = map.get(mod.category) ?? []
    list.push(mod)
    map.set(mod.category, list)
  }
  return LAYOUT_CATEGORY_ORDER.filter((c) => map.has(c)).map((category) => ({
    category,
    label: LAYOUT_CATEGORY_LABELS[category],
    items: map.get(category)!,
  }))
}
