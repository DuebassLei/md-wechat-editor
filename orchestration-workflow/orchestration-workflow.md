# 编排工作流

本文描述 **Command → Agent（含 skill）→ Skill** 编排模式，以墨韵简排公众号文章生产系统为例。

## 系统概览

文章系统在一个编排流程中展示两种 skill 模式：

- **Agent Skill**（预加载）：`article-researcher` 在 `article-writer-agent` 启动时注入为领域知识
- **Skill**（独立调用）：`mo-layout-formatter` 由 command 通过 Skill 工具直接调用

| 组件 | 角色 | 本仓库示例 |
|------|------|-----------|
| **Command** | 入口、用户交互 | `/article-orchestrator` |
| **Agent** | 调研与撰稿（预加载 agent skill） | `article-writer-agent` + `article-researcher` |
| **Skill** | 独立排版输出 | `mo-layout-formatter` |

## 流程图

```
╔══════════════════════════════════════════════════════════════════╗
║              文章编排工作流                                        ║
║           Command  →  Agent  →  Skill                            ║
╚══════════════════════════════════════════════════════════════════╝

                         ┌───────────────────┐
                         │  用户输入选题/偏好  │
                         └─────────┬─────────┘
                                   │
                                   ▼
         ┌─────────────────────────────────────────────────────┐
         │  /article-orchestrator — Command（入口）             │
         └─────────────────────────┬───────────────────────────┘
                                   │
                              Step 1
                                   │
                                   ▼
                      ┌────────────────────────┐
                      │  AskUser — 选题/受众/风格 │
                      └────────────┬───────────┘
                                   │
                         Step 2 — Agent 工具
                                   │
                                   ▼
         ┌─────────────────────────────────────────────────────┐
         │  article-writer-agent ● skill: article-researcher   │
         └─────────────────────────┬───────────────────────────┘
                                   │
                          返回：提纲 + 初稿正文
                                   │
                         Step 3 — Skill 工具
                                   │
                                   ▼
         ┌─────────────────────────────────────────────────────┐
         │  mo-layout-formatter — Skill ● :::module 排版输出    │
         └─────────────────────────┬───────────────────────────┘
                                   │
                          ┌────────┴────────┐
                          │                 │
                          ▼                 ▼
                   ┌────────────┐    ┌────────────┐
                   │ article.md │    │ titles.txt │
                   └────────────┘    └────────────┘
```

## 组件详情

### 1. Command — `/article-orchestrator`

- **位置**：`.claude/commands/article-orchestrator.md`
- **职责**：收集用户偏好 → 调用 agent → 调用排版 skill
- **模型**：haiku

### 2. Agent — `article-writer-agent`

- **位置**：`.claude/agents/article-writer-agent.md`
- **预加载 skill**：`article-researcher`
- **工具**：Read, Skill, WebSearch, WebFetch
- **职责**：调研、产出提纲与初稿，返回给 command

### 3. Agent Skill — `article-researcher`

- **位置**：`.claude/skills/article-researcher/SKILL.md`
- **职责**：调研资料、构建提纲、撰写 Markdown 初稿（纯文本，不含 :::module）
- **调用方式**：预加载进 agent，agent 通过 Skill 工具执行

### 4. Skill — `mo-layout-formatter`

- **位置**：`.claude/skills/mo-layout-formatter/SKILL.md`
- **职责**：将初稿转为墨韵 `:::module` 排版语法，写入 `docs/articles/YYYY-MM-DD/<slug>/`
- **调用方式**：command 通过 Skill 工具直接调用

## 执行示例

```
输入: /article-orchestrator
├─ Step 1: 询问选题、受众、风格
│  └─ 用户: Claude Code 最佳实践 / 开发者 / 教程
├─ Step 2: Agent → article-writer-agent
│  ├─ Skill: article-researcher
│  ├─ 调研 + 提纲 + 初稿
│  └─ 返回: outline + draft markdown
├─ Step 3: Skill → mo-layout-formatter
│  ├─ 写入: docs/articles/2026-06-26/claude-code-best-practice/article.md
│  └─ 写入: docs/articles/2026-06-26/claude-code-best-practice/titles.txt
└─ 输出摘要给用户
```

## 设计原则

1. **两种 Skill 模式**：Agent skill（预加载）vs Skill（独立调用）
2. **Command 做编排**：用户交互与步骤协调由 command 负责
3. **Agent 做内容**：调研与撰稿在隔离上下文中完成
4. **Skill 做排版**：`:::module` 格式化独立执行，接收 command 上下文中的初稿
5. **职责分离**：调研撰稿（agent）→ 排版出稿（skill）
