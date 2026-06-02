/**
 * 排版成稿 HTML 的微信粘贴后处理。
 * 组件已内联样式；此处做容器兜底与常见编辑器兼容修正。
 */
export function prepareWechatPasteHtml(html: string): string {
  if (!html?.trim()) return ''

  let out = html

  out = out
    .replace(/color:\s*rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)/gi, 'color: rgb(17, 24, 39)')
    .replace(/color:\s*#000\b/gi, 'color: #111827')
    .replace(/color:\s*#000000\b/gi, 'color: #111827')

  out = out.replace(
    /<img([^>]*?)style="/gi,
    '<img$1style="display:block;max-width:100%;height:auto;',
  )

  return out
}

/** @deprecated 使用 prepareWechatPasteHtml */
export const prepareRMarkdownHtmlForWechatPaste = prepareWechatPasteHtml
