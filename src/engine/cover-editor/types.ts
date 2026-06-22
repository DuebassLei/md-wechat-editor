export type CoverAspect = 'landscape' | 'portrait' | 'wechat'

export type CoverLayout = 'center' | 'left'

/** 小红书结构化版式（对齐 Canva 精选模板） */
export type CoverLayoutPreset =
  | 'default'
  | 'xhs-spring-outing'
  | 'xhs-notebook-dry'
  | 'xhs-browser-cta'
  | 'xhs-palm-editorial'
  | 'xhs-detail-workplace'
  | 'xhs-detail-media'
  | 'xhs-detail-memphis'
  | 'xhs-detail-scrapbook'

export interface CoverEditorState {
  title: string
  keywords: string
  fontFamily: string
  titleFontSize: number
  keywordsFontSize: number
  titleColor: string
  keywordsColor: string
  layout: CoverLayout
  layoutPreset: CoverLayoutPreset
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

export type CoverTemplateGroup = 'xhs' | 'wechat' | 'business' | 'literary' | 'creative' | 'minimal'

/** 一键套用的封面视觉方案（不含标题文案；aspect 可选，用于小红书等竖版场景） */
export interface CoverTemplate {
  id: string
  label: string
  desc: string
  group: CoverTemplateGroup
  fontFamily: string
  titleColor: string
  keywordsColor: string
  layout: CoverLayout
  bgPresetId: string
  overlayOpacity: number
  /** 套用时可一并切换画幅（如小红书竖版 9:16） */
  aspect?: CoverAspect
  /** 结构化版式 ID */
  layoutPreset?: CoverLayoutPreset
  titleFontSize?: number
  keywordsFontSize?: number
  defaultTitle?: string
  defaultKeywords?: string
}
