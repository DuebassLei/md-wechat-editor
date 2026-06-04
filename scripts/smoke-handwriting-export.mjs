import { applyTypoSimulation, parseTypoRules, hasExportableText } from '../src/engine/handwriting/typoSimulation.ts'
import { PAPER_PRESETS, PAPER_IDS, getPaperStyle } from '../src/engine/handwriting/paperPresets.ts'
import { FONT_PRESETS, FONT_IDS } from '../src/engine/handwriting/fontPresets.ts'

const checks = []

const sample = `模拟错别字：{田气=>天气}\n\n今日天气很好，适合出门。`
const result = applyTypoSimulation(sample)
checks.push(['typo replaces 天气→田气', result.displayText.includes('田气') && !result.displayText.includes('天气')])
checks.push(['typo strips rule token', !result.displayText.includes('{田气=>天气}')])
checks.push(['typo rule count', parseTypoRules(sample).length === 1])
checks.push(['empty not exportable', !hasExportableText('')])
checks.push(['whitespace not exportable', !hasExportableText('   \n  ')])

// 冲突：后规则覆盖
const conflict = '{A=>X}{B=>X}\nX'
const conflictResult = applyTypoSimulation(conflict)
checks.push(['later rule wins', conflictResult.displayText === 'B'])

checks.push(['paper count', PAPER_PRESETS.length === 11])
checks.push(['paper ids', PAPER_IDS.length === 11])
checks.push(['each paper has styles', PAPER_PRESETS.every((p) => p.styles.length >= 1)])
checks.push(['default ruled-white style', getPaperStyle('ruled-white', 'default').lineHeight === 32])
checks.push(['grid-large style', getPaperStyle('grid-large', 'default').backgroundSize === '32px 32px'])
checks.push(['font count', FONT_PRESETS.length === 13])
checks.push(['font ids', FONT_IDS.length === 13])

let failed = false
for (const [name, ok] of checks) {
  console.log(ok ? '✓' : '✗', name)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
