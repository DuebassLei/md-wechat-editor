/** 对齐 MD2Card 编辑器语法帮助 */
export interface CardSyntaxItem {
  title: string
  syntax: string
  note?: string
}

export const CARD_SYNTAX_SECTIONS: { title: string; items: CardSyntaxItem[] }[] = [
  {
    title: '排版技巧',
    items: [
      {
        title: '简单换行（软换行）',
        syntax: '第一行文字··\n第二行仍在同一段落',
        note: '行末输入两个空格再回车，渲染为 <br>，不新开段落',
      },
      {
        title: '段落分段',
        syntax: '第一段\n\n第二段',
        note: '段落之间留一个空行',
      },
      {
        title: '强制多空行',
        syntax: '上行文字<br/>\n<br/>\n下行文字',
        note: '使用 <br/> 叠加精确控制垂直留白',
      },
      {
        title: '排版对齐',
        syntax: '&ensp;半角缩进\n&emsp;全角缩进',
        note: '结合半角 / 全角空格微调对齐',
      },
    ],
  },
  {
    title: '基础 Markdown',
    items: [
      { title: '标题', syntax: '# 一级标题\n## 二级标题\n### 三级标题' },
      { title: '粗体', syntax: '**粗体文字**' },
      { title: '斜体', syntax: '*斜体文字*' },
      { title: '删除线', syntax: '~~删除线~~' },
      { title: '高亮', syntax: '==高亮重点==' },
      { title: '链接', syntax: '[链接文字](https://example.com)' },
      { title: '图片', syntax: '![描述文字](https://example.com/image.jpg)' },
      { title: '行内代码', syntax: '`code`' },
      { title: '代码块', syntax: '```javascript\nconst x = 1\n```' },
      { title: '引用', syntax: '> 引用段落' },
      { title: '无序列表', syntax: '- 列表项\n- 列表项' },
      { title: '有序列表', syntax: '1. 第一项\n2. 第二项' },
      { title: '任务列表', syntax: '- [x] 已完成\n- [ ] 待办' },
      { title: '表格', syntax: '| 列1 | 列2 |\n| --- | --- |\n| A | B |' },
      {
        title: '分割线',
        syntax: '---',
        note: '横线拆分模式下为拆页符；其它模式下为视觉分割线',
      },
    ],
  },
  {
    title: '增强模式（MDX 子集）',
    items: [
      {
        title: '开启方式',
        syntax: '右侧设置 → 增强模式（MDX）',
        note: '对齐 MD2Card mdxMode；关闭时公式与 JSX 样式按原文显示',
      },
      {
        title: '行内公式',
        syntax: '质能方程 $E = mc^2$ 在正文行内',
      },
      {
        title: '块级公式',
        syntax: '$$\n\\sum_{i=1}^n i = \\frac{n(n+1)}{2}\n$$',
      },
      {
        title: 'JSX 居中诗体',
        syntax: '<p style={{ fontFamily: "字语青梅硬笔", fontSize:"32px", textAlign:"center" }}>\n诗句第一行\n诗句第二行\n</p>',
      },
      {
        title: 'font 标签',
        syntax: '<font color="red">红色</font>\n<font size="5">较大字号</font>',
      },
    ],
  },
  {
    title: '分页与封面',
    items: [
      {
        title: '横线拆页',
        syntax: '---',
        note: '独占一行；须切换「横线拆分」模式',
      },
      {
        title: '显式拆页',
        syntax: ':::page',
        note: '独占一行，效果同 ---',
      },
      {
        title: '封面 YAML（完整）',
        syntax: `---
title: 主标题
description: 副标题说明
tags: 标签1, 标签2
date: 2025-03-08
image: https://example.com/cover.jpg
layout: overlay
badge: KNOWLEDGE
hook: 一句 slogan
brand: 你的品牌
---`,
        note: 'layout: overlay（竖图叠字）| separate（横图分离）；配合封面首图开关',
      },
    ],
  },
  {
    title: '拆分模式说明',
    items: [
      { title: '长图文', syntax: '整篇内容输出为单张卡片', note: '适合短内容或长图模式' },
      { title: '自动拆分', syntax: '内容超出单卡高度时自动分页', note: '默认推荐' },
      { title: '横线拆分', syntax: '先按 --- 分段，每段再自动分页', note: '章节化内容首选' },
    ],
  },
]
