import blue from './markdownThemes/blue';
import blueCyan from './markdownThemes/blueCyan';
import blueMountain from './markdownThemes/blueMountain';
import custom from './markdownThemes/custom';
import cyan from './markdownThemes/cyan';
import geekBlack from './markdownThemes/geekBlack';
import green from './markdownThemes/green';
import ink from './markdownThemes/ink';
import normal from './markdownThemes/normal';
import orangeHeart from './markdownThemes/orangeHeart';
import red from './markdownThemes/red';
import purple from './markdownThemes/purple';
import scienceBlue from './markdownThemes/scienceBlue';
import shanchui from './markdownThemes/shanchui';
import simple from './markdownThemes/simple';
import wechatFormat from './markdownThemes/wechatFormat';
import rose from './markdownThemes/rose';
import cuteGreen from './markdownThemes/cuteGreen';
import fullStackBlue from './markdownThemes/fullStackBlue';
import nightPurple from './markdownThemes/nightPurple';
import extremeBlack from './markdownThemes/extremeBlack';
import cupidBusy from './markdownThemes/cupidBusy';
import aiIndigo from './markdownThemes/aiIndigo';
import { PRO_THEME_DEFINITIONS, PRO_THEMES } from './markdownThemes/pro/generated';

export type ThemeTier = 'basic' | 'pro';

export interface ThemeOption {
  id: string;
  name: string;
  author?: string;
  description?: string;
  isNew?: boolean;
  tier: ThemeTier;
  series?: string;
}

const BASIC_THEME_IDS = new Set([
  'normal', 'simple', 'wechatFormat', 'green', 'blue', 'cyan', 'red', 'orangeHeart',
]);

function tierFor(id: string): ThemeTier {
  return BASIC_THEME_IDS.has(id) ? 'basic' : 'pro';
}

const BASE_THEME_OPTIONS: Omit<ThemeOption, 'tier'>[] = [
  { id: 'normal', name: '默认主题', author: 'zhning12' },
  { id: 'shanchui', name: '山吹', author: 'ElyhG' },
  { id: 'rose', name: '蔷薇紫', author: 'HeyRain' },
  { id: 'fullStackBlue', name: '全栈蓝', author: 'Nealyang' },
  { id: 'nightPurple', name: '凝夜紫', author: '童欧巴', isNew: true },
  { id: 'cuteGreen', name: '萌绿', author: 'koala' },
  { id: 'extremeBlack', name: '极简黑', author: '小鱼', isNew: true },
  { id: 'orangeHeart', name: '橙心', author: 'zhning12' },
  { id: 'ink', name: '墨黑', author: 'Mayandev' },
  { id: 'purple', name: '姹紫', author: 'djmaxwow' },
  { id: 'green', name: '绿意', author: 'koala' },
  { id: 'blue', name: '蓝色', author: 'zhning12' },
  { id: 'cyan', name: '青色', author: 'zhning12' },
  { id: 'red', name: '红色', author: 'zhning12' },
  { id: 'blueCyan', name: '蓝青', author: 'zhning12' },
  { id: 'blueMountain', name: '蓝山', author: 'zhning12' },
  { id: 'geekBlack', name: '极客黑', author: 'zhning12' },
  { id: 'scienceBlue', name: '科学蓝', author: 'zhning12' },
  { id: 'simple', name: '简洁', author: 'zhning12' },
  { id: 'wechatFormat', name: '微信格式', author: 'zhning12' },
  { id: 'cupidBusy', name: '丘比特忙', author: 'mdnice', isNew: true },
  {
    id: 'aiIndigo',
    name: 'AI 靛紫',
    author: '公众号参考',
    isNew: true,
  },
];

const PRO_THEME_OPTIONS: ThemeOption[] = PRO_THEME_DEFINITIONS.map((t) => ({
  id: t.id,
  name: t.name,
  author: 'md2wechat',
  series: t.series,
  tier: 'pro' as const,
  isNew: true,
}));

export const THEME_OPTIONS: ThemeOption[] = [
  ...BASE_THEME_OPTIONS.map((t) => ({ ...t, tier: tierFor(t.id) })),
  ...PRO_THEME_OPTIONS,
];

export const THEMES: Record<string, string> = {
  blue,
  blueMountain,
  blueCyan,
  normal,
  custom,
  cyan,
  geekBlack,
  green,
  ink,
  orangeHeart,
  red,
  purple,
  scienceBlue,
  shanchui,
  simple,
  wechatFormat,
  rose,
  cuteGreen,
  fullStackBlue,
  nightPurple,
  extremeBlack,
  cupidBusy,
  aiIndigo,
  ...PRO_THEMES,
};

const THEME_PATCHES: Record<string, string> = {
  rose: `
#nice h1 .content,
#nice h2 .content,
#nice h3 .content,
#nice h4 .content,
#nice strong {
  color: #664D9D !important;
}
#nice a {
  color: #664D9D !important;
  border-bottom-color: #664D9D !important;
}
#nice blockquote {
  border-color: #DEC6FB !important;
  background: #F6EEFF !important;
}
`,
};

export function getThemeCss(themeId: string, rootSelector = '#nice'): string {
  const baseCss = (THEMES[themeId] || THEMES.normal || '').replace(/#nice/g, rootSelector);
  const patchCss = (THEME_PATCHES[themeId] || '').replace(/#nice/g, rootSelector);
  return `${baseCss}\n${patchCss}`;
}

export function getThemeTier(themeId: string): ThemeTier {
  // 同步路径仍用静态默认；运行时锁定请走 useEntitlements / effectiveThemeTier
  return THEME_OPTIONS.find((t) => t.id === themeId)?.tier ?? 'basic';
}

export function isProTheme(themeId: string): boolean {
  return getThemeTier(themeId) === 'pro';
}
