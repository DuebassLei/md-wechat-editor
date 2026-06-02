/**
 * 墨韵简排 · ::: 排版模块语法速查（与引擎解析器对齐）
 */

export interface ModuleSyntaxItem {
  title: string
  description?: string
  syntax: string
  note?: string
}

export interface ModuleSyntaxSection {
  id: string
  title: string
  subtitle?: string
  items: ModuleSyntaxItem[]
}

export const MODULE_SYNTAX_SECTIONS: ModuleSyntaxSection[] = [
  {
    id: 'start',
    title: '文首与导航',
    subtitle: '封面、阅读路线',
    items: [
      {
        title: '文章封面 hero',
        description: '文首大卡片，支持阅读时长统计样式',
        syntax: `:::hero
eyebrow: GUIDE
title: 主标题文字
subtitle: 副标题说明
chips: 标签1|标签2|标签3
:::`,
      },
      {
        title: '阅读路线',
        description: '根据文中一级 :::p-title 自动生成章节导航',
        syntax: `:::reading-path
:::`,
        note: '须放在文首，且正文中有多个一级 :::p-title',
      },
      {
        title: 'YAML frontmatter',
        description: '文首 YAML 会自动转为 :::hero 围栏',
        syntax: `---
badge: GUIDE
title: 主标题
subtitle: 副标题
chips: 标签1|标签2
---`,
      },
    ],
  },
  {
    id: 'inline',
    title: '行内修饰',
    subtitle: '在段落、列表内使用',
    items: [
      { title: '渐变背景', syntax: '==渐变重点文字==' },
      { title: '胶囊标签', syntax: '!!胶囊标签文字!!' },
      { title: '主题色强调', syntax: '^^加重强调^^' },
      { title: '柔光重点', syntax: '::柔光重点::' },
      { title: '粗体 / 斜体', syntax: '**粗体**  *斜体*  ***粗斜***' },
      { title: '下划线', syntax: '__下划线__' },
      { title: '删除线', syntax: '~~删除线~~' },
      { title: '行内代码', syntax: '`code`' },
      { title: '链接', syntax: '[链接文字](https://example.com)' },
    ],
  },
  {
    id: 'images',
    title: '图片',
    items: [
      {
        title: '普通图片',
        syntax: '![说明文字](https://example.com/image.webp)',
      },
      {
        title: '限宽 + 限高（窗口内滚动）',
        description: '方括号内为 宽度 高度，高度超出可滚动',
        syntax: '![长图](https://example.com/long.webp)[100% 250px]',
      },
      {
        title: '多图横向并排',
        description: ':::gallery 围栏，图片用逗号分隔',
        syntax: `:::gallery
![图1](url1.webp), ![图2](url2.webp), ![图3](url3.webp)
:::`,
      },
    ],
  },
  {
    id: 'p-title',
    title: '段落标题',
    subtitle: ':::p-title 或 # 标题',
    items: [
      {
        title: '一级段落标题',
        syntax: `:::p-title
num: 01
title: 章节名
subtitle: EN · 副标题
level: 1
:::`,
      },
      {
        title: '二至四级',
        syntax: `:::p-title
num: 02
title: 小节标题
level: 2
prefix: 🔥
suffix: 🔥
:::`,
        note: '可选 color、num-color、subtitle-color 等字段',
      },
    ],
  },
  {
    id: 'module',
    title: '结构化模块',
    subtitle: ':::模块名 围栏语法',
    items: [
      {
        title: 'VS 对比 compare',
        syntax: `:::compare 方案 A | 方案 B
✘ 缺点 | 说明 | ✔ 优点 | 说明
:::`,
      },
      {
        title: '时间线 timeline',
        syntax: `:::timeline
2024-01 | 里程碑 | 说明文字
2024-06 | 上线 | 核心功能发布
:::`,
      },
      {
        title: '步骤 steps',
        syntax: `:::steps
步骤一 | 说明
步骤二 | 说明
:::`,
      },
      {
        title: 'FAQ 问答',
        syntax: `:::faq[常见问题]
问题一？ | 回答一
问题二？ | 回答二
:::`,
      },
      {
        title: '结论 verdict',
        syntax: `:::verdict
title: 核心结论
body: 一两句话给出判断。
:::`,
      },
    ],
  },
  {
    id: 'components',
    title: '扩展组件',
    subtitle: '墨韵 ::: 围栏',
    items: [
      {
        title: '突发摘要 breaking',
        syntax: `:::breaking
badge: NEW
title: 标题
subtitle: 副标题
chips: 高效|美观
正文摘要段落
:::`,
      },
      {
        title: '提示框 callout',
        syntax: `:::callout
title: 操作提示
body: 正文说明
:::`,
        note: '亦可用 GFM：> [TIP] 提示正文',
      },
      {
        title: '案例流 case-flow',
        syntax: `:::case-flow
- [案例 01] 标题：详细说明文字
- [案例 02] 标题：详细说明文字
:::`,
      },
      {
        title: '标签徽章 badges',
        syntax: `:::badges tone="accent"
Vue|TypeScript|Vite
:::`,
      },
      {
        title: '富文本对比 compare',
        description: '长文左右栏，分区标记 ---left--- / ---right---',
        syntax: `:::compare left-label="BEFORE" left-title="旧版" right-label="AFTER" right-title="新版"
---left---
左侧 Markdown
---right---
右侧 Markdown
:::`,
      },
    ],
  },
  {
    id: 'text-blocks',
    title: '文字块',
    items: [
      {
        title: '居中金句 statement',
        syntax: `:::statement
这是一段居中的强调文字。
:::`,
      },
      {
        title: '引导段落 lead',
        syntax: `:::lead
带左侧色条的引导段落，适合引言。
:::`,
      },
      {
        title: '引用块',
        syntax: '> 普通引用段落，支持 **行内修饰**',
      },
      {
        title: '分割线',
        syntax: '---',
      },
    ],
  },
  {
    id: 'ending',
    title: '行动与结尾',
    items: [
      {
        title: '行动召唤 CTA',
        syntax: `:::cta label="GET STARTED" title="准备好了吗？" button="立即行动"
:::`,
      },
      {
        title: '文末互动 engage',
        syntax: `:::engage
title: 感谢阅读，欢迎点赞转发！
label: THANKS FOR READING
:::`,
      },
    ],
  },
  {
    id: 'gfm',
    title: '标准 Markdown',
    subtitle: '与 GFM 一致',
    items: [
      { title: '标题', syntax: '# 一级\n## 二级\n### 三级' },
      { title: '列表', syntax: '- 无序\n1. 有序\n- [x] 任务' },
      {
        title: '代码块',
        syntax: '```javascript\nconst x = 1\n```',
      },
      {
        title: '表格',
        syntax: '| 列1 | 列2 |\n| --- | --- |\n| A | B |',
      },
    ],
  },
]

/** @deprecated 使用 MODULE_SYNTAX_SECTIONS */
export const R_MARKDOWN_SYNTAX_SECTIONS = MODULE_SYNTAX_SECTIONS

export type RMarkdownSyntaxItem = ModuleSyntaxItem
export type RMarkdownSyntaxSection = ModuleSyntaxSection
