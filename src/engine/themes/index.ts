import blue from './markdownThemes/blue';
import blueCyan from './markdownThemes/blueCyan';
import cyan from './markdownThemes/cyan';
import green from './markdownThemes/green';
import ink from './markdownThemes/ink';
import normal from './markdownThemes/normal';
import orangeHeart from './markdownThemes/orangeHeart';
import red from './markdownThemes/red';
import shanchui from './markdownThemes/shanchui';
import simple from './markdownThemes/simple';
import rose from './markdownThemes/rose';
import cuteGreen from './markdownThemes/cuteGreen';
import fullStackBlue from './markdownThemes/fullStackBlue';
import nightPurple from './markdownThemes/nightPurple';
import extremeBlack from './markdownThemes/extremeBlack';
import cupidBusy from './markdownThemes/cupidBusy';
import aiIndigo from './markdownThemes/aiIndigo';
import { PRO_THEME_DEFINITIONS, PRO_THEMES } from './markdownThemes/pro/generated';
import {
  PANDAAI_THEME_DEFINITIONS,
  PANDAAI_THEMES,
} from './markdownThemes/pandaai/generated';
import {
  CREATIVE_THEME_DEFINITIONS,
  CREATIVE_THEMES,
} from './markdownThemes/creative/generated';
import {
  DRAFT_THEME_DEFINITIONS,
  DRAFT_THEMES,
} from './markdownThemes/drafts/generated';
import { sanitizeDraftThemeCssForWechat } from './markdownThemes/drafts/sanitizeWechatCss';
import { DRAFT_THEME_IDS } from './markdownThemes/drafts/wechatDecor';

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
  'normal', 'simple', 'green', 'blue', 'cyan', 'red', 'orangeHeart',
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
  { id: 'green', name: '绿意', author: 'koala' },
  { id: 'blue', name: '蓝色', author: 'zhning12' },
  { id: 'cyan', name: '青色', author: 'zhning12' },
  { id: 'red', name: '红色', author: 'zhning12' },
  { id: 'blueCyan', name: '蓝青', author: 'zhning12' },
  { id: 'simple', name: '简洁', author: 'zhning12' },
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

const PANDAAI_THEME_OPTIONS: ThemeOption[] = PANDAAI_THEME_DEFINITIONS.map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  author: 'PandaAI',
  series: t.series,
  tier: 'pro' as const,
  isNew: true,
}));

const CREATIVE_THEME_OPTIONS: ThemeOption[] = CREATIVE_THEME_DEFINITIONS.map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  author: '墨韵简排',
  series: t.series,
  tier: 'pro' as const,
  isNew: true,
}));

const DRAFT_THEME_OPTIONS: ThemeOption[] = DRAFT_THEME_DEFINITIONS.map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  author: '墨韵简排',
  series: t.series,
  tier: 'pro' as const,
  isNew: true,
}));

export const THEME_OPTIONS: ThemeOption[] = [
  ...BASE_THEME_OPTIONS.map((t) => ({ ...t, tier: tierFor(t.id) })),
  ...DRAFT_THEME_OPTIONS,
  ...CREATIVE_THEME_OPTIONS,
  ...PANDAAI_THEME_OPTIONS,
  ...PRO_THEME_OPTIONS,
];

export const THEMES: Record<string, string> = {
  blue,
  blueCyan,
  normal,
  cyan,
  green,
  ink,
  orangeHeart,
  red,
  shanchui,
  simple,
  rose,
  cuteGreen,
  fullStackBlue,
  nightPurple,
  extremeBlack,
  cupidBusy,
  aiIndigo,
  ...DRAFT_THEMES,
  ...CREATIVE_THEMES,
  ...PANDAAI_THEMES,
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
  let baseCss = THEMES[themeId] || THEMES.normal || '';
  if (DRAFT_THEME_IDS.has(themeId)) {
    baseCss = sanitizeDraftThemeCssForWechat(baseCss);
  }
  baseCss = baseCss.replace(/#nice/g, rootSelector);
  const patchCss = (THEME_PATCHES[themeId] || '').replace(/#nice/g, rootSelector);
  return `${baseCss}\n${patchCss}`;
}

export {
  THEME_GROUP_ORDER,
  groupThemeOptions,
  resolveThemeGroup,
  type ThemeGroup,
} from './themeGroups';
