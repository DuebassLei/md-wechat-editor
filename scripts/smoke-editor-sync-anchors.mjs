import { buildWechatArticleHtml } from '../src/engine/render/wechatArticleHtml.ts'
import { OPEN_RENDER_ENTITLEMENTS } from '../src/engine/render/renderEntitlements.ts'
import { stripEditorSyncAttributes } from '../src/engine/render/editorSyncAnchors.ts'

const md = `# Hello

Paragraph.

:::lead
导语段落
:::`

const preview = await buildWechatArticleHtml(md, 'normal', OPEN_RENDER_ENTITLEMENTS, null, {
  editorSyncAnchors: true,
})
const copy = await buildWechatArticleHtml(md, 'normal', OPEN_RENDER_ENTITLEMENTS, null)
const copyStripped = stripEditorSyncAttributes(copy)

const checks = [
  ['preview has data-md-line-start', preview.includes('data-md-line-start')],
  ['copy has no data-md-line-start', !copy.includes('data-md-line-start')],
  ['copy has no data-md-sync', !copy.includes('data-md-sync')],
  ['strip leaves copy clean', !copyStripped.includes('data-md-line-start')],
]

let failed = false
for (const [name, ok] of checks) {
  console.log(ok ? '✓' : '✗', name)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
