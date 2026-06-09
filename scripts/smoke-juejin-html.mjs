import { postProcessForJuejin } from '../src/engine/render/juejinArticleHtml.ts'

const checks = []

const withMjx = postProcessForJuejin(
  '<p>正文</p><mjx-container data-formula="E=mc^2" display="true"></mjx-container>',
)
checks.push(['mjx display → figure', withMjx.includes('<figure>') && withMjx.includes('equation')])
checks.push(['mjx equation url', withMjx.includes('juejin.im/equation?tex=')])

const inlineMjx = postProcessForJuejin(
  '<p><mjx-container data-formula="a+b"></mjx-container></p>',
)
checks.push(['mjx inline → span img', inlineMjx.includes('display:inline')])

const plain = postProcessForJuejin('<section style="color:red">标题</section>')
checks.push(['plain html preserved', plain.includes('color:red')])

let failed = false
for (const [name, ok] of checks) {
  console.log(ok ? '✓' : '✗', name)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
