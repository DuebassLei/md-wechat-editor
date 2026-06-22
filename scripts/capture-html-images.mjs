/**
 * HTML → PNG：读取 source 目录下的静态 HTML，Playwright 截图导出。
 * 用法: node scripts/capture-html-images.mjs [slug]
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

/** html 为相对项目根路径；out 为相对 export 子目录的文件名 */
const PRESETS = {
  'editor-image-cover-update': [
    {
      html: 'images/covers/source/editor-image-cover-update-cover.html',
      out: 'editor-image-cover-update-cover.png',
      w: 1283,
      h: 383,
      subdir: 'covers',
    },
    {
      html: 'images/illustrations/source/editor-image-cover-update-local.html',
      out: 'editor-image-cover-update-local.png',
      w: 1280,
      h: 720,
      subdir: 'illustrations',
    },
    {
      html: 'images/illustrations/source/editor-image-cover-update-host.html',
      out: 'editor-image-cover-update-host.png',
      w: 1280,
      h: 720,
      subdir: 'illustrations',
    },
    {
      html: 'images/illustrations/source/editor-image-cover-update-templates.html',
      out: 'editor-image-cover-update-templates.png',
      w: 1280,
      h: 720,
      subdir: 'illustrations',
    },
  ],
}

async function main() {
  const slug = process.argv[2] || 'editor-image-cover-update'
  const pages = PRESETS[slug]
  if (!pages) {
    console.error(`未知 slug: ${slug}，可选: ${Object.keys(PRESETS).join(', ')}`)
    process.exit(1)
  }

  let chromium
  try {
    ;({ chromium } = await import('playwright'))
  } catch {
    console.error('请安装 playwright: npm i -D playwright && npx playwright install chromium')
    process.exit(1)
  }

  const browser = await chromium.launch()

  for (const p of pages) {
    const outDir = path.join(root, 'images', p.subdir, 'export')
    await mkdir(outDir, { recursive: true })

    const htmlPath = path.join(root, p.html)
    const pngPath = path.join(outDir, p.out)
    const page = await browser.newPage({
      viewport: { width: p.w, height: p.h },
      deviceScaleFactor: 2,
    })
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)
    await page.screenshot({
      path: pngPath,
      type: 'png',
      clip: { x: 0, y: 0, width: p.w, height: p.h },
    })
    await page.close()
    console.log('wrote', path.relative(root, pngPath), `(${p.w}×${p.h} @2x)`)
  }

  await browser.close()
  console.log(`Done: ${pages.length} HTML → PNG for ${slug}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
