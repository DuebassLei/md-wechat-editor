import wechatThemes from './wechat-themes.json'
import {
  buildPandaAiThemeCss,
  type PandaAiThemeDef,
} from './buildPandaAiThemeCss'

const rawThemes = wechatThemes.themes as Record<string, PandaAiThemeDef>

export const PANDAAI_THEME_DEFINITIONS = Object.values(rawThemes).map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  primary: t.primary,
  secondary: t.secondary,
  series: '公众号风格' as const,
}))

export const PANDAAI_THEMES: Record<string, string> = Object.fromEntries(
  Object.values(rawThemes).map((t) => [t.id, buildPandaAiThemeCss(t)]),
)

export type PandaAiThemeId = (typeof PANDAAI_THEME_DEFINITIONS)[number]['id']
