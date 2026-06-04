import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = process.env.README_SHOT_URL ?? 'http://localhost:5173'
const outDir = '.github/readme'

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

async function shot(name, url, after) {
  await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(900)
  if (after) await after(page)
  await page.screenshot({ path: `${outDir}/${name}`, fullPage: false })
  console.log('saved', `${outDir}/${name}`)
}

await shot('readme-studio.png', '/')
await shot('readme-landing.png', '/about')
await shot('readme-modules.png', '/', async (p) => {
  const btn = p.getByRole('button', { name: /插入组件/ })
  if (await btn.count()) {
    await btn.first().click()
    await p.waitForTimeout(500)
  }
})

await browser.close()
