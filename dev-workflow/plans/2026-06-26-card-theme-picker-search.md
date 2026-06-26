# CardThemePicker 主题搜索过滤

- **日期**：2026-06-26
- **领域**：vue
- **slug**：card-theme-picker-search

## 目标

为知识卡片工作室侧边栏 `CardThemePicker` 增加按名称、分组等关键词搜索过滤能力，使用户在 45 套主题中快速定位目标主题。

**验收标准**：

1. 主题商店头部出现搜索框，输入关键词后列表实时过滤
2. 支持匹配：主题 `label`、`id`、`desc`、分组 key、分组中文 label（如「莫兰迪」「小红书 Canva」）
3. 过滤后仍按现有 11 个分组 section 展示，空分组自动隐藏
4. 无匹配时显示「没有匹配的主题」空状态
5. 清空搜索恢复完整列表；选中主题行为不变
6. `npm run lint` 与 `npm run build` 通过

## 现状分析

### CardThemePicker.vue（待改）

- 路径：`src/components/card-studio/CardThemePicker.vue`
- 当前行为：从 `CARD_THEMES`（45 套）按 `groups` 数组硬编码的 11 个 `CardThemeGroup` 分组渲染卡片网格
- 头部仅展示统计文案（总套数、公众号同源数、Canva 数），**无搜索 UI**
- `grouped` computed 直接 `CARD_THEMES.filter(t => t.group === g.key)`，未经过滤链路
- 卡片展示 `theme.label`、`theme.desc` 及 `coverHint(theme)`（Canva/公众号同源/封面版式标签）

### ThemePicker.vue（参考实现）

- 路径：`src/components/ThemePicker.vue`
- 模式：`search = ref('')` → `filtered` computed 对 `THEME_OPTIONS` 做 `trim().toLowerCase()` 子串匹配 → `groupThemeOptions(filtered)` 再分组
- 匹配字段：`name`、`id`、`series`、`description`
- UI：`<input type="search" class="input">` + meta 行 + `v-if="grouped.length === 0"` 空状态

### 数据模型（CardThemeDef）

- 路径：`src/engine/card-studio/cardThemes/types.ts`
- 可搜索字段：`id`、`label`、`group`（11 种 enum）、`desc`
- **无** `series` 字段；分组展示 label 定义在组件内 `groups` 数组，与 `ThemePicker` 的 `groupThemeOptions` 不同

### 引用关系

- 唯一消费方：`src/components/card-studio/CardStudioSettings.vue`（`<CardThemePicker v-model="themeId" />`）
- 侧边栏固定布局，`CardThemePicker` 占 `flex-1 overflow-hidden`，搜索框应放在 `card-theme-picker__head` 内，滚动区保持 `overflow-y-auto`

### 引擎层

- **无需改动** `src/engine/card-studio/cardThemes/` — 纯 UI 过滤，不影响渲染/导出

## 影响文件

- [ ] `src/components/card-studio/CardThemePicker.vue` — 新增 search state、filtered computed、搜索输入框、空状态、meta 文案调整

（可选，本任务不强制）

- [ ] `src/engine/card-studio/cardThemes/groupLabels.ts` — 若未来多处复用分组 label，可抽取 `groups` 常量；当前仅单组件使用，可内联

## 实现步骤

### 1. 引入 search 状态

在 `<script setup>` 中：

```ts
import { computed, ref } from 'vue'

const search = ref('')
```

### 2. 实现 filteredThemes computed

参考 `ThemePicker.vue` 的 `filtered`，对 `CARD_THEMES` 过滤：

```ts
const filteredThemes = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return CARD_THEMES
  return CARD_THEMES.filter((t) => {
    const groupLabel = groups.find((g) => g.key === t.group)?.label ?? ''
    return (
      t.label.toLowerCase().includes(q)
      || t.id.toLowerCase().includes(q)
      || t.desc.toLowerCase().includes(q)
      || t.group.toLowerCase().includes(q)
      || groupLabel.toLowerCase().includes(q)
    )
  })
})
```

**说明**：`coverHint(theme)` 为运行时派生文案，首版可不纳入匹配（与 ThemePicker 不对等 `series` 的复杂度相当）；若实现 agent 认为有必要，可追加 `coverHint(theme).toLowerCase().includes(q)`。

### 3. 改造 grouped computed

将数据源从 `CARD_THEMES` 改为 `filteredThemes.value`：

```ts
const grouped = computed(() =>
  groups
    .map((g) => ({
      ...g,
      themes: filteredThemes.value.filter((t) => t.group === g.key),
    }))
    .filter((g) => g.themes.length > 0),
)
```

### 4. 调整统计 meta（可选增强）

- 无搜索：保持现有文案「45 套 · 含 … 公众号同源 · … Canva 小红书」
- 有搜索：改为「匹配 N / 45 套 · M 个分类」，参考 ThemePicker 的 `theme-menu__meta`

### 5. 模板：头部搜索框

在 `card-theme-picker__head` 内、`h2` 下方插入：

```html
<input
  v-model="search"
  class="input mt-2 w-full"
  type="search"
  placeholder="搜索主题名、分组…"
  aria-label="搜索卡片主题"
>
```

- 使用项目全局 `.input` 类（与 `ThemePicker`、`LayoutModulePicker` 一致）
- `card-studio` 目录内目前无 `.input` 用法，但全局样式已存在

### 6. 模板：空状态

在滚动区 `v-for="g in grouped"` 之后追加：

```html
<p v-if="grouped.length === 0" class="py-8 text-center text-sm text-ink-faint">
  没有匹配的主题
</p>
```

### 7. 自测要点

- 搜索「莫兰迪」→ 仅 morandi 分组 3 套
- 搜索「Canva」或「小红书」→ xhs 分组
- 搜索「公众号」→ culture/scrapbook/modern/formal/cute 相关分组
- 搜索 `cuteMilkTea` 或「奶茶」→ 单条命中
- 搜索 gibberish → 空状态
- 选中态 `aria-selected` 在过滤后仍正确

## 测试命令

```bash
# Vue 领域必跑（dev-verify）
npm run lint
npm run build

# 卡片 UI 相关建议追加
npm run test:card-studio
```

**手动验证**：

1. `npm run dev` → 打开 `/cards` 知识卡片工作室
2. 右侧「主题商店」输入各类关键词，确认过滤与空状态
3. 过滤后点击主题，预览区主题切换正常

## 风险与注意事项

1. **分组 label 与组件耦合**：`groups` 数组仅在 `CardThemePicker` 内定义，搜索匹配分组中文名依赖该数组；若日后分组 label 变更需同步 filter 逻辑
2. **性能**：45 条主题 + 客户端 filter，无性能风险；不必 debounce
3. **布局**：搜索框增加 head 高度，需确认小屏侧边栏滚动区仍可用（`min-h-0 flex-1 overflow-y-auto` 结构已具备）
4. **不抽 composable**：单组件使用，`ThemePicker` 也未抽取，保持一致即可
5. **引擎/冒烟测试**：`test:card-studio` 不覆盖 UI 搜索，主要靠 lint + build + 手动；不应修改 smoke 脚本除非新增可测纯函数
6. **领域 agent**：本任务为纯 Vue UI，推荐 `vue-frontend-agent` 而非 `card-studio-agent`（后者偏引擎/卡片渲染）
