export type CoverAspect = 'landscape' | 'portrait' | 'wechat'

export type CoverLayout = 'center' | 'left'

export interface CoverEditorState {
  title: string
  keywords: string
  fontFamily: string
  titleFontSize: number
  keywordsFontSize: number
  titleColor: string
  keywordsColor: string
  layout: CoverLayout
  aspect: CoverAspect
  bgPresetId: string
  customBgImage: string
  overlayOpacity: number
}

export interface CoverBgPreset {
  id: string
  label: string
  /** CSS background value (gradient or url) */
  background: string
  thumb: string
}

export interface CoverFontOption {
  value: string
  label: string
  className?: string
}

export interface CoverExportSize {
  w: number
  h: number
}
