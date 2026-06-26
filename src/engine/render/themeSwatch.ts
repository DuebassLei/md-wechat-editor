import { PRO_THEME_DEFINITIONS } from '@/themes/markdownThemes/pro/generated'
import { PANDAAI_THEME_DEFINITIONS } from '@/themes/markdownThemes/pandaai/generated'
import { CREATIVE_THEME_DEFINITIONS } from '@/themes/markdownThemes/creative/generated'

/** 主题色块预览（用于菜单/选择器，非精确主题色） */
const THEME_SWATCH: Record<string, string> = {
  normal: '#78716c',
  shanchui: '#b8860b',
  rose: '#7c5cad',
  fullStackBlue: '#2563eb',
  nightPurple: '#5b4b8a',
  cuteGreen: '#5c8a5c',
  extremeBlack: '#292524',
  orangeHeart: '#ea580c',
  ink: '#1c1917',
  green: '#16a34a',
  blue: '#2563eb',
  cyan: '#0891b2',
  red: '#dc2626',
  blueCyan: '#0e7490',
  simple: '#a8a29e',
  cupidBusy: '#e11d48',
  aiIndigo: '#4f46e5',
  ...Object.fromEntries(PRO_THEME_DEFINITIONS.map((t) => [t.id, t.accent])),
  ...Object.fromEntries(PANDAAI_THEME_DEFINITIONS.map((t) => [t.id, t.primary])),
  ...Object.fromEntries(CREATIVE_THEME_DEFINITIONS.map((t) => [t.id, t.primary])),
}

export function getThemeSwatch(themeId: string): string {
  return THEME_SWATCH[themeId] ?? '#78716c'
}