import type { CardAspect } from '@/engine/card-export/types'
import type { CardSplitMode } from './constants'
import type { CardThemeId } from './cardThemes/types'

export type CardStudioTemplateId =
  | 'overview'
  | 'science'
  | 'poetry'
  | 'vocabulary'
  | 'math'
  | 'xhs-series'

export interface CardStudioTemplate {
  id: CardStudioTemplateId
  label: string
  desc: string
  markdown: string
  themeId: CardThemeId
  splitMode: CardSplitMode
  includeCover: boolean
  richContent?: boolean
}

export const CARD_STUDIO_TEMPLATES: CardStudioTemplate[] = [
  {
    id: 'overview',
    label: '功能概览',
    desc: '知识卡片基础能力演示',
    themeId: 'minimal-light',
    splitMode: 'autoSplit',
    includeCover: true,
    markdown: `---
brand: 墨韵简排
badge: KNOWLEDGE
title: 知识卡片示例
subtitle: Markdown 转知识卡片，实时预览、主题套用、一键导出
hook: 左侧编辑 · 中间预览 · 右侧选主题
chips: 知识卡|Markdown|主题商店
---

# 知识卡片

> 墨韵简排知识卡片支持标准 Markdown，可将长文自动拆分为多张社交分享图。

![](https://picsum.photos/600/300)

## 主要功能

1. **知识卡片**：将 Markdown 渲染为精美卡片
2. **多种主题**：30 套主题含 16 套 Canva 小红书精选
3. **自动拆分**：内容超出单卡高度时自动分页
4. **横线拆分**：使用 \`---\` 手动分段后再分页
5. **封面首图**：YAML frontmatter 驱动封面大字报
6. **一键导出**：PNG 单张或 ZIP 打包

## 排版技巧演示

软换行（行末两空格）：  
仍在本段落内

&emsp;全角缩进一段示例文字

==高亮重点== 可直接在正文使用

<br/>
<br/>

上方通过 \`<br/>\` 增加了额外留白

---

\`\`\`js
const card = { theme: 'minimal-light', splitMode: 'autoSplit' }
console.log(card)
\`\`\`

| 模式 | 说明 |
|------|------|
| 长图文 | 单卡输出 |
| 自动拆分 | 按高度分页 |
| 横线拆分 | 按 --- 分段 |

- [x] 支持任务列表
- [ ] 待办事项
`,
  },
  {
    id: 'science',
    label: 'AI 科普卡',
    desc: 'DeepSeek 生成 + 横线拆分多卡（Sky 快速上手）',
    themeId: 'minimal-dark',
    splitMode: 'hrSplit',
    includeCover: true,
    markdown: `---
title: AI 知识科普：3 分钟读懂大模型
description: 用类比和场景，把复杂概念讲清楚
tags: AI科普, DeepSeek, 知识卡片
date: 2025-03-08
image: https://images.unsplash.com/photo-1484766280341-87861644c80d?w=880&auto=format&fit=crop
layout: overlay
badge: SCIENCE
hook: 收藏备用 · 转发给需要的朋友
brand: 墨韵简排
---

# 🤖 大模型是什么？

> 把它想象成「读过整个图书馆的超级实习生」——不会真正理解，但擅长根据读过的内容组织回答。

💭 **思考**：你第一次听说 AI 是在什么场景？

---

## 🧠 知识点一：它怎么「想」？

大模型本质是 **概率预测**：根据上文，猜下一个最可能出现的词。

- **有趣的类比**：像手机输入法的联想，只是词库换成了全人类文本
- **应用场景**：写邮件、改简历、翻译、整理笔记
- **互动引导**：👉 评论区说说你最常用 AI 做什么

---

## ⚡ 知识点二：为什么会「胡说」？

这叫 **幻觉**——模型在不确定时仍会自信地编造。

- **有趣的类比**：考试时不会也要把空填满的学生
- **应用场景**：查资料务必二次核实；适合头脑风暴而非当事实库
- **互动引导**：💭 你遇到过 AI 一本正经说错话吗？

---

## 🛠️ 知识点三：普通人怎么用？

**三步工作流**（对齐 Sky 文档）：

1. 用 DeepSeek 按提示词生成 Markdown 科普稿
2. 粘贴到知识卡片编辑器，选「暗黑科技」类主题
3. 用 \`---\` 横线拆分 + 导出 ZIP 发小红书

| 步骤 | 耗时 |
|------|------|
| AI 生成 | ~2 分钟 |
| 排版导出 | ~1 分钟 |

---

## 📌 今日小结

- 大模型 = 超强文本联想，不是全知真理
- 会幻觉，关键信息要核实
- **DeepSeek 写稿 + 知识卡片排版** = 小红书科普捷径

💭 还想听哪个 AI 概念？评论区点名，下期做成卡片系列～
`,
  },
  {
    id: 'poetry',
    label: '古诗卡',
    desc: '一诗一图一解读（Sky 语文场景）',
    themeId: 'xhs-poetic-mist',
    splitMode: 'autoSplit',
    includeCover: true,
    richContent: true,
    markdown: `---
title: 《问刘十九》
badge: 古诗
subtitle: 白居易 · 唐代
hook: 绿蚁新醅酒，红泥小火炉
chips: 语文|诗词|沉浸式
brand: 墨韵简排
---

# 《问刘十九》

### 白居易〔唐代〕

<p style={{ fontFamily: "LXGW WenKai, serif", fontSize:"28px", textAlign:"center" }}>
绿蚁新醅酒，<br/>
红泥小火炉。<br/>
晚来天欲雪，<br/>
能饮一杯无？
</p>

![](https://picsum.photos/seed/poetry-warm/600/360)

**诗意：**

新酿的米酒泛起绿色泡沫，红泥小炉烧得正旺。天快黑了，大雪将至，能否共饮一杯暖酒？

**意象速记：**

| 意象 | 含义 |
|------|------|
| 绿蚁 | 新酒面上的微沫 |
| 红泥炉 | 冬日暖意 |
| 天欲雪 | 将至的寒冷，反衬酒温 |

**课堂提问：**

💭 诗人为什么选在「欲雪」之夜邀人饮酒，而不是晴天？

> 提示：可从「冷暖对比」「友情」「生活节奏」三个角度思考。
`,
  },
  {
    id: 'vocabulary',
    label: '英语单词卡',
    desc: '音标 + 释义 + 词根 + 例句 + 选择题（Sky 英语场景）',
    themeId: 'minimal-light',
    splitMode: 'hrSplit',
    includeCover: true,
    markdown: `---
title: 英语单词卡
brand: 墨韵简排
---

## remarkable

/rɪˈmɑːrkəbl/

**释义**

非凡的；显著的

**词根解析**

remark（注意）+ able（能够）→ 值得注意的 → 非凡的

**例句**

He made **remarkable** progress in his studies.

---

## invitation

/ˌɪnvɪˈteɪʃən/

**释义**

邀请；请帖

**词根解析**

来自拉丁语 *invitare*「邀请」

**例句**

Everyone should try to get an **invitation** code.

---

# My Favorite Season

# 我最喜欢的季节

In a year, there are four seasons: spring, summer, autumn and winter. My favorite season is **autumn**.

一年有四季：春、夏、秋、冬。我最喜欢的季节是**秋天**。

The weather in autumn is cool and comfortable. The leaves turn golden and red, falling like butterflies dancing in the wind.

秋天的天气凉爽宜人。树叶变成金黄色和红色，像蝴蝶一样在风中飞舞飘落。

---

### 1. What is the writer's favorite season?

- A. Spring
- B. Summer
- C. **Autumn** ✅
- D. Winter

**解析（Analysis）：**

文中明确提到 "My favorite season is **autumn**."

---

### 2. Why does the writer like autumn? (可多选)

- A. **The weather is cool and comfortable.** ✅
- B. **They can eat sweet persimmons.** ✅
- C. The snow is beautiful.
- D. **They go hiking with family.** ✅

**解析（Analysis）：**

短文提到秋天凉爽宜人、有柿子吃、全家爬山，但未提及下雪。
`,
  },
  {
    id: 'math',
    label: '数学公式卡',
    desc: 'LaTeX 行内/块级公式（Sky 数学场景）',
    themeId: 'minimal-light',
    splitMode: 'hrSplit',
    includeCover: false,
    richContent: true,
    markdown: `# 数学公式

## 1. 行内公式

这是一个行内公式：$E = mc^2$，显示在文本中。

## 2. 块级公式

求和公式：

$$
\\sum_{i=1}^n i = \\frac{n(n+1)}{2}
$$

---

## 常用符号

| 类型 | 语法 | 示例 |
|------|------|------|
| 分数 | \`\\\\frac{a}{b}\` | $\\frac{a}{b}$ |
| 根号 | \`\\\\sqrt{x}\` | $\\sqrt{x}$ |
| 希腊字母 | \`\\\\alpha\` | $\\alpha$ |
`,
  },
  {
    id: 'xhs-series',
    label: '小红书多卡笔记',
    desc: '按 tsc 规范：YAML 封面 + --- 横线拆卡 + 配图建议',
    themeId: 'minimal-light',
    splitMode: 'hrSplit',
    includeCover: true,
    markdown: `---
title: 5步把长文变多卡笔记
description: 结构化 Markdown + 横线拆分，快速产出小红书 3:4 图文系列
tags: 小红书, 知识卡片, Markdown排版
date: 2026-06-19
image: https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=880&auto=format&fit=crop
layout: overlay
badge: XHS
hook: 长文不用删，拆开就能发
chips: 小红书|多卡笔记|排版
brand: 墨韵简排
---

# 5步把长文变多卡笔记

> 长文干货不必压成一条——**拆成系列图文卡**，阅读完成率往往更高。

[配图建议：书桌 + 笔记本电脑 + 便签纸，暖色调简约工作场景]

---

## 第1步：先写封面元数据

顶部 YAML 决定封面大字报与社交分享文案：

- \`title\`：20 字内 + 领域关键词
- \`description\`：一句话说清笔记价值
- \`layout: overlay\`：配图叠加大标题

💡 ==封面决定点击率==，其余卡片负责留住读者。

---

## 第2步：横线切分每张卡

每张卡之间用 \`---\` 隔开，**上下各空一行**：

| 卡片类型 | 标题 | 字数 |
|----------|------|------|
| 封面/引言 | \`#\` | ~50 字 |
| 核心信息 | \`##\` | 100–150 字 |
| 总结/CTA | \`##\` | ~80 字 |

> 信息太密？**再拆一张卡**，宁可多图也别挤满一屏。

---

## 第3步：排版拉满视觉节奏

纯文本也能有设计感：

1. **加粗** 关键词，\`*斜体*\` 做语气
2. \`行内代码\` 标记术语
3. \`>\` 引用块突出金句
4. ==高亮== 标重点
5. 适量 Emoji ✨💡📌（每条 1–2 个）

<br/>

&emsp;空行与缩进能增加**呼吸感**，3:4 竖图才不显拥挤。

---

## 第4步：编辑器设置对齐

墨韵简排知识卡片建议：

- **尺寸**：小红书 \`330×440\`
- **拆分**：选「横线拆分」，与 \`---\` 分段一致
- **主题**：干货用笔记本风，文艺用诗意朦胧

---

## 今天就能开始的清单

- [x] 长文按 \`---\` 手动分段
- [x] 封面补 \`[配图建议]\` 与 \`image\` 地址
- [ ] 换主题 → 导出 ZIP 发笔记

**收藏本模板**，把原文贴进左侧编辑器，改一版即可出图。

#小红书排版 #知识卡片 #长文拆解 #墨韵简排
`,
  },
]

const TEMPLATE_MAP = new Map(CARD_STUDIO_TEMPLATES.map((t) => [t.id, t]))

export function getCardStudioTemplate(id: CardStudioTemplateId): CardStudioTemplate | undefined {
  return TEMPLATE_MAP.get(id)
}

/** 默认空内容时加载的模板 */
export const CARD_STUDIO_DEFAULT_TEMPLATE_ID: CardStudioTemplateId = 'overview'

/** 兼容旧导出 */
export const CARD_STUDIO_SAMPLE =
  getCardStudioTemplate('overview')?.markdown ?? CARD_STUDIO_TEMPLATES[0].markdown
