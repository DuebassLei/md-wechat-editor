import type { CoverLayoutPreset } from './types'

/** Canva 精选小红书版式（封面 4 + 详情 4） */
export const XHS_LAYOUT_PRESET_LABELS: Record<CoverLayoutPreset, string> = {
  default: '标准',
  'xhs-spring-outing': '早春出游',
  'xhs-notebook-dry': '笔记本干货',
  'xhs-browser-cta': '浏览器 CTA',
  'xhs-palm-editorial': '棕榈极简',
  'xhs-detail-workplace': '职场详情',
  'xhs-detail-media': '自媒体详情',
  'xhs-detail-memphis': '孟菲斯详情',
  'xhs-detail-scrapbook': '手账详情',
}

export const XHS_CANVA_COVER_PRESETS: CoverLayoutPreset[] = [
  'xhs-spring-outing',
  'xhs-notebook-dry',
  'xhs-browser-cta',
  'xhs-palm-editorial',
]

export const XHS_CANVA_DETAIL_PRESETS: CoverLayoutPreset[] = [
  'xhs-detail-workplace',
  'xhs-detail-media',
  'xhs-detail-memphis',
  'xhs-detail-scrapbook',
]

export function isXhsLayoutPreset(preset: CoverLayoutPreset): boolean {
  return preset !== 'default'
}
