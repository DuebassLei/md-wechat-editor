/**
 * 通过 Cover Studio 页面批量导出封面与配图 PNG。
 * 用法: node scripts/capture-cover-studio.mjs [slug] [--base http://localhost:5173]
 *
 * 需先启动: npm run dev
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  COVER_EXPORT_SIZES,
  DEFAULT_COVER_STATE,
  getAspectDefaults,
} from '../src/engine/cover-editor/constants.ts'
import {
  coverTemplateStyleFields,
  getCoverTemplate,
} from '../src/engine/cover-editor/coverTemplates.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const PRESETS = {
  'editor-image-cover-update': {
    shots: [
      {
        out: 'images/covers/export/editor-image-cover-update-cover-studio.png',
        aspect: 'wechat',
        templateId: 'wechat-cinnabar-head',
        title: '墨韵简排上新',
        keywords: '图床 本地图 封面模板',
      },
      {
        out: 'images/illustrations/export/editor-image-cover-update-local.png',
        aspect: 'landscape',
        templateId: 'wechat-tech',
        title: '本地插入',
        keywords: 'Token IndexedDB 预览',
      },
      {
        out: 'images/illustrations/export/editor-image-cover-update-host.png',
        aspect: 'landscape',
        templateId: 'wechat-news',
        title: '上传图床',
        keywords: 'SM.MS ImgBB 自定义',
      },
      {
        out: 'images/illustrations/export/editor-image-cover-update-templates.png',
        aspect: 'landscape',
        templateId: 'xhs-macaron-diary',
        title: '28 套封面模板',
        keywords: '小红书 公众号 国风',
      },
    ],
  },
}

function buildCoverState({ aspect, templateId, title, keywords }) {
  const template = getCoverTemplate(templateId)
  if (!template) throw new Error(`Unknown template: ${templateId}`)

  const aspectPatch = template.aspect
    ? { aspect: template.aspect, ...getAspectDefaults(template.aspect) }
    : { aspect, ...getAspectDefaults(aspect) }

  return {
    ...DEFAULT_COVER_STATE,
    ...coverTemplateStyleFields(template),
    ...aspectPatch,
    title,
    keywords,
    customBgImage: '',
  }
}

function parseArgs(argv) {
  const slug = argv.find((a) => !a.startsWith('--')) || 'editor-image-cover-update'
  const baseIdx = argv.indexOf('--base')
  const base = baseIdx >= 0 ? argv[baseIdx + 1] : 'http://localhost:5173'
  return { slug, base }
}

async function waitForServer(base) {
  try {
    const res = await fetch(`${base}/cover`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  } catch {
    throw new Error(`Cover Studio 未就绪，请先运行 npm run dev（${base}）`)
  }
}

async function exportShot(page, base, state, aspect, outPath) {
  await page.goto(`${base}/cover`, { waitUntil: 'networkidle' })
  await page.evaluate((s) => {
    localStorage.setItem('mdwe:cover-editor', JSON.stringify(s))
  }, state)
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForSelector('.cover-canvas', { timeout: 15000 })

  const bytes = await page.evaluate(async (asp) => {
    const { toBlob } = await import('https://esm.sh/html-to-image@1.11.13')
    const el = document.querySelector('.cover-canvas')
    const wrap = el?.parentElement
    if (wrap) wrap.style.transform = 'none'
    const sizes = {
      landscape: { w: 1280, h: 720 },
      portrait: { w: 1080, h: 1920 },
      wechat: { w: 900, h: 383 },
    }
    const { w, h } = sizes[asp] ?? sizes.landscape
    const blob = await toBlob(el, {
      width: w,
      height: h,
      pixelRatio: 2,
      cacheBust: true,
      skipFonts: false,
    })
    if (!blob) return null
    return [...new Uint8Array(await blob.arrayBuffer())]
  }, aspect)

  if (!bytes?.length) throw new Error(`导出失败: ${outPath}`)

  await mkdir(path.dirname(outPath), { recursive: true })
  await writeFile(outPath, Buffer.from(bytes))
}

async function main() {
  const { slug, base } = parseArgs(process.argv.slice(2))
  const preset = PRESETS[slug]
  if (!preset) {
    console.error(`未知 slug: ${slug}，可选: ${Object.keys(PRESETS).join(', ')}`)
    process.exit(1)
  }

  await waitForServer(base)

  let chromium
  try {
    ;({ chromium } = await import('playwright'))
  } catch {
    console.error('请安装 playwright: npm i -D playwright && npx playwright install chromium')
    process.exit(1)
  }

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })

  for (const shot of preset.shots) {
    const state = buildCoverState(shot)
    const outPath = path.join(root, shot.out)
    const { w, h } = COVER_EXPORT_SIZES[shot.aspect]
    await exportShot(page, base, state, shot.aspect, outPath)
    console.log('wrote', path.relative(root, outPath), `(${w}×${h} @2x)`)
  }

  await browser.close()
  console.log(`Done: ${preset.shots.length} Cover Studio exports for ${slug}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
