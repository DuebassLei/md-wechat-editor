# 知识卡片渲染引擎视觉重构

- **日期**：2026-06-26
- **领域**：card
- **slug**：card-visual-redesign

## 目标

将 `cardThemeStyles.ts` 生成的卡片 CSS 从「干净文章排版」提升至「装饰性知识卡片」水准，使 19 套草案主题（`wechat-drafts.ts`）在卡片编辑器中的渲染效果与 `previews/wechat-theme-drafts/` 中各 HTML 预览文件视觉一致。

验收标准：
1. scrapbook 系列主题的 h1 具有「和纸胶带双色渐变」效果（`linear-gradient` 双色拼接 + 旋转 + 阴影）
2. scrapbook/cute 系列的 h2 具有「圆角胶囊」渲染（虚线/实线边框 + 渐变背景 + 偏移阴影）
3. 各主题的 h3 显示 `prefix` 装饰（emoji/符号）而非空白
4. 引文（blockquote）在 scrapbook/cute 系列中具有圆角卡片 + 偏移阴影效果
5. 分割线（hr）在 scrapbook/cute 系列中显示装饰性重复渐变图案或文字图案
6. strong 在 scrapbook/cute 系列中具有背景高亮 + 圆角
7. a 链接在 scrapbook/cute 系列中显示波浪下划线
8. 全部 19 套草案主题均通过 `npm run test:card-studio`

## 现状分析

### 当前 cardThemeStyles.ts 与预览 HTML 的关键差距

| 装饰维度 | 预览 HTML 的效果 | 当前 cardThemeStyles.ts | 差距 |
|----------|-----------------|------------------------|------|
| **h1** | 渐变双色胶带背景 + rotate + box-shadow（scrapbook）；梯度荧光笔效果（cute）；角标 emoji prefix/suffix | 仅有 `highlight-marker` 的 `linear-gradient transparent 55%` 或 `center-line` 下划线 | 无双色拼接、无 transform:rotate、无前缀 emoji |
| **h2** | 渐变背景胶囊 + 偏移阴影 box-shadow + 虚线/实线边框（cute/scrapbook） | `pill` style 仅有 `background: accentWeak` + `border-radius: 999px` | 无渐变色背景、无偏移阴影、无边框装饰 |
| **h3** | `::before` 显示 emoji（🌸、🍑、✿、✦）或符号（▸、♡） | CSS 中无 h3 prefix 定义 | h3 无 prefix 显示能力 |
| **blockquote** | 圆角卡片 + 偏移阴影 `box-shadow: 3px 3px 0 accent`（scrapbook/cute） | `rounded` style 有 border-radius 但无 box-shadow | 缺少偏移阴影和完整的「贴纸卡片」效果 |
| **hr** | 重复渐变彩色条纹（scrapbook）或文字图案 `· · · ✦ · · ·`（cute） | 仅有 `border-top: 1px solid hr` | 无任何装饰性分割线 |
| **strong** | 背景色高亮 + padding + border-radius（scrapbook/cute） | 仅有 `font-weight:700; color:ink` | 无背景高亮、无 padding/border-radius |
| **a** | `text-decoration: underline wavy accent` 波浪下划线 | `border-bottom: 1px solid linkUnderline` | 无波浪下划线 |
| **ul li** | 自定义 `::marker`（🍡、💫） | 标准 disc/list-style | 无自定义 marker |
| **table** | `border-radius` + `overflow:hidden` + 完整白底单元格 | 标准 `border-collapse` 无圆角 | 无圆角表格 |
| **pre/code** | 偏移阴影 + 完整白底 + 双边框（scrapbook） | 仅有 `background: preBg` + `border-radius: 10px` | 无阴影、无装饰性边框 |
| **ol** | 无特殊效果 | 有 `olAccentNumbers` 可显示彩色序号 | 已有支持 |

### 核心问题：prefix/suffix 语义缺失

预览 HTML 使用 `<span class="prefix">` / `<span class="content">` / `<span class="suffix">` 结构来分离标题装饰与正文。当前 `renderCardMarkdown.ts` 通过 `applyHeadingThemeCompat` 处理这个结构（将 `h1` 内容包裹进 `.content` 等），但 `cardThemeStyles.ts` 生成的 CSS 中，很多主题的 `.prefix` 和 `.suffix` 被设置为 `display:none`，导致无法显示装饰。

### 各主题系列的 style flags 复用模式

- **scrapbook** 系列（5 套主题）：复用 `scrapbookStyle` 对象，统一使用 `highlight-marker` + `pill` + `rounded`
- **cute** 系列（6 套主题）：复用 `cuteStyle` 对象，统一使用 `highlight-marker` + `pill` + `rounded`
- **culture**、**modern**、**formal** 系列：各有独立的 style flags 组合

这意味着新增的装饰能力需要在 style flags 层面做主题区分，不能在 `cardThemeStyles.ts` 中硬编码。

## 影响文件

- [ ] `src/engine/card-studio/cardThemes/types.ts` — 新增 `CardThemeStyleFlags` 字段：`hrStyle`、`strongStyle`、`linkUnderline`、`h3Decor`、`liMarker`、`tableRadius`、`preStyle`、`h1Rotate`、`h1Shadow`、`bqShadow`
- [ ] `src/engine/card-studio/cardThemeStyles.ts` — 重写 `h1Rules`、`h2Rules`、`h3Rules`（新增）、`blockquoteRules`、`hrRules`（新增）、`strongRules`（新增）、`linkRules`（新增）；修改 `buildCardThemeStyleBlock` 集成新规则
- [ ] `src/engine/card-studio/cardThemes/presets/wechat-drafts.ts` — 更新 `scrapbookStyle`、`cuteStyle` 和独立主题的 style flags 以匹配预览效果
- [ ] `src/engine/card-studio/renderCardMarkdown.ts` — 如需支持 h3 prefix 等标记，可能需要调整 `applyHeadingThemeCompat` 对 h3 的处理
- [ ] `src/engine/card-studio/cardThemePatterns.ts` — 如需新增背景图案则追加；暂推测不需要

### 不需要修改的文件（确认后）

- `prepareCardHtml.ts` — 不直接涉及 CSS 生成逻辑；只需 style block 输出即可
- `wrapCardChrome.ts` — 不涉及内容排版 CSS
- `buildPages.ts` — 不涉及样式生成
- `cardXhsChrome.ts` — XHS 系列壳层样式的装饰已足够，不需要改动

## 实现步骤

### 步骤 1：扩展 `CardThemeStyleFlags` 类型（types.ts）

新增以下 style flags：

```typescript
/** h3 装饰样式：'none' | 'emoji-prefix' | 'symbol-prefix' */
h3Style?: 'none' | 'emoji' | 'symbol'

/** 分割线样式：'line' | 'pattern-stripes' | 'pattern-dots' | 'pattern-text' */
hrStyle?: 'line' | 'stripes' | 'dots' | 'text'

/** strong 样式：'default' | 'highlight-bg' */
strongStyle?: 'default' | 'highlight'

/** 链接下划线样式：'solid' | 'wavy' */
linkUnderline?: 'solid' | 'wavy'

/** 列表 marker 自定义内容 */
liMarker?: string

/** blockquote 阴影偏移量（px） */
bqShadowOffset?: number

/** h1 是否旋转（deg） */
h1Rotate?: number

/** h1 阴影色 */
h1Shadow?: string

/** 代码块样式：'default' | 'card-shadow' */
preStyle?: 'default' | 'card'

/** 表格圆角半径（px） */
tableRadius?: number

/** 是否显示 h1/h3 的 prefix/suffix emoji */
showHeadingDecor?: boolean
```

### 步骤 2：新增 CSS 生成函数（cardThemeStyles.ts）

#### 2a. 新增 `h3Rules()`

当前的 `buildCardThemeStyleBlock` 中 h3 只有基本的字号和字重。新增独立函数：

- 根据 `h3Style` 决定是否启用 emoji/symbol prefix
- 当 `showHeadingDecor` 为 true 时，不设置 `.prefix` / `.suffix` 为 `display:none`
- 生成 `::before` 内容（通过 token 或 theme 中配置的 emoji）
- 不同主题系列使用不同前缀符号：
  - scrapbook：粉红色系列 emoji（`✿`）
  - cute：不同色系 emoji（`🌸`、`🍑`、`🌙`、`♡`）
  - tech-grid：`▸`
  - formal-editorial：无 prefix

#### 2b. 修改 `h1Rules()` — 添加胶带标题效果

对于 `h1Style === 'highlight-marker'`（scrapbook/cute 系列使用）：

- 目前 CSS 是 `background: linear-gradient(transparent 55%, hexAlpha('#ffe566', 0.85) 55%)` — 单色荧光笔
- 需要改为**双色渐变拼接**，类似预览 HTML 中的效果：
  ```css
  background: linear-gradient(135deg, accent1 0%, accent1 48%, transparent 48%, transparent 52%, accent2 52%, accent2 100%);
  border-radius: 4px;
  box-shadow: offsetX offsetY 0 shadowColor;
  transform: rotate(rotDeg);
  ```
- 需要新增 `h1BgColor1`、`h1BgColor2` 到 tokens 或 style flags，或从已有 tokens 派生

方案：使用 `t.accentWeak` 和 `t.hr` 派生双色。在 `wechat-drafts.ts` 的 `scrapbookStyle` 中，各主题的 `accent` 和 `hr` 已匹配预览文件中的胶带颜色对（如 mint 的 `#7ECBA1`/`#A7F3D0`，peach 的 `#FDBA74`/`#FFE8D6`）。派生公式：
- 色块 1 = `hexAlpha(t.accent, 0.3)`（35% 不透明）
- 色块 2 = `t.hr`（半透明色）
- 旋转 = `h1Rotate ?? 0`
- 阴影 = `h1Shadow ?? hexAlpha(t.hr, 0.6)`

#### 2c. 修改 `h2Rules()` — 添加渐变胶囊

对于 `h2Style === 'pill'`：

- 当前：`background: t.accentWeak` + `border-radius: 999px`
- 需要改为可选用渐变：
  ```css
  background: linear-gradient(135deg, t.accent 0%, softerAccent 100%);
  color: #fff;
  box-shadow: 0 4px 0 darkerAccent, 0 5px 14px hexAlpha(darkerAccent, 0.2);
  ```
- scrapbook 系列保留当前 `accentWeak` 背景 + 虚线边框
- cute 系列使用渐变背景 + 偏移阴影（深色版）
- 用 `h2Style === 'pill-gradient'` 区分，或通过新的 style flag `h2PillSolid` 控制

推荐方案：将 cute 系列的 h2Style 改为 `'pill-solid'` 新值，同 `'pill'` 但使用渐变背景 + 白色文字 + 偏移阴影。

#### 2d. 新增 `hrRules()`

预览 HTML 展示了两种装饰性分割线：

1. **scrapbook 系列的重复渐变条纹**：
   ```css
   hr {
     border: none; height: 12px; margin: 2em 16px;
     background: repeating-linear-gradient(
       90deg,
       accent-light 0, accent-light 8px,
       transparent 8px, transparent 12px,
       accent2 12px, accent2 20px,
       transparent 20px, transparent 24px
     );
   }
   ```

2. **cute/star 系列的文字图案**（通过 `::before` 模拟）：
   ```css
   hr { border: none; text-align: center; height: auto; background: none; }
   hr::before { content: "· · · ✿ · · ·"; color: ...; letter-spacing: 0.3em; }
   ```

根据 `hrStyle` 字段：
- `'line'`：保持当前 `border-top: 1px solid t.hr`
- `'stripes'`：重复渐变条纹（scrapbook 系列）
- `'text'`：通过 `::before` 显示文本图案（cute 系列）
- `'dots'`：点线图案（cute-star-dream 的 `· · · ✦ · · ·`）

#### 2e. 修改 blockquote 规则 — 添加偏移阴影

对于 `blockquoteStyle === 'rounded'`：
- 当前：`border: 1.5px solid t.hr; border-left: 4px solid t.accent; background: bqBg; border-radius: 12px`
- 添加：`box-shadow: bqShadowOffset px bqShadowOffset px 0 t.hr`（或 3px 3px 0 t.hr 的默认值）
- scrapbook 系列还使用了完整的白色背景 + 2px 边框，需要调整

#### 2f. 修改 strong 规则 — 添加背景高亮

根据 `strongStyle`：
- `'default'`：保持当前 `color: t.ink; font-weight: 700`
- `'highlight'`：添加 `background: hexAlpha(t.accent, 0.25); padding: 0 4px; border-radius: 4px` 以及对比色文字

#### 2g. 修改 a 规则 — 添加波浪下划线

根据 `linkUnderline`：
- `'solid'`：当前 `border-bottom: 1px solid linkUnderline`
- `'wavy'`：改为 `text-decoration: underline wavy t.accent` + `text-underline-offset: 2px`

#### 2h. 修改 ol/ul 规则

对于 cute/scrapbook 系列的 ul：
- 添加 `li::marker` 自定义内容（通过 `liMarker` flag）
- 例如 cute 系列的 `content: "🍡 "`、star-dream 的 `content: "💫 "`

### 步骤 3：更新主题预设（wechat-drafts.ts）

#### scrapbookStyle 更新

```typescript
const scrapbookStyle: CardThemeStyleFlags = {
  h1Style: 'highlight-marker',
  h2Style: 'pill',
  headerDecor: 'none',
  codeBordered: true,
  bgPattern: 'fine-grid',
  coverLayout: 'sticker',
  blockquoteStyle: 'rounded',
  hrStyle: 'stripes',          // 新增：重复渐变条纹
  strongStyle: 'highlight',    // 新增：背景高亮
  linkUnderline: 'wavy',       // 新增：波浪下划线
  bqShadowOffset: 3,           // 新增：偏移阴影
  h1Rotate: -0.5,              // 新增：微旋转
  preStyle: 'card',            // 新增：代码块带阴影
  tableRadius: 12,             // 新增：圆角表格
}
```

#### cuteStyle 更新

```typescript
const cuteStyle: CardThemeStyleFlags = {
  h1Style: 'highlight-marker',
  h2Style: 'pill-solid',       // 修改：渐变胶囊 + 白色文字 + 偏移阴影
  headerDecor: 'none',
  codeBordered: true,
  bgPattern: 'bloom',
  coverLayout: 'sticker',
  blockquoteStyle: 'rounded',
  hrStyle: 'text',             // 新增：文字图案分割线
  strongStyle: 'highlight',    // 新增：背景高亮
  linkUnderline: 'wavy',       // 新增：波浪下划线
  bqShadowOffset: 4,           // 新增：偏移阴影
  h1Rotate: 0,                 // 不旋转
  h3Decor: 'emoji',            // 新增：emoji prefix
  liMarker: '🍡 ',            // 新增：列表 marker
}
```

注意：每个 cute 主题的 `hrStyle` 可能需要不同文本。考虑在 tokens 中增加 `hrText` 字段，或在 style flags 中设置。推荐在 tokens 中新增 `hrDecorText` 字段。

#### 各主题的特殊覆盖

- `cuteBubble`：hr text `· · · ✿ · · ·`
- `cuteStarDream`：hr text `· · · ✦ · · ·`
- `cuteMilkTea`：hr text 可能不同
- `techGrid`：hr 改为 `hrStyle: 'stripes'`（蓝白条纹）
- `zhuYinSeal`、`deepLetter`、`formalEditorial`：保持当前 `'line'` 或 `'gradient'`（渐变透明分割线）

### 步骤 4：集成到 `buildCardThemeStyleBlock`

在 `buildCardThemeStyleBlock` 函数中：

1. 按顺序调用各新增规则函数
2. 确保 h3 的 `.prefix`/`.suffix` 在有装饰时不被 `display:none` 覆盖
3. 保持向后兼容：未设置的新 flag 使用默认值

```typescript
export function buildCardThemeStyleBlock(themeId: CardThemeId): string {
  // ...现有代码...
  
  // 新增规则
  const hrStyle = s.hrStyle ?? 'line'
  const strongStyleFlag = s.strongStyle ?? 'default'
  const linkUnderlineStyle = s.linkUnderline ?? 'solid'
  const h3Decor = s.h3Decor ?? 'none'
  
  // 构建 CSS
  const css = `
    // ...现有 CSS...
    ${h3Rules(h3Decor, t, headingFont)}
    ${hrRules(hrStyle, t)}
    ${strongRules(strongStyleFlag, t)}
    ${linkRules(linkUnderlineStyle, t)}
    ${ulRules(s.liMarker, t)}
  `
  return `<style>${css}</style>`
}
```

### 步骤 5：验证与测试

1. 运行 `npm run test:card-studio` 确保现有测试通过
2. 检查 smoke 测试是否覆盖了新 style flags 的断言
3. 手动验证核心主题的视觉效果：
   - mintScrapbook: 与 mint-scrapbook.html 对照
   - cuteBubble: 与 cute-bubble.html 对照
   - cuteStarDream: 与 cute-star-dream.html 对照
   - zhuYinSeal: 与 zhu-yin-seal.html 对照
   - deepLetter: 与 deep-letter.html 对照

## 测试命令

```bash
# 核心测试
npm run test:card-studio

# 浏览器测试（如有）
npm run test:card-studio:browser

# 完整引擎测试
npm run test:engine

# TypeScript 类型检查
npx tsc --noEmit
```

## 风险与注意事项

### 向后兼容

1. **现有 style flags 的默认值**：所有新增 flag 在 `CardThemeStyleFlags` 中为可选（`?`）。`buildCardThemeStyleBlock` 中为未设置的值提供默认行为，确保现有 26 套非草案主题（minimal-light、ocean-blue 等）视觉不变。
2. **预览 vs 渲染一致性**：预览 HTML 的 padding/margin 值（如 `1em 16px`）与当前 cardThemeStyles 的值（如 `10px 14px`）有差异。需要决定是精确匹配预览还是保持现有间距。建议：尊重预览的设计意图（间距可以微调），但保持 cardThemeStyles 使用 px 单位的一致性。

### 主题预设更新要求

1. **scrapbookStyle 和 cuteStyle** 是共享对象，更新后会影响旗下所有主题。需要验证每个主题的配色是否适合共享样式（颜色派生自 tokens，应该是安全的）。
2. **需要新增的 h2Style 值 `'pill-solid'`**：与 `'pill'` 不同，后者用于 scrapbook 保留虚线边框。

### Markdown 渲染管线影响

1. `renderCardMarkdown.ts` 中的 `applyHeadingThemeCompat` 函数负责将 h1/h2 包裹进 `.content` 等结构。需要确认 h3 是否也被处理。如果不被处理，预览 HTML 中的 h3 prefix 装饰不会被触发。
2. 检查 `applyHeadingThemeCompat` 的实现。

### 测试覆盖率

1. 当前的 `smoke-card-studio.mjs` 测试覆盖了主题数量、CSS 关键选择器、wrap 功能等基础断言。新样式需要补充测试：每个新 `hrStyle` 值对应的 CSS 输出应包含特定类名或样式规则。
2. 建议在 smoke 测试中为每个新 style flag 添加 `css.includes(...)` 断言。

### 已知的预览 HTML 与 cardThemeStyles 结构差异

预览 HTML 使用 `#nice h1` 选择器，而 cardThemeStyles 使用 `.card-reading h1`。这不应影响样式转移，但需要注意选择器特异度可能不同。

### 优先级

1. h1 双色渐变胶带效果（最醒目）
2. blockquote 偏移阴影（影响最大）
3. hr 装饰性分割线（主题区分度最高）
4. strong 背景高亮 + a 波浪下划线（细节提升）
5. h3 prefix 装饰 + ul 自定义 marker
6. 表格圆角 + 代码块阴影
