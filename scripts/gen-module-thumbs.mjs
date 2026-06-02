import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildLayoutModuleSnippet } from '../src/engine/constants/layoutModuleSnippets.ts'
import {
  LAYOUT_MODULES,
  LAYOUT_MODULE_PREVIEW_HEIGHT_PX,
  LAYOUT_MODULE_THUMB_VERSION,
} from '../src/engine/constants/layoutModules.ts'
import {
  OPEN_RENDER_ENTITLEMENTS,
  renderMarkdownWithThemeExtras,
} from '../src/engine/index.ts'
import { getThemeCss } from '../src/types/theme.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/module-thumbs')

const VIEWPORT = { width: 360, height: LAYOUT_MODULE_PREVIEW_HEIGHT_PX }

function wrapPreviewHtml(bodyHtml) {
  const themeCss = getThemeCss('normal', '.nice-markdown')
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: #fff; width: ${VIEWPORT.width}px; overflow: hidden; }
  ${themeCss}
</style></head><body>
  <article class="nice-markdown nice-markdown--rich-layout">${bodyHtml}</article>
</body></html>`
}

async function main() {
  let chromium
  try {
    ;({ chromium } = await import('playwright'))
  } catch {
    console.error('Install playwright: npm i -D playwright && npx playwright install chromium')
    process.exit(1)
  }

  await mkdir(outDir, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: VIEWPORT })

  for (const mod of LAYOUT_MODULES) {
    const markdown = buildLayoutModuleSnippet(mod.id)
    const bodyHtml = await renderMarkdownWithThemeExtras(
      markdown,
      'normal',
      OPEN_RENDER_ENTITLEMENTS,
      null,
    )
    await page.setContent(wrapPreviewHtml(bodyHtml), { waitUntil: 'networkidle' })
    const file = path.join(outDir, `${mod.id}@${LAYOUT_MODULE_THUMB_VERSION}.png`)
    await page.screenshot({ path: file, type: 'png', clip: { x: 0, y: 0, ...VIEWPORT } })
    console.log('wrote', path.basename(file))
  }

  await browser.close()
  await writeFile(
    path.join(outDir, 'manifest.json'),
    JSON.stringify({ version: LAYOUT_MODULE_THUMB_VERSION, count: LAYOUT_MODULES.length }, null, 2),
  )
  console.log(`Done: ${LAYOUT_MODULES.length} thumbs @ v${LAYOUT_MODULE_THUMB_VERSION}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
