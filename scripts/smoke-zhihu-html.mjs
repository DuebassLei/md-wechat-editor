import { postProcessForZhihu } from '../src/engine/render/zhihuArticleHtml.ts'

const checks = []

const display = postProcessForZhihu(
  '<mjx-container data-formula="E=mc^2" display="true"></mjx-container>',
)
checks.push(['display formula img', display.includes('Formula-image')])
checks.push(['display eeimg', display.includes('data-eeimg="true"')])
checks.push(['display alt latex', display.includes('alt="E=mc^2\\\\"')])

const inline = postProcessForZhihu(
  '<p><mjx-container data-formula="a+b"></mjx-container></p>',
)
checks.push(['inline alt no double backslash', inline.includes('alt="a+b"')])

const plain = postProcessForZhihu('<section style="color:blue">正文</section>')
checks.push(['plain html preserved', plain.includes('color:blue')])

let failed = false
for (const [name, ok] of checks) {
  console.log(ok ? '✓' : '✗', name)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
