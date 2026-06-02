import { PRO_THEME_DEFINITIONS } from '@/themes/markdownThemes/pro/generated'

/** 主题色块预览（用于菜单/选择器，非精确主题色） */
const THEME_SWATCH: Record<string, string> = {  normal: '#78716c',
  shanchui: '#b8860b',
  rose: '#7c5cad',
  fullStackBlue: '#2563eb',
  nightPurple: '#5b4b8a',
  cuteGreen: '#5c8a5c',
  extremeBlack: '#292524',
  orangeHeart: '#ea580c',
  ink: '#1c1917',
  purple: '#9333ea',
  green: '#16a34a',
  blue: '#2563eb',
  cyan: '#0891b2',
  red: '#dc2626',
  blueCyan: '#0e7490',
  blueMountain: '#1d4ed8',
  geekBlack: '#171717',
  scienceBlue: '#1e40af',
  simple: '#a8a29e',
  wechatFormat: '#07c160',
  cupidBusy: '#e11d48',
  aiIndigo: '#4f46e5',
  custom: '#a68b4b',
  ...Object.fromEntries(PRO_THEME_DEFINITIONS.map((t) => [t.id, t.accent])),
}
export function getThemeSwatch(themeId: string): string {
  return THEME_SWATCH[themeId] ?? '#78716c'
}
