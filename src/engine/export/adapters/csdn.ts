import { applySharedCleanup, collapseExtraBlankLines } from '../markdownCleanup'
import { transformCallouts } from '../calloutTransform'

export interface CsdnAdaptResult {
  markdown: string
  warnings: string[]
}

function injectToc(markdown: string): string {
  const h2Count = (markdown.match(/^##\s+/gm) ?? []).length
  if (h2Count < 3) return markdown
  if (/^\s*@?\[TOC\]/im.test(markdown)) return markdown
  return `@[TOC]\n\n${markdown}`
}

/** 表格前补空行 */
function ensureBlankLineBeforeBlocks(markdown: string): string {
  return markdown.replace(/([^\n])\n(\|[^\n]+\|)/g, '$1\n\n$2')
}

/** 检测围栏代码块内裸尖括号（C++ 模板等） */
export function detectAngleBracketWarnings(markdown: string): string[] {
  const warnings: string[] = []
  const re = /```[\w-]*\n([\s\S]*?)```/g
  let m: RegExpExecArray | null
  while ((m = re.exec(markdown)) !== null) {
    const code = m[1]
    if (/[\w)]\s*<\s*[\w]/.test(code) || /[\w]\s*>\s*[\w;(]/.test(code)) {
      warnings.push('检测到代码块含 < > 字符，CSDN 可能误解析为 HTML，粘贴后请检查')
      break
    }
  }
  return warnings
}

export function adaptForCsdn(markdown: string): CsdnAdaptResult {
  let out = transformCallouts(markdown)
  out = injectToc(out)
  out = ensureBlankLineBeforeBlocks(out)
  out = applySharedCleanup(out)
  out = collapseExtraBlankLines(out)
  return { markdown: out, warnings: detectAngleBracketWarnings(out) }
}
