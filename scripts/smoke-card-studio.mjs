import { CARD_THEMES, getCardTheme, CARD_THEME_IDS } from '../src/engine/card-studio/cardThemes/registry.ts'
import { buildCardThemeStyleBlock, cardThemeToExportTheme } from '../src/engine/card-studio/cardThemeStyles.ts'
import { splitByManualBreaks } from '../src/engine/card-studio/splitPages.ts'
import { prepareCardHtml } from '../src/engine/card-studio/prepareCardHtml.ts'
import { wrapWithCardChrome } from '../src/engine/card-studio/wrapCardChrome.ts'
import { buildCardStudioCover, canBuildCover } from '../src/engine/card-studio/buildCover.ts'
import { extractCardMeta } from '../src/engine/card-export/extractMeta.ts'
import { CARD_STUDIO_SAMPLE } from '../src/engine/card-studio/sampleMarkdown.ts'
import { CARD_STUDIO_TEMPLATES, getCardStudioTemplate } from '../src/engine/card-studio/cardStudioTemplates.ts'
import { renderCardMarkdown } from '../src/engine/card-studio/renderCardMarkdown.ts'
import { XHS_CANVA_THEMES } from '../src/engine/card-studio/cardThemes/presets/xhs-canva.ts'

const checks = []

checks.push(['theme count', CARD_THEMES.length === 30])
checks.push(['theme ids unique', new Set(CARD_THEME_IDS).size === 30])
checks.push(['get minimal-light', getCardTheme('minimal-light').label === '清爽知识'])
checks.push([
  'groups valid',
  CARD_THEMES.every((t) =>
    ['light', 'dark', 'gradient', 'morandi', 'magazine', 'xhs'].includes(t.group),
  ),
])
checks.push(['xhs canva count', CARD_THEMES.filter((t) => t.group === 'xhs').length === 16])
checks.push(['xhs presets match', XHS_CANVA_THEMES.length === 16])
checks.push(['morandi count', CARD_THEMES.filter((t) => t.group === 'morandi').length === 3])
checks.push(['magazine count', CARD_THEMES.filter((t) => t.group === 'magazine').length === 3])
checks.push(['all have style flags', CARD_THEMES.every((t) => t.style && t.tokens.exportBg)])
checks.push(['all have header decor', CARD_THEMES.every((t) => t.style.headerDecor)])
checks.push(['all have bg pattern', CARD_THEMES.every((t) => t.style.bgPattern !== undefined)])
checks.push(['all have cover layout', CARD_THEMES.every((t) => t.style.coverLayout !== undefined)])
checks.push(['xhs all have shell', XHS_CANVA_THEMES.every((t) => t.style.shellLayout)])

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
const coverNoBrand = buildCardStudioCover(meta.meta, '3:4', 'sunset-gradient', { showBrand: false })
checks.push(['cover hide brand', !coverNoBrand.includes('@' + meta.meta.brand)])
const looseFm = extractCardMeta(
  `brand: 墨韵简排\nbadge: KNOWLEDGE\ntitle: 知识卡片示例\nsubtitle: 副标题\nhook: hook\nchips: a|b\n---\n\n# 知识卡片`,
  'Brand',
)
checks.push(['loose fm title', looseFm.meta.title === '知识卡片示例'])
checks.push(['loose fm strips yaml', !looseFm.contentMd.includes('brand:')])
checks.push(['loose fm no raw brand in cover', !buildCardStudioCover(looseFm.meta, '3:4', 'minimal-light').includes('brand:')])
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

const xhsHtml = prepareCardHtml('## 干货要点\n\n- 第一条\n- 第二条', 'xhs-workplace')
checks.push(['xhs prepare shell', xhsHtml.html.includes('card-xhs-shell--xhs-workplace')])
checks.push(['xhs prepare pill h2 css', xhsHtml.html.includes('border-radius:999px')])
const xhsCover = buildCardStudioCover(meta.meta, '3:4', 'xhs-workplace')
checks.push(['xhs cover shell', xhsCover.includes('card-xhs-shell--xhs-workplace')])
checks.push(['xhs cover title', xhsCover.includes('知识卡片示例')])

const xhsWrapped = wrapWithCardChrome('<p>正文</p>', 'xhs-workplace')
checks.push(['xhs wrap shell', xhsWrapped.includes('card-xhs-shell--xhs-workplace')])
checks.push(['xhs wrap no studio header', !xhsWrapped.includes('card-studio-header')])

const xhsExport = cardThemeToExportTheme('xhs-media')
checks.push(['xhs export bg', xhsExport.exportBg === '#ede9fe'])
checks.push(['xhs no accent bar', xhsExport.accentBar === undefined])

checks.push(['sample has frontmatter', CARD_STUDIO_SAMPLE.includes('badge:')])
checks.push(['scene templates count', CARD_STUDIO_TEMPLATES.length === 6])
checks.push(['science template', getCardStudioTemplate('science')?.splitMode === 'hrSplit'])
checks.push(['poetry template', getCardStudioTemplate('poetry')?.markdown.includes('问刘十九')])
checks.push(['vocabulary template', getCardStudioTemplate('vocabulary')?.markdown.includes('remarkable')])
checks.push(['math template', getCardStudioTemplate('math')?.richContent === true])
checks.push(['xhs-series template', getCardStudioTemplate('xhs-series')?.splitMode === 'hrSplit'])
checks.push(['card soft break', renderCardMarkdown('行一  \n行二').includes('<br')])
checks.push(['card highlight', renderCardMarkdown('==重点==').includes('<mark>重点</mark>')])
checks.push(['card br tag', renderCardMarkdown('上<br/>下').includes('<br')])
checks.push([
  'card jsx font family',
  renderCardMarkdown(
    '<p style={{ fontFamily: "LXGW WenKai, serif", fontSize:"28px" }}>诗</p>',
    { richContent: true },
  ).includes("font-family:'LXGW WenKai, serif'"),
])
checks.push(['card math rich', renderCardMarkdown('公式 $E=mc^2$', { richContent: true }).includes('katex')])
checks.push([
  'card math table',
  prepareCardHtml(
    '## 符号\n\n| 名 | 式 |\n|---|---|\n| 能 | $E=mc^2$ |',
    'minimal-light',
    { richContent: true },
  ).html.includes('<table') && prepareCardHtml(
    '## 符号\n\n| 名 | 式 |\n|---|---|\n| 能 | $E=mc^2$ |',
    'minimal-light',
    { richContent: true },
  ).html.includes('.katex'),
])
const yamlCover = extractCardMeta('---\ntitle: 测试封面\nimage: https://example.com/bg.jpg\nlayout: separate\ndescription: 副标题\ntags: a, b\n---\n# 正文\n', '品牌')
checks.push(['yaml cover image', yamlCover.meta.coverImage === 'https://example.com/bg.jpg'])
checks.push(['yaml cover layout', yamlCover.meta.coverLayout === 'separate'])
checks.push(['yaml description', yamlCover.meta.subtitle === '副标题'])
const overlayCover = buildCardStudioCover({ ...yamlCover.meta, brand: '品牌', coverLayout: 'overlay' }, '3:4', 'minimal-light')
checks.push(['overlay cover html', overlayCover.includes('card-studio-cover--overlay')])
checks.push(['overlay cover bg', overlayCover.includes('example.com/bg.jpg')])

let failed = false
for (const [name, ok] of checks) {
  console.log(ok ? '✓' : '✗', name)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
