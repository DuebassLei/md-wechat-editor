import type { CardAspect } from '@/engine/card-export/types'

/** 对齐 MD2Card splitMode */
export type CardSplitMode = 'noSplit' | 'autoSplit' | 'hrSplit'

export const CARD_SPLIT_MODES: { id: CardSplitMode; label: string; desc: string }[] = [
  { id: 'noSplit', label: '长图文', desc: '单卡输出，超出时提示删减' },
  { id: 'autoSplit', label: '自动拆分', desc: '按卡片高度自动分页' },
  { id: 'hrSplit', label: '横线拆分', desc: '按 --- 或 :::page 分段后再分页' },
]

export const CARD_SIZE_PRESETS: { label: string; aspect: CardAspect; previewWidth: number }[] = [
  { label: '3:4 竖版 (360×480)', aspect: '3:4', previewWidth: 360 },
  { label: '1:1 方形 (360×360)', aspect: '1:1', previewWidth: 360 },
  { label: '小红书 (330×440)', aspect: '3:4', previewWidth: 330 },
  { label: '宽屏 (440×586)', aspect: '3:4', previewWidth: 440 },
]

export const CARD_ZOOM_OPTIONS = [
  { label: '40%', value: 0.4 },
  { label: '60%', value: 0.6 },
  { label: '80%', value: 0.8 },
  { label: '100%', value: 1 },
] as const

/** Sky 文档主题对照（MD2Card → 墨韵简排） */
export const CARD_THEME_RECOMMENDATIONS: { scene: string; md2card: string; themeId: string }[] = [
  { scene: '科普 / 科技', md2card: '暗黑科技', themeId: 'minimal-dark' },
  { scene: '干货 / 笔记', md2card: '笔记本', themeId: 'minimal-light' },
  { scene: '古诗 / 文艺', md2card: '诗意朦胧', themeId: 'xhs-poetic-mist' },
  { scene: '清爽知识', md2card: '苹果备忘录', themeId: 'minimal-light' },
  { scene: '暖色纸张', md2card: '温暖柔和', themeId: 'warm-paper' },
]
