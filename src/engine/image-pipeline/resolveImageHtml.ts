import { getStoredImage } from './imageStore'
import { IMAGE_TOKEN_PATTERN } from './types'

const MDWE_SRC_RE = new RegExp(`^mdwe-img:(${IMAGE_TOKEN_PATTERN})$`)
const LEGACY_SRC_RE = new RegExp(`^data:image\\/[^;]+;base64,(${IMAGE_TOKEN_PATTERN})$`)

function extractTokenFromSrc(src: string): string | null {
  const mdwe = MDWE_SRC_RE.exec(src)
  if (mdwe) return mdwe[1]
  const legacy = LEGACY_SRC_RE.exec(src)
  if (legacy) return legacy[1]
  return null
}

function serializeDoc(doc: Document, html: string): string {
  const nice = doc.querySelector('#nice')
  if (nice) return nice.outerHTML
  if (html.trim().startsWith('<section')) {
    const first = doc.body.firstElementChild
    return first?.outerHTML ?? html
  }
  return doc.body.innerHTML
}

/** 预览 HTML 兜底：修补 marked 后仍残留的 mdwe-img / 伪 data URL */
export async function resolveImageSourcesInHtml(html: string): Promise<string> {
  if (!html || (!html.includes('mdwe-img:') && !html.includes(';base64,IMG_'))) return html
  if (typeof DOMParser === 'undefined') return html

  const wrapped = html.includes('<html') ? html : `<body>${html}</body>`
  const doc = new DOMParser().parseFromString(wrapped, 'text/html')
  const imgs = doc.querySelectorAll('img')
  let changed = false

  for (const img of imgs) {
    const src = img.getAttribute('src') ?? ''
    const token = extractTokenFromSrc(src)
    if (!token) continue

    const record = await getStoredImage(token)
    if (!record?.dataUrl) continue

    img.setAttribute('src', record.dataUrl)
    changed = true
  }

  return changed ? serializeDoc(doc, html) : html
}
