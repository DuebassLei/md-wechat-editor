/** 排版引擎默认主题色 */
export interface ThemeColors {
  accent: string
  dark: string
  light: string
  border: string
  rgb: string
}

const DEFAULT_ACCENT = '#6c5ce7'
const DEFAULT_DARK = '#5a4bd1'

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

export function buildThemeColors(accent = DEFAULT_ACCENT, dark = DEFAULT_DARK): ThemeColors {
  return {
    accent,
    dark,
    light: accent + '26',
    border: accent + '33',
    rgb: hexToRgb(accent),
  }
}

export const LAYOUT_DEFAULT_COLORS = buildThemeColors()

/** @deprecated 使用 LAYOUT_DEFAULT_COLORS */
export const R_MARKDOWN_DEFAULT_COLORS = LAYOUT_DEFAULT_COLORS
