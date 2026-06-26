# CLAUDE.md

本文件为 Claude Code 在本仓库（墨韵简排 / md-wechat-editor）中工作时提供项目级指引。

## 项目概览

纯前端微信公众号 Markdown 排版工作室：Vue 3 + Vite + TypeScript。核心排版引擎位于 `src/engine/`，53 种 `:::module` 围栏组件，39 套主题。

| 路径 | 说明 |
|------|------|
| `src/engine/` | Markdown → 微信 HTML 管线（独立维护） |
| `src/modules/` | 排版模块插件注册 |
| `src/components/` | Vue UI 组件 |
| `docs/LAYOUT_SYNTAX.md` | `:::module` 排版语法 |
| `docs/MODULE_PLUGINS.md` | 自定义模块扩展 |
| `docs/articles/` | 公众号文章稿（按日期/ slug 组织） |

## 工作流概览

两套 **Command → Agent → Skill** 编排：

| 工作流 | 入口 | 文档 |
|--------|------|------|
| **功能开发** | `/dev-orchestrator` | `dev-workflow/dev-workflow.md` |
| **公众号文章** | `/article-orchestrator` | `orchestration-workflow/orchestration-workflow.md` |

### 功能开发（Explore → Implement → Review → Verify）

- `/dev-orchestrator`：探索 → 领域 agent 实现 → 审查 → 验证
- `/dev-fix`：Bug 修复短流程（跳过审查）
- `/dev-collections`：开发组件索引

**开发 Agent**：

| Agent | 领域 |
|-------|------|
| `dev-explore-agent` | 代码探索与计划 |
| `engine-agent` | 排版引擎 / 导出 |
| `vue-frontend-agent` | Vue 组件与 UI |
| `theme-agent` | 排版主题 CSS |
| `module-dev-agent` | `:::module` 模块插件 |
| `card-studio-agent` | 知识卡片工作室 |
| `code-reviewer-agent` | 实现后审查 |

计划输出：`dev-workflow/plans/YYYY-MM-DD-<slug>.md`

### 公众号文章

- `/article-orchestrator` → `article-writer-agent` → `mo-layout-formatter`
- 详见 `orchestration-workflow/orchestration-workflow.md`

## 辅助命令

| 命令 | 用途 |
|------|------|
| `/dev-orchestrator` | 功能开发完整流程 |
| `/dev-fix` | Bug 修复 |
| `/dev-collections` | 工作流组件索引 |
| `/engine-smoke-test` | 引擎冒烟测试 |
| `/module-scaffold` | 模块插件快速脚手架（不含探索/审查） |

## 关键模式

### Subagent 编排

Subagent **不能**通过 bash 启动其他 subagent。使用 Agent 工具：

```
Agent(subagent_type="article-writer-agent", description="...", prompt="...")
```

### 排版语法约束

- 仅支持 GFM Markdown + `:::module` 围栏，**禁止** XML 标签（`<lead>` 等）
- 闭合行必须是单独的 `:::` 
- 文首封面用 `:::hero` 或 YAML frontmatter（保存时自动转 hero）
- 详见 `docs/LAYOUT_SYNTAX.md`

### 引擎开发

- 修改模块或预览样式后：递增 `LAYOUT_MODULE_THUMB_VERSION`，运行 `npm run gen:module-thumbs`
- 引擎变更后运行：`npm run test:engine`（及相关的 card-studio / wechat-tietu 测试）
- 插件扩展见 `docs/MODULE_PLUGINS.md`，勿与内置 id 冲突

### 文章目录约定

```
docs/articles/YYYY-MM-DD/<slug>/
├── article.md          # 排版后的正文（:::module 语法）
├── titles.txt          # 备选标题（每行一个）
├── checklist.md        # 可选：发布前清单
└── assets/             # 配图、封面等
```

## 工作流最佳实践

- 用 **Command** 封装重复流程，而非口头描述
- 领域知识放 **Skill**（渐进披露），专项任务放 **Subagent**（隔离上下文）
- 新功能：优先 `/dev-orchestrator`，不要口头描述多步开发
- 复杂引擎改动：可用 plan mode，或由 `dev-explore-agent` 写计划后 `engine-agent` 实现
- 上下文用到约 50% 时手动 `/compact`
- `.claude/rules/*.md` 带 `paths:` 时仅编辑匹配文件时加载

## Git 提交

每个文件单独 commit，不要捆绑多个文件。提交信息聚焦「为什么改」。

## 文档

- 开发工作流：`dev-workflow/dev-workflow.md`
- 文章编排：`orchestration-workflow/orchestration-workflow.md`
- 排版语法：`docs/LAYOUT_SYNTAX.md`
- 模块插件：`docs/MODULE_PLUGINS.md`
