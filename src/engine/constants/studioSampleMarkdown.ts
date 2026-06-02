/**
 * AI 排版 · 本地草稿默认样板
 * 覆盖常用 Markdown 语法，便于切换主题对照预览效果。
 * 不含文首 YAML；AI 靛紫无 YAML 时用一级标题生成封面；文首 YAML/标签等请用「插入组件」中的 AI 靛紫文首。
 * 排版组件语法见「语法手册」与「插入组件」工具栏（::: 围栏）。
 */
export const STUDIO_SAMPLE_MARKDOWN = `# 一级标题示例

在 **AI 靛紫** 主题下，无 YAML 时以本一级标题生成文首封面；其它主题正常渲染此标题。需要完整封面与标签胶囊时，用「插入组件」→ **AI 靛紫文首**。

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

## 任务列表

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

*提示：切换 **AI 靛紫** 可用一级标题预览封面，或用「AI 靛紫文首」插入 YAML。文末互动需启用 engage 插件后插入。*
`
