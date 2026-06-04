import { extractWechatTietu, buildWechatCover, wechatTietuFileName } from '../src/engine/wechat-tietu/index.ts'
import { prepareReadingHtml } from '../src/engine/xhs/prepareReading.ts'
import { wrapHtmlWithFrame, CARD_FRAMES } from '../src/engine/card-export/cardFrames.ts'
import { buildCoverForSkin } from '../src/engine/wechat-tietu/index.ts'
import {
  buildZipBlob,
  dataUrlToBytes,
  wechatTietuZipArchiveName,
} from '../src/engine/card-export/downloadZip.ts'
import { TRANSPARENT_PX } from '../src/engine/card-export/constants.ts'

const checks = []

const heroMd = `:::hero
title: 贴图标题
subtitle: 一句话说明
brand: WxBrand
:::

正文。`

const h = extractWechatTietu(heroMd)
checks.push(
  ['extract title', h.meta.title === '贴图标题'],
  ['extract brand', h.meta.brand === 'WxBrand'],
  ['body kept', h.contentMd.includes('正文')],
)

const wechatCover = buildWechatCover(h.meta)
checks.push(
  ['wechat cover gradient', wechatCover.includes('#f0faf4')],
  ['wechat cover title', wechatCover.includes('贴图标题')],
  ['wechat cover accent', wechatCover.includes('#07c160')],
  ['wechat cover 3:4', wechatCover.includes('height:480px')],
)

const reading = prepareReadingHtml('## 标题\n\n段落一。\n\n段落二。', { skin: 'wechat' })
const framed = wrapHtmlWithFrame(wechatCover, 360, 480, 'wechat', '#07c160')
const framedClassic = wrapHtmlWithFrame(wechatCover, 360, 480, 'classic', '#07c160')
checks.push(
  ['wechat reading styles', reading.includes('<style>') && reading.includes('card-reading')],
  ['wechat reading blocks', reading.includes('<h2') && reading.includes('<p>')],
  ['frame wechat mint', framed.includes('#E8F8EF') && framed.includes('border-radius:22px')],
  ['frame wechat scale', framed.includes('transform:scale(')],
  ['frame classic xhs', framedClassic.includes('#F5EDE4') && framedClassic.includes('#D9C9AC')],
  ['frame soft cream', wrapHtmlWithFrame(wechatCover, 360, 480, 'soft', '#E67E22').includes('#F7F2E8')],
  ['frame presets', CARD_FRAMES.length >= 19],
  ['frame comic star', wrapHtmlWithFrame(wechatCover, 360, 480, 'comic', '#ff6b35').includes('<svg')],
  ['frame sketch soft', wrapHtmlWithFrame(wechatCover, 360, 480, 'sketch', '#5C5346').includes('<svg')],
  ['frame watercolor bloom', wrapHtmlWithFrame(wechatCover, 360, 480, 'watercolor', '#6c5ce7').includes('radial-gradient')],
  ['frame pixel grid', wrapHtmlWithFrame(wechatCover, 360, 480, 'pixel', '#A89A86').includes('#D9C9AC')],
  ['frame film bar', wrapHtmlWithFrame(wechatCover, 360, 480, 'film', '#000').includes('#3D3548')],
)

const xhsSkinCover = buildCoverForSkin(h.meta, 'xhs', 'normal')
checks.push(['xhs skin cover warm', xhsSkinCover.includes('#F7F2E8')])

const zipBlob = buildZipBlob({
  [wechatTietuFileName(0, 'hd', '2026-06-04')]: dataUrlToBytes(TRANSPARENT_PX),
})
checks.push(
  ['zip size', zipBlob.size > 30],
  ['zip name', wechatTietuZipArchiveName('2026-06-04') === 'wechat_tietu_2026-06-04.zip'],
  ['file name hd', wechatTietuFileName(1, 'hd', '2026-06-04') === 'wechat_tietu_2026-06-04_01.png'],
  ['file name upload', wechatTietuFileName(0, 'upload', '2026-06-04') === 'wechat_tietu_2026-06-04_00_cover.jpg'],
)

let failed = false
for (const [name, ok] of checks) {
  console.log(ok ? '✓' : '✗', name)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
