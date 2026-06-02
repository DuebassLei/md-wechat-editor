# 墨韵简排

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GitHub](https://img.shields.io/badge/GitHub-md--wechat--editor-181717?logo=github)](https://github.com/DuebassLei/md-wechat-editor)

**写好 Markdown，简排进公众号。**

纯前端的微信公众号排版工作室：在浏览器里写完、预览、复制内联 HTML，粘贴到 [微信公众平台](https://mp.weixin.qq.com) 即可发布。无需登录，文稿留在本地。

---

## 功能预览

| 排版工作室 | 插入组件 | 产品介绍 |
|:---:|:---:|:---:|
| ![编辑区、文档侧栏与手机预览](docs/assets/readme-studio.png) | ![按分类浏览 53 种 ::: 模块](docs/assets/readme-modules.png) | ![核心能力与上手步骤](docs/assets/readme-landing.png) |

截图位于 `docs/assets/`（本地 `npm run dev` 截取，可自行替换更新）。

---

## 适合谁用

| 场景 | 你能得到什么 |
|------|----------------|
| 技术/产品公众号运营 | 用熟悉的 Markdown 写作，输出符合公众号样式的排版 |
| 自媒体创作者 | Hero、时间轴、对比、FAQ 等组件开箱即用，少在编辑器里手工调格式 |
| 团队内容协作 | 本地文档列表，支持导入/导出 `.md`，版本与草稿可自控 |
| 从 AI 写作链路来的作者 | 在墨韵主站生成正文后，用本工具做「最后一公里」排版与出稿 |

---

## 核心能力

- **常用 Markdown** — 标题、列表、表格、任务列表、代码块等写作语法完整支持  
- **`:::module` 排版围栏** — 53 种排版组件（封面、步骤、对比、时间轴、CTA、FAQ 等），点击「插入组件」即可写入光标  
- **多套排版主题** — 39 套主题实时切换，右侧手机框预览，所见即所得  
- **一键复制公众号 HTML** — 经 juice 内联样式，直接粘贴公众平台正文编辑器  
- **语法手册内置** — 应用内可查全量模块说明，不必翻外部文档  
- **界面配色** — 9 套强调色 + 浅色/深色/跟随系统外观，下拉即换，长时间编辑更舒适  

---

## 五分钟上手

```
1. 打开编辑器 → 输入或粘贴 Markdown
2. 用「插入组件」添加 :::hero、:::steps、:::compare 等模块
3. 切换排版主题 → 对照右侧预览
4. 点击「复制公众号 HTML」
5. 登录微信公众平台 → 正文编辑器粘贴发布
```

文首也可用 YAML frontmatter，保存时会自动转为 `:::hero`：

```markdown
---
badge: GUIDE
title: 文章主标题
subtitle: 一句话说明
chips: 标签1|标签2
---

正文从这里开始……
```

更完整的模块列表与字段说明见 [docs/LAYOUT_SYNTAX.md](docs/LAYOUT_SYNTAX.md)；应用内 **语法手册** 与 **插入组件** 与引擎保持同步。

---

## 排版组件速查

共 **53** 种 `:::module` 围栏，按内容结构分类（与「插入组件」面板一致）：

| 分类 | 模块（`:::id` · 中文名） |
|------|--------------------------|
| 开篇 | `hero` 封面 · `cards` 要点卡片 · `label-title` 标签标题 · `part` 分篇 · `toc` 目录 |
| 判断与观点 | `verdict` 最终判断 · `manifesto` 宣言 · `bridge` 过渡 · `audience-fit` 读者适配 · `myth-fact` 误区澄清 |
| 结构与数据 | `timeline` 时间轴 · `steps` 步骤 · `compare` 对比 · `metrics` 核心数据 · `infographic` 信息图 · `stat-row` 数据条 |
| 证据与配图 | `quote` 引用 · `gallery` 图库 · `image-text` 图文 · `image-compare` 图片对比 · `image-steps` 步骤截图 |
| 转化与收尾 | `cta` 行动号召 · `faq` 常见问题 · `checklist` 清单 · `summary` 总结 · `pricing` 定价 · `cases` 案例 · `notice` 公告 |
| 可读性 | `callout` 提示 · `lead` 导语 · `definition` 术语 · `quote-card` 金句卡 · `comparison-table` 对比表 · `changelog` 更新日志 |
| 品牌与人物 | `author-card` 作者卡 · `people` 人物卡 · `series` 专栏 · `subscribe` 订阅引导 |
| 墨韵扩展 | `p-title` 段落标题 · `reading-path` 阅读路线 · `statement` 金句 · `breaking` 分隔强调 · `case-flow` 案例流程 · `badges` 徽章行 |

**39** 套排版主题（默认、山吹、全栈蓝、凝夜紫、微信格式及 Pro 系列等）在编辑器顶栏切换，与模块独立组合。

---

## 排版语法一览

本工具只使用 **常用 Markdown** + **`:::名称` 围栏**，不依赖第三方 R-Markdown 或 XML 标签。

```markdown
:::hero
eyebrow: GUIDE
title: 主标题
subtitle: 副标题
chips: 标签1|标签2
:::

:::steps label="流程" title="三步出稿" active="2"
撰写 | 写 Markdown
预览 | 切换主题对照
发布 | 复制 HTML 粘贴公众号
:::

:::compare 方案 A | 方案 B
✘ 手工排版慢 | 每次调格式费时
✔ 模块语法 | 结构清晰、样式统一
:::
```

闭合行必须是单独的 `:::`。检测到旧版 XML 标签时，编辑器会提示并可尝试自动转换。

---

## 与墨韵 AI 写作平台

| | 墨韵简排（本仓库） | 墨韵主站写作链路 |
|--|-------------------|------------------|
| 定位 | 排版工作室 | 选题、生成、润色 |
| AI 写作 | 不含 | 含 |
| 账号 / 积分 / 云同步 | 不含 | 含 |
| 数据 | 浏览器本地 | 平台侧 |

本工具专注「从 Markdown 到可粘贴的公众号 HTML」；若需要 AI 选题与正文生成，请使用墨韵主站，再导入本工具排版。

---

## 在线体验与源码

- **GitHub Pages**（推送 `main` 后自动部署）：`https://<user>.github.io/md-wechat-editor/`  
- **源码仓库**：<https://github.com/DuebassLei/md-wechat-editor>  

本地一键启动：

```bash
npm install
npm run dev
```

---

## 开发者

| 命令 | 说明 |
|------|------|
| `npm run dev` | 本地开发 |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览构建产物 |
| `npm run test:engine` | 排版引擎冒烟测试 |
| `npm run bench:picker` | 单模块预览渲染 P95 基准（开发） |
| `npm run gen:module-thumbs` | 生成「插入组件」静态缩略图 PNG |
| `npm run lint` | ESLint |

**组件缩略图**：修改排版模块或 `normal` 主题预览样式后，递增 `src/engine/constants/layoutModules.ts` 中的 `LAYOUT_MODULE_THUMB_VERSION`，然后执行 `npx playwright install chromium`（首次）与 `npm run gen:module-thumbs`。

**弹层性能探针**（开发）：控制台执行 `localStorage.setItem('mdwe:picker-perf','1')` 后打开「插入组件」，用 `__pickerPerfReport()` 查看打开/首图耗时。

**技术栈**：Vue 3 · Vite · Tailwind · CodeMirror 6 · marked · juice  

**引擎**：`src/engine/` 独立维护 Markdown → 微信 HTML 管线；模块扩展见 [docs/MODULE_PLUGINS.md](docs/MODULE_PLUGINS.md)。

**GitHub Pages 子路径本地模拟**（PowerShell）：

```powershell
$env:GITHUB_ACTIONS='true'; $env:GITHUB_REPOSITORY='user/md-wechat-editor'; npm run build; npm run preview
```

在仓库 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**，由 `.github/workflows/deploy-pages.yml` 自动发布。

| 环境变量 | 说明 |
|----------|------|
| `VITE_GITHUB_REPO_URL` | 落地页 GitHub 链接，默认 `https://github.com/DuebassLei/md-wechat-editor` |
| `VITE_WECHAT_MP_NAME` | 顶栏公众号推广名称，默认 `墨韵简排` |
| `VITE_WECHAT_MP_HINT` | 推广副文案，默认 `排版技巧 · 更新通知` |
| `VITE_WECHAT_MP_URL` | 弹窗内「在浏览器中打开」链接（可选） |
| `VITE_WECHAT_MP_QR_URL` | 默认公众号二维码图片 URL |
| `VITE_WECHAT_MP_PROMO_ENABLED` | 设为 `false` 关闭顶栏推广位 |

顶栏「扫码关注」点击弹出二维码；将图片放到 `public/wechat-mp-qr.png` 或设置 `VITE_WECHAT_MP_QR_URL`。

---

## 许可证

[MIT License](LICENSE)
