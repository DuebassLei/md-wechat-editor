/**
 * Screenshot canvas-design HTML posters to PNG.
 * Usage: node --import ./scripts/register-aliases.mjs scripts/capture-canvas-posters.mjs [slug]
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const slug = process.argv[2] || 'claude-skills-equipment'

const PRESETS = {
  'claude-skills-equipment': [
    { html: 'claude-skills-equipment-concept.html', out: 'claude-skills-equipment-concept.png', w: 1200, h: 720 },
    { html: 'claude-skills-equipment-categories.html', out: 'claude-skills-equipment-categories.png', w: 1200, h: 800 },
    { html: 'claude-skills-equipment-workflow.html', out: 'claude-skills-equipment-workflow.png', w: 1200, h: 560 },
    { html: 'claude-skills-equipment-cover.html', out: 'claude-skills-equipment-cover.png', w: 1283, h: 383, subdir: 'covers' },
  ],
  'claude-skills-15': [
    { html: 'claude-skills-15-workflow-ring.html', out: 'claude-skills-15-workflow-ring.png', w: 1200, h: 680 },
    { html: 'claude-skills-15-checklist.html', out: 'claude-skills-15-checklist.png', w: 1200, h: 900 },
    { html: 'claude-skills-15-cover.html', out: 'claude-skills-15-cover.png', w: 1283, h: 383, subdir: 'covers' },
  ],
  'remotion-skill': [
    { html: 'remotion-skill-cover.html', out: 'remotion-skill-cover.png', w: 1283, h: 383, subdir: 'covers' },
  ],
}

const pages = PRESETS[slug] ?? [
  { html: `${slug}-concept.html`, out: `${slug}-concept.png`, w: 1200, h: 720 },
  { html: `${slug}-categories.html`, out: `${slug}-categories.png`, w: 1200, h: 800 },
  { html: `${slug}-workflow.html`, out: `${slug}-workflow.png`, w: 1200, h: 560 },
  { html: `${slug}-cover.html`, out: `${slug}-cover.png`, w: 1283, h: 383, subdir: 'covers' },
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
  const browser = await chromium.launch()

  for (const p of pages) {
    const outDir =
      p.subdir === 'covers'
        ? path.join(root, 'images/covers/export')
        : path.join(posterDir, 'export')
    await mkdir(outDir, { recursive: true })

    const htmlPath = path.join(posterDir, p.html)
    const pngPath = path.join(outDir, p.out)
    const page = await browser.newPage({ viewport: { width: p.w, height: p.h } })
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' })
    await page.screenshot({
      path: pngPath,
      type: 'png',
      clip: { x: 0, y: 0, width: p.w, height: p.h },
    })
    await page.close()
    console.log('wrote', path.relative(root, pngPath))
  }

  await browser.close()
  console.log(`Done: ${pages.length} canvas posters`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
