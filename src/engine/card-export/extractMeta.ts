import { readFencedModule } from '@/lib/r-markdown/utils/fencedModule'
import { parseMd2wechatModuleBody } from '@/lib/r-markdown/md2wechatModuleParser'
import type { CardMeta } from './types'

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

function parseYamlBlock(raw: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const line of raw.split('\n')) {
    const m = line.match(/^([\w-]+):\s*(.+)$/)
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
  return out
}

function stripInline(s: string): string {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/[=^!~`*_]/g, '')
    .replace(/::/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function splitChips(raw: string): string[] {
  return raw
    .split(/[,，|]/)
    .map((c) => c.trim())
    .filter(Boolean)
}

function bodyPreview(md: string, limit = 320): string {
  // 跳过 fenced 代码块，避免封面摘要出现代码
  const stripped = md.replace(/```[\s\S]*?```/g, '')
  const out: string[] = []
  let total = 0
  for (const raw of stripped.split('\n')) {
    const t = raw.trim()
    if (!t || /^[#>\-*+:<`|!]/.test(t) || /^---+$/.test(t) || /^\d+\.\s/.test(t)) continue
    const text = stripInline(t)
    if (!text) continue
    out.push(text)
    total += text.length
    if (total >= limit) break
  }
  return out.join(' ')
}

function emptyMeta(defaultBrand: string): CardMeta {
  return {
    title: '',
    badge: '',
    subtitle: '',
    teaser: '',
    hook: '',
    chips: [],
    brand: defaultBrand,
    charCount: 0,
    readMin: 1,
  }
}

function applyYaml(meta: CardMeta, fm: Record<string, string>): void {
  if (fm.title || fm.heroTitle) meta.title = fm.heroTitle || fm.title || meta.title
  if (fm.badge || fm.eyebrow) meta.badge = fm.badge || fm.eyebrow || meta.badge
  if (fm.subtitle || fm.heroSubtitle || fm.summary) {
    meta.subtitle = fm.heroSubtitle || fm.subtitle || fm.summary || meta.subtitle
  }
  if (fm.hook || fm.slogan) meta.hook = fm.hook || fm.slogan || meta.hook
  if (fm.brand || fm.author) meta.brand = fm.brand || fm.author || meta.brand
  const chipsRaw = fm.chips || fm.heroTags || fm.tags || ''
  if (chipsRaw) meta.chips = splitChips(chipsRaw)
}

function applyHeroFields(meta: CardMeta, fields: Record<string, string>, label?: string): void {
  meta.title = fields.title || fields.heading || meta.title
  meta.badge = fields.eyebrow || fields.badge || label || meta.badge
  meta.subtitle = fields.subtitle || meta.subtitle
  meta.hook = fields.hook || fields.slogan || meta.hook
  if (fields.brand || fields.author) meta.brand = fields.brand || fields.author || meta.brand
  if (fields.chips) meta.chips = splitChips(fields.chips)
}

function computeStats(md: string, meta: CardMeta): void {
  const clean = md
    .replace(/---[\s\S]*?---\s*/, '')
    .replace(/:::[\s\S]*?:::/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#*`>[\]!|_~=^:-]/g, '')
    .replace(/\s+/g, '')
  meta.charCount = clean.length
  meta.readMin = Math.max(1, Math.ceil(meta.charCount / 400))
}

function buildTeaser(meta: CardMeta, contentMd: string): void {
  const lead = contentMd.match(/:::lead\b[^>]*\n([\s\S]*?)\n:::/i)
  if (!meta.subtitle && lead) {
    meta.subtitle = stripInline(lead[1])
  }
  if (!meta.subtitle) {
    for (const l of contentMd.split('\n')) {
      const t = l.trim()
      if (!t || /^[#>\-*+:<`|!]/.test(t) || /^---+$/.test(t)) continue
      meta.subtitle = stripInline(t)
      break
    }
  }
  const body = bodyPreview(contentMd)
  if (!meta.subtitle) {
    meta.teaser = body
  } else {
    // 已有 YAML subtitle 时不再拼接正文，避免封面出现代码片段
    meta.teaser = meta.subtitle
  }
  meta.teaser = meta.teaser.slice(0, 300)
}

export function extractCardMeta(
  markdown: string,
  defaultBrand: string,
): { meta: CardMeta; contentMd: string } {
  const meta = emptyMeta(defaultBrand)
  let lines = markdown.split('\n')

  const trimmedStart = markdown.trimStart()
  const fmMatch = trimmedStart.match(FRONTMATTER_RE)
  if (fmMatch) {
    applyYaml(meta, parseYamlBlock(fmMatch[1]))
    const afterFm = trimmedStart.slice(fmMatch[0].length).replace(/^\s+/, '')
    lines = afterFm.split('\n')
  }

  let i = 0
  while (i < lines.length && !lines[i].trim()) i++
  if (i < lines.length) {
    const fenced = readFencedModule(lines, i)
    if (fenced?.name === 'hero') {
      const body = parseMd2wechatModuleBody(fenced.bodyLines)
      Object.assign(body.fields, fenced.attrs)
      const openLabel = lines[i].match(/^:::\s*hero\b(?:\s+(.+))?/i)?.[1]
      applyHeroFields(meta, body.fields, openLabel?.trim())
      lines = [...lines.slice(0, i), ...lines.slice(fenced.next)]
    }
  }

  let contentMd = lines.join('\n').replace(/^\s+/, '')

  if (!meta.title) {
    const hm = contentMd.match(/^#\s+(.+)$/m)
    if (hm) meta.title = hm[1].trim()
  }

  buildTeaser(meta, contentMd)
  computeStats(markdown, meta)

  if (!meta.brand) meta.brand = defaultBrand

  return { meta, contentMd }
}
