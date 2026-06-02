import { buildLayoutModuleSnippet } from '../src/engine/constants/layoutModuleSnippets.ts'
import {
  OPEN_RENDER_ENTITLEMENTS,
  renderMarkdownWithThemeExtras,
} from '../src/engine/index.ts'

const IDS = ['hero', 'compare', 'timeline', 'lead']
const N = 20
const THRESHOLD_MS = 120

let warned = false

for (const id of IDS) {
  const md = buildLayoutModuleSnippet(id)
  const times = []
  for (let i = 0; i < N; i++) {
    const t0 = performance.now()
    await renderMarkdownWithThemeExtras(md, 'normal', OPEN_RENDER_ENTITLEMENTS, null)
    times.push(performance.now() - t0)
  }
  times.sort((a, b) => a - b)
  const p95 = times[Math.floor(times.length * 0.95)]
  console.log(`${id} p95=${p95.toFixed(1)}ms`)
  if (p95 > THRESHOLD_MS) {
    console.warn(`WARN: ${id} exceeds ${THRESHOLD_MS}ms`)
    warned = true
  }
}

if (warned) process.exitCode = 0
