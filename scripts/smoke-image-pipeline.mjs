import {
  buildLocalImageUrl,
  countImageTokens,
  createImageToken,
  listImageTokensInMarkdown,
  replaceTokenWithUrl,
} from '../src/engine/image-pipeline/imageTokens.ts'
import { parseUploadJsonUrl } from '../src/engine/image-pipeline/publishResolve.ts'
import { PUBLISH_MAX_BYTES } from '../src/engine/image-pipeline/types.ts'

const checks = []

const token = createImageToken()
checks.push(['token format', /^IMG_\d+_[a-z0-9]{6}$/.test(token)])

const url = buildLocalImageUrl(token)
checks.push(['local image url', url === `mdwe-img:${token}`])

const md = `![截图](${url})\n\n正文`
checks.push(['count tokens', countImageTokens(md) === 1])
checks.push(['list tokens', listImageTokensInMarkdown(md)[0] === token])

const replaced = replaceTokenWithUrl(md, token, 'https://example.com/a.jpg')
checks.push(['replace token', replaced.includes('https://example.com/a.jpg')])
checks.push(['replace removes token', !replaced.includes(token)])

const legacyMd = `![x](data:image/jpeg;base64,${token})`
checks.push(['legacy list', listImageTokensInMarkdown(legacyMd)[0] === token])

const { migrateLegacyImageUrls } = await import('../src/engine/image-pipeline/imageTokens.ts')
const migrated = migrateLegacyImageUrls(legacyMd)
checks.push(['migrate legacy', migrated.includes(`mdwe-img:${token}`) && !migrated.includes('base64,')])

const jsonUrl = parseUploadJsonUrl({ data: { url: 'https://cdn.example/x.png' } })
checks.push(['parse json url', jsonUrl === 'https://cdn.example/x.png'])

checks.push(['publish max bytes', PUBLISH_MAX_BYTES === 1024 * 1024 - 1])

let failed = false
for (const [name, ok] of checks) {
  console.log(ok ? '✓' : '✗', name)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
