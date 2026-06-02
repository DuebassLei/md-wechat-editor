/** 全量 ::: 排版模块演示稿（本地样板 / 手册对照） */
export const MODULE_SAMPLE_MARKDOWN = `:::hero
eyebrow: DEMO
title: 墨韵简排 · ::: 语法演示
subtitle: 常用 Markdown + 排版模块围栏
chips: 组件|预览|复制
:::

:::reading-path
:::

:::p-title
num: 01
title: 开篇与引导
subtitle: OPENING
level: 1
:::

:::lead
带色条的导语：适合章节承上启下，支持行内 **粗体** 与 ==重点==。
:::

:::statement
居中金句：结构清晰比装饰堆砌更重要。
:::

:::compare 方案 A | 方案 B
✘ 手工排版慢 | 每次调格式费时
✔ 一键模块 | 30 秒出稿
:::

:::compare left-label="BEFORE" left-title="旧流程" right-label="AFTER" right-title="新流程"
---left---
多段 **Markdown** 左侧正文
---right---
多段 *Markdown* 右侧正文
:::

:::steps label="HOW IT WORKS" title="三步完成排版" active="2"
输入 | 撰写 Markdown
预览 | 切换主题对照
输出 | 复制公众号 HTML
:::

:::timeline
2024-01 | 立项 | 确定产品方向
2024-06 | 上线 | 核心编辑器发布
:::

:::breaking
badge: NEW
title: 版本更新摘要
subtitle: 全面采用 ::: 围栏语法
正文：不再支持独立 XML 标签，请使用插入组件或语法手册。
:::

:::callout
title: 提示
body: 亦可用引用块写法：> [TIP] 操作小贴士
:::

:::gallery
![图1](https://picsum.photos/400/200?random=1), ![图2](https://picsum.photos/400/200?random=2)
:::

:::badges tone="accent"
Vue|TypeScript|公众号
:::

:::case-flow
- [案例 01] 排版效率：编辑时间缩短 60%
- [案例 02] 样式一致：主题统一输出
:::

:::faq[常见问题]
模块语法是什么？ | 使用 :::名称 围栏，闭合行写 :::
如何插入？ | 点击「插入组件」写入光标处
:::

:::cta label="GET STARTED" title="准备好发布了吗？" button="复制 HTML"
:::
`
