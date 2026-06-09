/**
 * Screenshot kkstyle HTML posters to PNG (3:4 @ 1500×2000).
 * Usage: node --import ./scripts/register-aliases.mjs scripts/capture-kkstyle-posters.mjs [slug]
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const slug = process.argv[2] || 'china-llm-comparison'
const VIEWPORT = { width: 1500, height: 2000 }

const pages = [
  `${slug}-p01-cover.html`,
  `${slug}-p02-models.html`,
  `${slug}-p03-pick.html`,
]

async function main() {
  let chromium
  try {
    ;({ chromium } = await import('playwright'))
  } catch {
    console.error('Install playwright: npm i -D playwright && npx playwright install chromium')
    process.exit(1)
  }

  const posterDir = path.join(root, 'images/posters')
  const outDir = path.join(posterDir, 'export')
  await mkdir(outDir, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: VIEWPORT })

  for (const htmlName of pages) {
    const htmlPath = path.join(posterDir, htmlName)
    const base = htmlName.replace(/\.html$/, '')
    const pngPath = path.join(outDir, `${base}.png`)
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' })
    await page.screenshot({
      path: pngPath,
      type: 'png',
      clip: { x: 0, y: 0, ...VIEWPORT },
    })
    console.log('wrote', path.relative(root, pngPath))
  }

  await browser.close()
  console.log(`Done: ${pages.length} kkstyle posters @ ${VIEWPORT.width}×${VIEWPORT.height}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
