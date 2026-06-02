export type LayoutTier = 'gfm' | 'standard' | 'advanced'

export type LayoutCategory =
  | 'opening'
  | 'judgment'
  | 'infographic'
  | 'evidence'
  | 'conversion'
  | 'brand'
  | 'readability'
  | 'extension'

export type LayoutBodyFormat = 'fields' | 'rows' | 'json' | 'fenced'

export interface LayoutModuleMeta {
  id: string
  name: string
  /** md2wechat 原生语法，如 :::hero */
  alias?: string
  category: LayoutCategory
  tier: LayoutTier
  bodyFormat: LayoutBodyFormat
  syntax: string
  description: string
}

/** 排版模块目录（md2wechat ::: 模块 + 墨韵 ::: 扩展） */
export const LAYOUT_MODULES: LayoutModuleMeta[] = [
  // opening
  { id: 'hero', name: '封面 Hero', alias: ':::hero', category: 'opening', tier: 'advanced', bodyFormat: 'fields', syntax: ':::hero', description: '开篇第一屏：标签 + 主标题 + 副标题' },
  { id: 'cards', name: '要点卡片', alias: ':::cards', category: 'opening', tier: 'advanced', bodyFormat: 'rows', syntax: ':::cards', description: '开篇多卡片要点预览' },
  { id: 'label-title', name: '标签标题', alias: ':::label-title', category: 'opening', tier: 'standard', bodyFormat: 'fields', syntax: ':::label-title', description: '带 eyebrow 的章节标题' },
  { id: 'part', name: '分篇标识', alias: ':::part', category: 'opening', tier: 'advanced', bodyFormat: 'fields', syntax: ':::part', description: '系列文章分篇/连载标识' },
  { id: 'toc', name: '目录导航', alias: ':::toc', category: 'opening', tier: 'advanced', bodyFormat: 'rows', syntax: ':::toc', description: '文内章节目录' },
  // judgment
  { id: 'verdict', name: '最终判断', alias: ':::verdict', category: 'judgment', tier: 'advanced', bodyFormat: 'fields', syntax: ':::verdict', description: '作者立场与结论框' },
  { id: 'manifesto', name: '宣言', alias: ':::manifesto', category: 'judgment', tier: 'advanced', bodyFormat: 'fields', syntax: ':::manifesto', description: '品牌/观点宣言块' },
  { id: 'bridge', name: '过渡桥接', alias: ':::bridge', category: 'judgment', tier: 'advanced', bodyFormat: 'fields', syntax: ':::bridge', description: '章节间承上启下' },
  { id: 'audience-fit', name: '读者适配', alias: ':::audience-fit', category: 'judgment', tier: 'advanced', bodyFormat: 'fields', syntax: ':::audience-fit', description: '说明适合谁读' },
  { id: 'myth-fact', name: '误区澄清', alias: ':::myth-fact', category: 'judgment', tier: 'advanced', bodyFormat: 'rows', syntax: ':::myth-fact', description: '误区 vs 事实对照' },
  // infographic
  { id: 'metrics', name: '核心数据', alias: ':::metrics', category: 'infographic', tier: 'advanced', bodyFormat: 'rows', syntax: ':::metrics', description: '关键指标数字行' },
  { id: 'infographic', name: '信息图', alias: ':::infographic', category: 'infographic', tier: 'advanced', bodyFormat: 'fields', syntax: ':::infographic', description: '结构化信息图描述块' },
  { id: 'timeline', name: '时间轴', alias: ':::timeline', category: 'infographic', tier: 'advanced', bodyFormat: 'rows', syntax: ':::timeline', description: '事件时间线' },
  { id: 'steps', name: '步骤条', alias: ':::steps', category: 'infographic', tier: 'advanced', bodyFormat: 'rows', syntax: ':::steps', description: '流程步骤' },
  { id: 'compare', name: '对比', alias: ':::compare', category: 'infographic', tier: 'advanced', bodyFormat: 'rows', syntax: ':::compare', description: '左右或上下对比' },
  // evidence
  { id: 'quote', name: '引用', alias: ':::quote', category: 'evidence', tier: 'advanced', bodyFormat: 'fields', syntax: ':::quote', description: '人物/文献引用块' },
  { id: 'image-text', name: '图文', alias: ':::image-text', category: 'evidence', tier: 'advanced', bodyFormat: 'fields', syntax: ':::image-text', description: '图 + 说明文字' },
  { id: 'image-compare', name: '图片对比', alias: ':::image-compare', category: 'evidence', tier: 'advanced', bodyFormat: 'fields', syntax: ':::image-compare', description: '前后/左右图片对比' },
  { id: 'image-steps', name: '步骤截图', alias: ':::image-steps', category: 'evidence', tier: 'advanced', bodyFormat: 'rows', syntax: ':::image-steps', description: '分步截图说明' },
  { id: 'image-annotate', name: '标注图', alias: ':::image-annotate', category: 'evidence', tier: 'advanced', bodyFormat: 'fields', syntax: ':::image-annotate', description: '带标注点的配图' },
  // conversion
  { id: 'cta', name: '行动号召', alias: ':::cta', category: 'conversion', tier: 'advanced', bodyFormat: 'fields', syntax: ':::cta', description: '文末 CTA 按钮区' },
  { id: 'faq', name: '常见问题', alias: ':::faq', category: 'conversion', tier: 'advanced', bodyFormat: 'rows', syntax: ':::faq', description: '问答列表' },
  { id: 'checklist', name: '检查清单', alias: ':::checklist', category: 'conversion', tier: 'advanced', bodyFormat: 'rows', syntax: ':::checklist', description: '可勾选清单' },
  { id: 'summary', name: '要点总结', alias: ':::summary', category: 'conversion', tier: 'advanced', bodyFormat: 'fields', syntax: ':::summary', description: '章节/全文要点回顾' },
  { id: 'pricing', name: '价格方案', alias: ':::pricing', category: 'conversion', tier: 'advanced', bodyFormat: 'rows', syntax: ':::pricing', description: '套餐/定价对比' },
  { id: 'cases', name: '案例展示', alias: ':::cases', category: 'conversion', tier: 'advanced', bodyFormat: 'rows', syntax: ':::cases', description: '客户/项目案例卡' },
  { id: 'notice', name: '公告提示', alias: ':::notice', category: 'conversion', tier: 'advanced', bodyFormat: 'fields', syntax: ':::notice', description: '重要通知/免责' },
  { id: 'specs', name: '规格参数', alias: ':::specs', category: 'conversion', tier: 'advanced', bodyFormat: 'rows', syntax: ':::specs', description: '产品规格表' },
  { id: 'toolbox', name: '工具箱', alias: ':::toolbox', category: 'conversion', tier: 'advanced', bodyFormat: 'rows', syntax: ':::toolbox', description: '推荐工具/资源列表' },
  { id: 'logos', name: 'Logo 墙', alias: ':::logos', category: 'conversion', tier: 'advanced', bodyFormat: 'rows', syntax: ':::logos', description: '合作方/客户 Logo' },
  // brand
  { id: 'author-card', name: '作者卡', alias: ':::author-card', category: 'brand', tier: 'advanced', bodyFormat: 'fields', syntax: ':::author-card', description: '作者介绍与关注引导' },
  { id: 'people', name: '人物卡', alias: ':::people', category: 'brand', tier: 'advanced', bodyFormat: 'rows', syntax: ':::people', description: '多人物介绍' },
  { id: 'series', name: '系列专栏', alias: ':::series', category: 'brand', tier: 'advanced', bodyFormat: 'fields', syntax: ':::series', description: '连载/专栏入口' },
  { id: 'subscribe', name: '订阅引导', alias: ':::subscribe', category: 'brand', tier: 'advanced', bodyFormat: 'fields', syntax: ':::subscribe', description: '关注/订阅号召' },
  // sprint4 / readability
  { id: 'callout', name: '提示 Callout', alias: ':::callout', category: 'readability', tier: 'standard', bodyFormat: 'fields', syntax: ':::callout', description: 'TIP/NOTE/WARNING 提示' },
  { id: 'definition', name: '术语定义', alias: ':::definition', category: 'readability', tier: 'standard', bodyFormat: 'fields', syntax: ':::definition', description: '概念/术语解释卡' },
  { id: 'question', name: '互动提问', alias: ':::question', category: 'readability', tier: 'standard', bodyFormat: 'fields', syntax: ':::question', description: '向读者抛出问题' },
  { id: 'quote-card', name: '金句卡片', alias: ':::quote-card', category: 'readability', tier: 'standard', bodyFormat: 'fields', syntax: ':::quote-card', description: '短金句高亮卡' },
  { id: 'changelog', name: '更新日志', alias: ':::changelog', category: 'readability', tier: 'advanced', bodyFormat: 'rows', syntax: ':::changelog', description: '版本/时间更新记录' },
  { id: 'comparison-table', name: '对比表', alias: ':::comparison-table', category: 'readability', tier: 'advanced', bodyFormat: 'rows', syntax: ':::comparison-table', description: '多列功能对比表' },
  { id: 'resource-list', name: '资源列表', alias: ':::resource-list', category: 'readability', tier: 'advanced', bodyFormat: 'rows', syntax: ':::resource-list', description: '链接/资料清单' },
  { id: 'stat-row', name: '数据条', alias: ':::stat-row', category: 'readability', tier: 'advanced', bodyFormat: 'rows', syntax: ':::stat-row', description: '横向关键数据条' },
  { id: 'tweet', name: '推文卡', alias: ':::tweet', category: 'readability', tier: 'advanced', bodyFormat: 'fields', syntax: ':::tweet', description: '社交媒体引用样式' },
  // 墨韵扩展（::: 围栏语法）
  { id: 'lead', name: '导语 Lead', alias: ':::lead', category: 'extension', tier: 'standard', bodyFormat: 'fenced', syntax: ':::lead', description: '章节导语强调' },
  { id: 'gallery', name: '图库', alias: ':::gallery', category: 'extension', tier: 'advanced', bodyFormat: 'fenced', syntax: ':::gallery', description: '多图横向并排' },
  { id: 'badges', name: '徽章行', alias: ':::badges', category: 'extension', tier: 'advanced', bodyFormat: 'fenced', syntax: ':::badges', description: '标签徽章组' },
  { id: 'statement', name: '金句', alias: ':::statement', category: 'extension', tier: 'advanced', bodyFormat: 'fenced', syntax: ':::statement', description: '突出金句段落' },
  { id: 'reading-path', name: '阅读路线', alias: ':::reading-path', category: 'extension', tier: 'advanced', bodyFormat: 'fenced', syntax: ':::reading-path', description: '章节导航条' },
  { id: 'breaking', name: '分隔强调', alias: ':::breaking', category: 'extension', tier: 'advanced', bodyFormat: 'fenced', syntax: ':::breaking', description: '章节分隔装饰' },
  { id: 'case-flow', name: '案例流程', alias: ':::case-flow', category: 'extension', tier: 'advanced', bodyFormat: 'fenced', syntax: ':::case-flow', description: '案例步骤流' },
  { id: 'p-title', name: '段落标题', alias: ':::p-title', category: 'extension', tier: 'standard', bodyFormat: 'fenced', syntax: ':::p-title', description: '带编号章节标题' },
  { id: 'title-da01', name: '标题卡 DA01', alias: ':::title-da01', category: 'extension', tier: 'advanced', bodyFormat: 'fenced', syntax: ':::title-da01', description: '经典标题样式' },
]

/** 组件选择器预览区高度（px），与 LayoutModulePreviewThumb、gen:module-thumbs 一致 */
export const LAYOUT_MODULE_PREVIEW_HEIGHT_PX = 152

/** Bump when snippet、渲染器或 normal 主题预览 CSS 变更，并重新执行 gen:module-thumbs */
export const LAYOUT_MODULE_THUMB_VERSION = 3

const MODULE_BY_ID = new Map(LAYOUT_MODULES.map((m) => [m.id, m]))

/** 大纲 layout_hint 推荐值（按类别分组，供 AI 与运营参考） */
export const LAYOUT_HINT_GROUPS: { label: string; ids: string[] }[] = [
  { label: '开篇', ids: ['hero', 'cards', 'toc', 'label-title'] },
  { label: '判断/观点', ids: ['verdict', 'manifesto', 'bridge', 'audience-fit', 'myth-fact', 'statement'] },
  { label: '结构/数据', ids: ['timeline', 'steps', 'compare', 'metrics', 'infographic', 'stat-row'] },
  { label: '证据/引用', ids: ['quote', 'quote-card', 'image-text', 'gallery'] },
  { label: '转化/收尾', ids: ['cta', 'faq', 'summary', 'checklist', 'subscribe'] },
  { label: '可读性', ids: ['callout', 'lead', 'definition', 'question', 'notice', 'breaking'] },
  { label: '品牌/案例', ids: ['author-card', 'cases', 'series', 'case-flow'] },
]

export const LAYOUT_HINT_IDS: string[] = LAYOUT_MODULES.map((m) => m.id)

const LAYOUT_TIER_RANK: Record<LayoutTier, number> = { gfm: 0, standard: 1, advanced: 2 }

export function layoutTierRank(tier: LayoutTier): number {
  return LAYOUT_TIER_RANK[tier]
}

/** 用户 layoutTier 是否可使用该模块 tier */
export function canAccessLayoutTier(userTier: LayoutTier, moduleTier: LayoutTier): boolean {
  return LAYOUT_TIER_RANK[userTier] >= LAYOUT_TIER_RANK[moduleTier]
}

export function modulesForTier(tier: LayoutTier): LayoutModuleMeta[] {
  const max = LAYOUT_TIER_RANK[tier]
  return LAYOUT_MODULES.filter((m) => LAYOUT_TIER_RANK[m.tier] <= max)
}

export function layoutModuleById(id: string): LayoutModuleMeta | undefined {
  return MODULE_BY_ID.get(id)
}

export function layoutHintLabel(id: string): string {
  return MODULE_BY_ID.get(id)?.name ?? id
}

/** 扁平 layout_hint 中文标签表 */
export const LAYOUT_HINT_LABELS: Record<string, string> = Object.fromEntries(
  LAYOUT_MODULES.map((m) => [m.id, m.name]),
)
