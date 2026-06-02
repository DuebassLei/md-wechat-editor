import { LAYOUT_MODULES } from '@/constants/layoutModules'
import { THEME_OPTIONS } from '@/engine'

/** 对外文案使用的模块/主题数量（与引擎常量同步） */
export const LAYOUT_MODULE_COUNT = LAYOUT_MODULES.length
export const THEME_COUNT = THEME_OPTIONS.length

export const PRODUCT_TAGLINE = `${LAYOUT_MODULE_COUNT} 种排版组件、${THEME_COUNT} 套主题`
