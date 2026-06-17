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
  {
    id: 'xhs-coral',
    label: '珊瑚粉',
    background: 'linear-gradient(155deg, #ff6b8a 0%, #ff8a9b 28%, #ffb3c1 58%, #ffe0e8 100%)',
    thumb: 'linear-gradient(135deg, #ff6b8a, #ffe0e8)',
  },
  {
    id: 'xhs-cream',
    label: '奶油纸面',
    background: 'linear-gradient(180deg, #f0e6d6 0%, #f7f2e8 45%, #fffdf8 100%)',
    thumb: 'linear-gradient(135deg, #f0e6d6, #fffdf8)',
  },
  {
    id: 'xhs-macaron',
    label: '马卡龙',
    background: 'linear-gradient(145deg, #ffc8dd 0%, #ffe5ec 35%, #fff4e6 70%, #e8f4ea 100%)',
    thumb: 'linear-gradient(135deg, #ffc8dd, #e8f4ea)',
  },
  {
    id: 'xhs-lavender',
    label: '莫兰迪紫',
    background: 'linear-gradient(160deg, #8b7faf 0%, #a99bc4 40%, #c9bfd6 70%, #e8e2ef 100%)',
    thumb: 'linear-gradient(135deg, #8b7faf, #e8e2ef)',
  },
  {
    id: 'xhs-mint',
    label: '薄荷清新',
    background: 'linear-gradient(155deg, #5aab8c 0%, #7ec4a8 35%, #b8e0cc 65%, #e5f5ec 100%)',
    thumb: 'linear-gradient(135deg, #5aab8c, #e5f5ec)',
  },
  {
    id: 'xhs-sunset',
    label: '暖橙生活',
    background: 'linear-gradient(150deg, #e85d4c 0%, #f0926c 30%, #f5c89a 60%, #fff0e0 100%)',
    thumb: 'linear-gradient(135deg, #e85d4c, #fff0e0)',
  },
  {
    id: 'wechat-green',
    label: '微信绿',
    background: 'linear-gradient(135deg, #047857 0%, #059669 38%, #10b981 68%, #6ee7b7 100%)',
    thumb: 'linear-gradient(135deg, #047857, #6ee7b7)',
  },
  {
    id: 'wechat-cinnabar',
    label: '朱砂红韵',
    background: 'linear-gradient(150deg, #7f1d1d 0%, #b45309 32%, #d97706 58%, #fde68a 100%)',
    thumb: 'linear-gradient(135deg, #7f1d1d, #fde68a)',
  },
  {
    id: 'wechat-ink',
    label: '深墨资讯',
    background: 'linear-gradient(160deg, #0c0a09 0%, #1c1917 42%, #292524 72%, #44403c 100%)',
    thumb: 'linear-gradient(135deg, #0c0a09, #44403c)',
  },
  {
    id: 'wechat-slate',
    label: '灰蓝资讯',
    background: 'linear-gradient(145deg, #1e293b 0%, #334155 38%, #475569 68%, #64748b 100%)',
    thumb: 'linear-gradient(135deg, #1e293b, #64748b)',
  },
  {
    id: 'wechat-soft',
    label: '素雅白',
    background: 'linear-gradient(180deg, #e2e8f0 0%, #f1f5f9 45%, #ffffff 100%)',
    thumb: 'linear-gradient(135deg, #e2e8f0, #ffffff)',
  },
  {
    id: 'wechat-jade',
    label: '青玉国风',
    background: 'linear-gradient(155deg, #134e4a 0%, #0f766e 35%, #14b8a6 62%, #99f6e4 100%)',
    thumb: 'linear-gradient(135deg, #134e4a, #99f6e4)',
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
