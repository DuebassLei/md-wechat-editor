/**
 * 浏览器内逐主题测试 buildCardPages，定位预览失败的主题
 * 用法：先 npm run dev，再 node --import ./scripts/register-aliases.mjs scripts/smoke-card-studio-browser.mjs
 */
import { chromium } from 'playwright'
import { CARD_THEME_IDS } from '../src/engine/card-studio/cardThemes/registry.ts'
import { CARD_STUDIO_SAMPLE } from '../src/engine/card-studio/sampleMarkdown.ts'

const BASE = process.env.CARD_STUDIO_URL ?? 'http://localhost:5173'

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  try {
    await page.goto(`${BASE}/cards`, { waitUntil: 'networkidle', timeout: 20000 })
  } catch (e) {
    console.error('无法打开页面，请先运行 npm run dev')
    console.error(e)
    await browser.close()
    process.exit(1)
  }

  const results = await page.evaluate(
    async ({ themeIds, sample }) => {
      const { buildCardPages } = await import('/src/engine/card-studio/buildPages.ts')
      const out = []
      for (const themeId of themeIds) {
        try {
          const r = await buildCardPages({
            markdown: sample,
            themeId,
            aspect: '3:4',
            splitMode: 'autoSplit',
            includeCover: true,
            brand: 'Test',
            previewWidth: 360,
          })
          out.push({
            themeId,
            ok: r.pages.length > 0 && r.pages.every((p) => p.dataUrl?.startsWith('data:image')),
            pages: r.pages.length,
            err: '',
          })
        } catch (e) {
          out.push({
            themeId,
            ok: false,
            pages: 0,
            err: e instanceof Error ? e.message : Object.prototype.toString.call(e),
          })
        }
      }
      return out
    },
    { themeIds: CARD_THEME_IDS, sample: CARD_STUDIO_SAMPLE },
  )

  let failed = false
  for (const r of results) {
    const mark = r.ok ? '✓' : '✗'
    console.log(mark, r.themeId, r.ok ? `${r.pages} pages` : r.err)
    if (!r.ok) failed = true
  }

  await browser.close()
  process.exit(failed ? 1 : 0)
}

main()
