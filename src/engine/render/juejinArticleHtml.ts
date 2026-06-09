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
  MJX_DATA_FORMULA,
} from './platformArticlePostProcess'

const JUEJIN_EQUATION_BASE = 'https://juejin.im/equation?tex='

function juejinEquationImg(data: string, display: boolean): string {
  const src = `${JUEJIN_EQUATION_BASE}${encodeURIComponent(data)}`
  if (display) {
    return `<figure><img class="equation" src="${src}" alt=""/></figure>`
  }
  return `<span><img style="display:inline;" class="equation" src="${src}" alt=""/></span>`
}

/** 无 DOM 时的字符串回退（与 markdown-nice solveJuejinMath 语义一致） */
function solveJuejinMathByRegex(html: string): string {
  return html.replace(
    /<mjx-container\b([^>]*)>[\s\S]*?<\/mjx-container>/gi,
    (_match, attrs: string) => {
      const dataMatch = attrs.match(
        new RegExp(`${MJX_DATA_FORMULA}=["']([^"']*)["']`),
      )
      if (!dataMatch) return _match
      const display = /\bdisplay\b/.test(attrs)
      return juejinEquationImg(dataMatch[1], display)
    },
  )
}

/** 将 MathJax 节点替换为掘金公式图片（对齐 markdown-nice solveJuejinMath） */
export function solveJuejinMath(html: string): string {
  if (!html.trim()) return html
  if (typeof DOMParser === 'undefined') return solveJuejinMathByRegex(html)

  try {
    const doc = new DOMParser().parseFromString(
      `<div id="juejin-math-root">${html}</div>`,
      'text/html',
    )
    const root = doc.getElementById('juejin-math-root')
    if (!root) return solveJuejinMathByRegex(html)

    const mjxs = [...root.querySelectorAll('mjx-container')]
    for (const mjx of mjxs) {
      const data = mjx.getAttribute(MJX_DATA_FORMULA)
      if (!data) continue
      mjx.outerHTML = juejinEquationImg(data, mjx.hasAttribute('display'))
    }

    return root.innerHTML
  } catch {
    return solveJuejinMathByRegex(html)
  }
}

/** 掘金粘贴前的 HTML 后处理 */
export function postProcessForJuejin(html: string): string {
  if (!html.trim()) return ''
  let out = solveJuejinMath(html)
  out = cleanupResidualMathJax(out)
  return out
}

/**
 * 掘金成稿 HTML：复用公众号 juice 内联管线，再套用掘金公式与 DOM 兼容处理。
 * 对齐 markdown-nice：solveJuejinMath → solveHtml（juice 部分已由 buildWechatArticleHtml 完成）。
 */
export async function buildJuejinArticleHtml(
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
  return postProcessForJuejin(base)
}
