/**
 * AI 排版 · 本地草稿默认样板
 * 覆盖常用 Markdown / GFM 语法，便于切换主题对照预览效果。
 * AI 靛紫主题会读取 frontmatter 生成文首渐变封面。
 * 排版组件语法见「语法手册」与「插入组件」工具栏（::: 围栏）。
 */
export const STUDIO_SAMPLE_MARKDOWN = `---
heroTag: 排版样板
heroTitle: Markdown 排版实验室
heroSubtitle: 汇集标题、列表、表格、代码与引用等语法，右侧切换主题即可对照公众号成稿效果
heroTags: DeepSeek-V4-Pro, 永久降价, Coding Plan, API 价格, 缓存命中, 性价比
---

# 一级标题示例

在 **AI 靛紫** 主题下，文首以 YAML 封面为准；其它主题会正常渲染此一级标题。

## 正文与强调

这是一段普通段落，用于观察行高、字色与段间距。支持 **粗体**、*斜体*、***粗斜体***、~~删除线~~、\`行内代码\` 以及 [外部链接](https://github.com)。

## 引用与分割线

> 引用块适合摘录观点、提示或金句。  
> 支持多行引用，观察左侧竖线与背景样式。

---

## 无序与有序列表

- 一级条目：选题与结构
  - 嵌套条目：细化小节
  - 嵌套条目：补充案例
- 一级条目：成稿与排版

1. 撰写 Markdown 正文
2. 选择右侧预览主题
3. 复制 HTML 或导出到公众号

## 任务列表（GFM）

- [x] 实时预览已开启
- [x] 支持多主题切换
- [ ] 按需保存到云端文章

## 代码块

\`\`\`typescript
interface PreviewOptions {
  themeId: string
  markdown: string
}

function render(opts: PreviewOptions): string {
  return buildHtml(opts.markdown, opts.themeId)
}
\`\`\`

\`\`\`bash
cd frontend && npm run build
\`\`\`

## 表格

| 元素 | 说明 | 对齐示例 |
| :--- | :--- | :---: |
| 标题 | h1–h6 层级与主题色 | 左 |
| 列表 | 有序 / 无序 / 任务 | 中 |
| 代码 | 行内与围栏高亮 | 右 |

## 标题层级

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题

## 图片

![示例配图 600×320](https://picsum.photos/seed/awp-studio-sample/600/320)

---

*提示：切换 **AI 靛紫** 可预览渐变封面、标签胶囊与文末互动 CTA；YAML 支持 \`heroTags\`、\`ctaTitle\`，\`cta: false\` 可关闭文末块。*
`
