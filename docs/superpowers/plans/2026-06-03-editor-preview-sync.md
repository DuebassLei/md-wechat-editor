# 编辑器 ↔ 预览双向同步 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 桌面并排时实现编辑区与微信预览的双向滚动、光标高亮与点击定位；移动端支持预览点击切 Tab 并跳转光标；复制公众号 HTML 不含任何同步属性。

**Architecture:** 通过 `ArticleRenderOptions.editorSyncAnchors` 分流预览/复制 HTML；引擎在富排版解析与 GFM 后处理中条件写入 `data-md-line-start` / `data-md-sync`；`useEditorPreviewSync` 基于锚点表驱动 CodeMirror 与 `WechatPreviewFrame` 滚动根；复制路径默认 `false` 并可选 `stripEditorSyncAttributes` 兜底。

**Tech Stack:** Vue 3, CodeMirror 6, marked, 现有 `buildWechatArticleHtml` 管线, Node smoke scripts

**Spec:** `docs/superpowers/specs/2026-06-03-editor-preview-sync-design.md`

---

## File map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/engine/render/wechatArticleHtml.ts` | Modify | `editorSyncAnchors` on `ArticleRenderOptions`; 预览结束后条件 annotate |
| `src/engine/r-markdown/parseOptions.ts` | Modify | `editorSyncAnchors?: boolean` 传入解析器 |
| `src/engine/render/editorSyncAnchors.ts` | Create | `injectSyncAttrsOnRoot`, `annotateGfmBlocks`, `stripEditorSyncAttributes` |
| `src/engine/r-markdown/utils/markdownParser.ts` | Modify | 模块/callout flush 时注入行号 |
| `src/engine/render/gfmThemeWrapper.ts` | Modify | `flushGfmMarkdownBuffer` 记录 `lineStart` 并标注容器 |
| `src/composables/usePreviewHtml.ts` | Modify | `editorSyncAnchors: true` |
| `src/components/EditorWorkspace.vue` | Modify | wire sync + `copyHtml` strip 兜底 |
| `src/composables/editorPreviewSync/anchorTable.ts` | Create | 纯函数：锚点表、line→anchor、中心 anchor |
| `src/composables/useEditorPreviewSync.ts` | Create | 监听滚动/选区/点击 |
| `src/components/WechatPreviewFrame.vue` | Modify | `defineExpose({ rootEl })`、高亮 CSS |
| `src/components/MarkdownEditor.vue` | Modify | `defineExpose({ editorView, ... })` |
| `scripts/smoke-editor-sync-anchors.mjs` | Create | 预览有锚点、复制无锚点 |
| `package.json` | Modify | `"test:sync": "node --import ./scripts/register-aliases.mjs scripts/smoke-editor-sync-anchors.mjs"` |

---

### Task 1: 渲染选项与 strip 兜底

**Files:**
- Create: `src/engine/render/editorSyncAnchors.ts`
- Modify: `src/engine/render/wechatArticleHtml.ts`
- Modify: `src/engine/r-markdown/parseOptions.ts`
- Modify: `src/engine/index.ts`（如需 export strip）

- [ ] **Step 1: 创建 `editorSyncAnchors.ts`**

```typescript
/** 同步锚点属性名（预览专用，不得进入复制管线） */
export const MD_SYNC_ATTR = 'data-md-sync'
export const MD_LINE_START_ATTR = 'data-md-line-start'
export const MD_SYNC_BLOCK = 'block'

/** 给模块/块级 HTML 根标签注入属性（仅当根元素为单个标签时） */
export function injectSyncAttrsOnRoot(html: string, lineStart: number): string {
  const trimmed = html.trim()
  if (!trimmed) return trimmed
  const m = trimmed.match(/^<([a-z][\w-]*)(\s[^>]*)?>/i)
  if (!m) return trimmed
  const tag = m[1]
  const rest = m[2] ?? ''
  if (/\bdata-md-line-start=/.test(rest)) return trimmed
  return trimmed.replace(
    /^<[a-z][\w-]*(\s[^>]*)?>/i,
    `<${tag}${rest} ${MD_LINE_START_ATTR}="${lineStart}" ${MD_SYNC_ATTR}="${MD_SYNC_BLOCK}">`,
  )
}

export function stripEditorSyncAttributes(html: string): string {
  if (!html.includes('data-md-line')) return html
  return html
    .replace(/\s*data-md-line-start="[^"]*"/gi, '')
    .replace(/\s*data-md-sync="[^"]*"/gi, '')
    .replace(/\s*class="([^"]*)"/gi, (_, cls: string) => {
      const next = cls.replace(/\bpreview-sync-active\b/g, '').trim()
      return next ? ` class="${next}"` : ''
    })
}
```

- [ ] **Step 2: 扩展 `ArticleRenderOptions` 与 `buildParseOptions`**

在 `src/engine/render/wechatArticleHtml.ts`：

```typescript
export interface ArticleRenderOptions {
  componentAccent?: string | null
  /** 仅 Studio 预览：写入 data-md-line-start，复制必须为 false/省略 */
  editorSyncAnchors?: boolean
}

function buildParseOptions(..., renderOptions?: ArticleRenderOptions): ParseMarkdownOptions {
  return {
    layoutTier: entitlements.layoutTier,
    templateEntitlements: templateEntitlements ?? null,
    componentAccent: renderOptions?.componentAccent ?? null,
    editorSyncAnchors: renderOptions?.editorSyncAnchors ?? false,
  }
}
```

在 `src/engine/r-markdown/parseOptions.ts`：

```typescript
export interface ParseMarkdownOptions {
  layoutTier: LayoutTier
  templateEntitlements?: TemplateEntitlementMap | null
  componentAccent?: string | null
  themeTokens?: ThemeColors
  editorSyncAnchors?: boolean
}
```

- [ ] **Step 3: `buildWechatArticleHtml` 末尾条件 annotate（占位，Task 2 实现 `annotateGfmBlocks`）**

```typescript
import { annotateArticleHtmlForSync, stripEditorSyncAttributes } from './editorSyncAnchors'

// buildWechatArticleHtml 末尾，return 前：
let result = /* 现有各分支 html */
if (renderOptions?.editorSyncAnchors) {
  result = annotateArticleHtmlForSync(markdown, result)
}
return result
```

先在 `editorSyncAnchors.ts` 导出桩函数，Task 2 填实现：

```typescript
export function annotateArticleHtmlForSync(markdown: string, html: string): string {
  return annotateGfmBlocks(markdown, html)
}
```

- [ ] **Step 4: 运行类型检查**

Run: `npm run build`  
Expected: 通过（或仅既有错误；无新增 TS 错误）

- [ ] **Step 5: Commit**

```bash
git add src/engine/render/editorSyncAnchors.ts src/engine/render/wechatArticleHtml.ts src/engine/r-markdown/parseOptions.ts
git commit -m "feat(engine): add editorSyncAnchors render option and strip helper"
```

---

### Task 2: GFM 块标注 `annotateGfmBlocks`

**Files:**
- Modify: `src/engine/render/editorSyncAnchors.ts`

- [ ] **Step 1: 实现块切分与 DOM 标注**

```typescript
const BLOCK_START_RE = /^(#{1,6}\s|>\s|```|[-*+]\s|\d+\.\s|:::)/

/** 按源文空行切分块，记录 1-based 起始行 */
export function splitMarkdownBlocks(markdown: string): { lineStart: number; text: string }[] {
  const lines = markdown.split('\n')
  const blocks: { lineStart: number; text: string }[] = []
  let buf: string[] = []
  let bufStart = 1

  function flush() {
    const text = buf.join('\n').trim()
    if (text) blocks.push({ lineStart: bufStart, text })
    buf = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNo = i + 1
    if (line.trim() === '') {
      flush()
      bufStart = lineNo + 1
      continue
    }
    if (buf.length === 0) bufStart = lineNo
    // ::: 围栏整块：从 ::: 开到闭合 :::
    if (/^:::\s*[\w-]/.test(line.trim())) {
      flush()
      const fenceBuf = [line]
      let j = i + 1
      while (j < lines.length) {
        fenceBuf.push(lines[j])
        if (lines[j].trim() === ':::') break
        j++
      }
      blocks.push({ lineStart: lineNo, text: fenceBuf.join('\n').trim() })
      i = j
      buf = []
      bufStart = j + 2
      continue
    }
    buf.push(line)
  }
  flush()
  return blocks
}

const SYNC_SELECTOR =
  'h1,h2,h3,h4,h5,h6,p,pre,blockquote,ul,ol,table,hr,section,div.awp-gfm-theme'

export function annotateGfmBlocks(markdown: string, html: string): string {
  if (typeof DOMParser === 'undefined') return html
  const blocks = splitMarkdownBlocks(markdown)
  if (!blocks.length) return html

  const doc = new DOMParser().parseFromString(html, 'text/html')
  const roots = [
    ...doc.querySelectorAll('#nice'),
    ...doc.querySelectorAll('.awp-gfm-theme'),
    doc.body,
  ]
  const candidates: Element[] = []
  for (const root of roots) {
    for (const el of root.querySelectorAll(SYNC_SELECTOR)) {
      if (el.closest('[data-md-line-start]')) continue
      if (el.matches('li section')) continue
      candidates.push(el)
    }
  }
  // 仅取顶层同步候选：父级不在 candidates 内
  const topLevel = candidates.filter(
    (el) => !candidates.some((p) => p !== el && p.contains(el)),
  )

  const n = Math.min(blocks.length, topLevel.length)
  for (let i = 0; i < n; i++) {
    topLevel[i].setAttribute(MD_LINE_START_ATTR, String(blocks[i].lineStart))
    topLevel[i].setAttribute(MD_SYNC_ATTR, MD_SYNC_BLOCK)
  }
  return doc.body.innerHTML.includes('<section id="nice"')
    ? (doc.querySelector('#nice')?.parentElement?.innerHTML ?? html)
    : doc.body.innerHTML
}
```

根据实际 `buildWechatHtml` 输出结构调整 query 根节点（实现时以 `#nice` 子节点为主）。

- [ ] **Step 2: `annotateArticleHtmlForSync` 调用 `annotateGfmBlocks`**

- [ ] **Step 3: 创建冒烟脚本 `scripts/smoke-editor-sync-anchors.mjs`**

```javascript
import { buildWechatArticleHtml } from '../src/engine/render/wechatArticleHtml.ts'
import { OPEN_RENDER_ENTITLEMENTS } from '../src/engine/render/renderEntitlements.ts'

const md = '# Hello\n\nParagraph.\n\n:::engage\ntitle: T\nbody: B\n:::'

const preview = await buildWechatArticleHtml(md, 'normal', OPEN_RENDER_ENTITLEMENTS, null, {
  editorSyncAnchors: true,
})
const copy = await buildWechatArticleHtml(md, 'normal', OPEN_RENDER_ENTITLEMENTS, null)

const checks = [
  ['preview has data-md-line-start', preview.includes('data-md-line-start')],
  ['copy has no data-md-line-start', !copy.includes('data-md-line-start')],
  ['copy has no data-md-sync', !copy.includes('data-md-sync')],
]

let failed = false
for (const [name, ok] of checks) {
  console.log(ok ? '✓' : '✗', name)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
```

- [ ] **Step 4: 运行冒烟**

Run: `node --import ./scripts/register-aliases.mjs scripts/smoke-editor-sync-anchors.mjs`  
Expected: 前 1 项可能仍失败（富排版 inject 在 Task 3）；copy 两项应 PASS

- [ ] **Step 5: Commit**

```bash
git add src/engine/render/editorSyncAnchors.ts scripts/smoke-editor-sync-anchors.mjs package.json
git commit -m "feat(engine): annotate GFM preview HTML with sync line anchors"
```

---

### Task 3: 富排版 `parseMarkdown` 行号注入

**Files:**
- Modify: `src/engine/r-markdown/utils/markdownParser.ts`
- Modify: `src/engine/render/gfmThemeWrapper.ts`
- Modify: `scripts/smoke-editor-sync-anchors.mjs`

- [ ] **Step 1: `markdownParser.ts` 模块输出包裹**

在每次 `html += ...` 模块/callout 结果前：

```typescript
import { injectSyncAttrsOnRoot } from '@/engine/render/editorSyncAnchors'

function wrapModuleHtml(fragment: string, lineIndex0: number, opts?: ParseMarkdownOptions): string {
  if (!opts?.editorSyncAnchors) return fragment
  return injectSyncAttrsOnRoot(fragment, lineIndex0 + 1)
}

// 示例：compareRich
html += wrapModuleHtml(compareRich.html, i, opts)

// md2w / ext / pluginFenced / callout 同理
```

- [ ] **Step 2: `gfmThemeWrapper.ts` 记录 GFM 缓冲首行**

修改 `flushGfmMarkdownBuffer` 签名，由 `markdownParser` 传入 `lineStart` 与 `opts`：

```typescript
export function flushGfmMarkdownBuffer(
  lines: string[],
  lineStart: number,
  opts?: { editorSyncAnchors?: boolean },
): string {
  if (!lines.length) return ''
  const content = lines.join('\n').trim()
  lines.length = 0
  if (!content) return ''
  let html = wrapGfmThemeHtml(renderMarkdown(content))
  if (opts?.editorSyncAnchors) {
    html = injectSyncAttrsOnRoot(html, lineStart)
  }
  return html
}
```

`markdownParser` 中维护 `let gfmStartLine = 0`，首次 `gfmBuffer.push` 时设 `gfmStartLine = i + 1`，`flushGfm()` 调用 `flushGfmMarkdownBuffer(gfmBuffer, gfmStartLine, opts)`。

- [ ] **Step 3: 运行冒烟（含 engage 模块）**

Run: `node --import ./scripts/register-aliases.mjs scripts/smoke-editor-sync-anchors.mjs`  
Expected: 三项全 ✓

- [ ] **Step 4: Commit**

```bash
git add src/engine/r-markdown/utils/markdownParser.ts src/engine/render/gfmThemeWrapper.ts scripts/smoke-editor-sync-anchors.mjs
git commit -m "feat(engine): inject sync anchors in rich layout parser"
```

---

### Task 4: 预览/复制分流接线

**Files:**
- Modify: `src/composables/usePreviewHtml.ts`
- Modify: `src/components/EditorWorkspace.vue`

- [ ] **Step 1: `usePreviewHtml` 开启锚点**

```typescript
const result = await buildWechatArticleHtml(
  markdown.value,
  themeId.value,
  OPEN_RENDER_ENTITLEMENTS,
  null,
  { editorSyncAnchors: true },
)
```

- [ ] **Step 2: `copyHtml` 显式关闭 + strip 兜底**

```typescript
import { stripEditorSyncAttributes } from '@/engine/render/editorSyncAnchors'

const full = await buildWechatArticleHtml(
  content.value,
  themeRef.value,
  OPEN_RENDER_ENTITLEMENTS,
  null,
  { editorSyncAnchors: false },
)
const ok = await copyRichText(stripEditorSyncAttributes(full))
```

确认未使用 `html` ref 作为复制源。

- [ ] **Step 3: 手动快速验证**

Run: `npm run dev`  
操作：编辑 → 复制 → 粘贴到记事本，确认无 `data-md-line-start`

- [ ] **Step 4: Commit**

```bash
git add src/composables/usePreviewHtml.ts src/components/EditorWorkspace.vue
git commit -m "feat: enable sync anchors for preview only, strip on copy"
```

---

### Task 5: 锚点表纯函数

**Files:**
- Create: `src/composables/editorPreviewSync/anchorTable.ts`
- Create: `scripts/smoke-anchor-table.mjs`

- [ ] **Step 1: 实现纯函数**

```typescript
export type SyncAnchor = { line: number; el: Element; top: number }

export function buildAnchorTable(scrollRoot: HTMLElement): SyncAnchor[] {
  const rootRect = scrollRoot.getBoundingClientRect()
  const nodes = scrollRoot.querySelectorAll('[data-md-sync="block"][data-md-line-start]')
  const anchors: SyncAnchor[] = []
  nodes.forEach((el) => {
    const line = Number((el as HTMLElement).dataset.mdLineStart)
    if (!Number.isFinite(line)) return
    const top = (el as HTMLElement).offsetTop
    anchors.push({ line, el, top })
  })
  anchors.sort((a, b) => a.line - b.line)
  return anchors
}

export function lineToAnchor(anchors: SyncAnchor[], line: number): SyncAnchor | null {
  if (!anchors.length) return null
  let best = anchors[0]
  for (const a of anchors) {
    if (a.line <= line) best = a
    else break
  }
  return best
}

export function anchorAtPreviewCenter(
  anchors: SyncAnchor[],
  scrollRoot: HTMLElement,
): SyncAnchor | null {
  if (!anchors.length) return null
  const centerY = scrollRoot.scrollTop + scrollRoot.clientHeight / 2
  let best = anchors[0]
  let bestDist = Infinity
  for (const a of anchors) {
    const el = a.el as HTMLElement
    const mid = a.top + el.offsetHeight / 2
    const dist = Math.abs(mid - centerY)
    if (dist < bestDist) {
      bestDist = dist
      best = a
    }
  }
  return best
}

export function scrollPreviewToAnchor(
  scrollRoot: HTMLElement,
  anchor: SyncAnchor,
): void {
  const el = anchor.el as HTMLElement
  const target =
    anchor.top + el.offsetHeight / 2 - scrollRoot.clientHeight / 2
  scrollRoot.scrollTop = Math.max(0, target)
}
```

- [ ] **Step 2: 冒烟脚本（简化 DOM）**

`scripts/smoke-anchor-table.mjs` 用 `linkedom` 或 `node` 无 DOM 时跳过；或在 `smoke-editor-sync-anchors` 中断言 `lineToAnchor` 逻辑用内联数组测：

```javascript
// 纯逻辑测试，不依赖 DOM
const anchors = [{ line: 1 }, { line: 10 }, { line: 20 }]
function lineToAnchor(anchors, line) { /* 同上 */ }
console.assert(lineToAnchor(anchors, 15).line === 10)
```

- [ ] **Step 3: Commit**

```bash
git add src/composables/editorPreviewSync/anchorTable.ts scripts/smoke-anchor-table.mjs package.json
git commit -m "feat: add editor-preview anchor table utilities"
```

---

### Task 6: `useEditorPreviewSync` composable

**Files:**
- Create: `src/composables/useEditorPreviewSync.ts`

- [ ] **Step 1: 实现 composable 骨架**

```typescript
import { ref, watch, onMounted, onUnmounted, nextTick, type Ref } from 'vue'
import type { EditorView } from '@codemirror/view'
import {
  buildAnchorTable,
  lineToAnchor,
  anchorAtPreviewCenter,
  scrollPreviewToAnchor,
  type SyncAnchor,
} from './editorPreviewSync/anchorTable'

export function useEditorPreviewSync(options: {
  editorView: Ref<EditorView | null>
  previewRoot: Ref<HTMLElement | null>
  getScrollRoot: () => HTMLElement | null
  previewLoading: Ref<boolean>
  previewHtml: Ref<string>
  sideBySide: Ref<boolean>
  onRequestEditTab: () => void
}) {
  let anchors: SyncAnchor[] = []
  let syncing: 'editor' | 'preview' | null = null
  let rafScroll = 0
  let selTimer: ReturnType<typeof setTimeout> | null = null
  let activeEl: Element | null = null

  function rebuildAnchors() {
    const root = options.getScrollRoot()
    if (!root) {
      anchors = []
      return
    }
    anchors = buildAnchorTable(root)
  }

  function setActive(anchor: SyncAnchor | null) {
    if (activeEl) activeEl.classList.remove('preview-sync-active')
    activeEl = anchor?.el ?? null
    activeEl?.classList.add('preview-sync-active')
  }

  function withSync(side: 'editor' | 'preview', fn: () => void) {
    syncing = side
    fn()
    requestAnimationFrame(() => {
      syncing = null
    })
  }

  function cursorLine(view: EditorView): number {
    const pos = view.state.selection.main.head
    return view.state.doc.lineAt(pos).number
  }

  function centerLine(view: EditorView): number {
    const rect = view.scrollDOM.getBoundingClientRect()
    const midY = rect.top + rect.height / 2
    const pos = view.elementAtHeight(midY - rect.top + view.scrollDOM.scrollTop)?.pos
    if (pos == null) return cursorLine(view)
    return view.state.doc.lineAt(pos).number
  }

  function syncFromEditor(scrollOnly = false) {
    const view = options.editorView.value
    const root = options.getScrollRoot()
    if (!view || !root || options.previewLoading.value) return
    const line = scrollOnly ? centerLine(view) : cursorLine(view)
    const anchor = lineToAnchor(anchors, line)
    if (!anchor) return
    withSync('editor', () => scrollPreviewToAnchor(root, anchor))
    if (!scrollOnly) setActive(anchor)
  }

  function syncFromPreview() {
    const view = options.editorView.value
    const root = options.getScrollRoot()
    if (!view || !root || syncing === 'editor') return
    const anchor = anchorAtPreviewCenter(anchors, root)
    if (!anchor) return
    withSync('preview', () => {
      view.dispatch({
        effects: EditorView.scrollIntoView(view.state.doc.line(anchor.line).from, { y: 'center' }),
      })
    })
    setActive(anchor)
  }

  function onPreviewClick(e: MouseEvent) {
    const t = (e.target as Element).closest('[data-md-line-start]')
    if (!t) return
    const line = Number((t as HTMLElement).dataset.mdLineStart)
    const view = options.editorView.value
    if (!view || !Number.isFinite(line)) return
    options.onRequestEditTab()
    const lineObj = view.state.doc.line(Math.min(line, view.state.doc.lines))
    view.dispatch({
      selection: { anchor: lineObj.from },
      scrollIntoView: true,
    })
    view.focus()
    nextTick(() => syncFromEditor(false))
  }

  // watch previewHtml + loading, bind listeners on editor scroller + scroll root
  // sideBySide: only attach scroll listeners when true
  // cleanup onUnmounted

  return { rebuildAnchors }
}
```

实现时从 `@codemirror/view` 正确导入 `EditorView.scrollIntoView` effect（CM6 API：`import { EditorView } from '@codemirror/view'` 使用 `EditorView.scrollIntoView(pos, { y: 'center' })`）。

- [ ] **Step 2: 绑定 lifecycle**

- `watch([previewHtml, previewLoading], async () => { if (!loading) await nextTick(); rebuildAnchors(); syncFromEditor(false) })`
- `watch(sideBySide, () => attach/detach scroll listeners)`
- `previewRoot` 上 `click` capture → `onPreviewClick`

- [ ] **Step 3: Commit**

```bash
git add src/composables/useEditorPreviewSync.ts
git commit -m "feat: add useEditorPreviewSync composable"
```

---

### Task 7: UI 接线（Frame + Editor + Workspace）

**Files:**
- Modify: `src/components/WechatPreviewFrame.vue`
- Modify: `src/components/MarkdownEditor.vue`
- Modify: `src/components/EditorWorkspace.vue`

- [ ] **Step 1: `WechatPreviewFrame` 暴露根元素与高亮样式**

```vue
<script setup lang="ts">
import { ref } from 'vue'
const rootRef = ref<HTMLElement | null>(null)
defineExpose({ rootEl: rootRef })
</script>

<template>
  <div ref="rootRef" class="preview-root" ...>
```

```css
.preview-body :deep([data-md-sync].preview-sync-active) {
  outline: 2px solid rgb(var(--color-jade) / 0.55);
  outline-offset: 2px;
  border-radius: 4px;
}
```

- [ ] **Step 2: `MarkdownEditor` 暴露 `editorView`**

```typescript
defineExpose({ insertAtCursor, openSyntaxDrawer, editorView })
```

- [ ] **Step 3: `EditorWorkspace` 串联**

```typescript
import { useMediaQuery } from '@vueuse/core' // 若无则手写 matchMedia ref
import { useEditorPreviewSync } from '@/composables/useEditorPreviewSync'

const previewFrameRef = ref<InstanceType<typeof WechatPreviewFrame> | null>(null)
const sideBySide = ref(typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches)

onMounted(() => {
  const mq = window.matchMedia('(min-width: 1024px)')
  const fn = () => { sideBySide.value = mq.matches }
  mq.addEventListener('change', fn)
  onUnmounted(() => mq.removeEventListener('change', fn))
})

const editorView = computed(() => editorRef.value?.editorView ?? null)

useEditorPreviewSync({
  editorView,
  previewRoot: computed(() => previewFrameRef.value?.rootEl ?? null),
  getScrollRoot: () => {
    const root = previewFrameRef.value?.rootEl
    if (!root) return null
    return (
      root.querySelector<HTMLElement>('.wechat-shell__scroll') ??
      root.querySelector<HTMLElement>('.preview-root') ??
      root
    )
  },
  previewLoading: loading,
  previewHtml: html,
  sideBySide,
  onRequestEditTab: () => { mobileTab.value = 'edit' },
})
```

```vue
<WechatPreviewFrame ref="previewFrameRef" ... />
```

注意：`previewRoot` 类型若为 `ComputedRef` 需 composable 接受 `Ref`.

- [ ] **Step 4: 本地手动验收（spec 9–10）**

- [ ] **Step 5: Commit**

```bash
git add src/components/WechatPreviewFrame.vue src/components/MarkdownEditor.vue src/components/EditorWorkspace.vue
git commit -m "feat: wire editor-preview scroll sync in studio workspace"
```

---

### Task 8: 脚本入口与文档

**Files:**
- Modify: `package.json`
- Modify: `README.md`（开发者命令表加一行）

- [ ] **Step 1: 添加 npm script**

```json
"test:sync": "node --import ./scripts/register-aliases.mjs scripts/smoke-editor-sync-anchors.mjs"
```

- [ ] **Step 2: 运行全量检查**

Run: `npm run test:sync`  
Run: `npm run test:engine`  
Run: `npm run lint`  
Run: `npm run build`  
Expected: 全部通过

- [ ] **Step 3: Commit**

```bash
git add package.json README.md
git commit -m "chore: add test:sync script for preview anchor smoke"
```

---

## Spec coverage checklist

| Spec 要求 | Task |
|-----------|------|
| 桌面双向滚动 | Task 6–7 |
| 光标高亮 | Task 6–7 |
| 预览点击 → 编辑 | Task 6–7 |
| 移动弱化 + Tab 切换 | Task 6–7 `sideBySide` / `onRequestEditTab` |
| 套壳/平铺滚动根 | Task 7 `getScrollRoot` |
| `editorSyncAnchors` 分流 | Task 1–4 |
| 复制无 `data-md-*` | Task 1 strip + Task 4 + smoke |
| 富排版行号 | Task 3 |
| GFM 行号 | Task 2 |
| 防循环 / loading 暂停 | Task 6 |
| 冒烟测试 | Task 2–3, 8 |

## Manual QA（实现后）

按 spec「手动验收」1–10 在桌面/移动各走一遍；重点回归「复制公众号 HTML」粘贴无 `data-md-line-start`。
