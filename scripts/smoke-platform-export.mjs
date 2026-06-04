import { transformCallouts } from '../src/engine/export/calloutTransform.ts'
import { splitFrontmatterToGfm } from '../src/engine/export/frontmatterToGfm.ts'
import { applySharedCleanup, collapseExtraBlankLines } from '../src/engine/export/markdownCleanup.ts'
import { degradeModulesToGfm } from '../src/engine/export/moduleToGfm/degrade.ts'
import { buildPlatformMarkdown } from '../src/engine/export/platformMarkdown.ts'
import { MODULE_SAMPLE_MARKDOWN } from '../src/engine/constants/moduleSampleMarkdown.ts'

const checks = []

const calloutOut = transformCallouts('> [TIP] 操作提示\n\n正文')
checks.push(
  ['callout tip', calloutOut.includes('💡 **提示**：操作提示')],
  ['callout body', calloutOut.includes('正文')],
)

const fm = splitFrontmatterToGfm(`---\ntitle: 标题\nsubtitle: 副标题\nchips: a|b\n---\n\n正文`)
checks.push(
  ['fm title', fm.preamble.includes('# 标题')],
  ['fm subtitle', fm.preamble.includes('> 副标题')],
  ['fm chips', fm.preamble.includes('a · b')],
  ['fm body', fm.body === '正文'],
)

const details = applySharedCleanup('<details><summary>标题</summary>内容</details>')
checks.push(['details transform', details.includes('**标题**') && details.includes('内容')])

const blank = collapseExtraBlankLines('a\n\n\n\nb')
checks.push(['blank collapse', blank === 'a\n\nb'])

const heroMd = `:::hero\ntitle: 测试标题\nsubtitle: 副标题\n:::\n\n正文`
const heroOut = degradeModulesToGfm(heroMd)
checks.push(
  ['hero h1', heroOut.markdown.includes('# 测试标题')],
  ['hero entry', heroOut.entries.some((e) => e.moduleId === 'hero')],
)

const juejin = buildPlatformMarkdown('# Hello\n\n```\ncode\n```', 'juejin')
checks.push(['juejin code lang', juejin.markdown.includes('```text')])

const csdn = buildPlatformMarkdown('## A\n\n## B\n\n## C\n\n## D', 'csdn')
checks.push(['csdn toc', csdn.markdown.startsWith('@[TOC]')])

const sample = buildPlatformMarkdown(MODULE_SAMPLE_MARKDOWN, 'juejin')
checks.push(['module sample entries', sample.report.entries.length > 0])

let failed = false
for (const [name, ok] of checks) {
  console.log(ok ? '✓' : '✗', name)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
