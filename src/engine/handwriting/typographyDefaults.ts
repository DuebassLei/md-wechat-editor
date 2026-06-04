/** 排版调节默认值与范围 */
export interface HandwritingTypography {
  /** 相对字体预设的字号增减（px） */
  fontSizeAdjust: number
  /** 字间距（em） */
  letterSpacing: number
  /** 行高倍率（相对纸张行距） */
  lineHeightScale: number
  /** 词间距（em） */
  wordSpacing: number
}

export const DEFAULT_TYPOGRAPHY: HandwritingTypography = {
  fontSizeAdjust: 0,
  letterSpacing: 0,
  lineHeightScale: 1,
  wordSpacing: 0,
}

export const TYPOGRAPHY_LIMITS = {
  fontSizeAdjust: { min: -8, max: 16, step: 1 },
  letterSpacing: { min: -0.05, max: 0.4, step: 0.01 },
  lineHeightScale: { min: 0.75, max: 1.6, step: 0.05 },
  wordSpacing: { min: 0, max: 0.6, step: 0.02 },
} as const
