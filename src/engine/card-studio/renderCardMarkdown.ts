import katex from 'katex'
import { marked } from 'marked'
import { applyHeadingThemeCompat } from '@/utils/markdownThemeCompat'

export interface RenderCardMarkdownOptions {
  /** 增强模式：JSX 样式、font 标签、LaTeX 公式（对齐 MD2Card mdxMode） */
  richContent?: boolean
}

const cardMarked = marked

cardMarked.setOptions({
  gfm: true,
  breaks: true,
})

const CODE_PLACEHOLDER = '\uE000CARD_CODE_'

function protectFencedCode(md: string): { text: string; restore: (s: string) => string } {
  const blocks: string[] = []
  const text = md.replace(/```[\s\S]*?```/g, (m) => {
    blocks.push(m)
    return `${CODE_PLACEHOLDER}${blocks.length - 1}\uE001`
  })
  return {
    text,
    restore: (s) =>
      s.replace(new RegExp(`${CODE_PLACEHOLDER}(\\d+)\uE001`, 'g'), (_, i) => blocks[Number(i)] ?? ''),
  }
}

function camelToKebab(key: string): string {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase()
}

function quoteCssValue(prop: string, value: string): string {
  if (!value) return value
  if (/^['"].*['"]$/.test(value)) return value
  if (prop === 'font-family' || /[\s,]/.test(value)) {
    return `'${value.replace(/'/g, "\\'")}'`
  }
  return value
}

/** MDX `style={{ fontSize:"40px" }}` → HTML `style="font-size:40px"` */
function normalizeJsxInlineStyles(md: string): string {
  return md.replace(/style=\{\{([\s\S]*?)\}\}/g, (_, inner: string) => {
    const rules: string[] = []
    const propRe = /([A-Za-z][\w]*)\s*:\s*("([^"]*)"|'([^']*)'|([^,}]+))/g
    let m: RegExpExecArray | null
    while ((m = propRe.exec(inner)) !== null) {
      const prop = camelToKebab(m[1])
      const raw = (m[3] ?? m[4] ?? m[5] ?? '').trim()
      const value = quoteCssValue(prop, raw)
      if (value) rules.push(`${prop}:${value}`)
    }
    return rules.length ? `style="${rules.join(';')}"` : ''
  })
}

function applyHighlights(md: string): string {
  return md.replace(/==([^=\n]+)==/g, '<mark>$1</mark>')
}

function renderLatex(md: string): string {
  const katexOpts = { throwOnError: false, output: 'html' as const }
  let out = md.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
    try {
      return katex.renderToString(expr.trim(), { ...katexOpts, displayMode: true })
    } catch {
      return `$$${expr}$$`
    }
  })
  out = out.replace(/(?<!\$)\$(?!\$)([^\$\n]+?)\$(?!\$)/g, (_, expr) => {
    try {
      return katex.renderToString(expr.trim(), { ...katexOpts, displayMode: false })
    } catch {
      return `$${expr}$`
    }
  })
  return out
}

function preprocessCardMarkdown(md: string, opts: RenderCardMarkdownOptions): string {
  const { text, restore } = protectFencedCode(md)
  let body = text
  body = applyHighlights(body)
  if (opts.richContent) {
    body = normalizeJsxInlineStyles(body)
    body = renderLatex(body)
  }
  return restore(body)
}

/** 知识卡片专用 Markdown → HTML（软换行、高亮、可选增强语法） */
export function renderCardMarkdown(content: string, opts: RenderCardMarkdownOptions = {}): string {
  if (!content?.trim()) return ''
  const prepared = preprocessCardMarkdown(content, opts)
  const html = cardMarked.parse(prepared) as string
  return applyHeadingThemeCompat(html)
}
