import { extractXhs } from '../src/engine/xhs/extractMeta.ts'
import { buildCover } from '../src/engine/xhs/buildCover.ts'
import { prepareReadingHtml } from '../src/engine/xhs/prepareReading.ts'
import { resolveAccentColors } from '../src/engine/xhs/resolveAccent.ts'
import { buildZipBlob, dataUrlToBytes, xhsZipArchiveName } from '../src/engine/xhs/downloadZip.ts'
import { TRANSPARENT_PX } from '../src/engine/xhs/tokens.ts'
import { degradeModulesToGfm } from '../src/engine/export/moduleToGfm/degrade.ts'

const checks = []

const heroMd = `:::hero
eyebrow: GUIDE
title: 主标题
subtitle: 副标题
hook: 一句 slogan
chips: a|b
brand: MyBrand
:::

正文段落。`

const h = extractXhs(heroMd)
checks.push(
  ['hero title', h.meta.title === '主标题'],
  ['hero badge', h.meta.badge === 'GUIDE'],
  ['hero hook', h.meta.hook === '一句 slogan'],
  ['hero brand', h.meta.brand === 'MyBrand'],
  ['hero stripped', !h.contentMd.includes(':::hero')],
  ['hero body', h.contentMd.includes('正文段落')],
)

const fmMd = `---
title: FM标题
subtitle: FM副标题
chips: x|y
---

正文`
const f = extractXhs(fmMd)
checks.push(
  ['fm title', f.meta.title === 'FM标题'],
  ['fm no yaml in body', !f.contentMd.startsWith('---')],
)

const both = `---
title: YAML标题
---
:::hero
title: Hero标题
:::

正文`
const b = extractXhs(both)
checks.push(['hero wins title', b.meta.title === 'Hero标题'])

const pt = degradeModulesToGfm(`:::p-title\ntitle: 章节一\nsubtitle: 说明\n:::\n\n段落`)
checks.push(['p-title h3', pt.markdown.includes('### 章节一')])

const html = prepareReadingHtml('## 小节\n\n段落文字。')
checks.push(
  ['reading h2', html.includes('<h2')],
  ['reading p', html.includes('段落文字')],
  ['reading no module fence', !html.includes(':::')],
  ['reading style block', html.includes('<style>') && html.includes('.card-reading h2')],
  ['reading flat blocks', html.includes('<h2') && !html.includes('class="xhs-reading"')],
)

const meta = {
  title: '==重点==标题',
  badge: 'GUIDE',
  subtitle: '副标题',
  teaser: '副标题 更多文字',
  hook: '金句',
  chips: ['标签'],
  brand: 'TestBrand',
  charCount: 1200,
  readMin: 3,
}
const colors = resolveAccentColors('warm', 'normal')
const cover = buildCover(meta, '3:4', colors)
const zipBlob = buildZipBlob({
  'xhs_test_00_cover.png': dataUrlToBytes(TRANSPARENT_PX),
  'xhs_test_01.png': dataUrlToBytes(TRANSPARENT_PX),
})
checks.push(
  ['zip blob size', zipBlob.size > 30],
  ['zip archive name', xhsZipArchiveName('2026-06-04') === 'xhs_2026-06-04.zip'],
  ['cover bg', cover.includes('#F7F2E8')],
  ['cover hook', cover.includes('金句')],
  ['cover highlight', cover.includes('重点')],
  ['cover brand', cover.includes('@TestBrand')],
  ['cover size', cover.includes('width:360px') && cover.includes('height:480px')],
)

let failed = false
for (const [name, ok] of checks) {
  console.log(ok ? '✓' : '✗', name)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
