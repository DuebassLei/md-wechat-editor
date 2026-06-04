export type PaperId =
  | 'ruled-white'
  | 'ruled-cream'
  | 'ruled-green'
  | 'ruled-pink'
  | 'grid-white'
  | 'grid-cream'
  | 'grid-large'
  | 'notebook-margin'
  | 'letter-vintage'
  | 'blank-white'
  | 'kraft'

export interface PaperStyle {
  id: string
  name: string
  backgroundColor: string
  backgroundImage: string
  /** 方格纸、复合背景等 */
  backgroundSize?: string
  backgroundPosition?: string
  lineHeight: number
  padding: { top: number; right: number; bottom: number; left: number }
  textColor: string
}

export interface PaperPreset {
  id: PaperId
  name: string
  styles: PaperStyle[]
}

function ruledLines(color: string, spacing: number): string {
  return `repeating-linear-gradient(transparent, transparent ${spacing - 1}px, ${color} ${spacing - 1}px, ${color} ${spacing}px)`
}

function gridLines(color: string): string {
  return `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`
}

function notebookBg(marginColor: string, lineColor: string, spacing: number): string {
  return `linear-gradient(to right, ${marginColor} 2px, transparent 2px), ${ruledLines(lineColor, spacing)}`
}

export const PAPER_PRESETS: PaperPreset[] = [
  {
    id: 'ruled-white',
    name: '横线纸',
    styles: [
      {
        id: 'default',
        name: '默认',
        backgroundColor: '#fffef8',
        backgroundImage: ruledLines('rgba(100, 149, 237, 0.35)', 32),
        lineHeight: 32,
        padding: { top: 48, right: 40, bottom: 48, left: 48 },
        textColor: '#1a1a2e',
      },
      {
        id: 'wide-margin',
        name: '宽边距',
        backgroundColor: '#fffef8',
        backgroundImage: ruledLines('rgba(100, 149, 237, 0.25)', 32),
        lineHeight: 32,
        padding: { top: 48, right: 72, bottom: 48, left: 72 },
        textColor: '#1a1a2e',
      },
      {
        id: 'dense',
        name: '密线',
        backgroundColor: '#fffef8',
        backgroundImage: ruledLines('rgba(100, 149, 237, 0.3)', 28),
        lineHeight: 28,
        padding: { top: 40, right: 40, bottom: 40, left: 40 },
        textColor: '#1a1a2e',
      },
    ],
  },
  {
    id: 'ruled-cream',
    name: '暖色横线',
    styles: [
      {
        id: 'default',
        name: '默认',
        backgroundColor: '#f5f0e1',
        backgroundImage: ruledLines('rgba(139, 90, 43, 0.2)', 32),
        lineHeight: 32,
        padding: { top: 48, right: 40, bottom: 48, left: 48 },
        textColor: '#3d2914',
      },
      {
        id: 'dense',
        name: '密线',
        backgroundColor: '#f5f0e1',
        backgroundImage: ruledLines('rgba(139, 90, 43, 0.25)', 28),
        lineHeight: 28,
        padding: { top: 40, right: 40, bottom: 40, left: 40 },
        textColor: '#3d2914',
      },
    ],
  },
  {
    id: 'ruled-green',
    name: '护眼绿',
    styles: [
      {
        id: 'default',
        name: '默认',
        backgroundColor: '#e8f5e9',
        backgroundImage: ruledLines('rgba(76, 175, 80, 0.28)', 32),
        lineHeight: 32,
        padding: { top: 48, right: 40, bottom: 48, left: 48 },
        textColor: '#1b3a1f',
      },
      {
        id: 'soft',
        name: '浅绿',
        backgroundColor: '#f1f8f2',
        backgroundImage: ruledLines('rgba(129, 199, 132, 0.35)', 32),
        lineHeight: 32,
        padding: { top: 48, right: 40, bottom: 48, left: 48 },
        textColor: '#2e4a32',
      },
    ],
  },
  {
    id: 'ruled-pink',
    name: '手账粉',
    styles: [
      {
        id: 'default',
        name: '默认',
        backgroundColor: '#fff5f7',
        backgroundImage: ruledLines('rgba(236, 72, 153, 0.22)', 32),
        lineHeight: 32,
        padding: { top: 48, right: 40, bottom: 48, left: 48 },
        textColor: '#4a2030',
      },
      {
        id: 'rose',
        name: '玫瑰',
        backgroundColor: '#fce8ef',
        backgroundImage: ruledLines('rgba(219, 39, 119, 0.18)', 30),
        lineHeight: 30,
        padding: { top: 44, right: 44, bottom: 44, left: 44 },
        textColor: '#5c1a33',
      },
    ],
  },
  {
    id: 'grid-white',
    name: '方格纸',
    styles: [
      {
        id: 'default',
        name: '小格',
        backgroundColor: '#ffffff',
        backgroundImage: gridLines('rgba(180, 180, 180, 0.4)'),
        backgroundSize: '24px 24px',
        lineHeight: 24,
        padding: { top: 40, right: 40, bottom: 40, left: 40 },
        textColor: '#222',
      },
      {
        id: 'fine',
        name: '细格',
        backgroundColor: '#ffffff',
        backgroundImage: gridLines('rgba(200, 200, 200, 0.35)'),
        backgroundSize: '20px 20px',
        lineHeight: 20,
        padding: { top: 36, right: 36, bottom: 36, left: 36 },
        textColor: '#222',
      },
    ],
  },
  {
    id: 'grid-cream',
    name: '米黄方格',
    styles: [
      {
        id: 'default',
        name: '默认',
        backgroundColor: '#faf6ed',
        backgroundImage: gridLines('rgba(160, 130, 90, 0.28)'),
        backgroundSize: '24px 24px',
        lineHeight: 24,
        padding: { top: 40, right: 40, bottom: 40, left: 40 },
        textColor: '#3d2914',
      },
      {
        id: 'warm',
        name: '暖棕',
        backgroundColor: '#f5ebe0',
        backgroundImage: gridLines('rgba(139, 90, 43, 0.22)'),
        backgroundSize: '24px 24px',
        lineHeight: 24,
        padding: { top: 40, right: 40, bottom: 40, left: 40 },
        textColor: '#3d2914',
      },
    ],
  },
  {
    id: 'grid-large',
    name: '作文格',
    styles: [
      {
        id: 'default',
        name: '标准',
        backgroundColor: '#fffef8',
        backgroundImage: gridLines('rgba(100, 149, 237, 0.35)'),
        backgroundSize: '32px 32px',
        lineHeight: 32,
        padding: { top: 48, right: 48, bottom: 48, left: 48 },
        textColor: '#1a1a2e',
      },
      {
        id: 'green',
        name: '绿色',
        backgroundColor: '#f1f8f2',
        backgroundImage: gridLines('rgba(76, 175, 80, 0.3)'),
        backgroundSize: '32px 32px',
        lineHeight: 32,
        padding: { top: 48, right: 48, bottom: 48, left: 48 },
        textColor: '#1b3a1f',
      },
    ],
  },
  {
    id: 'notebook-margin',
    name: '红线笔记',
    styles: [
      {
        id: 'default',
        name: '经典',
        backgroundColor: '#fffef8',
        backgroundImage: notebookBg('rgba(220, 38, 38, 0.55)', 'rgba(100, 149, 237, 0.3)', 32),
        lineHeight: 32,
        padding: { top: 48, right: 40, bottom: 48, left: 56 },
        textColor: '#1a1a2e',
      },
      {
        id: 'cream',
        name: '暖黄',
        backgroundColor: '#f5f0e1',
        backgroundImage: notebookBg('rgba(185, 28, 28, 0.45)', 'rgba(139, 90, 43, 0.2)', 32),
        lineHeight: 32,
        padding: { top: 48, right: 40, bottom: 48, left: 56 },
        textColor: '#3d2914',
      },
    ],
  },
  {
    id: 'letter-vintage',
    name: '复古信笺',
    styles: [
      {
        id: 'default',
        name: '默认',
        backgroundColor: '#f9f3e3',
        backgroundImage: `${ruledLines('rgba(139, 90, 43, 0.15)', 36)}, linear-gradient(rgba(139, 90, 43, 0.08) 1px, transparent 1px)`,
        backgroundSize: 'auto, 100% 144px',
        backgroundPosition: '0 0, 0 0',
        lineHeight: 36,
        padding: { top: 56, right: 56, bottom: 56, left: 56 },
        textColor: '#3d2914',
      },
      {
        id: 'parchment',
        name: '羊皮',
        backgroundColor: '#ede0c8',
        backgroundImage: `${ruledLines('rgba(92, 64, 51, 0.12)', 34)}, linear-gradient(rgba(92, 64, 51, 0.06) 1px, transparent 1px)`,
        backgroundSize: 'auto, 100% 136px',
        lineHeight: 34,
        padding: { top: 52, right: 52, bottom: 52, left: 52 },
        textColor: '#2c1810',
      },
    ],
  },
  {
    id: 'blank-white',
    name: '空白纸',
    styles: [
      {
        id: 'default',
        name: '默认',
        backgroundColor: '#ffffff',
        backgroundImage: 'none',
        lineHeight: 32,
        padding: { top: 48, right: 48, bottom: 48, left: 48 },
        textColor: '#1a1a2e',
      },
      {
        id: 'warm',
        name: '暖白',
        backgroundColor: '#fffef8',
        backgroundImage: 'none',
        lineHeight: 32,
        padding: { top: 48, right: 48, bottom: 48, left: 48 },
        textColor: '#1a1a2e',
      },
    ],
  },
  {
    id: 'kraft',
    name: '牛皮纸',
    styles: [
      {
        id: 'default',
        name: '默认',
        backgroundColor: '#c4a574',
        backgroundImage: ruledLines('rgba(60, 40, 20, 0.15)', 32),
        lineHeight: 32,
        padding: { top: 48, right: 40, bottom: 48, left: 48 },
        textColor: '#2c1810',
      },
      {
        id: 'dark-lines',
        name: '深线',
        backgroundColor: '#c4a574',
        backgroundImage: ruledLines('rgba(60, 40, 20, 0.3)', 32),
        lineHeight: 32,
        padding: { top: 48, right: 40, bottom: 48, left: 48 },
        textColor: '#2c1810',
      },
      {
        id: 'aged',
        name: '做旧',
        backgroundColor: '#b8956a',
        backgroundImage: ruledLines('rgba(40, 25, 12, 0.2)', 30),
        lineHeight: 30,
        padding: { top: 44, right: 44, bottom: 44, left: 44 },
        textColor: '#2c1810',
      },
    ],
  },
]

export const PAPER_IDS: PaperId[] = PAPER_PRESETS.map((p) => p.id)

export function getPaperPreset(paperId: PaperId): PaperPreset {
  const preset = PAPER_PRESETS.find((p) => p.id === paperId)
  if (!preset) return PAPER_PRESETS[0]
  return preset
}

export function getPaperStyle(paperId: PaperId, styleId: string): PaperStyle {
  const preset = getPaperPreset(paperId)
  return preset.styles.find((s) => s.id === styleId) ?? preset.styles[0]
}
