/** 与 markdown-nice 一致：MathJax 节点上的 LaTeX 源 */
export const MJX_DATA_FORMULA = 'data-formula'

/** markdown-nice solveHtml 中各平台共用的残余 MathJax 清理 */
export function cleanupResidualMathJax(html: string): string {
  return html
    .replace(/<mjx-container (class="inline.+?)<\/mjx-container>/g, '<span $1</span>')
    .replace(/\s<span class="inline/g, '&nbsp;<span class="inline')
    .replace(/svg><\/span>\s/g, 'svg></span>&nbsp;')
    .replace(/mjx-container/g, 'section')
    .replace(/class="mjx-solid"/g, 'fill="none" stroke-width="70"')
    .replace(/<mjx-assistive-mml.+?<\/mjx-assistive-mml>/g, '')
}

export function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}
