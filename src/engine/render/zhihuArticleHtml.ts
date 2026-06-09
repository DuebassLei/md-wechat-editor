import {
  buildWechatArticleHtml,
  type ArticleRenderOptions,
} from './wechatArticleHtml'
import type { RenderEntitlements } from './renderEntitlements'
import { OPEN_RENDER_ENTITLEMENTS } from './renderEntitlements'
import type { TemplateEntitlementMap } from '@/types/templateEntitlements'
import type { ThemeId } from '@/types/theme'
import {
  cleanupResidualMathJax,
  escapeHtmlAttr,
  MJX_DATA_FORMULA,
} from './platformArticlePostProcess'

/** 知乎公式 img（对齐 markdown-nice solveZhihuMath） */
function zhihuFormulaImg(data: string, display: boolean): string {
  let formula = data
  if (display && !formula.includes('\\tag')) {
    formula += '\\\\'
  }
  const alt = escapeHtmlAttr(formula)
  return `<img class="Formula-image" data-eeimg="true" src="" alt="${alt}">`
}

function solveZhihuMathByRegex(html: string): string {
  return html.replace(
    /<mjx-container\b([^>]*)>[\s\S]*?<\/mjx-container>/gi,
    (_match, attrs: string) => {
      const dataMatch = attrs.match(
        new RegExp(`${MJX_DATA_FORMULA}=["']([^"']*)["']`),
      )
      if (!dataMatch) return _match
      const display = /\bdisplay\b/.test(attrs)
      return zhihuFormulaImg(dataMatch[1], display)
    },
  )
}

/** 将 MathJax 节点替换为知乎公式占位图（对齐 markdown-nice solveZhihuMath） */
export function solveZhihuMath(html: string): string {
  if (!html.trim()) return html
  if (typeof DOMParser === 'undefined') return solveZhihuMathByRegex(html)

  try {
    const doc = new DOMParser().parseFromString(
      `<div id="zhihu-math-root">${html}</div>`,
      'text/html',
    )
    const root = doc.getElementById('zhihu-math-root')
    if (!root) return solveZhihuMathByRegex(html)

    const mjxs = [...root.querySelectorAll('mjx-container')]
    for (const mjx of mjxs) {
      const data = mjx.getAttribute(MJX_DATA_FORMULA)
      if (!data) continue
      mjx.outerHTML = zhihuFormulaImg(data, mjx.hasAttribute('display'))
    }

    return root.innerHTML
  } catch {
    return solveZhihuMathByRegex(html)
  }
}

/** 知乎粘贴前的 HTML 后处理 */
export function postProcessForZhihu(html: string): string {
  if (!html.trim()) return ''
  let out = solveZhihuMath(html)
  out = cleanupResidualMathJax(out)
  return out
}

/**
 * 知乎成稿 HTML：复用公众号 juice 内联管线，再套用知乎公式与 DOM 兼容处理。
 * 对齐 markdown-nice：solveZhihuMath → solveHtml（juice 部分已由 buildWechatArticleHtml 完成）。
 */
export async function buildZhihuArticleHtml(
  markdown: string,
  themeId: ThemeId,
  entitlements: RenderEntitlements = OPEN_RENDER_ENTITLEMENTS,
  templateEntitlements?: TemplateEntitlementMap | null,
  renderOptions?: ArticleRenderOptions,
): Promise<string> {
  const base = await buildWechatArticleHtml(
    markdown,
    themeId,
    entitlements,
    templateEntitlements,
    renderOptions,
  )
  return postProcessForZhihu(base)
}
