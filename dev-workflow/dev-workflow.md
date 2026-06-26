# 开发工作流

本文描述墨韵简排 **功能开发** 的 **Command → Agent → Skill** 编排模式。

## 系统概览

开发系统与文章系统并列，覆盖引擎、Vue 前端、主题、模块、知识卡片五大开发域：

| 组件 | 角色 | 示例 |
|------|------|------|
| **Command** | 入口、收集需求、路由实现 agent | `/dev-orchestrator` |
| **Agent** | 探索 / 实现 / 审查（各域专项） | `dev-explore-agent` → `vue-frontend-agent` |
| **Skill** | 验证测试、审查清单 | `dev-verify`、`dev-review-checklist` |

## 主流程图

```
╔══════════════════════════════════════════════════════════════════╗
║              功能开发编排工作流                                    ║
║     Explore → Implement → Review → Verify                        ║
╚══════════════════════════════════════════════════════════════════╝

                         ┌───────────────────┐
                         │  用户描述功能需求   │
                         └─────────┬─────────┘
                                   │
                                   ▼
         ┌─────────────────────────────────────────────────────┐
         │  /dev-orchestrator — Command（入口）                   │
         └─────────────────────────┬───────────────────────────┘
                                   │
                              Step 1
                                   ▼
                      ┌────────────────────────┐
                      │  AskUser — 需求/领域/slug │
                      └────────────┬───────────┘
                                   │
                              Step 2
                                   ▼
         ┌─────────────────────────────────────────────────────┐
         │  dev-explore-agent ● skill: codebase-explorer          │
         │  → dev-workflow/plans/YYYY-MM-DD-<slug>.md            │
         └─────────────────────────┬───────────────────────────┘
                                   │
                              Step 3（按领域路由）
                                   ▼
    ┌──────────┬──────────┬──────────┬──────────┬──────────┐
    │ engine   │ vue      │ theme    │ module   │ card     │
    │ -agent   │ -frontend│ -agent   │ -dev     │ -studio  │
    │          │ -agent   │          │ -agent   │ -agent   │
    └────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┘
         │          │          │          │          │
                              Step 4
                                   ▼
         ┌─────────────────────────────────────────────────────┐
         │  code-reviewer-agent ● skill: dev-review-checklist   │
         └─────────────────────────┬───────────────────────────┘
                                   │
                              Step 5
                                   ▼
         ┌─────────────────────────────────────────────────────┐
         │  dev-verify — Skill（lint + 领域冒烟测试）             │
         └─────────────────────────────────────────────────────┘
```

## 开发域与 Agent 映射

| 领域 | 说明 | 实现 Agent | 预加载 Skill |
|------|------|-----------|-------------|
| `engine` | 解析、渲染、导出管线 | `engine-agent` | `engine-knowledge` |
| `vue` | 组件、composables、路由 UI | `vue-frontend-agent` | `vue-frontend-knowledge` |
| `theme` | 排版主题 CSS | `theme-agent` | `theme-knowledge` |
| `module` | `:::module` 模块插件 | `module-dev-agent` | `engine-knowledge` |
| `card` | 知识卡片工作室 | `card-studio-agent` | `card-studio-knowledge` |
| `export` | 小红书/贴图/手写导出 | `engine-agent` | `engine-knowledge` |

## 命令速查

| 命令 | 用途 |
|------|------|
| `/dev-orchestrator` | 完整功能开发流程（探索→实现→审查→验证） |
| `/dev-fix` | Bug 修复短流程（探索→实现→验证，跳过审查） |
| `/dev-collections` | 开发工作流组件索引 |
| `/engine-smoke-test` | 仅运行引擎相关测试 |
| `/module-scaffold` | 快速脚手架（不含探索与审查） |

## Agent 速查

| Agent | 何时用 |
|-------|--------|
| `dev-explore-agent` | 读代码、写实现计划 |
| `engine-agent` | 改 `src/engine/` |
| `vue-frontend-agent` | 改 Vue 组件与 UI |
| `theme-agent` | 新增/修改排版主题 |
| `module-dev-agent` | 完整模块插件开发 |
| `card-studio-agent` | 知识卡片功能 |
| `code-reviewer-agent` | 实现后代码审查 |

## 计划文件约定

```
dev-workflow/plans/YYYY-MM-DD-<slug>.md
```

计划须含：目标、影响文件、实现步骤、测试命令、风险点。

## 设计原则

1. **先探索再动手**：`dev-explore-agent` 写计划，避免盲改
2. **领域专项 agent**：引擎与 Vue 分离上下文，减少串味
3. **审查与验证分离**：review agent 看代码质量，verify skill 跑命令
4. **失败即停**：探索无计划、测试失败时不声称完成
