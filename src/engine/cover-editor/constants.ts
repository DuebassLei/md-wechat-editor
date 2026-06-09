import type { CoverAspect, CoverBgPreset, CoverEditorState, CoverExportSize, CoverFontOption } from './types'

export const COVER_FONT_OPTIONS: CoverFontOption[] = [
  { value: "'PingFang SC', 'Microsoft YaHei', sans-serif", label: '苹方 / 雅黑' },
  { value: "'Noto Sans SC', 'PingFang SC', sans-serif", label: '思源黑体', className: 'cover-font-noto-sans' },
  { value: "'Noto Serif SC', 'Songti SC', serif", label: '思源宋体', className: 'cover-font-noto-serif' },
  { value: "'LXGW WenKai', 'KaiTi', serif", label: '霞鹜文楷', className: 'cover-font-lxgw-wenkai' },
  { value: "'Ma Shan Zheng', 'KaiTi', cursive", label: '马善政毛笔', className: 'cover-font-ma-shan-zheng' },
  { value: "'Long Cang', 'KaiTi', cursive", label: '龙藏体', className: 'cover-font-long-cang' },
  { value: "'KaiTi', 'STKaiti', serif", label: '楷体' },
]

export const COVER_BG_PRESETS: CoverBgPreset[] = [
  {
    id: 'misty-blue',
    label: '雾蓝晨曦',
    background: 'linear-gradient(145deg, #5b7fa3 0%, #8eb4c9 38%, #c5dde8 72%, #e8f2f7 100%)',
    thumb: 'linear-gradient(135deg, #5b7fa3, #c5dde8)',
  },
  {
    id: 'forest-mist',
    label: '林间薄雾',
    background: 'linear-gradient(160deg, #1e3a2f 0%, #3d6b4f 35%, #7a9e8a 65%, #b8cfc0 100%)',
    thumb: 'linear-gradient(135deg, #1e3a2f, #7a9e8a)',
  },
  {
    id: 'sunrise-glow',
    label: '晨光暖色',
    background: 'linear-gradient(155deg, #c45c26 0%, #e8924f 30%, #f5c98a 58%, #fde8c8 100%)',
    thumb: 'linear-gradient(135deg, #c45c26, #fde8c8)',
  },
  {
    id: 'ink-night',
    label: '墨韵夜色',
    background: 'linear-gradient(165deg, #1a1a2e 0%, #2d3561 45%, #4a5a8a 75%, #6b7db3 100%)',
    thumb: 'linear-gradient(135deg, #1a1a2e, #6b7db3)',
  },
  {
    id: 'paper-warm',
    label: '暖纸质感',
    background: 'linear-gradient(180deg, #e8dcc8 0%, #f5efe4 50%, #faf6f0 100%)',
    thumb: 'linear-gradient(135deg, #e8dcc8, #faf6f0)',
  },
]

export const COVER_ASPECT_LABELS: Record<CoverAspect, string> = {
  landscape: '横版 16:9',
  portrait: '竖版 9:16',
  wechat: '公众号 2.35:1',
}

export const COVER_EXPORT_SIZES: Record<CoverAspect, CoverExportSize> = {
  landscape: { w: 1280, h: 720 },
  portrait: { w: 1080, h: 1920 },
  wechat: { w: 900, h: 383 },
}

export const COVER_PREVIEW_MAX_WIDTH: Record<CoverAspect, number> = {
  landscape: 500,
  portrait: 300,
  wechat: 500,
}

export const DEFAULT_COVER_STATE: CoverEditorState = {
  title: '墨韵简排',
  keywords: '排版 封面 创作',
  fontFamily: COVER_FONT_OPTIONS[0].value,
  titleFontSize: 48,
  keywordsFontSize: 24,
  titleColor: '#ffffff',
  keywordsColor: '#ffffff',
  layout: 'center',
  aspect: 'landscape',
  bgPresetId: COVER_BG_PRESETS[0].id,
  customBgImage: '',
  overlayOpacity: 0.25,
}

export function getAspectDefaults(aspect: CoverAspect): Pick<CoverEditorState, 'titleFontSize' | 'keywordsFontSize'> {
  if (aspect === 'portrait') {
    return { titleFontSize: 32, keywordsFontSize: 16 }
  }
  if (aspect === 'wechat') {
    return { titleFontSize: 42, keywordsFontSize: 20 }
  }
  return { titleFontSize: 48, keywordsFontSize: 24 }
}

export function getBgPreset(id: string): CoverBgPreset {
  return COVER_BG_PRESETS.find((p) => p.id === id) ?? COVER_BG_PRESETS[0]
}

export function formatKeywords(text: string): string {
  return text
    .split(/\s+/)
    .map((k) => k.trim())
    .filter(Boolean)
    .join(' / ')
}

export function splitTitleLines(text: string): string[] {
  return text.split('\n')
}
