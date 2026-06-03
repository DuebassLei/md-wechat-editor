/** 同步锚点属性名（预览专用，不得进入复制管线） */
export const MD_SYNC_ATTR = 'data-md-sync'
export const MD_LINE_START_ATTR = 'data-md-line-start'
export const MD_SYNC_BLOCK = 'block'

/** 给模块/块级 HTML 根标签注入属性（仅当根元素为单个标签时） */
export function injectSyncAttrsOnRoot(html: string, lineStart: number): string {
  const trimmed = html.trim()
  if (!trimmed) return trimmed
  const m = trimmed.match(/^<([a-z][\w-]*)(\s[^>]*)?>/i)
  if (!m) return trimmed
  const rest = m[2] ?? ''
  if (/\bdata-md-line-start=/.test(rest)) return trimmed
  return trimmed.replace(
    /^<[a-z][\w-]*(\s[^>]*)?>/i,
    `<${m[1]}${rest} ${MD_LINE_START_ATTR}="${lineStart}" ${MD_SYNC_ATTR}="${MD_SYNC_BLOCK}">`,
  )
}

export function stripEditorSyncAttributes(html: string): string {
  if (!html.includes('data-md-line') && !html.includes('preview-sync-active')) return html
  return html
    .replace(/\s*data-md-line-start="[^"]*"/gi, '')
    .replace(/\s*data-md-sync="[^"]*"/gi, '')
    .replace(/\s*class="([^"]*)"/gi, (_, cls: string) => {
      const next = cls.replace(/\bpreview-sync-active\b/g, '').replace(/\s+/g, ' ').trim()
      return next ? ` class="${next}"` : ''
    })
}

/** 按源文空行切分块，记录 1-based 起始行 */
export function splitMarkdownBlocks(markdown: string): { lineStart: number; text: string }[] {
  const lines = markdown.split('\n')
  const blocks: { lineStart: number; text: string }[] = []
  let buf: string[] = []
  let bufStart = 1

  function flush() {
    const text = buf.join('\n').trim()
    if (text) blocks.push({ lineStart: bufStart, text })
    buf = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNo = i + 1
    if (line.trim() === '') {
      flush()
      bufStart = lineNo + 1
      continue
    }
    if (buf.length === 0) bufStart = lineNo
    if (/^:::\s*[\w-]/.test(line.trim())) {
      flush()
      const fenceBuf = [line]
      let j = i + 1
      while (j < lines.length) {
        fenceBuf.push(lines[j])
        if (lines[j].trim() === ':::') break
        j++
      }
      blocks.push({ lineStart: lineNo, text: fenceBuf.join('\n').trim() })
      i = j
      buf = []
      bufStart = j + 2
      continue
    }
    buf.push(line)
  }
  flush()
  return blocks
}

const SYNC_SELECTOR =
  'h1,h2,h3,h4,h5,h6,p,pre,blockquote,ul,ol,table,hr,section,div.awp-gfm-theme'

export function annotateGfmBlocks(markdown: string, html: string): string {
  if (typeof DOMParser === 'undefined') return html
  const blocks = splitMarkdownBlocks(markdown)
  if (!blocks.length) return html

  const doc = new DOMParser().parseFromString(
    html.includes('<html') ? html : `<body>${html}</body>`,
    'text/html',
  )
  const searchRoot = doc.querySelector('#nice') ?? doc.body

  const nodes = [...searchRoot.querySelectorAll(SYNC_SELECTOR)].filter(
    (el) => !el.closest('li') || el.tagName !== 'SECTION',
  )
  const topLevel = nodes.filter((el) => !nodes.some((p) => p !== el && p.contains(el)))

  const n = Math.min(blocks.length, topLevel.length)
  for (let i = 0; i < n; i++) {
    topLevel[i].setAttribute(MD_LINE_START_ATTR, String(blocks[i].lineStart))
    topLevel[i].setAttribute(MD_SYNC_ATTR, MD_SYNC_BLOCK)
  }

  const nice = doc.querySelector('#nice')
  if (nice) return nice.outerHTML
  if (html.trim().startsWith('<section')) {
    const first = doc.body.firstElementChild
    return first?.outerHTML ?? html
  }
  return doc.body.innerHTML
}

export function annotateArticleHtmlForSync(markdown: string, html: string): string {
  return annotateGfmBlocks(markdown, html)
}
