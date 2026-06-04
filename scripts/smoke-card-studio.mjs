import { CARD_THEMES, getCardTheme, CARD_THEME_IDS } from '../src/engine/card-studio/cardThemes/registry.ts'
import { buildCardThemeStyleBlock, cardThemeToExportTheme } from '../src/engine/card-studio/cardThemeStyles.ts'
import { splitByManualBreaks } from '../src/engine/card-studio/splitPages.ts'
import { prepareCardHtml } from '../src/engine/card-studio/prepareCardHtml.ts'
import { wrapWithCardChrome } from '../src/engine/card-studio/wrapCardChrome.ts'
import { buildCardStudioCover, canBuildCover } from '../src/engine/card-studio/buildCover.ts'
import { extractCardMeta } from '../src/engine/card-export/extractMeta.ts'
import { CARD_STUDIO_SAMPLE } from '../src/engine/card-studio/sampleMarkdown.ts'

const checks = []

checks.push(['theme count', CARD_THEMES.length === 14])
checks.push(['theme ids unique', new Set(CARD_THEME_IDS).size === 14])
checks.push(['get minimal-light', getCardTheme('minimal-light').label === '清爽知识'])
checks.push([
  'groups valid',
  CARD_THEMES.every((t) =>
    ['light', 'dark', 'gradient', 'morandi', 'magazine'].includes(t.group),
  ),
])
checks.push(['morandi count', CARD_THEMES.filter((t) => t.group === 'morandi').length === 3])
checks.push(['magazine count', CARD_THEMES.filter((t) => t.group === 'magazine').length === 3])
checks.push(['all have style flags', CARD_THEMES.every((t) => t.style && t.tokens.exportBg)])
checks.push(['all have header decor', CARD_THEMES.every((t) => t.style.headerDecor)])
checks.push(['all have bg pattern', CARD_THEMES.every((t) => t.style.bgPattern !== undefined)])
checks.push(['all have cover layout', CARD_THEMES.every((t) => t.style.coverLayout !== undefined)])

const lightCss = buildCardThemeStyleBlock('minimal-light')
checks.push(['css has card-reading', lightCss.includes('.card-reading')])
checks.push(['css chrome header', lightCss.includes('.card-studio-header--accent-strip')])
checks.push(['css center h1', lightCss.includes('text-align:center')])

const wrapped = wrapWithCardChrome('<p>正文</p>', 'ocean-blue')
checks.push(['wrap chrome', wrapped.includes('card-studio-shell')])
checks.push(['wrap header', wrapped.includes('card-studio-header')])

const darkCss = buildCardThemeStyleBlock('minimal-dark')
checks.push(['dark ol counter', darkCss.includes('counter(mdwe-ol)')])

const exportTheme = cardThemeToExportTheme('forest-green')
checks.push(['export theme brand', exportTheme.brandColor === '#10b981'])
checks.push(['strip accent bar when header', exportTheme.accentBar === undefined])

const meta = extractCardMeta(CARD_STUDIO_SAMPLE, 'Brand')
checks.push(['sample meta title', meta.meta.title === '知识卡片示例'])
checks.push(['sample meta badge', meta.meta.badge === 'KNOWLEDGE'])
checks.push(['cover teaser no code', !meta.meta.teaser.includes('const card')])
checks.push(['cover teaser uses subtitle', meta.meta.teaser === meta.meta.subtitle])
checks.push(['can build cover', canBuildCover(meta.meta)])
const coverHtml = buildCardStudioCover(meta.meta, '3:4', 'sunset-gradient')
checks.push(['cover html title', coverHtml.includes('知识卡片示例')])
checks.push(['cover html brand', coverHtml.includes('@' + meta.meta.brand)])
const serifCover = buildCardStudioCover(meta.meta, '3:4', 'magazine-serif')
checks.push(['cover inline font safe', !serifCover.includes('font-family:"')])
checks.push(['cover serif font ok', serifCover.includes("'Playfair Display'")])

const one = splitByManualBreaks('# Hello\n\nWorld')
checks.push(['single segment', one.length === 1])

const two = splitByManualBreaks('# A\n\n---\n\n# B')
checks.push(['hr split', two.length === 2])

const html = prepareCardHtml('## 标题\n\n段落。', 'morandi-rose')
checks.push(['prepare h2', html.html.includes('<h2')])
checks.push(['prepare chrome in html', html.html.includes('card-studio-shell')])

checks.push(['sample has frontmatter', CARD_STUDIO_SAMPLE.includes('badge:')])

let failed = false
for (const [name, ok] of checks) {
  console.log(ok ? '✓' : '✗', name)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
