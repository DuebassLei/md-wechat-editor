import { parseLayoutMarkdown } from '../src/engine/r-markdown/parseLayoutMarkdown.ts'
import { prepareLayoutInput } from '../src/engine/r-markdown/prepareInput.ts'
import { detectLegacyLayoutSyntax } from '../src/engine/render/detectLegacyLayoutSyntax.ts'
import { migrateLegacyLayoutSyntax } from '../src/engine/migrate/legacyXmlToFenced.ts'

const opts = { themeId: 'normal', layoutTier: 'advanced' }

const demoMd = `:::hero
title: 墨韵简排
subtitle: Markdown 微信排版
:::

# 一级标题`

const stepsMd = `:::steps label="FLOW" title="流程" active="2"
输入 | 第一步
输出 | 第二步
:::`

const compareRich = `:::compare left-label="BEFORE" left-title="旧" right-label="AFTER" right-title="新"
---left---
左侧内容
---right---
右侧内容
:::`

const pTitleMd = `:::p-title
num: 01
title: 章节一
level: 1
:::

正文`

const leadMd = `:::lead
导语段落
:::`

const checks = [
  ['hero module', parseLayoutMarkdown(demoMd, opts).includes('墨韵简排')],
  [
    'prepare strips yaml',
    !prepareLayoutInput('---\ncta: false\n---\n\nbody').startsWith('---'),
  ],
  [
    'yaml becomes hero fence',
    prepareLayoutInput('---\ntitle: 封面\n---\n\n正文').startsWith(':::hero'),
  ],
  ['steps open-line attrs', parseLayoutMarkdown(stepsMd, opts).includes('FLOW')],
  [
    'steps attrs not leaked as title',
    !parseLayoutMarkdown(stepsMd, opts).includes('label="FLOW"'),
  ],
  ['compare rich', parseLayoutMarkdown(compareRich, opts).includes('左侧内容')],
  ['p-title', parseLayoutMarkdown(pTitleMd, opts).includes('章节一')],
  ['ai indigo lead', parseLayoutMarkdown(leadMd, { ...opts, themeId: 'aiIndigo' }).length > 10],
  ['detect legacy lead', detectLegacyLayoutSyntax('<lead>x</lead>').found],
  [
    'migrate lead',
    migrateLegacyLayoutSyntax('<lead>hello</lead>').markdown.includes(':::lead'),
  ],
]

let failed = false
for (const [name, ok] of checks) {
  console.log(ok ? '✓' : '✗', name)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
